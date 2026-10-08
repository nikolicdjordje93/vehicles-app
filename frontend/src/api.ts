// Centralized fetch wrapper - every backend call except login goes through
// this instead of calling fetch() directly, so the Authorization header
// only has to be attached in one place.
const API_BASE = 'http://localhost:5122'
const STORAGE_KEY = 'auth'

// Ime događaja koji apiFetch pošalje kad bekend vrati 401 - AuthProvider
// (auth.tsx) ga sluša i odjavi korisnika.
export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

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

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })

  // 401 - token nedostaje, istekao je (posle 60 min) ili nije validan.
  // apiFetch nije komponenta, pa ne može sam da koristi useAuth() ni
  // useNavigate() - samo javi događaj, a AuthProvider uradi odjavu.
  if (response.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
  }

  return response
}
