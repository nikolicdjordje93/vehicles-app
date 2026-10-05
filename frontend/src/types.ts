// One shared shape for a vehicle, whether it's new or used - mirrors the
// backend's VehicleResponse. Used to have separate NewVehicle/UsedVehicle
// interfaces that differed only in a field name (brand vs manufacturer);
// collapsed into one since that split wasn't doing anything useful.
export interface Vehicle {
  id: number
  isNew: boolean
  brand: string
  model: string
  year: number
  bodyTypeId: number
  bodyTypeName: string
  color: string
  engine: string
  price: number
  // Optional attached tyre - null means none chosen.
  tyreId: number | null
  tyreQuantity: number | null
  // Denormalized from the attached tyre, for display - null when none.
  tyreBrand: string | null
  tyreSizeInches: number | null
  tyreSeason: string | null
  // Many-to-many, unlike the tyre fields above (at most one tyre) - a
  // vehicle can have any number of equipment items, including zero.
  equipment: Equipment[]
}

export interface Tyre {
  id: number
  brand: string
  sizeInches: number
  season: string
  price: number
}

// Šifarnik entry - mirrors the backend's BodyTypeResponse.
export interface BodyType {
  id: number
  name: string
}

// Mirrors the backend's EquipmentResponse.
export interface Equipment {
  id: number
  name: string
  code: string
}

// What we send to POST /api/vehicles when adding a new row. No id (the
// database assigns that).
export interface CreateVehiclePayload {
  isNew: boolean
  brand: string
  model: string
  bodyTypeId: number
  color: string
  engine: string
  year: number
  price: number
  tyreId: number | null
  tyreQuantity: number | null
  // The full set of equipment ids the vehicle should end up with - not
  // "add this one"/"remove that one". The backend diffs it against what's
  // already stored.
  equipmentIds: number[]
}

// Autocomplete suggestions for the "Add vehicle" form, from
// GET /api/vehicles/options - mirrors the backend's VehicleOptions.
export interface VehicleOptions {
  brands: string[]
  modelsByBrand: Record<string, string[]>
  // Šifarnik - a real list of { id, name }, not free-text suggestions.
  bodyTypes: BodyType[]
  colors: string[]
  engines: string[]
  years: number[]
  // Existing tyres, for the "attach a tyre" dropdown.
  tyres: Tyre[]
  // Every equipment row that exists, for the checkbox list on the form.
  equipment: Equipment[]
}

// What we send to POST/PUT /api/tyres.
export interface CreateTyrePayload {
  brand: string
  sizeInches: number
  season: string
  price: number
}

// Autocomplete suggestions for the "Add tyre" form, from
// GET /api/tyres/options - mirrors the backend's TyreOptions.
export interface TyreOptions {
  brands: string[]
  sizes: number[]
  seasons: string[]
}
