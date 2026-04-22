"""Persisted record of each Stripe Connect payout we've kicked off on
behalf of a host.

The authoritative status lives on Stripe; this row is our local cache
(kept in sync via the Connect webhook — `payout.paid` / `payout.failed` /
`payout.canceled` / `payout.updated`) so we can show history + reconcile
without paging through Stripe on every dashboard load.
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Payout(Base):
    __tablename__ = "payouts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # Stripe's `po_...` id. Unique because Stripe never re-uses these and
    # because our idempotency key strategy should make duplicates a bug
    # worth surfacing as an IntegrityError.
    stripe_payout_id: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False
    )
    # Denormalized so we can tie a payout back to a Connect account even
    # if the user later rotates/disconnects their account.
    stripe_account_id: Mapped[str] = mapped_column(String(255), nullable=False)

    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(
        String(3), default="usd", server_default="usd", nullable=False
    )
    # Stripe statuses: pending | in_transit | paid | failed | canceled.
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    # Always "instant" today but we keep the column so the model works
    # unchanged if/when we add standard (ACH) payouts.
    method: Mapped[str] = mapped_column(
        String(20), default="instant", server_default="instant", nullable=False
    )
    # Stripe returns this as a unix timestamp. Kept as int for fidelity
    # with the Stripe SDK — convert at the edge when rendering.
    arrival_date: Mapped[int | None] = mapped_column(Integer, nullable=True)
    failure_code: Mapped[str | None] = mapped_column(String(100), nullable=True)
    failure_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="payouts")
