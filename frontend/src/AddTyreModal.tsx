import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import type { CreateTyrePayload, Tyre, TyreOptions } from './types'
import { useLanguage } from './i18n'
import { useDatalistFocus } from './useDatalistFocus'
import { apiFetch } from './api'

interface AddTyreModalProps {
  onClose: () => void
  // Called after a successful save, so the page can re-fetch its list and
  // show the new/updated row without a manual page refresh.
  onCreated: () => void
  // When set, the modal opens pre-filled for this tyre and saves via PUT
  // instead of POST - same form, add vs. edit mode. Same pattern as
  // AddVehicleModal.
  tyre?: Tyre
}

export function AddTyreModal({ onClose, onCreated, tyre }: AddTyreModalProps) {
  const { t } = useLanguage()
  const isEditing = tyre !== undefined
  const [options, setOptions] = useState<TyreOptions | null>(null)
  const [brand, setBrand] = useState(tyre?.brand ?? '')
  const [sizeInches, setSizeInches] = useState(tyre ? String(tyre.sizeInches) : '')
  const [sizeError, setSizeError] = useState<string | null>(null)
  const [season, setSeason] = useState(tyre?.season ?? '')
  const [price, setPrice] = useState(tyre ? String(tyre.price) : '')
  const [priceError, setPriceError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Becomes true after a failed submit attempt, so required-field
  // messages only show once the user has actually tried to save.
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // Digits only - no comma/dot.
  const DIGITS_ONLY = /^[0-9]*$/
  // Empty, or digits with an optional decimal point, e.g. "85.50".
  // Must start with a digit - blocks a lone "." from being typed.
  const PRICE_PATTERN = /^$|^[0-9]+\.?[0-9]*$/

  function handleSizeChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (DIGITS_ONLY.test(value)) {
      setSizeInches(value)
      setSizeError(null)
    } else {
      setSizeError(t('errorNumbersOnly'))
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

  // One of these per datalist field - clears it on focus so the full list
  // of existing values shows, restores the old value on blur if nothing
  // was picked.
  const brandFocus = useDatalistFocus(setBrand)
  const sizeFocus = useDatalistFocus(setSizeInches)
  const seasonFocus = useDatalistFocus(setSeason)

  // Pull the autocomplete suggestions once, when the modal first opens.
  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await apiFetch('/api/tyres/options')
        if (!response.ok) {
          throw new Error(`Server error returned: ${response.status}`)
        }
        const data: TyreOptions = await response.json()
        setOptions(data)
      } catch {
        // Suggestions are a nice-to-have, not a requirement.
      }
    }

    fetchOptions()
  }, [])

  const isFormValid =
    brand.trim() !== '' &&
    sizeInches.trim() !== '' &&
    season.trim() !== '' &&
    price.trim() !== ''

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!isFormValid) {
      return
    }

    setSubmitting(true)
    setError(null)

    const payload: CreateTyrePayload = {
      brand,
      sizeInches: Number(sizeInches),
      season,
      price: Number(price),
    }

    const url = tyre
      ? `/api/tyres/${tyre.id}`
      : '/api/tyres'

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
      setError(isEditing ? t('errorEditTyre') : t('errorAddTyre'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation so clicking inside the modal doesn't bubble up
          to the overlay's onClick and close it */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">{isEditing ? t('editTyreTitle') : t('addTyreTitle')}</h2>

        {/* noValidate - we show our own required-field messages instead
            of the browser's default validation tooltip. */}
        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__scroll-area">
          <label className="form__field">
            <span>{t('thBrand')}</span>
            <input
              list="tyre-brand-options"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              onFocus={brandFocus.onFocus}
              onBlur={brandFocus.onBlur}
              required
            />
            <datalist id="tyre-brand-options">
              {options?.brands.map((b) => <option key={b} value={b} />)}
            </datalist>
            {submitAttempted && !brand.trim() && (
              <span className="form__field-error">{t('errorRequired')}</span>
            )}
          </label>

          <label className="form__field">
            <span>{t('thSize')}</span>
            <input
              list="tyre-size-options"
              type="text"
              inputMode="numeric"
              value={sizeInches}
              onChange={handleSizeChange}
              onFocus={sizeFocus.onFocus}
              onBlur={sizeFocus.onBlur}
              required
            />
            <datalist id="tyre-size-options">
              {options?.sizes.map((s) => <option key={s} value={s} />)}
            </datalist>
            {sizeError && <span className="form__field-error">{sizeError}</span>}
            {!sizeError && submitAttempted && !sizeInches.trim() && (
              <span className="form__field-error">{t('errorRequired')}</span>
            )}
          </label>

          <label className="form__field">
            <span>{t('thSeason')}</span>
            <input
              list="tyre-season-options"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              onFocus={seasonFocus.onFocus}
              onBlur={seasonFocus.onBlur}
              required
            />
            <datalist id="tyre-season-options">
              {options?.seasons.map((s) => <option key={s} value={s} />)}
            </datalist>
            {submitAttempted && !season.trim() && (
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
