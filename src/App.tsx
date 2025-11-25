import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MapPage from './pages/MapPage'
import RouteSelectionPage from './pages/RouteSelectionPage'

function App() {
  return (
    <div className="mobile-container">
      <Router>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/route" element={<RouteSelectionPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
