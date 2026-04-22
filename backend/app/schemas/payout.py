"""Pydantic schemas for the Stripe Connect routes."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class PayoutCreate(BaseModel):
    """Payload for `POST /stripe/connect/payouts`."""

    amount_cents: int = Field(
        ..., ge=50, description="Amount in smallest currency unit. Min 50 cents."
    )
    currency: str = Field("usd", min_length=3, max_length=3)


class PayoutOut(BaseModel):
    id: uuid.UUID
    stripe_payout_id: str
    amount_cents: int
    currency: str
    status: str
    method: str
    arrival_date: int | None = None
    failure_code: str | None = None
    failure_message: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class OnboardingLinkOut(BaseModel):
    url: str
    expires_at: int | None = None


class ConnectStatusOut(BaseModel):
    """Returned by `GET /stripe/connect/status`. Mirrors the dataclass
    produced by `StripeConnectService.refresh_account_status`."""

    connected: bool
    charges_enabled: bool
    payouts_enabled: bool
    details_submitted: bool
    has_instant_external_account: bool
    external_account_last4: str | None = None
    external_account_brand: str | None = None
    requirements_due: list[str] = Field(default_factory=list)
    disabled_reason: str | None = None


class BalanceOut(BaseModel):
    instant_available_cents: int
    currency: str = "usd"
