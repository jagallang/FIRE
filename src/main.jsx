import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CaseDetail from './pages/CaseDetail.jsx'
import Case2024 from './pages/Case2024.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/case/uiseong-2025" element={<CaseDetail />} />
        <Route path="/case/gangwon-2024" element={<Case2024 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
