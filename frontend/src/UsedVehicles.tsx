import { useState, useEffect, useCallback } from 'react'
import type { Vehicle } from './types'
import { BrandBadge } from './BrandBadge'
import { CarIcon } from './Icons'
import { FilterSidebar } from './FilterSidebar'
import { useLanguage } from './i18n'
import { AddVehicleModal } from './AddVehicleModal'

export function UsedVehicles() {
  const [usedVehicles, setUsedVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { t } = useLanguage()

  // Pulled out of useEffect (and wrapped in useCallback so it doesn't get
  // recreated every render) so the "Add vehicle" modal can also call it
  // after a successful save, refreshing the list without a page reload.
  const fetchUsedVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('http://localhost:5122/api/vehicles?isNew=false')

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
  }, [t])

  useEffect(() => {
    fetchUsedVehicles()
  }, [fetchUsedVehicles])

  async function handleDelete(id: number) {
    if (!window.confirm(t('confirmDeleteVehicle'))) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5122/api/vehicles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Server error returned: ${response.status}`)
      }

      fetchUsedVehicles()
      setSuccessMessage(t('successDeleteVehicle'))
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(t('errorDeleteVehicle'))
    }
  }

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
            <th>{t('thTyre')}</th>
            <th>{t('thActions')}</th>
          </tr>
        </thead>
        <tbody>
          {usedVehicles.map((car) => (
            <tr key={car.id}>
              <td>
                <span className="brand-cell">
                  <BrandBadge name={car.brand} />
                  {car.brand}
                </span>
              </td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>{car.bodyType}</td>
              <td>{car.color}</td>
              <td>{car.engine}</td>
              <td>€{car.price.toLocaleString()}</td>
              <td>
                {car.tyreBrand
                  ? `${car.tyreBrand} ${car.tyreSizeInches}" (${car.tyreQuantity}x)`
                  : '—'}
              </td>
              <td>
                <div className="table__actions">
                  <button className="btn btn--secondary btn--small" onClick={() => setEditingVehicle(car)}>
                    {t('editButton')}
                  </button>
                  <button className="btn btn--danger btn--small" onClick={() => handleDelete(car.id)}>
                    {t('deleteButton')}
                  </button>
                </div>
              </td>
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
        <div className="page-header">
          <h1 className="page-title">
            <CarIcon className="page-title__icon" />
            {t('navUsedVehicles')}
          </h1>
          <button className="btn btn--primary" onClick={() => setShowAddModal(true)}>
            {t('addVehicleButton')}
          </button>
        </div>
        {successMessage && <p className="banner banner--success">{successMessage}</p>}
        {content}
      </div>

      {showAddModal && (
        <AddVehicleModal
          isNew={false}
          onClose={() => setShowAddModal(false)}
          onCreated={fetchUsedVehicles}
        />
      )}

      {editingVehicle && (
        <AddVehicleModal
          isNew={false}
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onCreated={() => {
            fetchUsedVehicles()
            setSuccessMessage(t('successEditVehicle'))
            setTimeout(() => setSuccessMessage(null), 3000)
          }}
        />
      )}
    </div>
  )
}
