import { useState, useEffect, useCallback } from 'react'
import type { Tyre } from './types'
import { BrandBadge } from './BrandBadge'
import { TyreIcon } from './Icons'
import { FilterSidebar } from './FilterSidebar'
import { useLanguage } from './i18n'
import { AddTyreModal } from './AddTyreModal'
import { apiFetch } from './api'
import { useAuth } from './auth'

export function Tyres() {
  const [tyres, setTyres] = useState<Tyre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTyre, setEditingTyre] = useState<Tyre | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  // Separate from `error` above - that one replaces the whole table (it's
  // meant for "couldn't load the list"). A failed delete shouldn't hide
  // the list the user is looking at, so it gets its own banner instead.
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const { t } = useLanguage()
  const { auth } = useAuth()
  // Isto kao u Vehicles.tsx - samo UI, bekend i dalje vraća 403 Operateru.
  const isAdmin = auth?.role === 'Admin'

  const fetchTyres = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiFetch('/api/tyres')

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
  }, [t])

  useEffect(() => {
    fetchTyres()
  }, [fetchTyres])

  async function handleDelete(id: number) {
    if (!window.confirm(t('confirmDeleteTyre'))) {
      return
    }

    setDeleteError(null)

    try {
      const response = await apiFetch(`/api/tyres/${id}`, {
        method: 'DELETE',
      })

      // 409 Conflict - the backend refused because a vehicle still has
      // this tyre attached. Distinct message so it's clear *why*.
      if (response.status === 409) {
        setDeleteError(t('errorTyreInUse'))
        setTimeout(() => setDeleteError(null), 3000)
        return
      }

      if (!response.ok) {
        throw new Error(`Server error returned: ${response.status}`)
      }

      fetchTyres()
      setSuccessMessage(t('successDeleteTyre'))
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setDeleteError(t('errorDeleteTyre'))
      setTimeout(() => setDeleteError(null), 3000)
    }
  }

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
      <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>{t('thBrand')}</th>
            <th>{t('thSize')}</th>
            <th>{t('thSeason')}</th>
            <th>{t('thPrice')}</th>
            <th>{t('thActions')}</th>
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
              <td>
                <div className="table__actions">
                  <button className="btn btn--secondary btn--small" onClick={() => setEditingTyre(tyre)}>
                    {t('editButton')}
                  </button>
                  {isAdmin && (
                    <button className="btn btn--danger btn--small" onClick={() => handleDelete(tyre.id)}>
                      {t('deleteButton')}
                    </button>
                  )}
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
      <FilterSidebar />
      <div className="page-with-sidebar__main">
        <div className="page-header">
          <h1 className="page-title">
            <TyreIcon className="page-title__icon" />
            {t('navTyres')}
          </h1>
          <button className="btn btn--primary" onClick={() => setShowAddModal(true)}>
            {t('addTyreButton')}
          </button>
        </div>
        {successMessage && <p className="banner banner--success">{successMessage}</p>}
        {deleteError && <p className="banner banner--error">{deleteError}</p>}
        {content}
      </div>

      {showAddModal && (
        <AddTyreModal onClose={() => setShowAddModal(false)} onCreated={fetchTyres} />
      )}

      {editingTyre && (
        <AddTyreModal
          tyre={editingTyre}
          onClose={() => setEditingTyre(null)}
          onCreated={() => {
            fetchTyres()
            setSuccessMessage(t('successEditTyre'))
            setTimeout(() => setSuccessMessage(null), 3000)
          }}
        />
      )}
    </div>
  )
}
