import { Routes, Route } from 'react-router-dom'
import { Nav } from './Nav'
import { Home } from './Home'
import { Vehicles } from './Vehicles'
import { Tyres } from './Tyres'
import { Equipment } from './Equipment'
import { Login } from './Login'
import { BackgroundArt } from './BackgroundArt'
import { LanguageProvider } from './i18n'
import { AuthProvider } from './auth'
import { ProtectedRoute } from './ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="app">
          <BackgroundArt />
          <Nav />
          <main className="app__content">
            <Routes>
              {/* Jedina javna stranica. */}
              <Route path="/login" element={<Login />} />

              {/* Sve ispod traži prijavu - ProtectedRoute nema svoj path,
                  samo proveri auth pre nego što pusti unutrašnju rutu. */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/tyres" element={<Tyres />} />
                <Route path="/equipment" element={<Equipment />} />
              </Route>
            </Routes>
          </main>
        </div>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
