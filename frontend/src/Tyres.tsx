import { useState, useEffect, useCallback } from 'react'
import type { Tyre } from './types'
import { BrandBadge } from './BrandBadge'
import { TyreIcon } from './Icons'
import { FilterSidebar } from './FilterSidebar'
import { useLanguage } from './i18n'
import { AddTyreModal } from './AddTyreModal'

export function Tyres() {
  const [tyres, setTyres] = useState<Tyre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTyre, setEditingTyre] = useState<Tyre | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { t } = useLanguage()

  const fetchTyres = useCallback(async () => {
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
  }, [t])

  useEffect(() => {
    fetchTyres()
  }, [fetchTyres])

  async function handleDelete(id: number) {
    if (!window.confirm(t('confirmDeleteTyre'))) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5122/api/tyres/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Server error returned: ${response.status}`)
      }

      fetchTyres()
      setSuccessMessage(t('successDeleteTyre'))
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(t('errorDeleteTyre'))
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
                  <button className="btn btn--danger btn--small" onClick={() => handleDelete(tyre.id)}>
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
            <TyreIcon className="page-title__icon" />
            {t('navTyres')}
          </h1>
          <button className="btn btn--primary" onClick={() => setShowAddModal(true)}>
            {t('addTyreButton')}
          </button>
        </div>
        {successMessage && <p className="banner banner--success">{successMessage}</p>}
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
