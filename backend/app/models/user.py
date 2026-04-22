import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    apple_id: Mapped[str | None] = mapped_column(String(255), nullable=True, unique=True)
    auth_provider: Mapped[str] = mapped_column(String(50), default="email")
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    phone: Mapped[str | None] = mapped_column(
        String(50), nullable=True, unique=True, index=True
    )
    stripe_customer_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True, unique=True, index=True
    )
    # ─── Stripe Connect (host side — receiving payouts from guests) ─────
    # Separate from `stripe_customer_id`, which represents the user as a
    # guest paying bills. A user can be both: they host their own bills
    # (Connect account) and pay into bills they're invited to (Customer).
    stripe_account_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True, unique=True
    )
    # Cached flags from the Connect account's `charges_enabled` /
    # `payouts_enabled` / `details_submitted` fields. Refreshed on every
    # `account.updated` webhook and on every status check. We read these
    # inline (instead of hitting Stripe) on the hot path — e.g. when the
    # guest is creating a PaymentIntent we decide in O(1) whether to
    # attach `transfer_data.destination`.
    stripe_charges_enabled: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default="false", nullable=False
    )
    stripe_payouts_enabled: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default="false", nullable=False
    )
    stripe_details_submitted: Mapped[bool] = mapped_column(
        Boolean, default=False, server_default="false", nullable=False
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    bills_owned = relationship(
        "Bill", back_populates="owner", foreign_keys="[Bill.owner_id]"
    )
    bill_memberships = relationship("BillMember", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    sms_logs = relationship("SmsLog", back_populates="user")
    payment_methods = relationship("PaymentMethod", back_populates="user", cascade="all, delete-orphan")
    payouts = relationship("Payout", back_populates="user", cascade="all, delete-orphan")
