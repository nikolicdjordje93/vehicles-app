import { useState, useEffect } from 'react'
import type { NewVehicle } from './types'
import { BrandBadge } from './BrandBadge'
import { CarIcon } from './Icons'
import { FilterSidebar } from './FilterSidebar'
import { useLanguage } from './i18n'

export function NewVehicles() {
  const [vehicles, setVehicles] = useState<NewVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchNewVehicles() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://localhost:5122/api/newvehicles')

        if (!response.ok) {
          throw new Error(`Server error returned: ${response.status}`)
        }

        const data = await response.json()
        setVehicles(data)
      } catch (err) {
        setError(t('errorNewVehicles'))
      } finally {
        setLoading(false)
      }
    }

    fetchNewVehicles()
  }, [t])

  let content

  if (loading) {
    content = (
      <div className="state">
        <div className="spinner" />
        <p>{t('loadingNewVehicles')}</p>
      </div>
    )
  } else if (error) {
    content = <p className="state state--error">{t('errorPrefix')} {error}</p>
  } else if (vehicles.length === 0) {
    content = <p className="state">{t('emptyNewVehicles')}</p>
  } else {
    content = (
      <table className="table">
        <thead>
          <tr>
            <th>{t('thManufacturer')}</th>
            <th>{t('thModel')}</th>
            <th>{t('thBodyType')}</th>
            <th>{t('thColor')}</th>
            <th>{t('thEngine')}</th>
            <th>{t('thPrice')}</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>
                <span className="brand-cell">
                  <BrandBadge name={vehicle.brand} />
                  {vehicle.brand}
                </span>
              </td>
              <td>{vehicle.model}</td>
              <td>{vehicle.bodyType}</td>
              <td>{vehicle.color}</td>
              <td>{vehicle.engine}</td>
              <td>{t('priceFrom')} €{vehicle.price.toLocaleString()}</td>
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
          <CarIcon className="page-title__icon" />
          {t('navNewVehicles')}
        </h1>
        {content}
      </div>
    </div>
  )
}
