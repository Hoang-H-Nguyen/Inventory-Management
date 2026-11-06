import { request } from '../../shared/api/http.js';

// GET /dashboard | MANAGER
export function getDashboard({ signal } = {}) {

  return request(`/dashboard`, { method: 'GET', signal });
}
