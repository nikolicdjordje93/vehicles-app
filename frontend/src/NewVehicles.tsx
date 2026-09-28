import { useState, useEffect, useCallback } from 'react'
import type { Vehicle } from './types'
import { BrandBadge } from './BrandBadge'
import { CarIcon } from './Icons'
import { FilterSidebar } from './FilterSidebar'
import { useLanguage } from './i18n'
import { AddVehicleModal } from './AddVehicleModal'

export function NewVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { t } = useLanguage()

  // Pulled out of useEffect (and wrapped in useCallback so it doesn't get
  // recreated every render) so the "Add vehicle" modal can also call it
  // after a successful save, refreshing the list without a page reload.
  const fetchNewVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('http://localhost:5122/api/vehicles?isNew=true')

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
  }, [t])

  useEffect(() => {
    fetchNewVehicles()
  }, [fetchNewVehicles])

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

      fetchNewVehicles()
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
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>
                <span className="brand-cell">
                  <BrandBadge name={vehicle.brand} />
                  {vehicle.brand}
                </span>
              </td>
              <td>{vehicle.model}</td>
              <td>{vehicle.year}</td>
              <td>{vehicle.bodyType}</td>
              <td>{vehicle.color}</td>
              <td>{vehicle.engine}</td>
              <td>{t('priceFrom')} €{vehicle.price.toLocaleString()}</td>
              <td>
                {vehicle.tyreBrand
                  ? `${vehicle.tyreBrand} ${vehicle.tyreSizeInches}" (${vehicle.tyreQuantity}x)`
                  : '—'}
              </td>
              <td>
                <div className="table__actions">
                  <button className="btn btn--secondary btn--small" onClick={() => setEditingVehicle(vehicle)}>
                    {t('editButton')}
                  </button>
                  <button className="btn btn--danger btn--small" onClick={() => handleDelete(vehicle.id)}>
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
            {t('navNewVehicles')}
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
          isNew={true}
          onClose={() => setShowAddModal(false)}
          onCreated={fetchNewVehicles}
        />
      )}

      {editingVehicle && (
        <AddVehicleModal
          isNew={true}
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onCreated={() => {
            fetchNewVehicles()
            setSuccessMessage(t('successEditVehicle'))
            setTimeout(() => setSuccessMessage(null), 3000)
          }}
        />
      )}
    </div>
  )
}
