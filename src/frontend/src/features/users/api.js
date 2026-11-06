import { request } from '../../shared/api/http.js';

// GET /users | ADMIN
export function listUsers({ query, signal } = {}) {

  return request(`/users`, { method: 'GET', signal, query });
}

// POST /users | ADMIN
export function createUser({ body, idempotencyKey, signal } = {}) {

  return request(`/users`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /users/{userId} | ADMIN
export function getUser({ userId, signal } = {}) {
  if (userId === undefined || userId === null) throw new TypeError('Missing userId');
  return request(`/users/${encodeURIComponent(userId)}`, { method: 'GET', signal });
}

// PATCH /users/{userId} | ADMIN
export function updateUser({ userId, body, idempotencyKey, signal } = {}) {
  if (userId === undefined || userId === null) throw new TypeError('Missing userId');
  return request(`/users/${encodeURIComponent(userId)}`, { method: 'PATCH', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// POST /users/{userId}/reset-password | ADMIN
export function resetUserPassword({ userId, body, idempotencyKey, signal } = {}) {
  if (userId === undefined || userId === null) throw new TypeError('Missing userId');
  return request(`/users/${encodeURIComponent(userId)}/reset-password`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /user-activity | ADMIN
export function listUserActivity({ query, signal } = {}) {

  return request(`/user-activity`, { method: 'GET', signal, query });
}
