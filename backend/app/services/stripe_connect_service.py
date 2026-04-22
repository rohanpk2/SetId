"""
Stripe Connect — Express connected accounts + instant payouts to debit cards.

This is the ONE place we talk to Stripe in the Connect context. Every call
that touches a connected account passes `stripe_account=acct_id` so Stripe
acts as that account (not the platform) — missing that keyword is the
classic way to accidentally pay out from the platform's balance, so we
always pass it explicitly.

Money flow this service enables:

    Web/mobile guest card
        └─▶ PaymentIntent (created by PaymentService with
                            `transfer_data.destination = host_acct_id`)
            └─▶ Host's Connect balance (`instant_available`)
                └─▶ `Payout.create(method="instant")`  ◀── this service
                    └─▶ Host's debit card (arrives in ~30 minutes)

Fees (out of our control):
  - Stripe's per-PaymentIntent fee (~2.9% + $0.30 US) — deducted before
    funds land in host's Connect balance.
  - Stripe's instant payout fee (~1.75% per payout, $0.50 min) — deducted
    before funds land on the host's debit card.
  - Our `application_fee_amount` on the PaymentIntent (see
    `PaymentService` + `settings.PLATFORM_FEE_BPS`) — the platform's cut.
"""

import logging
import secrets
from dataclasses import dataclass
from typing import Optional

import stripe
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.payout import Payout
from app.models.user import User

logger = logging.getLogger(__name__)


class StripeConnectError(ValueError):
    """Raised for any Connect-flow problem. `code` is the stable machine
    identifier the HTTP layer maps to an error_response code. `message`
    is user-safe; never include raw Stripe error bodies that might leak
    internals."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass
class ConnectedAccountStatus:
    connected: bool
    charges_enabled: bool
    payouts_enabled: bool
    details_submitted: bool
    # True if the account has at least one external account (card or bank)
    # that supports instant payouts. Checked via the `available_payout_methods`
    # field Stripe returns on each external account.
    has_instant_external_account: bool
    external_account_last4: Optional[str]
    external_account_brand: Optional[str]
    requirements_due: list[str]
    disabled_reason: Optional[str]


_SYNTHETIC_EMAIL_DOMAIN = "@phone.users.spltr"


class StripeConnectService:
    def __init__(self, db: Session):
        self.db = db
        if not settings.STRIPE_SECRET_KEY:
            raise StripeConnectError(
                "STRIPE_NOT_CONFIGURED",
                "Stripe is not configured on the server.",
            )
        stripe.api_key = settings.STRIPE_SECRET_KEY

    # ─── Account lifecycle ───────────────────────────────────────────────

    def ensure_connected_account(self, user: User) -> str:
        """Return the user's `acct_...` id, creating an Express account if
        they don't have one yet.

        We let Stripe default to the `full` service agreement (omitting
        `tos_acceptance` entirely). Stripe explicitly blocks the
        `recipient` agreement for US-platform + US-account — it's only
        valid for cross-border setups. `full` is also what we actually
        want: our hosts are Connect merchants of record for funds flowing
        into their balance via destination charges, so they need to
        accept the full Express agreement during onboarding.
        """
        if user.stripe_account_id:
            return user.stripe_account_id

        email = user.email if not self._is_synthetic_email(user.email) else None

        try:
            account = stripe.Account.create(
                type="express",
                country="US",
                email=email,
                capabilities={
                    "card_payments": {"requested": True},
                    "transfers": {"requested": True},
                },
                business_type="individual",
                business_profile={
                    "product_description": (
                        "Settld bill-splitting: receives funds from guests "
                        "and pays out to the host who picked up the check."
                    ),
                    # 7299 = Miscellaneous personal services. Matches how we
                    # describe the app to Stripe Connect onboarding.
                    "mcc": "7299",
                },
                metadata={"user_id": str(user.id)},
            )
        except stripe.error.StripeError as e:
            logger.exception("stripe_connect_account_create_failed")
            raise StripeConnectError(
                "STRIPE_ERROR", self._safe_stripe_message(e)
            )

        user.stripe_account_id = account.id
        self.db.commit()
        self.db.refresh(user)
        logger.info(
            "stripe_connect_account_created",
            extra={"user_id": str(user.id), "account_id": account.id},
        )
        return account.id

    def create_onboarding_link(
        self,
        user: User,
        *,
        return_url: Optional[str] = None,
        refresh_url: Optional[str] = None,
    ) -> dict:
        """Generate a fresh Stripe-hosted onboarding URL.

        AccountLinks expire in ~5 minutes. We always mint a new one rather
        than caching — cheap and avoids dealing with expiry. The frontend
        opens this URL in an in-app browser that auto-closes when Stripe
        redirects to `return_url` / `refresh_url`.
        """
        account_id = self.ensure_connected_account(user)
        try:
            link = stripe.AccountLink.create(
                account=account_id,
                refresh_url=refresh_url or settings.CONNECT_REFRESH_URL,
                return_url=return_url or settings.CONNECT_RETURN_URL,
                type="account_onboarding",
            )
        except stripe.error.StripeError as e:
            logger.exception("stripe_connect_link_create_failed")
            raise StripeConnectError(
                "STRIPE_ERROR", self._safe_stripe_message(e)
            )
        return {"url": link.url, "expires_at": link.expires_at}

    def refresh_account_status(self, user: User) -> ConnectedAccountStatus:
        """Pull the authoritative account state from Stripe, cache the
        booleans locally, and inspect external accounts for instant-payout
        eligibility.

        Called from:
          - GET /stripe/connect/status (user is checking their onboarding)
          - create_instant_payout (validation)
          - Connect webhook handler (after `account.updated`)
        """
        if not user.stripe_account_id:
            return ConnectedAccountStatus(
                connected=False,
                charges_enabled=False,
                payouts_enabled=False,
                details_submitted=False,
                has_instant_external_account=False,
                external_account_last4=None,
                external_account_brand=None,
                requirements_due=[],
                disabled_reason=None,
            )

        try:
            account = stripe.Account.retrieve(user.stripe_account_id)
        except stripe.error.StripeError as e:
            logger.exception("stripe_connect_account_retrieve_failed")
            raise StripeConnectError(
                "STRIPE_ERROR", self._safe_stripe_message(e)
            )

        charges = bool(account.charges_enabled)
        payouts = bool(account.payouts_enabled)
        details = bool(account.details_submitted)
        requirements = list(
            (account.requirements or {}).get("currently_due") or []
        )
        disabled_reason = (account.requirements or {}).get("disabled_reason")

        has_instant, last4, brand = self._inspect_external_accounts(
            user.stripe_account_id
        )

        # Cache on user row so the hot path can read it inline (O(1))
        # instead of roundtripping to Stripe.
        user.stripe_charges_enabled = charges
        user.stripe_payouts_enabled = payouts
        user.stripe_details_submitted = details
        self.db.commit()

        return ConnectedAccountStatus(
            connected=True,
            charges_enabled=charges,
            payouts_enabled=payouts,
            details_submitted=details,
            has_instant_external_account=has_instant,
            external_account_last4=last4,
            external_account_brand=brand,
            requirements_due=requirements,
            disabled_reason=disabled_reason,
        )

    # ─── Balance + payouts ───────────────────────────────────────────────

    def get_instant_available_cents(
        self, user: User, currency: str = "usd"
    ) -> int:
        """Sum of balances eligible for instant payout, in cents.

        This is the `instant_available` bucket — different from `available`
        which is the standard (ACH) bucket. Stripe separates them because
        not every transaction becomes instantly-payable-out immediately.
        """
        if not user.stripe_account_id:
            raise StripeConnectError(
                "NOT_CONNECTED",
                "Set up payouts before checking your balance.",
            )
        try:
            balance = stripe.Balance.retrieve(
                stripe_account=user.stripe_account_id
            )
        except stripe.error.StripeError as e:
            raise StripeConnectError(
                "STRIPE_ERROR", self._safe_stripe_message(e)
            )

        total = 0
        for entry in balance.instant_available or []:
            if entry.currency == currency:
                total += int(entry.amount)
        return total

    def create_instant_payout(
        self,
        user: User,
        *,
        amount_cents: int,
        currency: str = "usd",
    ) -> Payout:
        """Kick off an instant payout on the user's connected account.

        Validates amount, onboarding state, and external-account
        eligibility BEFORE calling Stripe so we can return clean,
        actionable error codes to the mobile app.
        """
        currency = currency.lower()

        if amount_cents <= 0:
            raise StripeConnectError("INVALID_AMOUNT", "Amount must be positive.")
        # Stripe's hard minimum for USD payouts is $0.50; enforce locally
        # so the UX error is immediate, not a 400 from Stripe.
        if amount_cents < 50:
            raise StripeConnectError(
                "AMOUNT_TOO_SMALL",
                "Minimum payout is $0.50.",
            )

        status = self.refresh_account_status(user)
        if not status.connected:
            raise StripeConnectError(
                "NOT_CONNECTED",
                "Set up payouts before cashing out.",
            )
        if not status.details_submitted:
            raise StripeConnectError(
                "HOST_NOT_ONBOARDED",
                "Finish Stripe verification before cashing out.",
            )
        if not status.payouts_enabled:
            raise StripeConnectError(
                "PAYOUTS_TEMPORARILY_DISABLED",
                "Your Stripe account needs attention before payouts can run.",
            )
        if not status.has_instant_external_account:
            raise StripeConnectError(
                "EXTERNAL_ACCOUNT_NOT_INSTANT_CAPABLE",
                "Add a debit card that supports instant payouts.",
            )

        instant_balance = self.get_instant_available_cents(user, currency=currency)
        if amount_cents > instant_balance:
            raise StripeConnectError(
                "INSUFFICIENT_INSTANT_BALANCE",
                f"Only ${instant_balance / 100:.2f} is available for instant payout.",
            )

        idempotency_key = f"payout_{user.id}_{secrets.token_hex(8)}"
        try:
            stripe_payout = stripe.Payout.create(
                amount=amount_cents,
                currency=currency,
                method="instant",
                # We don't pass `destination` — Stripe routes to the default
                # external account on the connected account, which is the
                # card the user added during onboarding. If they later add
                # multiple cards, the default is still picked automatically.
                metadata={"user_id": str(user.id)},
                stripe_account=user.stripe_account_id,
                idempotency_key=idempotency_key,
            )
        except stripe.error.InvalidRequestError as e:
            logger.warning(
                "stripe_connect_payout_invalid",
                extra={
                    "account_id": user.stripe_account_id,
                    "error": str(e),
                },
            )
            raise StripeConnectError(
                "PAYOUT_INVALID", self._safe_stripe_message(e)
            )
        except stripe.error.StripeError as e:
            logger.exception("stripe_connect_payout_failed")
            raise StripeConnectError(
                "STRIPE_ERROR", self._safe_stripe_message(e)
            )

        payout = Payout(
            user_id=user.id,
            stripe_payout_id=stripe_payout.id,
            stripe_account_id=user.stripe_account_id,
            amount_cents=amount_cents,
            currency=currency,
            status=stripe_payout.status,
            method=stripe_payout.method or "instant",
            arrival_date=stripe_payout.arrival_date,
        )
        self.db.add(payout)
        self.db.commit()
        self.db.refresh(payout)
        logger.info(
            "stripe_connect_payout_created",
            extra={
                "user_id": str(user.id),
                "payout_id": stripe_payout.id,
                "amount_cents": amount_cents,
                "status": stripe_payout.status,
            },
        )
        return payout

    def list_payouts(self, user: User, limit: int = 20) -> list[Payout]:
        return (
            self.db.query(Payout)
            .filter(Payout.user_id == user.id)
            .order_by(Payout.created_at.desc())
            .limit(limit)
            .all()
        )

    # ─── Webhook ─────────────────────────────────────────────────────────

    def handle_connect_webhook(self, payload: bytes, sig_header: str) -> None:
        """Verify and dispatch a Connect-scoped webhook event.

        Uses `STRIPE_CONNECT_WEBHOOK_SECRET` (NOT the payment webhook
        secret). Stripe signs each endpoint's events with that endpoint's
        own secret, so reusing the payments secret would fail signature
        verification on every call.
        """
        if not settings.STRIPE_CONNECT_WEBHOOK_SECRET:
            raise StripeConnectError(
                "WEBHOOK_NOT_CONFIGURED",
                "Connect webhook secret missing on server.",
            )
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_CONNECT_WEBHOOK_SECRET
            )
        except stripe.error.SignatureVerificationError as e:
            raise StripeConnectError("INVALID_SIGNATURE", str(e))

        event_type = event["type"]
        obj = event["data"]["object"]
        logger.info(
            "stripe_connect_webhook_received",
            extra={"event_type": event_type, "id": obj.get("id")},
        )

        if event_type == "account.updated":
            self._refresh_user_from_account_webhook(obj)
        elif event_type in (
            "payout.paid",
            "payout.failed",
            "payout.canceled",
            "payout.updated",
        ):
            self._update_payout_from_webhook(obj)
        # All other events are accepted and ignored; Stripe re-sends if
        # we 5xx, so we return 200 even for unhandled types.

    # ─── Internals ───────────────────────────────────────────────────────

    def _inspect_external_accounts(
        self, account_id: str
    ) -> tuple[bool, Optional[str], Optional[str]]:
        """Returns (has_instant, last4, brand).

        Checks `available_payout_methods` on each external account — an
        entry of `"instant"` means Stripe can instant-payout to that card
        or bank account. Without an instant-capable external account, a
        payout with `method="instant"` will 400.
        """
        has_instant = False
        last4: Optional[str] = None
        brand: Optional[str] = None

        try:
            cards = stripe.Account.list_external_accounts(
                account_id, object="card", limit=10
            )
            for card in cards.data or []:
                apm = getattr(card, "available_payout_methods", None) or []
                if "instant" in apm:
                    return True, card.last4, card.brand

            banks = stripe.Account.list_external_accounts(
                account_id, object="bank_account", limit=10
            )
            for ba in banks.data or []:
                apm = getattr(ba, "available_payout_methods", None) or []
                if "instant" in apm:
                    return True, ba.last4, ba.bank_name or "Bank"
        except stripe.error.StripeError:
            # Non-fatal — we return False and let validation fail cleanly
            # downstream rather than blowing up the whole status call.
            logger.warning(
                "stripe_connect_list_external_failed",
                extra={"account_id": account_id},
            )

        return has_instant, last4, brand

    def _refresh_user_from_account_webhook(self, account_obj: dict) -> None:
        acct_id = account_obj.get("id")
        if not acct_id:
            return
        user = (
            self.db.query(User)
            .filter(User.stripe_account_id == acct_id)
            .first()
        )
        if not user:
            return
        user.stripe_charges_enabled = bool(account_obj.get("charges_enabled"))
        user.stripe_payouts_enabled = bool(account_obj.get("payouts_enabled"))
        user.stripe_details_submitted = bool(
            account_obj.get("details_submitted")
        )
        self.db.commit()

    def _update_payout_from_webhook(self, payout_obj: dict) -> None:
        stripe_payout_id = payout_obj.get("id")
        if not stripe_payout_id:
            return
        payout = (
            self.db.query(Payout)
            .filter(Payout.stripe_payout_id == stripe_payout_id)
            .first()
        )
        if not payout:
            # Event for a payout we didn't create (shouldn't happen with
            # correct webhook filtering, but log and drop).
            logger.info(
                "stripe_connect_webhook_unknown_payout",
                extra={"stripe_payout_id": stripe_payout_id},
            )
            return
        payout.status = payout_obj.get("status") or payout.status
        payout.failure_code = payout_obj.get("failure_code")
        payout.failure_message = payout_obj.get("failure_message")
        arrival = payout_obj.get("arrival_date")
        if arrival is not None:
            payout.arrival_date = arrival
        self.db.commit()

    @staticmethod
    def _is_synthetic_email(email: Optional[str]) -> bool:
        """Phone-auth users get a synthetic email like
        `14155551234@phone.users.spltr`. Stripe rejects those at
        onboarding, so pass None and let the user enter a real email
        on Stripe's form."""
        return bool(email and email.endswith(_SYNTHETIC_EMAIL_DOMAIN))

    @staticmethod
    def _safe_stripe_message(e: stripe.error.StripeError) -> str:
        """Prefer Stripe's `user_message` (intended for end users) and
        fall back to the generic error message. Never surface raw
        `str(e)` which can include request IDs + internal fields."""
        return getattr(e, "user_message", None) or str(e) or "Stripe error"
