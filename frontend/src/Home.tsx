import { Link } from 'react-router-dom'
import { useLanguage } from './i18n'

export function Home() {
  const { t } = useLanguage()

  return (
    <div className="home">
      <h1>{t('homeTitle')}</h1>
      <p>{t('homeSubtitle')}</p>
      <div className="home__cards">
        <Link to="/new-vehicles" className="home__card">{t('navNewVehicles')}</Link>
        <Link to="/used-vehicles" className="home__card">{t('navUsedVehicles')}</Link>
        <Link to="/tyres" className="home__card">{t('navTyres')}</Link>
      </div>
    </div>
  )
}
