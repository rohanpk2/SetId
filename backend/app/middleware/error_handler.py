import logging

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException

logger = logging.getLogger(__name__)


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_exception_handler(request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={
                "success": False,
                "error": {
                    "code": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many requests. Please wait and try again.",
                },
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": str(exc.errors()),
                },
            },
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request, exc: HTTPException):
        detail = exc.detail
        if isinstance(detail, dict) and "code" in detail:
            code = detail.get("code", "HTTP_ERROR")
            message = detail.get("message", "Request failed")
        else:
            code = "HTTP_ERROR"
            message = detail
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": code,
                    "message": message,
                },
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request, exc: Exception):
        # Always log the traceback. Without this, every uncaught exception
        # silently becomes a 500/INTERNAL_ERROR with no forensic trail —
        # which is exactly how the Supabase pooler / psycopg3 prepared-
        # statement bug went undiagnosed during App Review (submission
        # fe194338-…). Logging here is cheap and required for debugging.
        client_host = request.client.host if request.client else None
        logger.exception(
            "unhandled_exception path=%s method=%s ip=%s",
            request.url.path,
            request.method,
            client_host,
        )
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred",
                },
            },
        )
