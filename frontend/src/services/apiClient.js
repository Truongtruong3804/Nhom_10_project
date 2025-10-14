// Central API client and integration points
// Toggle this to false when backend is ready
export const USE_MOCKS = true

// If VITE_API_URL is not set, use relative path (works with Vite proxy)
const BASE = (import.meta.env.VITE_API_URL || '').trim()

function withAuthHeaders(headers = {}) {
  try {
    const raw = localStorage.getItem('svm_user')
    if (raw) {
      const { token } = JSON.parse(raw) || {}
      if (token) return { ...headers, Authorization: `Bearer ${token}` }
    }
  } catch {}
  return headers
}

async function realFetch(path, options = {}) {
  const url = BASE ? BASE + path : path
  const res = await fetch(url, {
    headers: withAuthHeaders({ 'Content-Type': 'application/json', ...(options.headers || {}) }),
    ...options,
  })
  if (!res.ok) throw new Error('API error')
  return res.json()
}

export const api = {
  get: (path) => realFetch(path),
  post: (path, body) => realFetch(path, { method: 'POST', body: JSON.stringify(body) }),
}
