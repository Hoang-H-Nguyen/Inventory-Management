import { request } from '../../shared/api/http.js';

// GET /inventory | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function listInventory({ query, signal } = {}) {

  return request(`/inventory`, { method: 'GET', signal, query });
}

// GET /inventory/{productId} | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function getInventory({ productId, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/inventory/${encodeURIComponent(productId)}`, { method: 'GET', signal });
}

// GET /inventory/{productId}/movements | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function listMovements({ productId, query, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/inventory/${encodeURIComponent(productId)}/movements`, { method: 'GET', signal, query });
}

// POST /inventory/{productId}/counts | WAREHOUSE_STAFF
export function recordCount({ productId, body, idempotencyKey, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/inventory/${encodeURIComponent(productId)}/counts`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /inventory/{productId}/sales | WAREHOUSE_STAFF
export function recordSale({ productId, body, idempotencyKey, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/inventory/${encodeURIComponent(productId)}/sales`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}
