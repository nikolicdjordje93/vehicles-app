import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CarIcon } from './Icons'
import { useLanguage } from './i18n'

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()

  function closeMenu() {
    setIsOpen(false)
  }

  const categoryLabels: Record<string, string> = {
    '/new-vehicles': t('navNewVehicles'),
    '/used-vehicles': t('navUsedVehicles'),
    '/tyres': t('navTyres'),
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
        <NavLink to="/new-vehicles" className={linkClass}>
          {t('navNewVehicles')}
        </NavLink>
        <NavLink to="/used-vehicles" className={linkClass}>
          {t('navUsedVehicles')}
        </NavLink>
        <NavLink to="/tyres" className={linkClass}>
          {t('navTyres')}
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
                to="/new-vehicles"
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {t('navNewVehicles')}
              </NavLink>
              <NavLink
                to="/used-vehicles"
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {t('navUsedVehicles')}
              </NavLink>
              <NavLink
                to="/tyres"
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {t('navTyres')}
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
