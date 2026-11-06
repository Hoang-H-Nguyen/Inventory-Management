import { request } from '../../shared/api/http.js';

// GET /products | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function listProducts({ query, signal } = {}) {

  return request(`/products`, { method: 'GET', signal, query });
}

// POST /products | INVENTORY_PLANNER
export function createProduct({ body, idempotencyKey, signal } = {}) {

  return request(`/products`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /products/{productId} | WAREHOUSE_STAFF, INVENTORY_PLANNER
export function getProduct({ productId, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/products/${encodeURIComponent(productId)}`, { method: 'GET', signal });
}

// PATCH /products/{productId} | INVENTORY_PLANNER
export function updateProduct({ productId, body, idempotencyKey, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/products/${encodeURIComponent(productId)}`, { method: 'PATCH', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /suppliers | INVENTORY_PLANNER
export function listSuppliers({ query, signal } = {}) {

  return request(`/suppliers`, { method: 'GET', signal, query });
}

// POST /suppliers | INVENTORY_PLANNER
export function createSupplier({ body, idempotencyKey, signal } = {}) {

  return request(`/suppliers`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// PATCH /suppliers/{supplierId} | INVENTORY_PLANNER
export function updateSupplier({ supplierId, body, idempotencyKey, signal } = {}) {
  if (supplierId === undefined || supplierId === null) throw new TypeError('Missing supplierId');
  return request(`/suppliers/${encodeURIComponent(supplierId)}`, { method: 'PATCH', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// GET /products/{productId}/suppliers | INVENTORY_PLANNER
export function listSupplierProducts({ productId, query, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/products/${encodeURIComponent(productId)}/suppliers`, { method: 'GET', signal, query });
}

// POST /products/{productId}/suppliers | INVENTORY_PLANNER
export function createSupplierProduct({ productId, body, idempotencyKey, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/products/${encodeURIComponent(productId)}/suppliers`, { method: 'POST', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// PATCH /supplier-products/{supplierProductId} | INVENTORY_PLANNER
export function updateSupplierProduct({ supplierProductId, body, idempotencyKey, signal } = {}) {
  if (supplierProductId === undefined || supplierProductId === null) throw new TypeError('Missing supplierProductId');
  return request(`/supplier-products/${encodeURIComponent(supplierProductId)}`, { method: 'PATCH', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}

// PUT /products/{productId}/policy | INVENTORY_PLANNER
export function setPolicy({ productId, body, idempotencyKey, signal } = {}) {
  if (productId === undefined || productId === null) throw new TypeError('Missing productId');
  return request(`/products/${encodeURIComponent(productId)}/policy`, { method: 'PUT', signal, body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} });
}
