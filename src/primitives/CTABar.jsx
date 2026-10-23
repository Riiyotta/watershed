import './primitives.css'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { href } from '../routing.js'

// §1.2 CTABar: slim CTA above the footer (/customers, /change).
export default function CTABar({ title = 'See it in action', label = 'Book a demo', to = '/demo' }) {
  return (
    <section className="border-y border-[rgba(13,89,242,.5)] bg-white" style={{ transition: 'margin-top .15s ease' }}>
      <div className="relative mx-auto max-w-[1200px]">
        <span aria-hidden="true" className="absolute inset-y-0 left-[12px] right-[12px] hidden border-x border-dashed border-[rgba(13,89,242,.5)] md:block" />
        <div className="relative flex items-center justify-between gap-5 px-6 py-12 md:px-8">
          {/* measured 390: one row, title 24/28.8 -0.72 */}
          <h2 className="text-2xl font-medium leading-[28.8px] tracking-[-0.72px] text-midnight md:text-[32px] md:leading-[38.4px] md:tracking-[-0.96px]">{title}</h2>
          <Button as={Link} to={href(to)} arrow className="shrink-0">
            {label}
          </Button>
        </div>
      </div>
    </section>
  )
}
