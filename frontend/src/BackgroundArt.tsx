import { CarIcon, TyreIcon } from './Icons'

// Purely decorative — fills empty page space with faint, generic shapes.
// Not meant to be noticed consciously, just to soften the flat white/dark background.
export function BackgroundArt() {
  return (
    <div className="app__bg-art" aria-hidden="true">
      <CarIcon className="app__bg-icon app__bg-icon--car" />
      <TyreIcon className="app__bg-icon app__bg-icon--tyre-1" />
      <TyreIcon className="app__bg-icon app__bg-icon--tyre-2" />
    </div>
  )
}
