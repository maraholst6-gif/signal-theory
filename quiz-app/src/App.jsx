import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Questions from './pages/Questions.jsx'
import Results from './pages/Results.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
