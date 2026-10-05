import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import type { CreateVehiclePayload, Vehicle, VehicleOptions } from './types'
import { useLanguage } from './i18n'
import { useDatalistFocus } from './useDatalistFocus'
import { EquipmentPicker } from './EquipmentPicker'
import { apiFetch } from './api'

interface AddVehicleModalProps {
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

export function AddVehicleModal({ onClose, onCreated, vehicle }: AddVehicleModalProps) {
  const { t } = useLanguage()
  const isEditing = vehicle !== undefined
  const [options, setOptions] = useState<VehicleOptions | null>(null)
  // Explicit field, not inherited from whichever tab was open - lets you
  // add a used vehicle while looking at the New tab, or fix a miscategorized
  // one on Edit. Defaults to New for the Add form.
  const [isNewVehicle, setIsNewVehicle] = useState(vehicle ? vehicle.isNew : true)
  const [brand, setBrand] = useState(vehicle?.brand ?? '')
  const [model, setModel] = useState(vehicle?.model ?? '')
  // A real <select> bound to an id, not free text - same reasoning as
  // tyreId below. Options come straight from the BodyTypes šifarnik table.
  const [bodyTypeId, setBodyTypeId] = useState(vehicle ? String(vehicle.bodyTypeId) : '')
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
  // Which equipment ids are currently checked - starts from whatever the
  // vehicle already has (mapped down to just the ids) when editing.
  const [equipmentIds, setEquipmentIds] = useState<number[]>(vehicle?.equipment.map((e) => e.id) ?? [])
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

  // Checking a box adds its id, unchecking removes it - equipmentIds is
  // just "the current set of checked ids", nothing fancier than that.
  function handleEquipmentToggle(equipmentId: number) {
    setEquipmentIds((prev) =>
      prev.includes(equipmentId)
        ? prev.filter((id) => id !== equipmentId)
        : [...prev, equipmentId]
    )
  }

  // One of these per datalist field - clears it on focus so the full list
  // of existing values shows, restores the old value on blur if nothing
  // was picked.
  const brandFocus = useDatalistFocus(setBrand)
  const modelFocus = useDatalistFocus(setModel)
  const colorFocus = useDatalistFocus(setColor)
  const engineFocus = useDatalistFocus(setEngine)
  const yearFocus = useDatalistFocus(setYear)

  // Pull the autocomplete suggestions once, when the modal first opens.
  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await apiFetch('/api/vehicles/options')
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
    bodyTypeId !== '' &&
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
      isNew: isNewVehicle,
      brand,
      model,
      bodyTypeId: Number(bodyTypeId),
      color,
      engine,
      year: Number(year),
      price: Number(price),
      tyreId: tyreId ? Number(tyreId) : null,
      tyreQuantity: tyreId ? Number(resolvedTyreQuantity) : null,
      equipmentIds,
    }

    const url = vehicle
      ? `/api/vehicles/${vehicle.id}`
      : '/api/vehicles'

    try {
      const response = await apiFetch(url, {
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
            <span>{t('thCondition')}</span>
            <div className="tabs">
              <button
                type="button"
                className={'tab' + (isNewVehicle ? ' tab--active' : '')}
                onClick={() => setIsNewVehicle(true)}
              >
                {t('conditionNew')}
              </button>
              <button
                type="button"
                className={'tab' + (!isNewVehicle ? ' tab--active' : '')}
                onClick={() => setIsNewVehicle(false)}
              >
                {t('conditionUsed')}
              </button>
            </div>
          </label>

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

          {/* Šifarnik - a real <select> resolving to a BodyTypeId, same
              reasoning as the Tyre <select> further down, not free text
              like Brand/Model/Color/Engine above. New entries are added
              directly in the database, not from this form. */}
          <label className="form__field">
            <span>{t('thBodyType')}</span>
            <select value={bodyTypeId} onChange={(e) => setBodyTypeId(e.target.value)}>
              <option value="">{t('selectBodyTypeOption')}</option>
              {options?.bodyTypes.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {submitAttempted && !bodyTypeId && (
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

          {/* Many-to-many - a multi-select dropdown, not a plain <select>,
              since more than one item can be picked at once. No
              required-field error here: an empty selection (no equipment
              at all) is valid. */}
          <div className="form__field">
            <span>{t('thEquipment')}</span>
            <EquipmentPicker
              options={options?.equipment ?? []}
              selectedIds={equipmentIds}
              onToggle={handleEquipmentToggle}
            />
          </div>

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
