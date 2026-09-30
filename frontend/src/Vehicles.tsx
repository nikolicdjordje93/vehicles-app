import { useState, useEffect, useCallback } from 'react'
import type { Vehicle } from './types'
import { BrandBadge } from './BrandBadge'
import { CarIcon } from './Icons'
import { FilterSidebar } from './FilterSidebar'
import { useLanguage } from './i18n'
import { AddVehicleModal } from './AddVehicleModal'

// New and Used used to be two separate pages/routes. They're the same
// table and the same DB rows (split only by the isNew column), so this
// single page now covers both - a tab picks which isNew value to fetch.
export function Vehicles() {
  const [isNewFilter, setIsNewFilter] = useState(true)
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
  // Depends on isNewFilter, so switching tabs refetches automatically.
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:5122/api/vehicles?isNew=${isNewFilter}`)

      if (!response.ok) {
        throw new Error(`Server error returned: ${response.status}`)
      }

      const data = await response.json()
      setVehicles(data)
    } catch (err) {
      setError(t('errorVehicles'))
    } finally {
      setLoading(false)
    }
  }, [t, isNewFilter])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

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

      fetchVehicles()
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
        <p>{t('loadingVehicles')}</p>
      </div>
    )
  } else if (error) {
    content = <p className="state state--error">{t('errorPrefix')} {error}</p>
  } else if (vehicles.length === 0) {
    content = <p className="state">{t('emptyVehicles')}</p>
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
              {/* "Start from" prefix only made sense for New (list price);
                  a used vehicle's price is the actual asking price. */}
              <td>{isNewFilter && `${t('priceFrom')} `}€{vehicle.price.toLocaleString()}</td>
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
            {t('navVehicles')}
          </h1>
          <button className="btn btn--primary" onClick={() => setShowAddModal(true)}>
            {t('addVehicleButton')}
          </button>
        </div>

        <div className="tabs" style={{ marginBottom: 20 }}>
          <button
            className={'tab' + (isNewFilter ? ' tab--active' : '')}
            onClick={() => setIsNewFilter(true)}
          >
            {t('tabNew')}
          </button>
          <button
            className={'tab' + (!isNewFilter ? ' tab--active' : '')}
            onClick={() => setIsNewFilter(false)}
          >
            {t('tabUsed')}
          </button>
        </div>

        {successMessage && <p className="banner banner--success">{successMessage}</p>}
        {content}
      </div>

      {showAddModal && (
        <AddVehicleModal
          onClose={() => setShowAddModal(false)}
          onCreated={fetchVehicles}
        />
      )}

      {editingVehicle && (
        <AddVehicleModal
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onCreated={() => {
            fetchVehicles()
            setSuccessMessage(t('successEditVehicle'))
            setTimeout(() => setSuccessMessage(null), 3000)
          }}
        />
      )}
    </div>
  )
}
