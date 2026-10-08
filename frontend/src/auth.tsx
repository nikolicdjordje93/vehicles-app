import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { UNAUTHORIZED_EVENT } from './api'

export type Role = 'Admin' | 'Operater'

export interface AuthState {
  token: string
  id: number
  email: string
  role: Role
}

type AuthContextValue = {
  auth: AuthState | null
  login: (auth: AuthState) => void
  logout: () => void
}

const STORAGE_KEY = 'auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Čita sačuvano stanje iz localStorage-a pri prvom učitavanju stranice -
// baš to je ono što sprečava da refresh izloguje korisnika.
function readStoredAuth(): AuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    // Pokvaren/ručno izmenjen sadržaj u localStorage-u - tretiraj kao da
    // niko nije ulogovan, umesto da app padne.
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(readStoredAuth)

  function login(newAuth: AuthState) {
    setAuth(newAuth)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuth))
  }

  function logout() {
    setAuth(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  // apiFetch javi kad bekend vrati 401 - odjavimo korisnika. Ne treba
  // ručni redirect: auth postane null, pa ProtectedRoute sam prebaci na /login.
  useEffect(() => {
    function handleUnauthorized() {
      setAuth(null)
      localStorage.removeItem(STORAGE_KEY)
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Isti obrazac kao useLanguage() u i18n.tsx.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
