import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.core.response import success_response, error_response
from app.schemas.user import UserProfile, UserUpdate, UserSearchResult, InviteRequest

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    profile = UserProfile.model_validate(current_user)
    return success_response(data=profile.model_dump())


@router.patch("/me")
def update_my_profile(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    profile = UserProfile.model_validate(current_user)
    return success_response(data=profile.model_dump(), message="Profile updated")


@router.delete("/me")
def delete_my_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft-delete the authenticated user.

    We can't hard-delete because the user's UUID is referenced by bills they
    own, payments they've made, and bill memberships they appear in — other
    users' financial history would break. Instead we:

      - flip `is_active` to False (so login + auth deps reject them)
      - scrub PII (email, phone, apple_id, full_name, avatar_url, password_hash)
      - free up the unique `phone` / `apple_id` indexes so the user can
        re-register with the same phone/Apple ID on a new account

    Stripe `stripe_customer_id` is preserved for reconciliation/refunds.
    Payment methods cascade-delete via the relationship on the User model.
    """
    user_id = current_user.id

    current_user.is_active = False
    # Rotate email onto a reserved domain so the unique-index slot is freed
    # for future signups, while keeping *some* value for audit trails.
    current_user.email = f"deleted-{user_id}@deleted.invalid"
    current_user.full_name = "Deleted User"
    current_user.phone = None
    current_user.apple_id = None
    current_user.password_hash = None
    current_user.avatar_url = None

    db.commit()
    return success_response(message="Account deleted")


@router.get("/search")
def search_users(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pattern = f"%{q}%"
    users = (
        db.query(User)
        .filter(
            User.is_active.is_(True),
            (User.email.ilike(pattern) | User.full_name.ilike(pattern)),
        )
        .limit(20)
        .all()
    )
    results = [UserSearchResult.model_validate(u).model_dump() for u in users]
    return success_response(data=results)


@router.post("/invite")
def invite_user(
    body: InviteRequest,
    current_user: User = Depends(get_current_user),
):
    return error_response(
        "NOT_IMPLEMENTED",
        "Email invites are not enabled yet.",
        501,
    )


@router.get("/{user_id}")
def get_user_profile(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
    if not user:
        return error_response("NOT_FOUND", "User not found", 404)

    profile = UserProfile.model_validate(user)
    return success_response(data=profile.model_dump())
