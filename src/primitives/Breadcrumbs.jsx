import './primitives.css'
import { Link } from 'react-router-dom'
import { href } from '../routing.js'

// §2.3 Breadcrumbs. items: [{label, path}]. A trailing separator follows the last crumb (as measured).
export default function Breadcrumbs({ items, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-[5px] md:gap-2 text-[10px] font-medium leading-[15px] tracking-[-0.12px] text-ink-secondary md:text-xs md:leading-[18px]">
        {items.map((c) => (
          <li key={c.path} className="flex items-center gap-[5px] md:gap-2">
            <Link to={href(c.path)} className="hover:text-ink hover:underline">
              {c.label}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
