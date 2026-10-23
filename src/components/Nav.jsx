import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Wordmark from './Wordmark.jsx'
import { MENUS, NAV_ITEMS, NAV_LINKS } from './navData.js'
import { ArrowRight, ChevronDown, ChevronLeft16, ChevronRight24, Globe } from './Icons.jsx'
import { prefersReducedMotion } from '../motion.js'
import { href } from '../routing.js'

// Measured on the original (Radix NavigationMenu): viewport mounts 81-91ms after pointer-in (MutationObserver,
// incl. ~5ms render) and starts closing ~180ms after pointer-out; exit animation .3s then unmount. Mobile sheet
// out-animation .2s. The panel carries a transparent 24px bottom pad (.navMenu padding-bottom) as a hover bridge.
const OPEN_DELAY = 80
const CLOSE_DELAY = 160

// PAGES_SPEC §1.1 variants. 'opaque' = homepage (§2.2). 'translucent' / 'inverted' are transparent at scrollY 0
// and switch to the opaque styles after any scroll (y >= 1), transition background-color/--color-link/--color-logo .25s.
const SURFACE = {
  opaque: 'border-line-light bg-[rgba(255,255,255,.98)] shadow-[0_1px_0_rgba(0,0,0,.05)]',
  translucent: 'border-[rgba(4,19,48,.12)] bg-transparent',
  inverted: 'border-[rgba(255,255,255,.24)] bg-transparent',
}
const SURFACE_TRANSITION = 'background-color .25s, --color-link .25s, --color-logo .25s'

// §2.2 Nav + §3.9 desktop dropdown + §3.10 mobile menu.
// variant: 'opaque' | 'translucent' | 'inverted' (PAGES_SPEC §1.1). showDemo=false hides "Book a demo" (/demo*).
export default function Nav({ variant = 'opaque', showDemo = true }) {
  const [openMenu, setOpenMenu] = useState(null) // desktop dropdown key (trigger state)
  const [shown, setShown] = useState(null) // menu rendered in the viewport (kept during exit)
  const [outgoing, setOutgoing] = useState(null) // { key, dir, id } menu sliding out on switch
  const [vpClosing, setVpClosing] = useState(false)
  const timers = useRef({})
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileClosing, setMobileClosing] = useState(false)
  const [mobileSub, setMobileSub] = useState(null) // drilled-in submenu key
  const [menuTop, setMenuTop] = useState(108)
  const navRef = useRef(null)

  // Translucent variants: opaque once the page has scrolled at all.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    if (variant === 'opaque') return undefined
    const on = () => setScrolled(window.scrollY >= 1)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [variant])
  const look = variant === 'opaque' || scrolled ? 'opaque' : variant
  const inverted = variant === 'inverted'
  // Inverted links/logo read --color-link / --color-logo (white over the dark hero, ink once opaque).
  const navStyle =
    variant === 'opaque'
      ? undefined
      : { transition: SURFACE_TRANSITION, ...(inverted ? { '--color-link': look === 'opaque' ? '#242633' : '#fff', '--color-logo': look === 'opaque' ? '#242633' : '#fff' } : {}) }
  const linkText = inverted ? 'text-[color:var(--color-link)] hover:text-ink' : 'text-ink'

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeNowRef.current()
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ---- desktop dropdown ----
  const clearTimers = () => {
    clearTimeout(timers.current.open)
    clearTimeout(timers.current.close)
    clearTimeout(timers.current.unmount)
  }
  const openNow = (key) => {
    clearTimers()
    setVpClosing(false)
    setOpenMenu((cur) => {
      if (cur && cur !== key && !prefersReducedMotion()) {
        const dir = NAV_ITEMS.indexOf(key) > NAV_ITEMS.indexOf(cur) ? 'end' : 'start'
        setOutgoing({ key: cur, dir, id: Date.now() })
      } else if (!cur) setOutgoing(null)
      return key
    })
    setShown(key)
  }
  const closeNow = () => {
    clearTimers()
    setOpenMenu(null)
    setOutgoing(null)
    if (prefersReducedMotion()) {
      setShown(null)
      return
    }
    setVpClosing(true)
    timers.current.unmount = setTimeout(() => {
      setShown(null)
      setVpClosing(false)
    }, 300)
  }
  const closeNowRef = useRef(closeNow)
  closeNowRef.current = closeNow
  const requestOpen = (key) => {
    clearTimeout(timers.current.close)
    if (openMenu) return openNow(key)
    clearTimeout(timers.current.open)
    timers.current.open = setTimeout(() => openNow(key), OPEN_DELAY)
  }
  const requestClose = () => {
    clearTimeout(timers.current.open)
    if (!openMenu) return
    clearTimeout(timers.current.close)
    timers.current.close = setTimeout(closeNow, CLOSE_DELAY)
  }
  useEffect(() => () => clearTimers(), [])

  // Close the dropdown and the mobile menu whenever the route changes.
  const { pathname, search } = useLocation()
  useEffect(() => {
    clearTimers()
    setOpenMenu(null)
    setShown(null)
    setOutgoing(null)
    setVpClosing(false)
    setMobileOpen(false)
    setMobileClosing(false)
    setMobileSub(null)
  }, [pathname, search])

  // ---- mobile sheet ----
  const toggleMobile = () => {
    if (mobileOpen) {
      setMobileOpen(false)
      if (!prefersReducedMotion()) {
        setMobileClosing(true)
        setTimeout(() => setMobileClosing(false), 200)
      }
      return
    }
    if (navRef.current) setMenuTop(navRef.current.getBoundingClientRect().bottom)
    setMobileClosing(false)
    setMobileOpen(true)
    setMobileSub(null)
  }

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-[100] h-[68px] border-b ${SURFACE[look]}`}
      style={navStyle}
    >
      <div className="container-ws relative flex h-[67px] items-center justify-between">
        <Link to={href('/')} aria-label="Northwind home" className="flex h-[30px] w-[148px] shrink-0 items-center lg:w-[172px] lg:pr-6">
          <Wordmark className="text-[26px] leading-[30px]" style={inverted ? { color: 'var(--color-logo)' } : undefined} />
        </Link>

        {/* Desktop menu */}
        <div className="hidden flex-1 justify-center lg:flex" onMouseLeave={requestClose} onMouseEnter={() => clearTimeout(timers.current.close)}>
          <ul className="flex items-center gap-[10px]">
            {NAV_ITEMS.map((item) => {
              const hasMenu = Boolean(MENUS[item])
              const isOpen = openMenu === item
              const cls = `flex h-10 items-center rounded-btn px-[10px] py-[6px] text-md font-medium leading-[28px] tracking-[-0.4px] ${isOpen && inverted ? 'text-ink' : linkText} transition-[color,background-color] duration-200 ease-[ease] hover:bg-gray-10 ${isOpen ? 'bg-gray-10' : ''}`
              return (
                <li key={item}>
                  {hasMenu ? (
                    <button
                      type="button"
                      className={cls}
                      aria-expanded={isOpen}
                      onMouseEnter={() => requestOpen(item)}
                      onFocus={() => openNow(item)}
                      onClick={() => (isOpen ? closeNow() : openNow(item))}
                    >
                      {item}
                      {/* MOTION: chevron rotate .25s */}
                      <ChevronDown className={`nav-chevron ml-1 ${isOpen ? '-rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link to={href(NAV_LINKS[item])} className={cls} onMouseEnter={requestClose}>
                      {item}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Dropdown viewport, centred on the container. MOTION: panelEnter / enterFromTop / enterFromLeft|Right (§3.9) */}
          {shown && (
            <div className="absolute left-1/2 top-[54px] z-10 -translate-x-1/2 pb-6 pt-[3px]">
              <DropdownViewport shown={shown} outgoing={outgoing} closing={vpClosing} onOutgoingDone={() => setOutgoing(null)} />
            </div>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center lg:flex">
          {/* "Sign in" pointed off-site on the original; the clone has no external links, so it is a non-link button. */}
          <button
            type="button"
            className={`${showDemo ? 'mr-[10px] ' : ''}flex h-9 items-center rounded-btn border border-line-light bg-gray-10 px-4 text-[15px] font-medium leading-[28px] tracking-[-0.3px] text-ink-secondary transition-colors duration-hover hover:bg-gray-20`}
          >
            Sign in
          </button>
          {showDemo && (
            <Link
              to={href('/demo')}
              className="flex h-9 items-center rounded-btn bg-cobalt px-4 text-[15px] font-medium leading-[28px] tracking-[-0.3px] text-white transition-colors duration-hover hover:bg-cobalt-70"
            >
              Book a demo
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={toggleMobile}
          className={`flex h-10 w-10 items-center justify-center rounded-[6px] border border-line-light ${inverted ? 'bg-gray-10' : 'bg-transparent'} text-ink lg:hidden`}
        >
          {/* MOTION: lines morph to X with transform .2s, opacity .2s (§2.2) */}
          <span className="relative block h-6 w-6">
            {/* original: outer lines translateY(+-4px) rotate(+-45deg), middle scaleX(0) + opacity 0; transform/opacity .2s */}
            <span className="ham-line absolute left-px top-[3.2px] h-[1.6px] w-[22px] rounded bg-current" style={{ transform: mobileOpen ? 'translateY(8px) rotate(45deg)' : 'none' }} />
            <span className="ham-line absolute left-px top-[11.2px] h-[1.6px] w-[22px] rounded bg-current" style={{ transform: mobileOpen ? 'scaleX(0)' : 'none', opacity: mobileOpen ? 0 : 1 }} />
            <span className="ham-line absolute left-px top-[19.2px] h-[1.6px] w-[22px] rounded bg-current" style={{ transform: mobileOpen ? 'translateY(-8px) rotate(-45deg)' : 'none' }} />
          </span>
        </button>
      </div>

      {/* Mobile panel. MOTION: mobileMenuSlideIn/Out .2s cubic-bezier(.4,0,.2,1) (§3.10) */}
      {(mobileOpen || mobileClosing) && (
        <div className={`fixed inset-x-0 bottom-0 z-[99] flex flex-col bg-white lg:hidden ${mobileOpen ? 'mobile-menu-in' : 'mobile-menu-out'}`} style={{ top: menuTop }}>
          <div key={mobileSub || 'root'} className="menu-fade-in flex-1 overflow-y-auto">
            {mobileSub ? (
              <MobileSubmenu name={mobileSub} onBack={() => setMobileSub(null)} />
            ) : (
              <ul className="pt-[18px]">
                {NAV_ITEMS.map((item) => (
                  <li key={item}>
                    {MENUS[item] ? (
                      <button type="button" onClick={() => setMobileSub(item)} className="flex h-[60px] w-full items-center justify-between py-4 pl-4 pr-6 text-left text-[20px] font-medium leading-[28px] tracking-[-0.5px] text-ink">
                        {item}
                        <ChevronRight24 className="text-ink-secondary" />
                      </button>
                    ) : (
                      <Link to={href(NAV_LINKS[item])} className="flex h-[60px] items-center py-4 pl-4 pr-6 text-[20px] font-medium leading-[28px] tracking-[-0.5px] text-ink">
                        {item}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="menu-fade-in flex flex-col gap-[9px] border-t border-line-light p-4">
            <button type="button" className="flex h-11 items-center justify-center rounded-[1px] border border-line-light bg-gray-10 text-md font-medium text-ink-secondary">
              Sign in
            </button>
            {showDemo && (
              <Link to={href('/demo')} className="flex h-11 items-center justify-center rounded-[1px] bg-cobalt text-md font-medium text-white">
                Book a demo
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

// Shell (bg, border, shadow) = Radix viewport: panelEnter on open, exitToTop on close (.3s cubic-bezier(.85,0,.15,1)),
// height transition .25s when switching. Content slides +-128px with fade (.25s ease) on trigger switch.
function DropdownViewport({ shown, outgoing, closing, onOutgoingDone }) {
  const curRef = useRef(null)
  const [h, setH] = useState(null)
  useLayoutEffect(() => {
    const el = curRef.current
    if (!el) return undefined
    const measure = () => setH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [shown])
  const enterCls = outgoing ? (outgoing.dir === 'end' ? 'nav-from-end' : 'nav-from-start') : ''
  const exitCls = outgoing ? (outgoing.dir === 'end' ? 'nav-to-start' : 'nav-to-end') : ''
  return (
    <div className={`w-[824px] rounded-panel border border-line-light bg-gray-10 p-[6px] shadow-dropdown ${closing ? 'nav-vp-closed' : 'nav-vp-open'}`}>
      <div className="nav-vp-size relative overflow-hidden" style={h == null ? undefined : { height: h }}>
        {outgoing && (
          <div key={`out-${outgoing.id}`} aria-hidden="true" className={`absolute inset-x-0 top-0 ${exitCls}`} onAnimationEnd={onOutgoingDone}>
            <DropdownPanel menu={MENUS[outgoing.key]} />
          </div>
        )}
        <div ref={curRef} key={shown} className={enterCls}>
          <DropdownPanel menu={MENUS[shown]} />
        </div>
      </div>
    </div>
  )
}

function DropdownPanel({ menu }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="rounded-btn border border-line-light bg-white">
        <div className="grid grid-cols-2 border-b border-line-light">
          {menu.header.map((h, i) => (
            <Link key={h.title} to={href(h.to)} className={`group flex items-center gap-3 px-6 py-[18px] transition-[color,background-color] duration-500 ease-expo hover:bg-cobalt-5 ${i === 0 ? 'border-r border-line-light' : ''}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn border border-line-light bg-bg-xlight text-cobalt">
                <Globe />
              </span>
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-[15px] font-semibold leading-4 tracking-[-0.3px] text-ink transition-colors duration-500 ease-expo group-hover:text-cobalt">
                  {h.title}
                  {/* section-title arrow: translate(.5ch) on hover, .25s expo-out */}
                  <ArrowRight size={12} className="nav-title-arrow" />
                </span>
                <span className="text-[13px] font-medium leading-[14px] tracking-[-0.13px] text-ink-secondary">{h.desc}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-3">
          {menu.groups.map((g) => (
            <div key={g.title} className="p-3">
              <p className="p-3 font-mono text-[13px] font-normal leading-4 tracking-[-0.26px] text-ink-disabled">{g.title}</p>
              <ul>
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link to={href(l.to)} className="group flex h-10 items-center gap-2 rounded-btn p-3 transition-[color,background-color] duration-500 ease-expo hover:bg-cobalt-5">
                      {l.icon && <l.icon className="text-cobalt" />}
                      <span className="text-[15px] font-semibold leading-4 tracking-[-0.3px] text-ink transition-colors duration-500 ease-expo group-hover:text-cobalt">{l.label}</span>
                      {l.tag && <span className="tag tag-new">{l.tag}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Link to={href(menu.footer.to)} className="flex h-[45px] items-center justify-between px-6 py-3">
        <span className="flex items-center gap-2">
          <span className={`tag ${menu.footer.tag === 'New' ? 'tag-new' : 'tag-explore'}`}>{menu.footer.tag}</span>
          <span className="text-[15px] font-medium leading-4 tracking-[-0.3px] text-ink">{menu.footer.text}</span>
        </span>
        <span className="flex items-center gap-1 text-[15px] font-medium leading-4 tracking-[-0.3px] text-cobalt">
          {menu.footer.cta} <ArrowRight size={12} />
        </span>
      </Link>
    </div>
  )
}

function MobileSubmenu({ name, onBack }) {
  const menu = MENUS[name]
  const [first, second, third] = menu.groups
  const GroupList = ({ g }) => (
    <div>
      <p className="py-3 font-mono text-[13px] leading-4 tracking-[-0.26px] text-ink-disabled">{g.title}</p>
      <ul>
        {g.links.map((l) => (
          <li key={l.label}>
            <Link to={href(l.to)} className="flex min-h-10 items-center gap-2 py-3">
              {l.icon && <l.icon className="shrink-0 text-cobalt" />}
              <span className="text-[15px] font-semibold leading-4 tracking-[-0.3px] text-ink">{l.label}</span>
              {l.tag && <span className="tag tag-new ml-auto">{l.tag}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <div>
      <button type="button" onClick={onBack} className="flex h-[66px] w-full items-center gap-3 px-4 text-[20px] font-medium leading-[28px] tracking-[-0.5px] text-ink">
        <ChevronLeft16 />
        {name}
      </button>
      <div className="border-t border-line-light">
        {menu.header.map((h) => (
          <Link key={h.title} to={href(h.to)} className="flex items-center gap-3 border-b border-line-light px-4 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn border border-line-light bg-bg-xlight text-cobalt">
              <Globe />
            </span>
            <span className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-[15px] font-semibold leading-4 tracking-[-0.3px] text-ink">
                {h.title} <ArrowRight size={12} />
              </span>
              <span className="text-[13px] font-medium leading-[14px] tracking-[-0.13px] text-ink-secondary">{h.desc}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 px-4 pt-3">
        <GroupList g={first} />
        <GroupList g={second} />
      </div>
      {third && (
        <div className="px-4 pb-4 pt-6">
          <GroupList g={third} />
        </div>
      )}
      <Link to={href(menu.footer.to)} className="flex flex-col gap-2 border-t border-line-light bg-gray-10 px-4 py-3">
        <span className={`tag self-start ${menu.footer.tag === 'New' ? 'tag-new' : 'tag-explore'}`}>{menu.footer.tag}</span>
        <span className="flex items-center justify-between text-[15px] font-medium leading-4 tracking-[-0.3px] text-ink">
          {menu.footer.text} <ArrowRight size={12} className="text-cobalt" />
        </span>
      </Link>
    </div>
  )
}
