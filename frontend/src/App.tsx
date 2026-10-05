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

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="app">
          <BackgroundArt />
          <Nav />
          <main className="app__content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/tyres" element={<Tyres />} />
              <Route path="/equipment" element={<Equipment />} />
            </Routes>
          </main>
        </div>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
