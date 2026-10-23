import './primitives.css'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../motion.js'
import { FaqChevron } from './icons.jsx'

// Radix-style collapsible panel. Measured on the original (faq-module): open = @keyframes slideDown
// (height 0 -> content height), close = slideUp, both .3s cubic-bezier(.85,0,.15,1); only under
// prefers-reduced-motion: no-preference. No animation on first render.
const FAQ_EASE = 'cubic-bezier(0.85, 0, 0.15, 1)'
function FaqPanel({ open, id, labelledBy, children }) {
  const ref = useRef(null)
  const prev = useRef(open)
  const [shown, setShown] = useState(open)
  if (open && !shown) setShown(true)
  useLayoutEffect(() => {
    const el = ref.current
    if (prev.current === open) return undefined
    prev.current = open
    if (!el || prefersReducedMotion()) {
      if (!open) setShown(false)
      return undefined
    }
    const h = el.scrollHeight
    const anim = el.animate(open ? [{ height: '0px' }, { height: `${h}px` }] : [{ height: `${h}px` }, { height: '0px' }], { duration: 300, easing: FAQ_EASE })
    if (!open) anim.onfinish = () => setShown(false)
    return () => anim.cancel()
  }, [open])
  return (
    <div ref={ref} id={id} role="region" aria-labelledby={labelledBy} hidden={!shown} className="faq-panel overflow-hidden">
      {children}
    </div>
  )
}

// §2.9 Faq accordion (single, first item open on load).
// cta: { strong, text?, label, href } — FAQ CTA box.  `compact` = items only (e.g. inside a GatedLanding column).
export default function Faq({ eyebrow = 'FAQ', title, cta, items, compact = false, className = '' }) {
  const [open, setOpen] = useState(0)
  const uid = useId()
  const list = (
    <div className={compact ? '' : '-mt-3 wide:max-w-[754px]'}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="faq-item" data-state={isOpen ? 'open' : 'closed'}>
            <h3>
              <button
                type="button"
                id={`${uid}-t${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-md font-semibold leading-[22px] tracking-[-0.16px] text-ink"
              >
                {it.q}
                <FaqChevron className="faq-chevron shrink-0" />
              </button>
            </h3>
            <FaqPanel open={isOpen} id={`${uid}-p${i}`} labelledBy={`${uid}-t${i}`}>
              <p className="mb-5 max-w-[720px] text-sm font-medium leading-5 tracking-[-0.14px] text-ink-secondary">{it.a}</p>
            </FaqPanel>
          </div>
        )
      })}
    </div>
  )
  if (compact) return <div className={className}>{list}</div>
  return (
    <section className={`py-[43px] md:py-20 lg:py-16 wide:py-20 ${className}`}>
      {/* Stacked (sidebar above the list) until 1280, as the original (.layout 350px 1fr only >=1280). */}
      <div className="container-ws grid grid-cols-1 gap-[21px] max-md:px-2 lg:gap-8 lg:px-3 wide:grid-cols-[350px_754px] wide:gap-12 wide:px-6">
        <div className="flex flex-col gap-[21px] md:gap-8">
          <div className="flex flex-col gap-[11px] md:gap-4">
            <p className="t-eyebrow">{eyebrow}</p>
            <h2 className="text-3xl font-medium leading-[30.8px] tracking-[-0.84px] text-ink md:text-[35px] md:leading-[38.5px] md:tracking-[-1.05px]">{title}</h2>
          </div>
          {cta && (
            <div className="flex flex-col gap-[11px] rounded-panel border border-cobalt-10 bg-gray-10 p-[11px] md:gap-4 md:p-4">
              {/* .ctaDescription: title line + body as one block (no gap), body in text-primary */}
              <div className="text-[13px] font-normal leading-[19.5px] tracking-[-0.13px] text-ink md:text-md md:leading-6 md:tracking-[-0.16px]">
                <strong className="block max-w-[720px] font-bold">{cta.strong}</strong>
                {cta.text && <p>{cta.text}</p>}
              </div>
              <a href={cta.href ?? '#'} className="btn-faq">
                {cta.label}
              </a>
            </div>
          )}
        </div>
        {list}
      </div>
    </section>
  )
}
