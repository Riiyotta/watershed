import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import TemplatePage from './pages/TemplatePage.jsx'
import { LOCALE } from './routing.js'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`${LOCALE}/`} replace />} />
        <Route path={LOCALE} element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<TemplatePage />} />
        </Route>
        <Route path="*" element={<Navigate to={`${LOCALE}/`} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
