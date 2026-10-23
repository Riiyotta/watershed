import './primitives.css'
import Media from '../components/Media.jsx'
import { Inline } from './RichText.jsx'

// §2.1 Prose. Renders a block array (data-driven) and/or children inside `.prose-ws`.
//
// Block shapes:
//   { t:'p', text, className? }            { t:'h2'|'h3'|'h4', text, id? }
//   { t:'ul'|'ol', items:[string | {text, items:[...]}], className? }
//   { t:'quote', paras:[string], attribution? }           plain blockquote
//   { t:'figure', slot, caption?, size?:'xs'|'s'|'m', aspect?:'16/9', tone? }
//   { t:'aside', paras:[string] }                          blog-aside callout
//   { t:'stylized', text, cite, slot }                     StylizedQuote (dark placeholder bg)
//   { t:'table', head:[string], rows:[[string]] }
//   { t:'code', text }
// variant: 'blog' (720 text column) | 'legal' (h2/h3 400, cobalt strong) | 'story' (customer RichText)

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/\*|`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const headingId = (b) => b.id ?? slugify(b.text)

// TOC items from blocks: [{id, text, level}]
export function tocFromBlocks(blocks = []) {
  return blocks.filter((b) => b.t === 'h2' || b.t === 'h3').map((b) => ({ id: headingId(b), text: b.text.replace(/\*\*/g, ''), level: b.t === 'h2' ? 2 : 3 }))
}

function List({ b }) {
  const Tag = b.t
  return (
    <Tag className={b.className}>
      {b.items.map((it, i) =>
        typeof it === 'string' ? (
          <li key={i}>
            <Inline text={it} />
          </li>
        ) : (
          <li key={i}>
            <Inline text={it.text} />
            <List b={{ t: it.ordered ? 'ol' : 'ul', items: it.items }} />
          </li>
        ),
      )}
    </Tag>
  )
}

export function ProseBlock({ b }) {
  switch (b.t) {
    case 'p':
      return (
        <p className={b.className}>
          <Inline text={b.text} />
        </p>
      )
    case 'h2':
    case 'h3':
    case 'h4': {
      const H = b.t
      return (
        <H id={headingId(b)} style={{ scrollMarginTop: 120 }}>
          <Inline text={b.text} />
        </H>
      )
    }
    case 'ul':
    case 'ol':
      return <List b={b} />
    case 'quote':
      return (
        <blockquote className="prose-quote">
          {b.paras.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
          {b.attribution && <p className="quote-attribution">{b.attribution}</p>}
        </blockquote>
      )
    case 'figure':
      return (
        <figure className={`prose-photo ${b.size ? `maxWidth-${b.size}` : ''} ${b.caption ? 'has-caption' : ''}`}>
          <Media slot={b.slot} tone={b.tone} alt={b.alt ?? 'Illustration placeholder'} className="block w-full" style={{ aspectRatio: b.aspect ?? '16 / 9' }} />
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      )
    case 'aside':
      return (
        <aside className="blog-aside">
          {b.paras.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
        </aside>
      )
    case 'stylized':
      return (
        <blockquote className="stylized-quote">
          {/* full-bleed background image inside the quote (dark placeholder) */}
          <Media slot={b.slot ?? 'prose.stylizedQuote.bg'} tone="dark" className="absolute inset-0 h-full w-full" />
          <p className="sq-text">{b.text}</p>
          {b.cite && <cite>{b.cite}</cite>}
          <svg width="50" height="50" viewBox="0 0 50 50" className="sq-mark absolute bottom-[30px] right-[30px]" aria-hidden="true">
            <path d="M6 40V27C6 17 11 11 21 9l1.5 3.5C17 14.5 14.5 18 14.3 22.5H21V40H6zm22 0V27c0-10 5-16 15-18l1.5 3.5c-5.5 2-8 5.5-8.2 10H43V40H28z" fill="#fff" fillOpacity=".9" />
          </svg>
        </blockquote>
      )
    case 'table':
      return (
        <div className={`prose-table ${b.head.length >= 6 ? 'is-wide' : ''}`}>
          <table>
            <thead>
              <tr>
                {b.head.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>
                      <Inline text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'code':
      return (
        <pre>
          <code>{b.text}</code>
        </pre>
      )
    default:
      return null
  }
}

export default function Prose({ blocks, variant = 'blog', as: Tag = 'div', className = '', children, ...rest }) {
  const v = variant === 'legal' ? 'is-legal' : variant === 'story' ? 'is-story' : ''
  return (
    <Tag className={`prose-ws ${v} ${className}`} {...rest}>
      {blocks?.map((b, i) => <ProseBlock key={i} b={b} />)}
      {children}
    </Tag>
  )
}
