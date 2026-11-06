import { request } from '../../shared/api/http.js';

// POST /proposals/preview | INVENTORY_PLANNER
export function previewProposal({ body, idempotencyKey, signal } = {}) {

  return request(`/proposals/preview`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /proposals | INVENTORY_PLANNER, MANAGER
export function listProposals({ query, signal } = {}) {

  return request(`/proposals`, { method: 'GET', signal, query });
}

// POST /proposals | INVENTORY_PLANNER
export function createDraft({ body, idempotencyKey, signal } = {}) {

  return request(`/proposals`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /proposals/{proposalId} | INVENTORY_PLANNER, MANAGER
export function getProposal({ proposalId, signal } = {}) {
  if (proposalId === undefined || proposalId === null) throw new TypeError('Missing proposalId');
  return request(`/proposals/${encodeURIComponent(proposalId)}`, { method: 'GET', signal });
}

// PATCH /proposals/{proposalId} | INVENTORY_PLANNER
export function updateDraft({ proposalId, body, idempotencyKey, signal } = {}) {
  if (proposalId === undefined || proposalId === null) throw new TypeError('Missing proposalId');
  return request(`/proposals/${encodeURIComponent(proposalId)}`, { method: 'PATCH', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /proposals/{proposalId}/submit | INVENTORY_PLANNER
export function submitProposal({ proposalId, body, idempotencyKey, signal } = {}) {
  if (proposalId === undefined || proposalId === null) throw new TypeError('Missing proposalId');
  return request(`/proposals/${encodeURIComponent(proposalId)}/submit`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /proposals/{proposalId}/approve | MANAGER
export function approveProposal({ proposalId, body, idempotencyKey, signal } = {}) {
  if (proposalId === undefined || proposalId === null) throw new TypeError('Missing proposalId');
  return request(`/proposals/${encodeURIComponent(proposalId)}/approve`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /proposals/{proposalId}/reject | MANAGER
export function rejectProposal({ proposalId, body, idempotencyKey, signal } = {}) {
  if (proposalId === undefined || proposalId === null) throw new TypeError('Missing proposalId');
  return request(`/proposals/${encodeURIComponent(proposalId)}/reject`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /proposals/{proposalId}/copy | INVENTORY_PLANNER
export function copyRejectedProposal({ proposalId, body, idempotencyKey, signal } = {}) {
  if (proposalId === undefined || proposalId === null) throw new TypeError('Missing proposalId');
  return request(`/proposals/${encodeURIComponent(proposalId)}/copy`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /proposals/{proposalId}/history | INVENTORY_PLANNER, MANAGER
export function listProposalHistory({ proposalId, query, signal } = {}) {
  if (proposalId === undefined || proposalId === null) throw new TypeError('Missing proposalId');
  return request(`/proposals/${encodeURIComponent(proposalId)}/history`, { method: 'GET', signal, query });
}
