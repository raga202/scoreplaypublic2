// src/services/api.js
// Lightweight API helper used by services/*.js
// - Returns { status, data, ok, error } on network or parse errors
// - Adds Authorization: Bearer <token> when a session token is stored in AsyncStorage (@scoreplay:token)
// - Set BASE_URL to your API root (e.g. 'https://api.example.com/v1')
//
// Usage:
//   import apiFetch from '../services/api';
//   const res = await apiFetch('/users/me', { method: 'GET' });
//   if (res.ok) console.log(res.data);

const BASE_URL = ''; // e.g. 'https://api.yourdomain.com/v1' — set this to your backend URL if needed

// Safe AsyncStorage require (works even if package not installed during quick dev)
let AsyncStorage = null;
try {
  // eslint-disable-next-line global-require
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  AsyncStorage = null;
  // No-op: token header will simply not be added if AsyncStorage is unavailable
}

/**
 * apiFetch
 * @param {string} path - absolute URL or relative path (if BASE_URL is set)
 * @param {object} options - fetch options (method, headers, body, etc.)
 * @returns {Promise<{status:number, data:any, ok:boolean, error?:any}>}
 */
async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') || BASE_URL === '' ? path : `${BASE_URL}${path}`;

  const defaultHeaders = {
    Accept: 'application/json',
    ...((options && options.headers) || {}),
  };

  // Add JSON content-type if body present and not already set
  if (options.body && !(defaultHeaders['Content-Type'] || defaultHeaders['content-type'])) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Attach token if available
  try {
    if (AsyncStorage) {
      const token = await AsyncStorage.getItem('@scoreplay:token');
      if (token) defaultHeaders.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore token retrieval errors
    // console.warn('[apiFetch] token read error', e);
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers: defaultHeaders });
  } catch (networkErr) {
    // network error (offline, DNS, etc.)
    return { status: 0, data: null, ok: false, error: networkErr };
  }

  // Try to read response text safely
  let text = null;
  try {
    text = await response.text();
  } catch (e) {
    return { status: response.status, data: null, ok: response.ok, error: e };
  }

  // Try to parse JSON, otherwise return raw text
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = text;
    }
  }

  return { status: response.status, data, ok: response.ok };
}

export { apiFetch };
export default apiFetch;