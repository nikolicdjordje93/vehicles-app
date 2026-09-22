export interface NewVehicle {
  id: number
  brand: string
  model: string
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

export interface UsedVehicle {
  id: number
  manufacturer: string
  model: string
  year: number
  bodyType: string
  color: string
  engine: string
  price: number
}
