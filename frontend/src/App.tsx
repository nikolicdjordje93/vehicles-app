import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

interface Vehicle {
  id: number
  brand: string
  model: string
  year: number
}

interface Shirts {
  id: number,
  brand: string,
  size: number
}

interface Tyres {
  id: number,
  brand: string,
  size: number
}

function Home() {
  return <p>Please choose a category from the menu above.</p>
}

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/vehicles">Vehicles</Link>
        <Link to="/shirts">Shirts</Link>
        <Link to="/tyres">Tyres</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/shirts" element={<Shirts />} />
        <Route path="/tyres" element={<Tyres />} />
      </Routes>
    </div>
  )
}

function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

   useEffect(() => {
    async function fetchVehicles() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://localhost:5122/api/vehicles')

        if (!response.ok) {
          throw new Error(`Server error returned: ${response.status}`)
        }

        const data = await response.json()
        setVehicles(data)
      } catch (err) {
        setError('Can\'t load vehicles. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
  <div>
    <ul>
      {vehicles.map((vehicle) => (
        <li key={vehicle.id}>
          {vehicle.brand} {vehicle.model} ({vehicle.year})
        </li>
      ))}
    </ul>
  </div>
)
}

function Shirts() {
  const [shirts, setShirts] = useState<Shirts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

   useEffect(() => {
    async function fetchShirts() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://localhost:5122/api/shirts')

        if (!response.ok) {
          throw new Error(`Server error returned: ${response.status}`)
        }

        const data = await response.json()
        setShirts(data)
      } catch (err) {
        setError('Can\'t load shirts. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchShirts()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <ul>
      {shirts.map((shirt) => (
        <li key={shirt.id}>
          {shirt.brand} {shirt.size}
        </li>
      ))}
    </ul>
  )
}

function Tyres() {
  const [tyres, setTyres] = useState<Tyres[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTyres() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://localhost:5122/api/tyres')

        if (!response.ok) {
          throw new Error(`Server error returned: ${response.status}`)
        }

        const data = await response.json()
        setTyres(data)
      } catch (err) {
        setError('Can\'t load tyres. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTyres()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <ul>
      {tyres.map((tyre) => (
        <li key={tyre.id}>
          {tyre.brand} {tyre.size}
        </li>
      ))}
    </ul>
  )
}

export default App