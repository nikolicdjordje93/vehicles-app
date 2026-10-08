import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CarIcon } from './Icons'
import { useLanguage } from './i18n'
import { useAuth } from './auth'

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage()
  const { auth, logout } = useAuth()

  function closeMenu() {
    setIsOpen(false)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  // Neprijavljen korisnik (to je uvek samo /login, zbog ProtectedRoute) vidi
  // samo logo - bez linkova, izbora jezika, dropdown-a i korisničkog dela.
  // Mora da stoji POSLE svih hook-ova iznad: React zahteva da se hook-ovi
  // pozivaju istim redom pri svakom renderu, pa early return ne sme pre njih.
  // <span> umesto <Link> - nema gde da vodi dok korisnik nije prijavljen.
  if (!auth) {
    return (
      <nav className="nav">
        <span className="nav__brand">
          <CarIcon className="nav__brand-icon" />
          {t('brand')}
        </span>
      </nav>
    )
  }

  const categoryLabels: Record<string, string> = {
    '/vehicles': t('navVehicles'),
    '/tyres': t('navTyres'),
    '/equipment': t('navEquipment'),
  }

  const currentLabel = categoryLabels[location.pathname] ?? t('navCategories')

  function linkClass({ isActive }: { isActive: boolean }) {
    return 'nav__link' + (isActive ? ' is-active' : '')
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav__brand" onClick={closeMenu}>
        <CarIcon className="nav__brand-icon" />
        {t('brand')}
      </Link>

      <div className="nav__center">
        <NavLink to="/vehicles" className={linkClass}>
          {t('navVehicles')}
        </NavLink>
        <NavLink to="/tyres" className={linkClass}>
          {t('navTyres')}
        </NavLink>
        <NavLink to="/equipment" className={linkClass}>
          {t('navEquipment')}
        </NavLink>
      </div>

      <div className="nav__right">
        <div className="nav__lang-switch">
          <button
            className={'nav__lang-btn' + (language === 'sr' ? ' is-active' : '')}
            onClick={() => setLanguage('sr')}
          >
            SR
          </button>
          <button
            className={'nav__lang-btn' + (language === 'en' ? ' is-active' : '')}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
        </div>

        <div className="nav__dropdown">
          <button
            className="nav__dropdown-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {currentLabel} {isOpen ? '▲' : '▼'}
          </button>

          {isOpen && (
            <div className="nav__dropdown-menu">
              <NavLink
                to="/vehicles"
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {t('navVehicles')}
              </NavLink>
              <NavLink
                to="/tyres"
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {t('navTyres')}
              </NavLink>
              <NavLink
                to="/equipment"
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {t('navEquipment')}
              </NavLink>
            </div>
          )}
        </div>

        {/* Ovde je auth sigurno postavljen (neprijavljeni su izašli gore),
            pa više ne treba provera {auth && ...}. */}
        <div className="nav__user">
          <span className="nav__user-info">{auth.email} ({auth.role})</span>
          <button className="nav__logout-btn" onClick={handleLogout}>
            {t('logoutButton')}
          </button>
        </div>
      </div>
    </nav>
  )
}
