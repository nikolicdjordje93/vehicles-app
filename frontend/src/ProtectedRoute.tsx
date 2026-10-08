import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './auth'

// Omotava sve stranice koje traže prijavu (vidi App.tsx).
// Nema prijavljenog korisnika -> odmah na /login. `replace` zamenjuje
// trenutnu stavku u istoriji, pa dugme Back ne vraća na zaštićenu stranu.
// Ima prijavljenog korisnika -> <Outlet /> iscrta stranicu za trenutnu rutu.
export function ProtectedRoute() {
  const { auth } = useAuth()

  if (!auth) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
