import { Link } from 'react-router-dom'
import { useLanguage } from './i18n'

export function Home() {
  const { t } = useLanguage()

  return (
    <div className="home">
      <h1>{t('homeTitle')}</h1>
      <p>{t('homeSubtitle')}</p>
      <div className="home__cards">
        <Link to="/vehicles" className="home__card">{t('navVehicles')}</Link>
        <Link to="/tyres" className="home__card">{t('navTyres')}</Link>
      </div>
    </div>
  )
}
