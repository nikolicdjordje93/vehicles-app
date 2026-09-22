import { useState, useEffect } from 'react'
import type { UsedVehicle } from './types'
import { BrandBadge } from './BrandBadge'
import { CarIcon } from './Icons'
import { FilterSidebar } from './FilterSidebar'
import { useLanguage } from './i18n'

export function UsedVehicles() {
  const [usedVehicles, setUsedVehicles] = useState<UsedVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchUsedVehicles() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://localhost:5122/api/usedvehicles')

        if (!response.ok) {
          throw new Error(`Server error returned: ${response.status}`)
        }

        const data = await response.json()
        setUsedVehicles(data)
      } catch (err) {
        setError(t('errorUsedVehicles'))
      } finally {
        setLoading(false)
      }
    }

    fetchUsedVehicles()
  }, [t])

  let content

  if (loading) {
    content = (
      <div className="state">
        <div className="spinner" />
        <p>{t('loadingUsedVehicles')}</p>
      </div>
    )
  } else if (error) {
    content = <p className="state state--error">{t('errorPrefix')} {error}</p>
  } else if (usedVehicles.length === 0) {
    content = <p className="state">{t('emptyUsedVehicles')}</p>
  } else {
    content = (
      <table className="table">
        <thead>
          <tr>
            <th>{t('thManufacturer')}</th>
            <th>{t('thModel')}</th>
            <th>{t('thYear')}</th>
            <th>{t('thBodyType')}</th>
            <th>{t('thColor')}</th>
            <th>{t('thEngine')}</th>
            <th>{t('thPrice')}</th>
          </tr>
        </thead>
        <tbody>
          {usedVehicles.map((car) => (
            <tr key={car.id}>
              <td>
                <span className="brand-cell">
                  <BrandBadge name={car.manufacturer} />
                  {car.manufacturer}
                </span>
              </td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>{car.bodyType}</td>
              <td>{car.color}</td>
              <td>{car.engine}</td>
              <td>€{car.price.toLocaleString()}</td>
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
          {t('navUsedVehicles')}
        </h1>
        {content}
      </div>
    </div>
  )
}
