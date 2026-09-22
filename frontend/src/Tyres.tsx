import { useState, useEffect } from 'react'
import type { Tyre } from './types'
import { BrandBadge } from './BrandBadge'
import { TyreIcon } from './Icons'
import { FilterSidebar } from './FilterSidebar'
import { useLanguage } from './i18n'

export function Tyres() {
  const [tyres, setTyres] = useState<Tyre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchTyres() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://localhost:5122/api/tyres')

        if (!response.ok) {
          throw new Error(`Server error returned: ${response.status}`)
        }

        const data = await response.json()
        setTyres(data)
      } catch (err) {
        setError(t('errorTyres'))
      } finally {
        setLoading(false)
      }
    }

    fetchTyres()
  }, [t])

  let content

  if (loading) {
    content = (
      <div className="state">
        <div className="spinner" />
        <p>{t('loadingTyres')}</p>
      </div>
    )
  } else if (error) {
    content = <p className="state state--error">{t('errorPrefix')} {error}</p>
  } else if (tyres.length === 0) {
    content = <p className="state">{t('emptyTyres')}</p>
  } else {
    content = (
      <table className="table">
        <thead>
          <tr>
            <th>{t('thBrand')}</th>
            <th>{t('thSize')}</th>
            <th>{t('thSeason')}</th>
            <th>{t('thPrice')}</th>
          </tr>
        </thead>
        <tbody>
          {tyres.map((tyre) => (
            <tr key={tyre.id}>
              <td>
                <span className="brand-cell">
                  <BrandBadge name={tyre.brand} />
                  {tyre.brand}
                </span>
              </td>
              <td>{tyre.sizeInches}"</td>
              <td>{tyre.season}</td>
              <td>€{tyre.price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className="page-with-sidebar">
      <FilterSidebar />
      <div className="page-with-sidebar__main">
        <h1 className="page-title">
          <TyreIcon className="page-title__icon" />
          {t('navTyres')}
        </h1>
        {content}
      </div>
    </div>
  )
}
