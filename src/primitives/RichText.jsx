import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { href, isExternal } from '../routing.js'

// Tiny inline markup for placeholder copy: **bold**, *em*, `code`, [label](/internal-path).
// Internal paths become <Link to={href(path)}>; external destinations render as plain text (the clone never links off-site).
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

export function Inline({ text }) {
  if (text == null) return null
  const parts = String(text).split(TOKEN)
  return parts.map((p, i) => {
    if (!p) return null
    if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
    if (p.startsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>
    if (p.startsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>
    if (p.startsWith('[')) {
      const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      const [, label, to] = m
      if (isExternal(to)) return <Fragment key={i}>{label}</Fragment>
      return (
        <Link key={i} to={href(to)}>
          {label}
        </Link>
      )
    }
    return <Fragment key={i}>{p}</Fragment>
  })
}
