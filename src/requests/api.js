export const API_BASE = import.meta.env.VITE_API_BASE || 'https://backend-drivez-atgfavb2cuccgrah.eastus2-01.azurewebsites.net/v1/drivez';

export function buildUrl(path) {
  if (!path) return API_BASE;
  return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
}

export async function apiFetch(path, options = {}) {
  const url = buildUrl(path);

  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = hasBody && typeof FormData !== 'undefined' && options.body instanceof FormData;

  const defaultHeaders = {};
  if (hasBody && !isFormData) defaultHeaders['Content-Type'] = 'application/json';

  options.headers = { ...(options.headers || {}), ...defaultHeaders };

  const response = await fetch(url, options);

  if (!response.ok) {
    let text = null;
    try { text = await response.text(); } catch (e) {}

    // Try to parse JSON error body for richer information
    let parsed = null;
    try { parsed = text ? JSON.parse(text) : null; } catch (e) { parsed = null; }

    const errMsg = (parsed && (parsed.message || parsed.error)) || text || `HTTP ${response.status}`;
    const err = new Error(errMsg);
    err.status = response.status;
    err.body = parsed || text;
    throw err;
  }

  if (response.status === 204) return null;
  try { return await response.json(); } catch (e) { return null; }
}

export default { API_BASE, buildUrl, apiFetch };
