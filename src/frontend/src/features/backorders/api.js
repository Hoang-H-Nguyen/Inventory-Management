import { request } from '../../shared/api/http.js';

// GET /backorders | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function listBackorders({ query, signal } = {}) {

  return request(`/backorders`, { method: 'GET', signal, query });
}

// POST /backorders | INVENTORY_PLANNER
export function createBackorder({ body, idempotencyKey, signal } = {}) {

  return request(`/backorders`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /backorders/{backorderId} | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function getBackorder({ backorderId, signal } = {}) {
  if (backorderId === undefined || backorderId === null) throw new TypeError('Missing backorderId');
  return request(`/backorders/${encodeURIComponent(backorderId)}`, { method: 'GET', signal });
}

// POST /backorders/{backorderId}/fulfilments | WAREHOUSE_STAFF
export function fulfilBackorder({ backorderId, body, idempotencyKey, signal } = {}) {
  if (backorderId === undefined || backorderId === null) throw new TypeError('Missing backorderId');
  return request(`/backorders/${encodeURIComponent(backorderId)}/fulfilments`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /backorders/{backorderId}/cancellations | INVENTORY_PLANNER
export function cancelBackorder({ backorderId, body, idempotencyKey, signal } = {}) {
  if (backorderId === undefined || backorderId === null) throw new TypeError('Missing backorderId');
  return request(`/backorders/${encodeURIComponent(backorderId)}/cancellations`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /backorders/{backorderId}/history | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function listBackorderHistory({ backorderId, query, signal } = {}) {
  if (backorderId === undefined || backorderId === null) throw new TypeError('Missing backorderId');
  return request(`/backorders/${encodeURIComponent(backorderId)}/history`, { method: 'GET', signal, query });
}
