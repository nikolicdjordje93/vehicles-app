import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import type { CreateVehiclePayload, Vehicle, VehicleOptions } from './types'
import { useLanguage } from './i18n'
import { useDatalistFocus } from './useDatalistFocus'

interface AddVehicleModalProps {
  // Decides which list this vehicle joins - the page that opened the modal
  // already knows this, so the user never has to pick it manually.
  isNew: boolean
  onClose: () => void
  // Called after a successful save, so the page can re-fetch its list and
  // show the new/updated row without a manual page refresh.
  onCreated: () => void
  // When set, the modal opens pre-filled for this vehicle and saves via
  // PUT instead of POST - same form, add vs. edit mode.
  vehicle?: Vehicle
}

// A default year to pre-fill the form with - it's still a plain text
// field underneath, so the user can change it to anything.
const DEFAULT_YEAR = '2026'

export function AddVehicleModal({ isNew, onClose, onCreated, vehicle }: AddVehicleModalProps) {
  const { t } = useLanguage()
  const isEditing = vehicle !== undefined
  const [options, setOptions] = useState<VehicleOptions | null>(null)
  const [brand, setBrand] = useState(vehicle?.brand ?? '')
  const [model, setModel] = useState(vehicle?.model ?? '')
  const [bodyType, setBodyType] = useState(vehicle?.bodyType ?? '')
  const [color, setColor] = useState(vehicle?.color ?? '')
  const [colorError, setColorError] = useState<string | null>(null)
  const [engine, setEngine] = useState(vehicle?.engine ?? '')
  const [year, setYear] = useState(vehicle ? String(vehicle.year) : DEFAULT_YEAR)
  const [yearError, setYearError] = useState<string | null>(null)
  const [price, setPrice] = useState(vehicle ? String(vehicle.price) : '')
  const [priceError, setPriceError] = useState<string | null>(null)
  // Optional - "" means no tyre attached. A real <select>, not a datalist,
  // since this must resolve to an actual TyreId, not free text.
  const [tyreId, setTyreId] = useState(vehicle?.tyreId ? String(vehicle.tyreId) : '')
  const [tyreQuantity, setTyreQuantity] = useState(vehicle?.tyreQuantity ? String(vehicle.tyreQuantity) : '')
  const [tyreQuantityError, setTyreQuantityError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Becomes true after a failed submit attempt, so required-field
  // messages only show once the user has actually tried to save.
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // Letters and spaces only - rejects the keystroke instead of accepting
  // it and showing an error afterward, so invalid characters never end up
  // in the field to begin with.
  const LETTERS_ONLY = /^[a-zA-ZčćžšđČĆŽŠĐ\s]*$/
  // Digits only - no comma/dot, so "18500" is fine but "18500,00" isn't.
  const DIGITS_ONLY = /^[0-9]*$/
  // Empty, or digits with an optional decimal point, e.g. "18500.50".
  // Must start with a digit - blocks a lone "." from being typed.
  const PRICE_PATTERN = /^$|^[0-9]+\.?[0-9]*$/

  function handleColorChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (LETTERS_ONLY.test(value)) {
      setColor(value)
      setColorError(null)
    } else {
      setColorError(t('errorColorLettersOnly'))
    }
  }

  function handleYearChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (DIGITS_ONLY.test(value)) {
      setYear(value)
      setYearError(null)
    } else {
      setYearError(t('errorNumbersOnly'))
    }
  }

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (PRICE_PATTERN.test(value)) {
      setPrice(value)
      setPriceError(null)
    } else {
      setPriceError(t('errorNumbersOnly'))
    }
  }

  function handleTyreQuantityChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (DIGITS_ONLY.test(value)) {
      setTyreQuantity(value)
      setTyreQuantityError(null)
    } else {
      setTyreQuantityError(t('errorNumbersOnly'))
    }
  }

  // One of these per datalist field - clears it on focus so the full list
  // of existing values shows, restores the old value on blur if nothing
  // was picked.
  const brandFocus = useDatalistFocus(setBrand)
  const modelFocus = useDatalistFocus(setModel)
  const bodyTypeFocus = useDatalistFocus(setBodyType)
  const colorFocus = useDatalistFocus(setColor)
  const engineFocus = useDatalistFocus(setEngine)
  const yearFocus = useDatalistFocus(setYear)

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

  const isFormValid =
    brand.trim() !== '' &&
    model.trim() !== '' &&
    bodyType.trim() !== '' &&
    color.trim() !== '' &&
    engine.trim() !== '' &&
    year.trim() !== '' &&
    price.trim() !== ''

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!isFormValid) {
      return
    }

    setSubmitting(true)
    setError(null)

    // A tyre was picked but quantity left blank - 4 is the sane default
    // for "a full set", without forcing the user to type it every time.
    const resolvedTyreQuantity = tyreId && !tyreQuantity.trim() ? '4' : tyreQuantity

    const payload: CreateVehiclePayload = {
      isNew,
      brand,
      model,
      bodyType,
      color,
      engine,
      year: Number(year),
      price: Number(price),
      tyreId: tyreId ? Number(tyreId) : null,
      tyreQuantity: tyreId ? Number(resolvedTyreQuantity) : null,
    }

    const url = vehicle
      ? `http://localhost:5122/api/vehicles/${vehicle.id}`
      : 'http://localhost:5122/api/vehicles'

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Server error returned: ${response.status}`)
      }

      onCreated()
      onClose()
    } catch (err) {
      setError(isEditing ? t('errorEditVehicle') : t('errorAddVehicle'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation so clicking inside the modal doesn't bubble up
          to the overlay's onClick and close it */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">{isEditing ? t('editVehicleTitle') : t('addVehicleTitle')}</h2>

        {/* noValidate - we show our own required-field messages instead
            of the browser's default validation tooltip. */}
        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* Only this area scrolls - title above and buttons below stay fixed. */}
          <div className="form__scroll-area">
          <label className="form__field">
            <span>{t('thManufacturer')}</span>
            <input
              list="brand-options"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              onFocus={brandFocus.onFocus}
              onBlur={brandFocus.onBlur}
              required
            />
            <datalist id="brand-options">
              {options?.brands.map((b) => <option key={b} value={b} />)}
            </datalist>
            {submitAttempted && !brand.trim() && (
              <span className="form__field-error">{t('errorRequired')}</span>
            )}
          </label>

          <label className="form__field">
            <span>{t('thModel')}</span>
            <input
              list="model-options"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              onFocus={modelFocus.onFocus}
              onBlur={modelFocus.onBlur}
              required
            />
            {/* Recomputed from `brand` above - type a different
                Manufacturer and these suggestions change with it. */}
            <datalist id="model-options">
              {modelSuggestions.map((m) => <option key={m} value={m} />)}
            </datalist>
            {submitAttempted && !model.trim() && (
              <span className="form__field-error">{t('errorRequired')}</span>
            )}
          </label>

          <label className="form__field">
            <span>{t('thYear')}</span>
            <input
              list="year-options"
              type="text"
              inputMode="numeric"
              value={year}
              onChange={handleYearChange}
              onFocus={yearFocus.onFocus}
              onBlur={yearFocus.onBlur}
              required
            />
            <datalist id="year-options">
              {options?.years.map((y) => <option key={y} value={y} />)}
            </datalist>
            {yearError && <span className="form__field-error">{yearError}</span>}
            {!yearError && submitAttempted && !year.trim() && (
              <span className="form__field-error">{t('errorRequired')}</span>
            )}
          </label>

          <label className="form__field">
            <span>{t('thBodyType')}</span>
            <input
              list="bodytype-options"
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              onFocus={bodyTypeFocus.onFocus}
              onBlur={bodyTypeFocus.onBlur}
              required
            />
            <datalist id="bodytype-options">
              {options?.bodyTypes.map((b) => <option key={b} value={b} />)}
            </datalist>
            {submitAttempted && !bodyType.trim() && (
              <span className="form__field-error">{t('errorRequired')}</span>
            )}
          </label>

          <label className="form__field">
            <span>{t('thColor')}</span>
            <input
              list="color-options"
              value={color}
              onChange={handleColorChange}
              onFocus={colorFocus.onFocus}
              onBlur={colorFocus.onBlur}
              required
            />
            <datalist id="color-options">
              {options?.colors.map((c) => <option key={c} value={c} />)}
            </datalist>
            {colorError && <span className="form__field-error">{colorError}</span>}
            {!colorError && submitAttempted && !color.trim() && (
              <span className="form__field-error">{t('errorRequired')}</span>
            )}
          </label>

          <label className="form__field">
            <span>{t('thEngine')}</span>
            <input
              list="engine-options"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              onFocus={engineFocus.onFocus}
              onBlur={engineFocus.onBlur}
              required
            />
            <datalist id="engine-options">
              {options?.engines.map((eng) => <option key={eng} value={eng} />)}
            </datalist>
            {submitAttempted && !engine.trim() && (
              <span className="form__field-error">{t('errorRequired')}</span>
            )}
          </label>

          <label className="form__field">
            <span>{t('thPrice')}</span>
            <input
              type="text"
              inputMode="decimal"
              value={price}
              onChange={handlePriceChange}
              required
            />
            {priceError && <span className="form__field-error">{priceError}</span>}
            {!priceError && submitAttempted && !price.trim() && (
              <span className="form__field-error">{t('errorRequired')}</span>
            )}
          </label>

          {/* Optional - a real <select> since it must resolve to an
              actual TyreId, unlike the free-text fields above. */}
          <label className="form__field">
            <span>{t('thTyre')}</span>
            <select value={tyreId} onChange={(e) => setTyreId(e.target.value)}>
              <option value="">{t('noTyreOption')}</option>
              {options?.tyres.map((tyreOption) => (
                <option key={tyreOption.id} value={tyreOption.id}>
                  {tyreOption.brand} {tyreOption.sizeInches}" - {tyreOption.season} (€{tyreOption.price})
                </option>
              ))}
            </select>
          </label>

          {tyreId && (
            <label className="form__field">
              <span>{t('thQuantity')}</span>
              <input
                type="text"
                inputMode="numeric"
                value={tyreQuantity}
                onChange={handleTyreQuantityChange}
                placeholder="4"
              />
              {tyreQuantityError && <span className="form__field-error">{tyreQuantityError}</span>}
            </label>
          )}

          {error && <p className="state state--error">{error}</p>}
          </div>

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
