import type { ReactNode } from 'react'
import { useLanguage } from './i18n'

interface FilterSidebarProps {
  // Page-specific filter controls (inputs, selects...). When omitted, the
  // sidebar falls back to its original "coming soon" placeholder - so
  // pages that haven't built real filters yet (like Tyres) are unaffected.
  children?: ReactNode
}

export function FilterSidebar({ children }: FilterSidebarProps) {
  const { t } = useLanguage()

  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">{t('filtersTitle')}</h2>
      {children ?? <p className="sidebar__note">{t('filtersNote')}</p>}
    </aside>
  )
}
