import { request } from '../../shared/api/http.js';

// GET /me | ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER, MANAGER
export function getMe({ signal } = {}) {

  return request(`/me`, { method: 'GET', signal });
}

// POST /auth/login | PUBLIC
export function login({ body, idempotencyKey, signal } = {}) {

  return request(`/auth/login`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /auth/logout | ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER, MANAGER
export function logout({ idempotencyKey, signal } = {}) {

  return request(`/auth/logout`, { method: 'POST', signal, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /auth/change-password | ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER, MANAGER
export function changePassword({ body, idempotencyKey, signal } = {}) {

  return request(`/auth/change-password`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}
