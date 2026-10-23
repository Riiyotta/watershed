import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { href } from '../routing.js'
import Wordmark from './Wordmark.jsx'
import { ArrowRight, PrivacyToggle, SelectChevrons, SocialIn } from './Icons.jsx'
import { EmailCatcher, LegalCopy } from '../primitives/Form.jsx'

// §2.12 Footer: CTA strip with collapsible demo form + dark link panel.
// `to` = locale-free internal path (same destinations as the original footer; labels are placeholders).
const GROUPS = [
  { title: 'Platform', to: '/platform', links: [{ l: 'Data assistant', to: '/platform/sustainability-ai', isNew: true }, { l: 'Inventory', to: '/platform/measure' }, { l: 'Disclosures', to: '/platform/disclosures' }, { l: 'Reduction', to: '/platform/act' }, { l: 'Integrations', to: '/platform/marketplace' }, { l: 'Guided tours', to: '/product-tours' }] },
  { title: 'Solutions', to: '/solutions/csrd', links: [{ l: 'EU rules', to: '/solutions/csrd' }, { l: 'Emission factors', to: '/solutions/ceda' }, { l: 'Finance teams', to: '/solutions/finance' }, { l: 'Procurement', to: '/solutions/supply-chain' }, { l: 'State climate disclosure rules', to: '/solutions/california' }, { l: 'Product impact reports', to: '/solutions/product-footprints', isNew: true }] },
  { title: 'Guides', to: '/guides', links: [{ l: 'State of climate data 2026', to: '/state-of-corporate-sustainability-ai-2026' }, { l: 'Disclosure handbook 2026', to: '/guides/climate-disclosure' }, { l: 'Supplier engagement', to: '/guides/mastering-scope-3', isNew: true }, { l: 'Analyst review summary', to: '/verdantix-2026' }] },
  {
    title: 'Resources',
    to: '/blog',
    links: [
      { l: 'Blog', to: '/blog' },
      { l: 'Carbon accounting', to: '/platform/measure/carbon-accounting' },
      { l: 'ESG reporting', to: '/platform/disclosures/esg' },
      { l: "Buyer's guide", to: '/platform/disclosures/rfp-guide' },
      { l: 'Rule checker', to: '/tools/climate-policy-calendar' },
      { l: 'Frameworks', disclosure: [{ l: 'EU rules', to: '/platform/disclosures/csrd' }, { l: 'State rules', to: '/solutions/california' }, { l: 'Global standards', to: '/platform/disclosures/issb' }] },
    ],
  },
  { title: 'Company', to: '/about-us', links: [{ l: 'About', to: '/about-us' }, { l: 'Newsroom', to: '/news' }, { l: 'Partners', to: '/partners' }, { l: 'Careers', to: '/careers' }, { l: 'Brand', to: '/brand' }] },
  { title: 'Customers', to: '/customers', links: [{ l: 'Case studies', to: '/customers' }, { l: 'Climate leaders', to: '/climate-leads' }, { l: 'Community', to: '/change' }] },
  { title: 'Events', to: '/events', links: [{ l: 'Upcoming', to: '/events' }, { l: 'On demand', to: '/events?filter=on-demand' }] },
]

const FIELDS = [
  ['First name*', 'Last name*'],
  ['Work email*'],
  ['Company*'],
  ['Job title*'],
  ['Country*'],
  ['Phone number*'],
  ['How can we help?'],
]

// `short` = PAGES_SPEC §1.2 /climate-economy CTA strip (349 tall at 1440): the same H2, then a single-field
// email catcher (§1.5) in a glass pill with the legal copy underneath, instead of the collapsible demo form.
export default function Footer({ short = false }) {
  const [expanded, setExpanded] = useState(false)
  // .ctaStripFormContainer: max-height 220px -> content height, transition max-height .45s ease-in-out
  const formRef = useRef(null)
  const [formH, setFormH] = useState(null)
  const expand = () => {
    if (formRef.current) setFormH(formRef.current.scrollHeight)
    setExpanded(true)
  }

  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(#fff 0%, #fab7a3 26%, #245eff 65%, #245eff 70%, #1e2338 100%)' }}>
      {/* Noise overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.42] mix-blend-soft-light" style={{ backgroundImage: 'var(--tex-noise-footer)', backgroundSize: '200px' }} />
      {/* Original outlined decoration (replaces brand mark A3): concentric arcs, 800x800 bottom-right (mobile 600, right -15%) */}
      <ArcDecoration />

      {/* CTA strip */}
      <div className="relative z-[2] flex flex-col items-center gap-8 px-4 py-20 md:px-6">
        <h2 className="text-center text-4xl font-normal leading-[35.2px] tracking-display text-ink md:text-7xl md:leading-[52.8px]">See Northwind in action</h2>

        {short ? (
          <div className="flex w-full max-w-[358px] flex-col gap-4 md:max-w-[454px]">
            {/* glass pill; the catcher itself insets the field and button 4px at 768+ (§1.5) */}
            <div
              className="rounded-panel"
              style={{ background: 'rgba(15,23,42,.02)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5), inset 0 0 0 1px rgba(255,255,255,.25)' }}
            >
              <EmailCatcher label="Work email" buttonLabel="Request a demo" legal={false} />
            </div>
            <LegalCopy tone="muted" className="text-center" />
          </div>
        ) : (
        <div className="relative w-full max-w-[358px] md:max-w-[560px]">
        <div
          className="relative w-full rounded-panel p-2"
          style={{
            background: 'rgba(15,23,42,.02)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5), inset 0 0 0 1px rgba(255,255,255,.25)',
            ...(expanded ? {} : { WebkitMaskImage: 'var(--mask-smooth-fade)', maskImage: 'var(--mask-smooth-fade)' }),
          }}
        >
          {/* max-height 220 -> full, .45s ease-in-out (§2.12) */}
          <form
            ref={formRef}
            className={`footer-form overflow-hidden rounded-btn bg-white p-8 ${expanded ? 'max-h-[1200px]' : 'max-h-[220px]'}`}
            style={expanded && formH ? { maxHeight: formH } : undefined}
            onSubmit={(e) => e.preventDefault()}
            aria-label="Request a demo"
          >
            <div className="flex flex-col gap-[14px]">
              {FIELDS.map((row, i) => (
                <div key={i} className={`grid gap-[14px] md:gap-3 ${row.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {row.map((f) =>
                    f === 'Country*' ? (
                      <div key={f} className="relative">
                        <select aria-label={f} defaultValue="" className="h-10 w-full appearance-none rounded-btn border border-line-light bg-white px-4 text-xs md:h-[42px] font-medium text-ink-disabled md:text-sm">
                          <option value="" disabled>
                            {f}
                          </option>
                          <option>United Kingdom</option>
                          <option>United States</option>
                          <option>Germany</option>
                        </select>
                        <SelectChevrons className="pointer-events-none absolute right-4 top-[9px] text-ink-disabled" />
                      </div>
                    ) : (
                      <input
                        key={f}
                        aria-label={f}
                        placeholder={f}
                        className="h-10 w-full rounded-[1px] border border-line-light bg-white px-4 text-xs md:h-[42px] font-medium text-ink placeholder:text-ink-disabled focus:shadow-focus md:text-sm"
                      />
                    )
                  )}
                </div>
              ))}
              <button type="submit" className="hs-submit h-11 self-start rounded-btn bg-cobalt pl-4 pr-9 text-md font-medium text-white hover:bg-cobalt-70">
                Submit
              </button>
            </div>
          </form>
        </div>

          {!expanded && (
            <button
              type="button"
              onClick={expand}
              className="absolute left-1/2 top-[90px] z-[3] flex h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-md px-[14px] text-sm text-white hover:brightness-[1.08] md:top-[71px] md:h-[66px] md:px-6 md:text-2xl"
              style={{
                border: '1.5px solid transparent',
                background: 'linear-gradient(#265cff, #1246e0) padding-box, linear-gradient(#4796ff 0%, #2c6cf9 30%, #0534e5 70%, #000cd2 100%) border-box',
                textShadow: '0 -1px 1px rgba(255,255,255,.35), 0 1px 1px rgba(0,0,0,.2)',
                boxShadow: '0 1px 2px rgba(4,19,48,.16), 0 4px 8px rgba(4,19,48,.12), 0 12px 24px rgba(36,94,255,.24)',
              }}
            >
              Request a demo <ArrowRight size={20} strokeWidth={1.6} className="h-[14px] w-[14px] md:h-5 md:w-5" />
            </button>
          )}
        </div>
        )}
      </div>

      {/* Main dark panel */}
      <div className="relative z-[2] mx-auto max-w-container pl-4 md:pl-0 lg:pl-6 min-[1281px]:pl-0">
        <div className="relative bg-footer-panel px-6 py-12 before:absolute before:inset-y-0 before:right-full before:w-[100vw] before:bg-footer-panel md:w-full md:pb-20 md:pl-[25px] md:pr-12 md:pt-[84px] lg:w-3/4 lg:py-[60px] lg:pl-20 lg:pr-8 min-[1281px]:w-[870px] min-[1281px]:pb-20 min-[1281px]:pl-[25px] min-[1281px]:pr-12 min-[1281px]:pt-[84px]">
          <div className="flex flex-col gap-[60px]">
            {/* Logo row */}
            <div className="flex items-center justify-between md:grid md:grid-cols-3 md:gap-12 lg:gap-5 min-[1281px]:grid-cols-[repeat(3,233.66px)] min-[1281px]:gap-12">
              <Link to={href('/')} aria-label="Northwind home" className="flex h-10 w-[197px] items-center">
                <Wordmark light className="text-[34px] leading-10" />
              </Link>
              {/* Off-site social profile on the original: shown as an icon only, no external link */}
              <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-[rgba(248,250,252,.1)] text-footer-title md:col-start-3">
                <SocialIn />
              </span>
            </div>

            {/* Link groups */}
            <div className="grid grid-cols-[repeat(2,151px)] gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-12 md:gap-y-[60px] min-[1281px]:grid-cols-[repeat(3,233.66px)]">
              {GROUPS.map((g) => (
                <LinkGroup key={g.title} group={g} />
              ))}
            </div>

            {/* Locale select */}
            <div className="relative mt-8 w-[173px]">
              <select
                aria-label="Language"
                defaultValue="en-GB"
                className="h-[45px] w-full appearance-none rounded-none border-[.5px] border-[rgba(248,250,252,.4)] bg-[rgba(15,23,42,.6)] py-3 pl-4 pr-[38px] text-sm font-medium text-footer-title hover:border-[rgba(248,250,252,.7)]"
              >
                <option value="en-GB">English (UK)</option>
                <option value="en-US">English (US)</option>
                <option value="de">Deutsch</option>
              </select>
              <SelectChevrons className="pointer-events-none absolute right-4 top-[10.5px] text-footer-title" />
            </div>

            {/* Bottom bar */}
            <div className="grid grid-cols-2 items-center gap-x-4 gap-y-4 text-sm font-medium leading-[21px] text-footer-muted md:grid-cols-3 md:items-start min-[1281px]:grid-cols-[repeat(3,233.66px)] md:gap-x-12">
              <p>© 2026 Northwind Data, Inc.</p>
              <ul className="flex flex-col flex-wrap items-start gap-x-3 gap-y-2 md:col-span-2 md:flex-row">
                {[
                  ['Privacy', '/legal/privacy'],
                  ['Terms', '/legal/terms'],
                  ['Security', '/legal/security'],
                ].map(([l, to]) => (
                  <li key={l}>
                    <Link to={href(to)} className="underline transition-colors duration-150 hover:text-footer-title">
                      {l}
                    </Link>
                  </li>
                ))}
                <li>
                  <button type="button" className="flex items-center gap-1 underline transition-colors duration-150 hover:text-footer-title">
                    <PrivacyToggle />
                    Your privacy choices
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function LinkGroup({ group }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <Link to={href(group.to)} className="text-md font-normal leading-4 tracking-[-0.16px] text-footer-title transition-colors duration-150 hover:text-cobalt">
        {group.title}
      </Link>
      <ul className="flex flex-col gap-2">
        {group.links.map((link) => (
          // li: 20px font / 20px line-height strut + inline-flex 22px link => 23px rows (measured, matches original)
          <li key={link.l} className="text-[20px] leading-5">
            {link.disclosure ? (
              <>
                <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1.5 text-left text-sm font-normal leading-[22px] tracking-[-0.14px] text-footer-muted transition-colors duration-150 hover:text-footer-title">
                  {link.l}
                  {/* caret rotates 180deg, transform .15s ease-in-out */}
                  <span className={`footer-caret inline-block text-[10px] text-footer-muted ${open ? 'rotate-180' : ''}`} style={{ fontFamily: 'Arial' }}>
                    ▾
                  </span>
                </button>
                {open && (
                  <ul className="mt-2 flex flex-col gap-2 pl-3">
                    {link.disclosure.map((d) => (
                      <li key={d.l}>
                        <Link to={href(d.to)} className="text-sm leading-[22px] tracking-[-0.14px] text-footer-link transition-colors duration-150 hover:text-footer-title">
                          {d.l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link to={href(link.to)} className="inline-flex w-full items-start justify-between gap-2 text-sm font-normal leading-[22px] tracking-[-0.14px] text-footer-link transition-colors duration-150 hover:text-footer-title md:justify-start">
                {link.l}
                {link.isNew && <span className="mt-[2px] shrink-0 bg-[rgba(38,92,255,.14)] px-1.5 py-[2px] text-[11px] font-medium uppercase leading-[13.2px] tracking-[0.22px] text-cobalt">New</span>}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ArcDecoration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 800"
      fill="none"
      // Same box as the original's footer::after: bottom-anchored, ≤1280px 600px at right -15%, above that 800px at right -10%.
      className="pointer-events-none absolute bottom-0 right-[-15%] z-[1] h-[600px] w-[600px] min-[1281px]:right-[-10%] min-[1281px]:h-[800px] min-[1281px]:w-[800px]"
    >
      <g stroke="rgba(255,255,255,.22)" strokeWidth="1.5">
        {[390, 320, 250, 180, 110].map((r) => (
          <circle key={r} cx="400" cy="400" r={r} />
        ))}
        <path d="M400 10V790" />
      </g>
    </svg>
  )
}
