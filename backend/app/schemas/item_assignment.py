import uuid
from decimal import Decimal

from pydantic import BaseModel


class AssignmentCreate(BaseModel):
    receipt_item_id: uuid.UUID
    bill_member_id: uuid.UUID
    share_type: str = "equal"
    share_value: Decimal = Decimal("0")


class AssignmentBulkCreate(BaseModel):
    assignments: list[AssignmentCreate]
    # DEFAULT IS FALSE. Chip toggles in the host UI create/delete a single
    # assignment row at a time — if this defaulted to True, every tap would
    # fan out a payment-request SMS to every guest whose amount changed
    # (equal-split siblings get recomputed each tap, so the dedup check in
    # PaymentNotificationService keeps failing and re-sending). SMS fan-out
    # is now exclusively triggered by `POST /bills/:id/send-payment-requests`,
    # which the host invokes explicitly from the Review Payment flow.
    # Set this to True only when you intentionally want each assignment
    # mutation to also notify guests.
    send_payment_notifications: bool = False
    # Client-generated id echoed back in the WS broadcast so the originating
    # client can suppress its own event (avoiding a redundant refetch that
    # would clobber the optimistic UI update).
    client_mutation_id: str | None = None


class AssignmentUpdate(BaseModel):
    share_type: str | None = None
    share_value: Decimal | None = None
    client_mutation_id: str | None = None


class AssignmentOut(BaseModel):
    id: uuid.UUID
    receipt_item_id: uuid.UUID
    bill_member_id: uuid.UUID
    share_type: str
    share_value: Decimal
    amount_owed: Decimal
    item_name: str | None = None
    member_nickname: str | None = None

    model_config = {"from_attributes": True}


class AutoSplitRequest(BaseModel):
    member_ids: list[uuid.UUID] | None = None
    # Same reasoning as AssignmentBulkCreate — default False. Use the
    # dedicated `POST /bills/:id/send-payment-requests` endpoint to SMS.
    send_payment_notifications: bool = False
    client_mutation_id: str | None = None
