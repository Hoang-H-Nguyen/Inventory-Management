import { request } from '../../shared/api/http.js';

// POST /ai/draft-requests | INVENTORY_PLANNER
export function createAIDraftRequest({ body, idempotencyKey, signal } = {}) {

  return request(`/ai/draft-requests`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /ai/draft-requests/{requestId} | INVENTORY_PLANNER
export function getAIRequest({ requestId, signal } = {}) {
  if (requestId === undefined || requestId === null) throw new TypeError('Missing requestId');
  return request(`/ai/draft-requests/${encodeURIComponent(requestId)}`, { method: 'GET', signal });
}
