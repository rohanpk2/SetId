import logging

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.core.response import success_response, error_response
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    AuthResponse,
    UserBrief,
    AppleSignInRequest,
    SendOtpRequest,
    VerifyOtpRequest,
    PhoneAuthData,
)
from app.services.auth_service import AuthService
from app.services.otp_service import (
    OtpProviderError,
    otp_uses_dev_store,
    send_otp as send_sms_otp,
)
from app.limiter import limiter
from app.utils.phone import normalize_to_e164
from app.utils.phone_rate_limit import check_phone_send_limit

router = APIRouter(prefix="/auth", tags=["Auth"])
logger = logging.getLogger(__name__)


@router.post("/signup")
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    svc = AuthService(db)
    try:
        user, token = svc.signup(
            email=body.email,
            password=body.password,
            full_name=body.full_name,
        )
    except ValueError:
        return error_response("EMAIL_EXISTS", "A user with this email already exists", 409)

    auth_data = AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserBrief.model_validate(user),
    )
    return success_response(data=auth_data.model_dump(), message="Account created successfully")


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    svc = AuthService(db)
    try:
        user, token = svc.login(email=body.email, password=body.password)
    except ValueError:
        return error_response("INVALID_CREDENTIALS", "Invalid email or password", 401)

    auth_data = AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserBrief.model_validate(user),
    )
    return success_response(data=auth_data.model_dump(), message="Login successful")


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    user_brief = UserBrief.model_validate(current_user)
    return success_response(data=user_brief.model_dump())


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return success_response(message="Logged out successfully")


@router.post("/send-otp")
@limiter.limit("20/minute")
def send_otp(request: Request, body: SendOtpRequest, db: Session = Depends(get_db)):
    """Send SMS OTP via Twilio Verify (or dev in-memory when configured)."""
    try:
        phone_e164 = normalize_to_e164(body.phone)
    except ValueError:
        logger.warning(
            "auth.send_otp invalid_phone ip=%s",
            request.client.host if request.client else None,
        )
        return error_response(
            "INVALID_PHONE",
            "Enter a valid phone number in international format.",
            400,
        )
    try:
        check_phone_send_limit(phone_e164)
    except PermissionError as e:
        logger.warning(
            "auth.send_otp rate_limited phone_tail=%s ip=%s",
            phone_e164[-4:],
            request.client.host if request.client else None,
        )
        return error_response("RATE_LIMIT_EXCEEDED", str(e), 429)
    svc = AuthService(db)
    try:
        svc.assert_send_otp_intent(phone_e164, body.intent)
    except ValueError as e:
        err = e.args[0] if e.args else "ERROR"
        if err == "PHONE_ALREADY_REGISTERED":
            return error_response(
                "PHONE_ALREADY_REGISTERED",
                "This number already has an account. Log in instead.",
                409,
            )
        if err == "PHONE_NOT_REGISTERED":
            return error_response(
                "PHONE_NOT_REGISTERED",
                "No account for this number yet. Use Get Started to sign up.",
                404,
            )
        return error_response("ERROR", str(e), 400)
    try:
        send_sms_otp(phone_e164)
    except OtpProviderError as e:
        logger.warning(
            "auth.send_otp failed code=%s phone_tail=%s ip=%s",
            e.code,
            phone_e164[-4:],
            request.client.host if request.client else None,
        )
        status = 503 if e.code == "CONFIG_ERROR" else 502
        return error_response(e.code, e.message, status)
    logger.info(
        "auth.send_otp ok phone_tail=%s dev_mode=%s ip=%s",
        phone_e164[-4:],
        otp_uses_dev_store(),
        request.client.host if request.client else None,
    )
    return success_response(
        data={"sent": True, "otp_dev_mode": otp_uses_dev_store()},
        message="Verification code sent",
    )


@router.post("/verify-otp")
@limiter.limit("40/minute")
def verify_otp_phone(request: Request, body: VerifyOtpRequest, db: Session = Depends(get_db)):
    """Verify OTP and return JWT + user (signup creates user; login requires existing phone)."""
    svc = AuthService(db)
    try:
        user, token = svc.complete_phone_otp(
            body.phone, body.code, body.first_name, body.intent
        )
    except OtpProviderError as e:
        logger.warning(
            "auth.verify_otp provider_error code=%s ip=%s",
            e.code,
            request.client.host if request.client else None,
        )
        status = 503 if e.code == "CONFIG_ERROR" else 502
        return error_response(e.code, e.message, status)
    except ValueError as e:
        code = e.args[0] if e.args else "ERROR"
        logger.warning(
            "auth.verify_otp rejected reason=%s phone_tail=%s ip=%s",
            code,
            (body.phone or "")[-4:] if len(body.phone or "") >= 4 else "****",
            request.client.host if request.client else None,
        )
        mapping = {
            "INVALID_PHONE": (400, "INVALID_PHONE", "Enter a valid phone number."),
            "INVALID_OTP": (401, "INVALID_OTP", "That code is incorrect. Try again."),
            "OTP_EXPIRED": (400, "OTP_EXPIRED", "This code has expired. Request a new one."),
            "EMAIL_CONFLICT": (409, "EMAIL_CONFLICT", "Unable to create account. Contact support."),
            "ACCOUNT_DISABLED": (403, "ACCOUNT_DISABLED", "This account is disabled."),
            "PHONE_ALREADY_REGISTERED": (
                409,
                "PHONE_ALREADY_REGISTERED",
                "This number already has an account. Log in instead.",
            ),
            "PHONE_NOT_REGISTERED": (
                404,
                "PHONE_NOT_REGISTERED",
                "No account for this number. Use Get Started to sign up.",
            ),
            "NAME_REQUIRED": (
                400,
                "NAME_REQUIRED",
                "Enter your first name to create an account.",
            ),
        }
        if code in mapping:
            status, err_code, msg = mapping[code]
            return error_response(err_code, msg, status)
        return error_response("VERIFICATION_FAILED", str(e), 400)

    logger.info(
        "auth.verify_otp ok user_id=%s phone_tail=%s ip=%s",
        user.id,
        (body.phone or "")[-4:] if len(body.phone or "") >= 4 else "****",
        request.client.host if request.client else None,
    )

    auth = PhoneAuthData(
        token=token,
        access_token=token,
        user=UserBrief.model_validate(user),
    )
    return success_response(data=auth.model_dump(mode="json"), message="Signed in successfully")


@router.post("/apple")
async def apple_signin(body: AppleSignInRequest, db: Session = Depends(get_db)):
    """Sign in with Apple"""
    svc = AuthService(db)
    try:
        user, token = await svc.apple_signin(
            identity_token=body.identity_token,
            authorization_code=body.authorization_code,
            user_info=body.user_info
        )
    except ValueError as e:
        return error_response("APPLE_AUTH_FAILED", str(e), 401)

    auth_data = AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserBrief.model_validate(user),
    )
    return success_response(data=auth_data.model_dump(), message="Apple Sign In successful")
