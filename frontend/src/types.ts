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
  bodyType: string
  color: string
  engine: string
  price: number
}

export interface Tyre {
  id: number
  brand: string
  sizeInches: number
  season: string
  price: number
}

// What we send to POST /api/vehicles when adding a new row. No id (the
// database assigns that).
export interface CreateVehiclePayload {
  isNew: boolean
  brand: string
  model: string
  bodyType: string
  color: string
  engine: string
  year: number
  price: number
}

// Autocomplete suggestions for the "Add vehicle" form, from
// GET /api/vehicles/options - mirrors the backend's VehicleOptions.
export interface VehicleOptions {
  brands: string[]
  modelsByBrand: Record<string, string[]>
  bodyTypes: string[]
  engines: string[]
  years: number[]
}
