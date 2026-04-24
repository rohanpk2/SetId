import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { bills as billsApi, assignments as assignmentsApi, receipts as receiptsApi } from '../services/api';

// Monotonically-increasing client mutation id. Passed with every assignment
// mutation so the server can echo it in the `assignment_update` broadcast,
// and the originating client can then drop its own event (it already
// applied the change optimistically and has the mutation response in hand,
// so re-processing the broadcast would be pure redundant work — and, at
// worst, re-order state by racing with a queued sibling mutation).
let _mutationIdCounter = 0;
const _clientInstanceId = `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
export function newClientMutationId() {
  _mutationIdCounter += 1;
  return `${_clientInstanceId}:${_mutationIdCounter}`;
}

function parsePriceValue(value) {
  const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

function normalizeItemName(value) {
  return `${value ?? ''}`.replace(/\s+/g, ' ').trim();
}

function roundMoney(n) {
  return Math.round(n * 100) / 100;
}

export function useBillData(billId) {
  const [bill, setBill] = useState(null);
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [assignmentMap, setAssignmentMap] = useState({});
  const [serverAssignments, setServerAssignments] = useState([]);
  
  // Maps "itemId::memberId" → array of server assignment ids (handles duplicates).
  const serverAssignmentIds = useRef({});
  // Per-key promise chain so clicks on the same chip serialize without dropping.
  const mutationQueueRef = useRef({});
  // Tracks in-flight mutation count so fetchSummary can back off until settled.
  const inFlightMutationsRef = useRef(0);
  // Set of client_mutation_ids we initiated and are still waiting to see
  // echoed back on the WS. Echoed events are dropped — we already applied
  // them locally and have the server response.
  const ownMutationIdsRef = useRef(new Set());
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Item editing state
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [savingItemEdits, setSavingItemEdits] = useState(false);
  const [nextDraftItemId, setNextDraftItemId] = useState(1);
  const [itemQuantities, setItemQuantities] = useState({});
  const [itemNames, setItemNames] = useState({});
  const [itemPrices, setItemPrices] = useState({});
  const [originalItemSnapshots, setOriginalItemSnapshots] = useState({});
  const [removedItemIds, setRemovedItemIds] = useState({});

  /** Apply a `member_joined` WebSocket payload directly to local state.
   *
   *  Historically this event just triggered `fetchSummary(true)` — which
   *  meant the joining member showed up ~500-1500ms later (one REST
   *  round-trip for `/bills/:id/summary` + one for `/assignments`). The
   *  backend already ships the full updated members array in the WS frame,
   *  so we can splice it in locally and render instantly.
   *
   *  Payload shape (from `_broadcast_event(..., "member_joined", ...)` in
   *  `party_public.py`):
   *    {
   *      member_id: str,
   *      nickname: str,
   *      members: [{id, nickname, status}, ...],
   *    }
   */
  const applyMemberJoined = useCallback((payload) => {
    const incoming = payload?.members;
    if (!Array.isArray(incoming) || incoming.length === 0) return;
    // Merge so we never regress fields the WS payload omits (e.g. user_id,
    // avatar) — the payload only carries id/nickname/status, but any member
    // we already know about should keep its richer fields.
    setMembers((prev) => {
      const prevById = new Map(prev.map((m) => [m.id, m]));
      return incoming.map((m) => ({
        ...(prevById.get(m.id) || {}),
        ...m,
      }));
    });
  }, []);

  const applyServerItemState = useCallback((nextBill, nextItems, preserveAssignments = false) => {
    setBill(nextBill);
    setItems(nextItems);

    const quantities = {};
    const names = {};
    const prices = {};
    const snapshots = {};

    (nextItems ?? []).forEach((item) => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      const name = item.name ?? '';
      const totalPrice = parsePriceValue(item.total_price ?? 0).toFixed(2);
      quantities[item.id] = quantity;
      names[item.id] = name;
      prices[item.id] = totalPrice;
      snapshots[item.id] = {
        name: normalizeItemName(name),
        quantity,
        totalPrice,
      };
    });

    setItemQuantities(quantities);
    setItemNames(names);
    setItemPrices(prices);
    setOriginalItemSnapshots(snapshots);
    setRemovedItemIds({});
    setNextDraftItemId(1);

    if (preserveAssignments) {
      setAssignmentMap((prev) => {
        const nextMap = {};
        (nextItems ?? []).forEach((item) => {
          nextMap[item.id] = prev[item.id] || [];
        });
        return nextMap;
      });
    }
  }, []);

  const lastFetchTime = useRef(0);
  const FETCH_DEBOUNCE_MS = 1000;

  const fetchSummary = useCallback(async (force = false) => {
    if (!billId) return;
    
    if (!force && inFlightMutationsRef.current > 0) return;

    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime.current;
    if (!force && timeSinceLastFetch < FETCH_DEBOUNCE_MS) return;

    lastFetchTime.current = now;

    try {
      const [summaryRes, assignRes] = await Promise.all([
        billsApi.getSummary(billId),
        assignmentsApi.list(billId),
      ]);

      if (!force && inFlightMutationsRef.current > 0) return;

      const data = summaryRes.data;
      setMembers(data.members ?? []);
      applyServerItemState(data.bill, data.items ?? []);

      const allAssignments = assignRes.data ?? [];
      setServerAssignments(allAssignments);
      const map = {};
      const idMap = {};
      (data.items ?? []).forEach((item) => {
        map[item.id] = [];
      });
      allAssignments.forEach((a) => {
        const itemId = a.receipt_item_id;
        if (!map[itemId]) map[itemId] = [];
        if (!map[itemId].includes(a.bill_member_id)) {
          map[itemId].push(a.bill_member_id);
        }
        const key = `${itemId}::${a.bill_member_id}`;
        if (!idMap[key]) idMap[key] = [];
        idMap[key].push(a.id);
      });
      serverAssignmentIds.current = idMap;
      setAssignmentMap(map);
    } catch (e) {
      if (__DEV__) console.warn('[fetchSummary] failed', e);
    }
  }, [applyServerItemState, billId]);

  const handlePullToRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  }, [fetchSummary]);

  // Initial load
  useEffect(() => {
    fetchSummary().finally(() => setLoading(false));
  }, [fetchSummary]);

  // Refresh when the screen regains focus
  useFocusEffect(
    useCallback(() => {
      fetchSummary(true);
    }, [fetchSummary]),
  );

  // Refresh when the app returns from background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') fetchSummary(true);
    });
    return () => sub.remove();
  }, [fetchSummary]);

  const applyFullAssignmentList = useCallback((serverList) => {
    setServerAssignments(serverList);
    const map = {};
    const idMap = {};
    (items ?? []).forEach((item) => {
      map[item.id] = [];
    });
    serverList.forEach((a) => {
      const itemId = a.receipt_item_id;
      if (!map[itemId]) map[itemId] = [];
      if (!map[itemId].includes(a.bill_member_id)) {
        map[itemId].push(a.bill_member_id);
      }
      const key = `${itemId}::${a.bill_member_id}`;
      if (!idMap[key]) idMap[key] = [];
      idMap[key].push(a.id);
    });
    serverAssignmentIds.current = idMap;
    setAssignmentMap(map);
  }, [items]);

  /** Apply authoritative per-item assignment state from the server. This
   *  keeps `serverAssignments` (used for subtotals + per-member amounts)
   *  in sync alongside the chip list, including equal-split sibling
   *  recalculations that happen when a new member is added/removed. */
  const applyItemAssignments = useCallback((itemId, itemAssignments) => {
    if (!itemId) return;
    const list = Array.isArray(itemAssignments) ? itemAssignments : [];

    setServerAssignments((prev) => {
      const withoutItem = prev.filter((a) => a.receipt_item_id !== itemId);
      return [...withoutItem, ...list];
    });

    setAssignmentMap((prev) => {
      const memberIds = [];
      list.forEach((a) => {
        if (!memberIds.includes(a.bill_member_id)) memberIds.push(a.bill_member_id);
      });
      return { ...prev, [itemId]: memberIds };
    });

    const newIdMap = { ...serverAssignmentIds.current };
    Object.keys(newIdMap).forEach((key) => {
      if (key.startsWith(`${itemId}::`)) delete newIdMap[key];
    });
    list.forEach((a) => {
      const key = `${itemId}::${a.bill_member_id}`;
      if (!newIdMap[key]) newIdMap[key] = [];
      if (!newIdMap[key].includes(a.id)) newIdMap[key].push(a.id);
    });
    serverAssignmentIds.current = newIdMap;
  }, []);

  /** Apply an `assignment_update` delta to local state without a REST
   *  round-trip. The broadcast payload carries `item_assignments` — the
   *  full post-mutation assignment list for the affected item — so
   *  re-applying is idempotent and safe even for events we originated
   *  (we may have already updated locally from the mutation HTTP response).
   *
   *  Payload shapes we accept:
   *    - Per-item delta: { action, receipt_item_id, item_assignments, ... }
   *    - Full sync:      { action: 'full_sync', assignments: [...] }
   *    - Legacy array:   [AssignmentOut, ...] (pre-delta server payload)
   */
  const applyAssignmentDelta = useCallback((data) => {
    if (!data) return;

    if (Array.isArray(data)) {
      if (data.length === 0) return;
      applyFullAssignmentList(data);
      return;
    }

    const maybeMutationId = data.client_mutation_id;
    const isOwnEvent = maybeMutationId && ownMutationIdsRef.current.has(maybeMutationId);
    if (isOwnEvent) {
      // We already applied authoritative state from the mutation HTTP
      // response; dropping the echo avoids a redundant setState.
      ownMutationIdsRef.current.delete(maybeMutationId);
      return;
    }

    const action = data.action;
    if (action === 'full_sync') {
      applyFullAssignmentList(data.assignments ?? []);
      return;
    }

    const itemId = data.receipt_item_id;
    if (!itemId) return;

    if (Array.isArray(data.item_assignments)) {
      applyItemAssignments(itemId, data.item_assignments);
      return;
    }

    // Legacy compact delta (no item_assignments). Fall back to chip-only
    // toggling — subtotals will drift until the next focus refetch.
    const memberId = data.bill_member_id;
    const assignmentId = data.assignment_id;
    if (!memberId) return;
    const key = `${itemId}::${memberId}`;

    if (action === 'added') {
      setAssignmentMap((prev) => {
        const list = prev[itemId] || [];
        return {
          ...prev,
          [itemId]: list.includes(memberId) ? list : [...list, memberId],
        };
      });
      if (assignmentId) {
        const existing = serverAssignmentIds.current[key] || [];
        if (!existing.includes(assignmentId)) {
          serverAssignmentIds.current[key] = [...existing, assignmentId];
        }
      }
    } else if (action === 'removed') {
      setAssignmentMap((prev) => {
        const list = prev[itemId] || [];
        return {
          ...prev,
          [itemId]: list.filter((id) => id !== memberId),
        };
      });
      if (assignmentId) {
        serverAssignmentIds.current[key] = (serverAssignmentIds.current[key] || []).filter(
          (id) => id !== assignmentId,
        );
      } else {
        serverAssignmentIds.current[key] = [];
      }
    }
  }, [applyFullAssignmentList, applyItemAssignments]);

  const handleToggleMember = useCallback((itemId, memberId) => {
    const key = `${itemId}::${memberId}`;
    const currentList = assignmentMap[itemId] || [];
    const has = currentList.includes(memberId);

    // Optimistic UI update
    setAssignmentMap((prev) => {
      const list = prev[itemId] || [];
      return {
        ...prev,
        [itemId]: has
          ? list.filter((id) => id !== memberId)
          : list.includes(memberId) ? list : [...list, memberId],
      };
    });

    inFlightMutationsRef.current += 1;

    const prevPromise = mutationQueueRef.current[key] || Promise.resolve();
    const nextPromise = prevPromise.then(async () => {
      try {
        let itemAssignmentsMap = null;
        if (has) {
          const ids = serverAssignmentIds.current[key] || [];
          if (ids.length > 0) {
            const responses = await Promise.all(
              ids.map((id) => {
                const mutationId = newClientMutationId();
                ownMutationIdsRef.current.add(mutationId);
                return assignmentsApi
                  .delete(billId, id, { clientMutationId: mutationId })
                  .catch(() => {
                    ownMutationIdsRef.current.delete(mutationId);
                    return null;
                  });
              }),
            );
            // Use the last successful delete's authoritative state —
            // they're sequential mutations of the same item, so later
            // wins.
            for (const res of responses) {
              const map = res?.data?.item_assignments;
              if (map) itemAssignmentsMap = map;
            }
          }
          serverAssignmentIds.current[key] = [];
        } else {
          const mutationId = newClientMutationId();
          ownMutationIdsRef.current.add(mutationId);
          const res = await assignmentsApi.create(
            billId,
            [
              { receipt_item_id: itemId, bill_member_id: memberId, share_type: 'equal', share_value: 0 },
            ],
            { clientMutationId: mutationId },
          );
          const payload = res?.data ?? res;
          // Response shape: { assignments: [...], item_assignments: {itemId: [...]} }
          // with a backward-compatible fallback to the legacy array shape.
          const createdList = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.assignments)
              ? payload.assignments
              : [payload];
          const newIds = createdList
            .filter(Boolean)
            .map((a) => a?.id)
            .filter(Boolean);
          serverAssignmentIds.current[key] = [
            ...(serverAssignmentIds.current[key] || []),
            ...newIds,
          ];
          if (payload && payload.item_assignments) {
            itemAssignmentsMap = payload.item_assignments;
          }
        }

        // Apply authoritative per-item state to `serverAssignments` so
        // subtotals and per-member amounts update as the equal-split
        // siblings get recomputed server-side. Without this, the chips
        // toggle instantly but the subtotal row stays stale until the
        // next focus refetch.
        if (itemAssignmentsMap) {
          Object.entries(itemAssignmentsMap).forEach(([iid, list]) => {
            applyItemAssignments(iid, list);
          });
        }
      } catch (err) {
        console.warn('[TOGGLE] mutation failed, reverting', err);
        setAssignmentMap((prev) => {
          const list = prev[itemId] || [];
          return {
            ...prev,
            [itemId]: has
              ? list.includes(memberId) ? list : [...list, memberId]
              : list.filter((id) => id !== memberId),
          };
        });
      }
    });

    mutationQueueRef.current[key] = nextPromise.catch(() => {});

    // NO fetchSummary here. The optimistic update + the server response on
    // the mutation itself are the source of truth. Broadcasts from other
    // clients will update via `applyAssignmentDelta`. Any drift will be
    // reconciled on screen focus / background wake (see effects above).
    nextPromise.finally(() => {
      inFlightMutationsRef.current = Math.max(0, inFlightMutationsRef.current - 1);
    });
  }, [assignmentMap, billId, applyItemAssignments]);

  return {
    // State
    bill,
    members,
    items,
    setItems,
    assignmentMap,
    setAssignmentMap,
    serverAssignments,
    loading,
    refreshing,
    
    // Item editing state
    isEditingItems,
    setIsEditingItems,
    savingItemEdits,
    setSavingItemEdits,
    nextDraftItemId,
    setNextDraftItemId,
    itemQuantities,
    setItemQuantities,
    itemNames,
    setItemNames,
    itemPrices,
    setItemPrices,
    originalItemSnapshots,
    setOriginalItemSnapshots,
    removedItemIds,
    setRemovedItemIds,
    
    // Actions
    fetchSummary,
    handlePullToRefresh,
    handleToggleMember,
    applyServerItemState,
    applyMemberJoined,
    applyAssignmentDelta,
  };
}