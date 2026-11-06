import { request } from '../../shared/api/http.js';

// GET /products/{productId}/sales | INVENTORY_PLANNER
export function listSales({ productId, query, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/products/${encodeURIComponent(productId)}/sales`, { method: 'GET', signal, query });
}

// GET /products/{productId}/demand | INVENTORY_PLANNER
export function getDemand({ productId, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/products/${encodeURIComponent(productId)}/demand`, { method: 'GET', signal });
}
