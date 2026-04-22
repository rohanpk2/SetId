"""add Stripe Connect columns + payouts table

Revision ID: f1a2b3c4d5e6
Revises: e7f8a9b0c1d2
Create Date: 2026-04-22 00:00:00.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


revision: str = "f1a2b3c4d5e6"
down_revision: Union[str, None] = "e7f8a9b0c1d2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ─── users: Stripe Connect columns ─────────────────────────────────
    op.add_column("users", sa.Column("stripe_account_id", sa.String(255), nullable=True))
    op.create_unique_constraint(
        "uq_users_stripe_account_id", "users", ["stripe_account_id"]
    )
    op.add_column(
        "users",
        sa.Column(
            "stripe_charges_enabled",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "stripe_payouts_enabled",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "stripe_details_submitted",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )

    # ─── payouts table ─────────────────────────────────────────────────
    op.create_table(
        "payouts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("stripe_payout_id", sa.String(255), unique=True, nullable=False),
        sa.Column("stripe_account_id", sa.String(255), nullable=False),
        sa.Column("amount_cents", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(3), server_default="usd", nullable=False),
        sa.Column("status", sa.String(50), nullable=False),
        sa.Column("method", sa.String(20), server_default="instant", nullable=False),
        sa.Column("arrival_date", sa.Integer(), nullable=True),
        sa.Column("failure_code", sa.String(100), nullable=True),
        sa.Column("failure_message", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_payouts_user_id", "payouts", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_payouts_user_id", table_name="payouts")
    op.drop_table("payouts")
    op.drop_column("users", "stripe_details_submitted")
    op.drop_column("users", "stripe_payouts_enabled")
    op.drop_column("users", "stripe_charges_enabled")
    op.drop_constraint("uq_users_stripe_account_id", "users", type_="unique")
    op.drop_column("users", "stripe_account_id")
