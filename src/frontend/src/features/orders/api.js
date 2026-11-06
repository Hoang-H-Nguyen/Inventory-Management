import { request } from '../../shared/api/http.js';

// GET /placed-orders | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function listPlacedOrders({ query, signal } = {}) {

  return request(`/placed-orders`, { method: 'GET', signal, query });
}

// POST /placed-orders | INVENTORY_PLANNER
export function createPlacedOrder({ body, idempotencyKey, signal } = {}) {

  return request(`/placed-orders`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /placed-orders/{orderId} | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function getPlacedOrder({ orderId, signal } = {}) {
  if (orderId === undefined || orderId === null) throw new TypeError('Missing orderId');
  return request(`/placed-orders/${encodeURIComponent(orderId)}`, { method: 'GET', signal });
}

// POST /placed-orders/{orderId}/receipts | WAREHOUSE_STAFF
export function receiveOrder({ orderId, body, idempotencyKey, signal } = {}) {
  if (orderId === undefined || orderId === null) throw new TypeError('Missing orderId');
  return request(`/placed-orders/${encodeURIComponent(orderId)}/receipts`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /placed-orders/{orderId}/cancellations | INVENTORY_PLANNER
export function cancelOrderRemainder({ orderId, body, idempotencyKey, signal } = {}) {
  if (orderId === undefined || orderId === null) throw new TypeError('Missing orderId');
  return request(`/placed-orders/${encodeURIComponent(orderId)}/cancellations`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /placed-orders/{orderId}/history | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function listOrderHistory({ orderId, query, signal } = {}) {
  if (orderId === undefined || orderId === null) throw new TypeError('Missing orderId');
  return request(`/placed-orders/${encodeURIComponent(orderId)}/history`, { method: 'GET', signal, query });
}
