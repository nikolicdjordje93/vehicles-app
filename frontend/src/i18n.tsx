import { createContext, useContext, useState, type ReactNode } from 'react'

type Language = 'en' | 'sr'

const translations = {
  en: {
    brand: 'AutoShop',
    navVehicles: 'Vehicles',
    navTyres: 'Tyres',
    navEquipment: 'Equipment',
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
    thCondition: 'Condition',
    thEquipment: 'Equipment',
    thEquipmentName: 'Name',
    noTyreOption: '— none —',
    priceFrom: 'Start from',
    conditionNew: 'New',
    conditionUsed: 'Used',
    loadingVehicles: 'Loading vehicles...',
    loadingTyres: 'Loading tyres...',
    loadingEquipment: 'Loading equipment...',
    errorPrefix: 'Error:',
    errorVehicles: "Can't load vehicles. Please try again later.",
    errorTyres: "Can't load tyres. Please try again later.",
    errorEquipment: "Can't load equipment. Please try again later.",
    emptyVehicles: 'No vehicles found.',
    emptyTyres: 'No tyres found.',
    emptyEquipment: 'No equipment found.',
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
    errorTyreInUse: "This tyre is attached to a vehicle and can't be deleted.",
    successDeleteVehicle: 'Vehicle deleted.',
    successDeleteTyre: 'Tyre deleted.',
    successEditVehicle: 'Vehicle updated.',
    successEditTyre: 'Tyre updated.',
    selectBodyTypeOption: '— select —',
    filterAllOption: '— all —',
    resetFiltersButton: 'Reset filters',
    equipmentCountLabel: 'items',
    equipmentPlaceholder: 'Select equipment...',
    loginTitle: 'Log in',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginButton: 'Log in',
    errorLoginInvalid: 'Invalid email or password.',
    errorLoginGeneric: "Couldn't log in. Please try again.",
    logoutButton: 'Log out',
  },
  sr: {
    brand: 'AutoShop',
    navVehicles: 'Vozila',
    navTyres: 'Pneumatici',
    navEquipment: 'Oprema',
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
    thCondition: 'Stanje',
    thEquipment: 'Oprema',
    thEquipmentName: 'Naziv',
    noTyreOption: '— bez gume —',
    priceFrom: 'Od',
    conditionNew: 'Novo',
    conditionUsed: 'Polovno',
    loadingVehicles: 'Učitavanje vozila...',
    loadingTyres: 'Učitavanje guma...',
    loadingEquipment: 'Učitavanje opreme...',
    errorPrefix: 'Greška:',
    errorVehicles: 'Neuspešno učitavanje vozila. Pokušajte kasnije.',
    errorTyres: 'Neuspešno učitavanje guma. Pokušajte kasnije.',
    errorEquipment: 'Neuspešno učitavanje opreme. Pokušajte kasnije.',
    emptyVehicles: 'Nema pronađenih vozila.',
    emptyTyres: 'Nema pronađenih guma.',
    emptyEquipment: 'Nema pronađene opreme.',
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
    errorTyreInUse: 'Ova guma je vezana za vozilo i ne može se obrisati.',
    successDeleteVehicle: 'Vozilo je obrisano.',
    successDeleteTyre: 'Guma je obrisana.',
    successEditVehicle: 'Vozilo je izmenjeno.',
    successEditTyre: 'Guma je izmenjena.',
    selectBodyTypeOption: '— izaberite —',
    filterAllOption: '— sve —',
    resetFiltersButton: 'Resetuj filtere',
    equipmentCountLabel: 'komada',
    equipmentPlaceholder: 'Izaberite opremu...',
    loginTitle: 'Prijava',
    emailLabel: 'Email',
    passwordLabel: 'Lozinka',
    loginButton: 'Prijavi se',
    errorLoginInvalid: 'Pogrešan email ili lozinka.',
    errorLoginGeneric: 'Neuspešna prijava. Pokušajte ponovo.',
    logoutButton: 'Odjavi se',
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
