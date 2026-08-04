const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_URL = envUrl.endsWith('/api/super-admin') ? envUrl : `${envUrl.replace(/\/$/, '')}/api/super-admin`;

function getToken() {
  return localStorage.getItem('ceylone_token');
}

async function request(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const isFormData = body instanceof FormData;
  const requestHeaders = {};
  if (!isFormData) requestHeaders['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { ...requestHeaders, ...headers },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = { success: false, message: 'Unexpected server response' };
  }

  if (!res.ok || payload.success === false) {
    const err = new Error(payload.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

export const api = {
  get: (path) => request(path),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' })
};

export { BASE_URL };
