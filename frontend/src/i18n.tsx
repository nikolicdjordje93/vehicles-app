import { createContext, useContext, useState, type ReactNode } from 'react'

type Language = 'en' | 'sr'

const translations = {
  en: {
    brand: 'AutoShop',
    navNewVehicles: 'New Vehicles',
    navUsedVehicles: 'Used Vehicles',
    navTyres: 'Tyres',
    navCategories: 'Categories',
    homeTitle: 'Welcome',
    homeSubtitle: 'Choose a category to get started:',
    filtersTitle: 'Filters',
    filtersNote: 'Filters are coming soon.',
    thManufacturer: 'Manufacturer',
    thModel: 'Model',
    thBodyType: 'Body type',
    thColor: 'Color',
    thEngine: 'Engine',
    thPrice: 'Price',
    thYear: 'Year',
    thBrand: 'Brand',
    thSize: 'Size',
    thSeason: 'Season',
    thActions: 'Actions',
    thTyre: 'Tyre',
    thQuantity: 'Quantity',
    noTyreOption: '— none —',
    priceFrom: 'Start from',
    loadingNewVehicles: 'Loading new vehicles...',
    loadingUsedVehicles: 'Loading used vehicles...',
    loadingTyres: 'Loading tyres...',
    errorPrefix: 'Error:',
    errorNewVehicles: "Can't load new vehicles. Please try again later.",
    errorUsedVehicles: "Can't load used vehicles. Please try again later.",
    errorTyres: "Can't load tyres. Please try again later.",
    emptyNewVehicles: 'No new vehicles found.',
    emptyUsedVehicles: 'No used vehicles found.',
    emptyTyres: 'No tyres found.',
    addVehicleButton: 'Add vehicle',
    addVehicleTitle: 'Add vehicle',
    editVehicleTitle: 'Edit vehicle',
    errorAddVehicle: "Couldn't add vehicle. Please try again.",
    errorEditVehicle: "Couldn't update vehicle. Please try again.",
    addTyreButton: 'Add tyre',
    addTyreTitle: 'Add tyre',
    editTyreTitle: 'Edit tyre',
    errorAddTyre: "Couldn't add tyre. Please try again.",
    errorEditTyre: "Couldn't update tyre. Please try again.",
    errorColorLettersOnly: 'Only letters are allowed.',
    errorNumbersOnly: 'Only numbers are allowed.',
    errorRequired: 'This field is required.',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    deleteButton: 'Delete',
    editButton: 'Edit',
    confirmDeleteVehicle: 'Delete this vehicle?',
    confirmDeleteTyre: 'Delete this tyre?',
    errorDeleteVehicle: "Couldn't delete vehicle. Please try again.",
    errorDeleteTyre: "Couldn't delete tyre. Please try again.",
    successDeleteVehicle: 'Vehicle deleted.',
    successDeleteTyre: 'Tyre deleted.',
    successEditVehicle: 'Vehicle updated.',
    successEditTyre: 'Tyre updated.',
  },
  sr: {
    brand: 'AutoShop',
    navNewVehicles: 'Nova vozila',
    navUsedVehicles: 'Polovna vozila',
    navTyres: 'Pneumatici',
    navCategories: 'Kategorije',
    homeTitle: 'Dobrodošli',
    homeSubtitle: 'Izaberite kategoriju da počnete:',
    filtersTitle: 'Filteri',
    filtersNote: 'Filteri uskoro stižu.',
    thManufacturer: 'Proizvođač',
    thModel: 'Model',
    thBodyType: 'Tip karoserije',
    thColor: 'Boja',
    thEngine: 'Motor',
    thPrice: 'Cena',
    thYear: 'Godište',
    thBrand: 'Brend',
    thSize: 'Dimenzija',
    thSeason: 'Sezona',
    thActions: 'Akcije',
    thTyre: 'Guma',
    thQuantity: 'Količina',
    noTyreOption: '— bez gume —',
    priceFrom: 'Od',
    loadingNewVehicles: 'Učitavanje novih vozila...',
    loadingUsedVehicles: 'Učitavanje polovnih vozila...',
    loadingTyres: 'Učitavanje guma...',
    errorPrefix: 'Greška:',
    errorNewVehicles: 'Neuspešno učitavanje novih vozila. Pokušajte kasnije.',
    errorUsedVehicles: 'Neuspešno učitavanje polovnih vozila. Pokušajte kasnije.',
    errorTyres: 'Neuspešno učitavanje guma. Pokušajte kasnije.',
    emptyNewVehicles: 'Nema pronađenih novih vozila.',
    emptyUsedVehicles: 'Nema pronađenih polovnih vozila.',
    emptyTyres: 'Nema pronađenih guma.',
    addVehicleButton: 'Dodaj vozilo',
    addVehicleTitle: 'Dodaj vozilo',
    editVehicleTitle: 'Izmeni vozilo',
    errorAddVehicle: 'Neuspešno dodavanje vozila. Pokušajte ponovo.',
    errorEditVehicle: 'Neuspešno izmenjeno vozilo. Pokušajte ponovo.',
    addTyreButton: 'Dodaj gumu',
    addTyreTitle: 'Dodaj gumu',
    editTyreTitle: 'Izmeni gumu',
    errorAddTyre: 'Neuspešno dodavanje gume. Pokušajte ponovo.',
    errorEditTyre: 'Neuspešno izmenjena guma. Pokušajte ponovo.',
    errorColorLettersOnly: 'Dozvoljena su samo slova.',
    errorNumbersOnly: 'Dozvoljeni su samo brojevi.',
    errorRequired: 'Ovo polje je obavezno.',
    cancel: 'Otkaži',
    save: 'Sačuvaj',
    saving: 'Čuvanje...',
    deleteButton: 'Obriši',
    editButton: 'Izmeni',
    confirmDeleteVehicle: 'Obrisati ovo vozilo?',
    confirmDeleteTyre: 'Obrisati ovu gumu?',
    errorDeleteVehicle: 'Neuspešno brisanje vozila. Pokušajte ponovo.',
    errorDeleteTyre: 'Neuspešno brisanje gume. Pokušajte ponovo.',
    successDeleteVehicle: 'Vozilo je obrisano.',
    successDeleteTyre: 'Guma je obrisana.',
    successEditVehicle: 'Vozilo je izmenjeno.',
    successEditTyre: 'Guma je izmenjena.',
  },
} as const

type TranslationKey = keyof typeof translations.en

type LanguageContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

// React Context is how we share a value (here: the chosen language + a
// translate function) with any component in the tree, without passing
// it down manually through every level of props ("prop drilling").
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  function t(key: TranslationKey): string {
    return translations[language][key]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Small wrapper hook so components just call useLanguage() instead of
// importing useContext + LanguageContext everywhere.
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
