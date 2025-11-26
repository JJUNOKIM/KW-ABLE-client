import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MapPage from './pages/MapPage'
import RouteSelectionPage from './pages/RouteSelectionPage'
import RouteResultPage from './pages/RouteResultPage'
import RouteGuidancePage from './pages/RouteGuidancePage'

function App() {
  return (
    <div className="mobile-container">
      <Router>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/route" element={<RouteSelectionPage />} />
          <Route path="/route-result" element={<RouteResultPage />} />
          <Route path="/route-guidance" element={<RouteGuidancePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
