import { Routes, Route } from 'react-router-dom'
import { Nav } from './Nav'
import { Home } from './Home'
import { Vehicles } from './Vehicles'
import { Tyres } from './Tyres'
import { BackgroundArt } from './BackgroundArt'
import { LanguageProvider } from './i18n'

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <BackgroundArt />
        <Nav />
        <main className="app__content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/tyres" element={<Tyres />} />
          </Routes>
        </main>
      </div>
    </LanguageProvider>
  )
}

export default App
