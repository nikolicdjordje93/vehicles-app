import { useState, useEffect, type FormEvent } from 'react'
import type { CreateVehiclePayload, VehicleOptions } from './types'
import { useLanguage } from './i18n'

interface AddVehicleModalProps {
  // Decides which list this vehicle joins - the page that opened the modal
  // already knows this, so the user never has to pick it manually.
  isNew: boolean
  onClose: () => void
  // Called after a successful save, so the page can re-fetch its list and
  // show the new row without a manual page refresh.
  onCreated: () => void
}

// A default year to pre-fill the form with - it's still a plain text
// field underneath, so the user can change it to anything.
const DEFAULT_YEAR = '2026'

export function AddVehicleModal({ isNew, onClose, onCreated }: AddVehicleModalProps) {
  const { t } = useLanguage()
  const [options, setOptions] = useState<VehicleOptions | null>(null)
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [bodyType, setBodyType] = useState('')
  const [color, setColor] = useState('')
  const [engine, setEngine] = useState('')
  const [year, setYear] = useState(DEFAULT_YEAR)
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pull the autocomplete suggestions once, when the modal first opens.
  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch('http://localhost:5122/api/vehicles/options')
        if (!response.ok) {
          throw new Error(`Server error returned: ${response.status}`)
        }
        const data: VehicleOptions = await response.json()
        setOptions(data)
      } catch {
        // Suggestions are a nice-to-have, not a requirement - if this
        // fails, the fields just fall back to plain free text with no
        // datalist entries, instead of blocking the whole form.
      }
    }

    fetchOptions()
  }, [])

  // Which models to suggest depends on the brand currently typed in -
  // this is what makes the Model suggestions "cascade" from Manufacturer.
  // It's a derived value (recomputed on every render), not its own state,
  // since it's entirely determined by `options` and `brand`.
  const modelSuggestions = options?.modelsByBrand[brand] ?? []

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const payload: CreateVehiclePayload = {
      isNew,
      brand,
      model,
      bodyType,
      color,
      engine,
      year: Number(year),
      price: Number(price),
    }

    try {
      const response = await fetch('http://localhost:5122/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Server error returned: ${response.status}`)
      }

      onCreated()
      onClose()
    } catch (err) {
      setError(t('errorAddVehicle'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation so clicking inside the modal doesn't bubble up
          to the overlay's onClick and close it */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">{t('addVehicleTitle')}</h2>

        <form className="form" onSubmit={handleSubmit}>
          {/* The `list` attribute on each input points at a <datalist> id
              below - this gives a browser-native autocomplete dropdown
              while the field stays a normal, freely-editable text input. */}
          <label className="form__field">
            <span>{t('thManufacturer')}</span>
            <input
              list="brand-options"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
            <datalist id="brand-options">
              {options?.brands.map((b) => <option key={b} value={b} />)}
            </datalist>
          </label>

          <label className="form__field">
            <span>{t('thModel')}</span>
            <input
              list="model-options"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
            {/* Recomputed from `brand` above - type a different
                Manufacturer and these suggestions change with it. */}
            <datalist id="model-options">
              {modelSuggestions.map((m) => <option key={m} value={m} />)}
            </datalist>
          </label>

          <label className="form__field">
            <span>{t('thYear')}</span>
            <input
              list="year-options"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
            <datalist id="year-options">
              {options?.years.map((y) => <option key={y} value={y} />)}
            </datalist>
          </label>

          <label className="form__field">
            <span>{t('thBodyType')}</span>
            <input
              list="bodytype-options"
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              required
            />
            <datalist id="bodytype-options">
              {options?.bodyTypes.map((b) => <option key={b} value={b} />)}
            </datalist>
          </label>

          <label className="form__field">
            <span>{t('thColor')}</span>
            <input value={color} onChange={(e) => setColor(e.target.value)} required />
          </label>

          <label className="form__field">
            <span>{t('thEngine')}</span>
            <input
              list="engine-options"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              required
            />
            <datalist id="engine-options">
              {options?.engines.map((eng) => <option key={eng} value={eng} />)}
            </datalist>
          </label>

          <label className="form__field">
            <span>{t('thPrice')}</span>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>

          {error && <p className="state state--error">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
