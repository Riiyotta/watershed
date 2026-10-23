import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import PromoBar from '../components/PromoBar.jsx'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { stripLocale } from '../routing.js'
import { chromeFor } from './chrome.js'

// Shared chrome for every route: promo bar, sticky nav, footer. Per-route variants come from chrome.js.
export default function SiteLayout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  const chrome = chromeFor(stripLocale(pathname))

  return (
    <>
      {chrome.promo && <PromoBar />}
      {chrome.nav && <Nav variant={chrome.nav} showDemo={chrome.demo} />}
      <main>
        <Outlet />
      </main>
      {chrome.footer && <Footer short={chrome.footer === 'short'} />}
    </>
  )
}
