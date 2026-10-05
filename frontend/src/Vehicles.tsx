import { useState, useEffect, useCallback } from 'react'
import type { Vehicle } from './types'
import { BrandBadge } from './BrandBadge'
import { CarIcon } from './Icons'
import { FilterSidebar } from './FilterSidebar'
import { useLanguage } from './i18n'
import { AddVehicleModal } from './AddVehicleModal'
import { apiFetch } from './api'

// New and Used used to be two separate pages/routes, then two tabs on one
// page. Both were really just a filter on the same table and the same DB
// rows (split only by the isNew column) - so now it's a single table with
// no filter at all, and a Condition column tells New from Used per row.

// Every filter lives here as plain text/selection state - "" (or 'all')
// means "no restriction on this field". Filtering itself happens entirely
// in the browser, over whatever fetchVehicles() already loaded - no extra
// requests to the backend, no new query params.
interface VehicleFilters {
  condition: 'all' | 'new' | 'used'
  brand: string
  model: string
  yearMin: string
  yearMax: string
  bodyTypeName: string
  color: string
  engine: string
  priceMin: string
  priceMax: string
  tyre: string
  equipmentName: string
}

const EMPTY_FILTERS: VehicleFilters = {
  condition: 'all',
  brand: '',
  model: '',
  yearMin: '',
  yearMax: '',
  bodyTypeName: '',
  color: '',
  engine: '',
  priceMin: '',
  priceMax: '',
  tyre: '',
  equipmentName: '',
}

// Which column is currently sorted, and which direction. null = whatever
// order the backend returned (Brand, then Model).
type SortField = 'condition' | 'brand' | 'model' | 'year' | 'bodyType' | 'color' | 'engine' | 'price' | 'tyre' | 'equipment'
interface SortConfig {
  field: SortField
  direction: 'asc' | 'desc'
}

function matchesFilters(vehicle: Vehicle, filters: VehicleFilters): boolean {
  if (filters.condition === 'new' && !vehicle.isNew) return false
  if (filters.condition === 'used' && vehicle.isNew) return false
  if (filters.brand && !vehicle.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false
  if (filters.model && !vehicle.model.toLowerCase().includes(filters.model.toLowerCase())) return false
  if (filters.yearMin && vehicle.year < Number(filters.yearMin)) return false
  if (filters.yearMax && vehicle.year > Number(filters.yearMax)) return false
  if (filters.bodyTypeName && vehicle.bodyTypeName !== filters.bodyTypeName) return false
  if (filters.color && !vehicle.color.toLowerCase().includes(filters.color.toLowerCase())) return false
  if (filters.engine && !vehicle.engine.toLowerCase().includes(filters.engine.toLowerCase())) return false
  if (filters.priceMin && vehicle.price < Number(filters.priceMin)) return false
  if (filters.priceMax && vehicle.price > Number(filters.priceMax)) return false
  if (filters.tyre && !(vehicle.tyreBrand ?? '').toLowerCase().includes(filters.tyre.toLowerCase())) return false
  if (filters.equipmentName && !vehicle.equipment.some((e) => e.name === filters.equipmentName)) return false
  return true
}

// One comparator, keyed by whichever field is currently sorted. Returns
// the usual negative/zero/positive Array.sort() expects; direction just
// flips the sign at the end instead of duplicating every case twice.
function compareVehicles(a: Vehicle, b: Vehicle, sort: SortConfig): number {
  let result: number

  switch (sort.field) {
    case 'condition':
      result = Number(a.isNew) - Number(b.isNew)
      break
    case 'brand':
      result = a.brand.localeCompare(b.brand)
      break
    case 'model':
      result = a.model.localeCompare(b.model)
      break
    case 'year':
      result = a.year - b.year
      break
    case 'bodyType':
      result = a.bodyTypeName.localeCompare(b.bodyTypeName)
      break
    case 'color':
      result = a.color.localeCompare(b.color)
      break
    case 'engine':
      result = a.engine.localeCompare(b.engine)
      break
    case 'price':
      result = a.price - b.price
      break
    case 'tyre':
      result = (a.tyreBrand ?? '').localeCompare(b.tyreBrand ?? '')
      break
    case 'equipment':
      result = a.equipment.length - b.equipment.length
      break
  }

  return sort.direction === 'desc' ? -result : result
}

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [filters, setFilters] = useState<VehicleFilters>(EMPTY_FILTERS)
  const [sort, setSort] = useState<SortConfig | null>(null)
  const { t } = useLanguage()

  // Pulled out of useEffect (and wrapped in useCallback so it doesn't get
  // recreated every render) so the "Add vehicle" modal can also call it
  // after a successful save, refreshing the list without a page reload.
  // No isNew query param - omitting it entirely returns every vehicle.
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiFetch('/api/vehicles')

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
  }, [t])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  async function handleDelete(id: number) {
    if (!window.confirm(t('confirmDeleteVehicle'))) {
      return
    }

    try {
      const response = await apiFetch(`/api/vehicles/${id}`, {
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

  function updateFilter<K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Clicking the same column again flips direction instead of re-picking
  // it from scratch - the usual data-table convention.
  function handleSort(field: SortField) {
    setSort((prev) =>
      prev?.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' }
    )
  }

  function sortIndicator(field: SortField) {
    if (sort?.field !== field) {
      return null
    }
    return sort.direction === 'asc' ? ' ▲' : ' ▼'
  }

  // The dropdown options for Body type / Equipment filters come straight
  // from whatever's actually in the loaded vehicles - not a separate
  // /options request - so they only ever list values that exist right now.
  const bodyTypeOptions = [...new Set(vehicles.map((v) => v.bodyTypeName))].sort()
  const equipmentOptions = [...new Set(vehicles.flatMap((v) => v.equipment.map((e) => e.name)))].sort()

  const displayedVehicles = vehicles
    .filter((v) => matchesFilters(v, filters))
    .sort((a, b) => (sort ? compareVehicles(a, b, sort) : 0))

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
  } else if (displayedVehicles.length === 0) {
    content = <p className="state">{t('emptyVehicles')}</p>
  } else {
    content = (
      <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th className="table__sortable" onClick={() => handleSort('condition')}>{t('thCondition')}{sortIndicator('condition')}</th>
            <th className="table__sortable" onClick={() => handleSort('brand')}>{t('thManufacturer')}{sortIndicator('brand')}</th>
            <th className="table__sortable" onClick={() => handleSort('model')}>{t('thModel')}{sortIndicator('model')}</th>
            <th className="table__sortable" onClick={() => handleSort('year')}>{t('thYear')}{sortIndicator('year')}</th>
            <th className="table__sortable" onClick={() => handleSort('bodyType')}>{t('thBodyType')}{sortIndicator('bodyType')}</th>
            <th className="table__sortable" onClick={() => handleSort('color')}>{t('thColor')}{sortIndicator('color')}</th>
            <th className="table__sortable" onClick={() => handleSort('engine')}>{t('thEngine')}{sortIndicator('engine')}</th>
            <th className="table__sortable" onClick={() => handleSort('price')}>{t('thPrice')}{sortIndicator('price')}</th>
            <th className="table__sortable" onClick={() => handleSort('tyre')}>{t('thTyre')}{sortIndicator('tyre')}</th>
            <th className="table__sortable" onClick={() => handleSort('equipment')}>{t('thEquipment')}{sortIndicator('equipment')}</th>
            <th>{t('thActions')}</th>
          </tr>
        </thead>
        <tbody>
          {displayedVehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>
                <span className={'condition-badge' + (vehicle.isNew ? ' condition-badge--new' : ' condition-badge--used')}>
                  {vehicle.isNew ? t('conditionNew') : t('conditionUsed')}
                </span>
              </td>
              <td>
                <span className="brand-cell">
                  <BrandBadge name={vehicle.brand} />
                  {vehicle.brand}
                </span>
              </td>
              <td>{vehicle.model}</td>
              <td>{vehicle.year}</td>
              <td>{vehicle.bodyTypeName}</td>
              <td>{vehicle.color}</td>
              <td>{vehicle.engine}</td>
              {/* "Start from" prefix only makes sense for a New vehicle
                  (list price); a Used one's price is the actual asking
                  price. Read per-row now (vehicle.isNew), not from a
                  page-level filter, since both conditions share one table. */}
              <td>{vehicle.isNew && `${t('priceFrom')} `}€{vehicle.price.toLocaleString()}</td>
              <td>
                {vehicle.tyreBrand
                  ? `${vehicle.tyreBrand} ${vehicle.tyreSizeInches}" (${vehicle.tyreQuantity}x)`
                  : '—'}
              </td>
              <td>
                {/* CSS-only hover popup (no JS state per row) - the panel
                    is just hidden with display:none and shown via the
                    :hover selector in index.css, instead of a plain
                    native title tooltip. */}
                {vehicle.equipment.length > 0 ? (
                  <span className="equipment-hover">
                    <span className="equipment-hover__count">
                      {vehicle.equipment.length} {t('equipmentCountLabel')}
                    </span>
                    <span className="equipment-hover__panel">
                      {vehicle.equipment.map((item) => (
                        <span key={item.id} className="chip">{item.name}</span>
                      ))}
                    </span>
                  </span>
                ) : '—'}
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
      </div>
    )
  }

  return (
    <div className="page-with-sidebar">
      <FilterSidebar>
        <div className="sidebar__filter">
          <label>{t('thCondition')}</label>
          <select value={filters.condition} onChange={(e) => updateFilter('condition', e.target.value as VehicleFilters['condition'])}>
            <option value="all">{t('filterAllOption')}</option>
            <option value="new">{t('conditionNew')}</option>
            <option value="used">{t('conditionUsed')}</option>
          </select>
        </div>

        <div className="sidebar__filter">
          <label>{t('thManufacturer')}</label>
          <input value={filters.brand} onChange={(e) => updateFilter('brand', e.target.value)} />
        </div>

        <div className="sidebar__filter">
          <label>{t('thModel')}</label>
          <input value={filters.model} onChange={(e) => updateFilter('model', e.target.value)} />
        </div>

        <div className="sidebar__filter">
          <label>{t('thYear')}</label>
          <div className="sidebar__filter-range">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={filters.yearMin}
              onChange={(e) => updateFilter('yearMin', e.target.value)}
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Max"
              value={filters.yearMax}
              onChange={(e) => updateFilter('yearMax', e.target.value)}
            />
          </div>
        </div>

        <div className="sidebar__filter">
          <label>{t('thBodyType')}</label>
          <select value={filters.bodyTypeName} onChange={(e) => updateFilter('bodyTypeName', e.target.value)}>
            <option value="">{t('filterAllOption')}</option>
            {bodyTypeOptions.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>

        <div className="sidebar__filter">
          <label>{t('thColor')}</label>
          <input value={filters.color} onChange={(e) => updateFilter('color', e.target.value)} />
        </div>

        <div className="sidebar__filter">
          <label>{t('thEngine')}</label>
          <input value={filters.engine} onChange={(e) => updateFilter('engine', e.target.value)} />
        </div>

        <div className="sidebar__filter">
          <label>{t('thPrice')}</label>
          <div className="sidebar__filter-range">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => updateFilter('priceMin', e.target.value)}
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => updateFilter('priceMax', e.target.value)}
            />
          </div>
        </div>

        <div className="sidebar__filter">
          <label>{t('thTyre')}</label>
          <input value={filters.tyre} onChange={(e) => updateFilter('tyre', e.target.value)} />
        </div>

        <div className="sidebar__filter">
          <label>{t('thEquipment')}</label>
          <select value={filters.equipmentName} onChange={(e) => updateFilter('equipmentName', e.target.value)}>
            <option value="">{t('filterAllOption')}</option>
            {equipmentOptions.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>

        <button className="btn btn--secondary btn--small" onClick={() => setFilters(EMPTY_FILTERS)}>
          {t('resetFiltersButton')}
        </button>
      </FilterSidebar>

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
