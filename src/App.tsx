import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MapPage from './pages/MapPage'

function App() {
  return (
    <div className="mobile-container">
      <Router>
        <Routes>
          <Route path="/" element={<MapPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
