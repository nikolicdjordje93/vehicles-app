import { useLanguage } from './i18n'

export function FilterSidebar() {
  const { t } = useLanguage()

  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">{t('filtersTitle')}</h2>
      <p className="sidebar__note">{t('filtersNote')}</p>
    </aside>
  )
}
