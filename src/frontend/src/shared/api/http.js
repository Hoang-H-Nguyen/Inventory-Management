// In-memory bearer token only; a real auth flow still needs to be implemented.
let accessToken = null;
export function setAccessToken(token) { accessToken = token; }

export class ApiError extends Error {
  constructor(status, details) {
    super(details.message || `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function request(path, { method = 'GET', query, body, headers = {}, signal } = {}) {
  const base = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  const url = new URL(`${base.replace(/\/$/, '')}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(query || {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  }
  const response = await fetch(url, {
    method, signal,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; }
  catch { throw new ApiError(response.status, { message: 'API trả về nội dung không phải JSON.' }); }
  if (!response.ok) throw new ApiError(response.status, data || {});
  return data;
}
// Caller owns Idempotency-Key and must reuse the same key for the same retried mutation.
// Do not automatically retry stock movements or invent acting-user/role headers.
