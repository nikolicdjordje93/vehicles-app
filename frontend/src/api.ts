// Centralized fetch wrapper - every backend call except login goes through
// this instead of calling fetch() directly, so the Authorization header
// only has to be attached in one place.
const API_BASE = 'http://localhost:5122'
const STORAGE_KEY = 'auth'

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const auth = JSON.parse(raw)
      if (auth?.token) {
        headers.set('Authorization', `Bearer ${auth.token}`)
      }
    }
  } catch {
    // No valid stored auth - request goes out without a token, and the
    // backend returns 401 like it would for anyone else.
  }

  return fetch(`${API_BASE}${path}`, { ...options, headers })
}
