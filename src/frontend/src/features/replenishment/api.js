import { request } from '../../shared/api/http.js';

// GET /low-stock | INVENTORY_PLANNER
export function listLowStock({ query, signal } = {}) {

  return request(`/low-stock`, { method: 'GET', signal, query });
}

// GET /low-stock/{productId} | INVENTORY_PLANNER
export function getLowStockDetail({ productId, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/low-stock/${encodeURIComponent(productId)}`, { method: 'GET', signal });
}

// GET /replenishment-runs | INVENTORY_PLANNER
export function listRuns({ query, signal } = {}) {

  return request(`/replenishment-runs`, { method: 'GET', signal, query });
}

// POST /replenishment-runs | INVENTORY_PLANNER
export function createManualRun({ idempotencyKey, signal } = {}) {

  return request(`/replenishment-runs`, { method: 'POST', signal, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}
