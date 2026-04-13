"""Unit tests for ReadinessService."""

from decimal import Decimal
from unittest.mock import MagicMock, patch

import pytest

from app.services.readiness_service import ReadinessService


def _mock_bill(total="100.00", ready=False, owner_id="owner-1"):
    bill = MagicMock()
    bill.id = "bill-1"
    bill.total = Decimal(total)
    bill.ready_to_pay = ready
    bill.ready_reason = None
    bill.ready_marked_at = None
    bill.ready_marked_by = None
    bill.owner_id = owner_id
    bill.status = "active"
    return bill


def _mock_payment(amount="50.00", status="succeeded"):
    p = MagicMock()
    p.amount = Decimal(amount)
    p.status = status
    return p


class TestEvaluate:
    def test_fully_collected(self):
        db = MagicMock()
        bill = _mock_bill(total="100.00")
        db.query.return_value.filter.return_value.first.return_value = bill
        db.query.return_value.filter.return_value.all.return_value = [
            _mock_payment("60.00"),
            _mock_payment("40.00"),
        ]

        svc = ReadinessService(db)
        result = svc.evaluate("bill-1")

        assert result["meets_threshold"] is True
        assert result["total_collected"] == Decimal("100.00")
        assert result["collection_pct"] == Decimal("100.00")

    def test_partially_collected(self):
        db = MagicMock()
        bill = _mock_bill(total="100.00")
        db.query.return_value.filter.return_value.first.return_value = bill
        db.query.return_value.filter.return_value.all.return_value = [
            _mock_payment("30.00"),
        ]

        svc = ReadinessService(db)
        result = svc.evaluate("bill-1")

        assert result["meets_threshold"] is False
        assert result["collection_pct"] == Decimal("30.00")

    def test_zero_total_bill(self):
        db = MagicMock()
        bill = _mock_bill(total="0.00")
        db.query.return_value.filter.return_value.first.return_value = bill
        db.query.return_value.filter.return_value.all.return_value = []

        svc = ReadinessService(db)
        result = svc.evaluate("bill-1")

        assert result["meets_threshold"] is False

    def test_not_found(self):
        db = MagicMock()
        db.query.return_value.filter.return_value.first.return_value = None

        svc = ReadinessService(db)
        with pytest.raises(ValueError, match="NOT_FOUND"):
            svc.evaluate("no-such-bill")


class TestMarkReady:
    def test_fully_collected_marks_ready(self):
        db = MagicMock()
        bill = _mock_bill(total="100.00")
        db.query.return_value.filter.return_value.first.return_value = bill
        db.query.return_value.filter.return_value.all.return_value = [
            _mock_payment("100.00"),
        ]

        svc = ReadinessService(db)
        result = svc.mark_ready("bill-1", "owner-1", reason="fully_collected")

        assert result.ready_to_pay is True
        assert result.ready_reason == "fully_collected"
        assert result.status == "ready_to_pay"

    def test_owner_override_bypasses_threshold(self):
        db = MagicMock()
        bill = _mock_bill(total="100.00")
        db.query.return_value.filter.return_value.first.return_value = bill
        db.query.return_value.filter.return_value.all.return_value = [
            _mock_payment("20.00"),
        ]

        svc = ReadinessService(db)
        result = svc.mark_ready("bill-1", "owner-1", reason="owner_override")

        assert result.ready_to_pay is True
        assert result.ready_reason == "owner_override"

    def test_non_owner_forbidden(self):
        db = MagicMock()
        bill = _mock_bill(owner_id="owner-1")
        db.query.return_value.filter.return_value.first.return_value = bill

        svc = ReadinessService(db)
        with pytest.raises(ValueError, match="FORBIDDEN"):
            svc.mark_ready("bill-1", "not-owner", reason="fully_collected")

    def test_threshold_not_met_rejects(self):
        db = MagicMock()
        bill = _mock_bill(total="100.00")
        db.query.return_value.filter.return_value.first.return_value = bill
        db.query.return_value.filter.return_value.all.return_value = [
            _mock_payment("50.00"),
        ]

        svc = ReadinessService(db)
        with pytest.raises(ValueError, match="THRESHOLD_NOT_MET"):
            svc.mark_ready("bill-1", "owner-1", reason="fully_collected")

    def test_already_ready_rejects(self):
        db = MagicMock()
        bill = _mock_bill(ready=True)
        db.query.return_value.filter.return_value.first.return_value = bill

        svc = ReadinessService(db)
        with pytest.raises(ValueError, match="ALREADY_READY"):
            svc.mark_ready("bill-1", "owner-1", reason="fully_collected")

    def test_not_found_raises(self):
        db = MagicMock()
        db.query.return_value.filter.return_value.first.return_value = None

        svc = ReadinessService(db)
        with pytest.raises(ValueError, match="NOT_FOUND"):
            svc.mark_ready("no-bill", "owner-1", reason="fully_collected")


class TestUnmarkReady:
    def test_success_clears_readiness(self):
        db = MagicMock()
        bill = _mock_bill(total="100.00", ready=True, owner_id="owner-1")
        bill.ready_reason = "fully_collected"
        bill.ready_marked_at = "2025-01-01"
        bill.ready_marked_by = "owner-1"
        bill.status = "ready_to_pay"

        db.query.return_value.filter.return_value.first.side_effect = [
            bill,  # bill lookup
            None,  # active card check (no active card)
        ]

        svc = ReadinessService(db)
        result = svc.unmark_ready("bill-1", "owner-1")

        assert result.ready_to_pay is False
        assert result.ready_reason is None
        assert result.ready_marked_at is None
        assert result.ready_marked_by is None
        assert result.status == "active"
        db.commit.assert_called_once()

    def test_not_found_raises(self):
        db = MagicMock()
        db.query.return_value.filter.return_value.first.return_value = None

        svc = ReadinessService(db)
        with pytest.raises(ValueError, match="NOT_FOUND"):
            svc.unmark_ready("no-bill", "owner-1")

    def test_non_owner_forbidden(self):
        db = MagicMock()
        bill = _mock_bill(owner_id="owner-1")
        db.query.return_value.filter.return_value.first.return_value = bill

        svc = ReadinessService(db)
        with pytest.raises(ValueError, match="FORBIDDEN"):
            svc.unmark_ready("bill-1", "not-owner")

    def test_blocked_by_active_virtual_card(self):
        db = MagicMock()
        bill = _mock_bill(owner_id="owner-1")
        active_card = MagicMock()

        db.query.return_value.filter.return_value.first.side_effect = [
            bill,         # bill lookup
            active_card,  # active card check finds one
        ]

        svc = ReadinessService(db)
        with pytest.raises(ValueError, match="ACTIVE_CARD_EXISTS"):
            svc.unmark_ready("bill-1", "owner-1")
