import './primitives.css'
import { useEffect, useState } from 'react'

// Active-section tracking (§2.2): IntersectionObserver on the target elements; whenever one crosses
// the rootMargin line, the active id becomes the last target whose top is above that line.
export function useActiveSection(ids, { offset = 120, rootMargin } = {}) {
  const [active, setActive] = useState(ids[0] ?? null)
  const key = ids.join('|')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return undefined
    const recompute = () => {
      let current = els[0].id
      for (const el of els) {
        if (el.getBoundingClientRect().top - offset <= 1) current = el.id
      }
      setActive(current)
    }
    const io = new IntersectionObserver(recompute, { rootMargin: rootMargin ?? `-${offset}px 0px 0px 0px`, threshold: [0, 1] })
    els.forEach((el) => io.observe(el))
    recompute()
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, offset, rootMargin])
  return active
}

// §2.2 TocSidebar. items: [{id, text, level: 2|3}]. `top` = sticky offset (blog 100, legal/STB 128).
// Hidden below 1024 (lg).
export default function Toc({ items, top = 100, className = '', label = 'On this page' }) {
  const active = useActiveSection(items.map((i) => i.id))
  if (!items.length) return null
  return (
    <section
      aria-label={label}
      className={`toc sticky hidden border-l border-cobalt-30 px-8 lg:block ${className}`}
      style={{ top, marginBottom: 150 }}
    >
      <nav>
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={`toc-item level-${it.level} ${active === it.id ? 'is-active' : ''}`}
            aria-current={active === it.id ? 'location' : undefined}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(it.id)?.scrollIntoView({ block: 'start' })
              history.replaceState(null, '', `#${it.id}`)
            }}
          >
            {it.text}
          </a>
        ))}
      </nav>
    </section>
  )
}
