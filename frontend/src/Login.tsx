import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth'
import { useLanguage } from './i18n'

export function Login() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
 debugger
    try {
      const response = await fetch('http://localhost:5122/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      // 401 - pogrešan email/lozinka, posebna (ljubaznija) poruka umesto
      // generičke greške.
      if (response.status === 401) {
        setError(t('errorLoginInvalid'))
        return
      }

      if (!response.ok) {
        throw new Error(`Server error returned: ${response.status}`)
      }

      const data = await response.json()
      login({ token: data.token, id: data.id, email: data.email, role: data.role })
      navigate('/vehicles')
    } catch (err) {
      setError(t('errorLoginGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <h1 className="login__title">{t('loginTitle')}</h1>

        <label className="form__field">
          <span>{t('emailLabel')}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="form__field">
          <span>{t('passwordLabel')}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="state state--error">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? t('saving') : t('loginButton')}
        </button>
      </form>
    </div>
  )
}
