import { useState, useEffect, useCallback } from 'react'
import type { Equipment as EquipmentItem } from './types'
import { EquipmentIcon } from './Icons'
import { useLanguage } from './i18n'
import { apiFetch } from './api'

// Read-only list - there's no "Add equipment" button on purpose (new rows
// go straight into the database), same reasoning as BodyTypes.
export function Equipment() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiFetch('/api/equipment')

      if (!response.ok) {
        throw new Error(`Server error returned: ${response.status}`)
      }

      const data = await response.json()
      setEquipment(data)
    } catch (err) {
      setError(t('errorEquipment'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchEquipment()
  }, [fetchEquipment])

  let content

  if (loading) {
    content = (
      <div className="state">
        <div className="spinner" />
        <p>{t('loadingEquipment')}</p>
      </div>
    )
  } else if (error) {
    content = <p className="state state--error">{t('errorPrefix')} {error}</p>
  } else if (equipment.length === 0) {
    content = <p className="state">{t('emptyEquipment')}</p>
  } else {
    content = (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>{t('thEquipmentName')}</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <EquipmentIcon className="page-title__icon" />
          {t('navEquipment')}
        </h1>
      </div>
      {content}
    </div>
  )
}
