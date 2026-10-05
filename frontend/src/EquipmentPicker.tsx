import { useEffect, useRef, useState } from 'react'
import type { Equipment } from './types'
import { useLanguage } from './i18n'

interface EquipmentPickerProps {
  options: Equipment[]
  selectedIds: number[]
  onToggle: (id: number) => void
}

// A multi-select dropdown: closed by default (like a normal <select>),
// showing the currently picked items as small removable chips. Clicking it
// opens a panel with the same checkbox list this used to be permanently -
// so the underlying logic (selectedIds + onToggle) hasn't changed at all,
// only how much space it takes up when nothing is being edited.
export function EquipmentPicker({ options, selectedIds, onToggle }: EquipmentPickerProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close the panel on a click anywhere outside this component. Without
  // this, the only way to close it would be picking an item or clicking
  // the toggle button again.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedItems = options.filter((item) => selectedIds.includes(item.id))

  return (
    <div className="multi-select" ref={containerRef}>
      <button
        type="button"
        className="multi-select__toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="multi-select__chips">
          {selectedItems.length === 0 ? (
            <span className="multi-select__placeholder">{t('equipmentPlaceholder')}</span>
          ) : (
            selectedItems.map((item) => (
              <span key={item.id} className="chip">
                {item.name}
                {/* stopPropagation - otherwise this click would also
                    bubble up to the toggle button and reopen/close the
                    panel right after removing the chip. */}
                <span
                  className="chip__remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle(item.id)
                  }}
                >
                  ×
                </span>
              </span>
            ))
          )}
        </span>
        <span className="multi-select__arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="multi-select__panel">
          <div className="checkbox-list">
            {options.map((item) => (
              <label key={item.id} className="checkbox-list__item">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onToggle(item.id)}
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
