import { ArrowRight } from './Icons.jsx'

// Shared button. variant: primary | light | outline. `arrow` adds the 14px withArrow icon.
// Internal links: <Button as={Link} to={href(path)}>.
// `shine` adds the pointer-following overlay; JS here only sets --cursor-x/y (static wiring).
const VARIANTS = { primary: 'btn-primary', light: 'btn-light', outline: 'btn-outline' } // literal names so Tailwind keeps them

export default function Button({ as: Tag = 'a', variant = 'primary', arrow = false, shine = false, className = '', children, ...rest }) {
  const onPointerMove = shine
    ? (e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--cursor-x', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--cursor-y', `${e.clientY - r.top}px`)
      }
    : undefined
  return (
    <Tag
      className={`btn ${VARIANTS[variant]} ${shine ? 'btn-shine' : ''} ${className}`}
      onPointerMove={onPointerMove}
      {...rest}
    >
      {children}
      {arrow && <ArrowRight className="btn-arrow-icon shrink-0" />}
    </Tag>
  )
}
