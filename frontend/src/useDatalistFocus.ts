import { useRef, type Dispatch, type FocusEvent, type SetStateAction } from 'react'

// Native datalists only suggest matches for the CURRENT text, so a
// pre-filled field (edit mode) only ever matches itself. Clearing the
// field on focus makes the browser show the full list; if the user leaves
// without picking anything, the original value comes back on blur.
export function useDatalistFocus(setValue: Dispatch<SetStateAction<string>>) {
  const previousValue = useRef('')

  function onFocus(e: FocusEvent<HTMLInputElement>) {
    previousValue.current = e.target.value
    setValue('')
  }

  function onBlur() {
    setValue((current) => (current === '' ? previousValue.current : current))
  }

  return { onFocus, onBlur }
}
