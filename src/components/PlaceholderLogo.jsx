// Made-up placeholder logos (ASSET_MANIFEST §D). Simple geometric mark + text, drawn in currentColor.
export const LOGOS = [
  { name: 'Acme', mark: 'circle' },
  { name: 'Globex', mark: 'diamond' },
  { name: 'Initech', mark: null },
  { name: 'Northbay', mark: 'bars' },
  { name: 'Lumen', mark: 'ring' },
  { name: 'Kestrel', mark: null },
  { name: 'Orbit', mark: 'circle' },
  { name: 'Halcyon', mark: 'square' },
  { name: 'Verdant', mark: 'leaf' },
  { name: 'Pinecrest', mark: null },
  { name: 'Solace', mark: 'ring' },
  { name: 'Tidewater', mark: 'bars' },
]

function Mark({ type, x = 0, s = 16 }) {
  const c = s / 2
  switch (type) {
    case 'circle':
      return <circle cx={x + c} cy={c + 2} r={c} fill="currentColor" />
    case 'ring':
      return <circle cx={x + c} cy={c + 2} r={c - 1.5} fill="none" stroke="currentColor" strokeWidth="3" />
    case 'diamond':
      return <rect x={x + 2} y={4} width={s - 4} height={s - 4} transform={`rotate(45 ${x + c} ${c + 2})`} fill="currentColor" />
    case 'square':
      return <rect x={x} y={2} width={s} height={s} rx="3" fill="currentColor" />
    case 'bars':
      return (
        <g fill="currentColor">
          <rect x={x} y={8} width="4" height={s - 6} />
          <rect x={x + 6} y={4} width="4" height={s - 2} />
          <rect x={x + 12} y={2} width="4" height={s} />
        </g>
      )
    case 'leaf':
      return <path d={`M${x} ${s + 2}C${x} ${6} ${x + 6} 2 ${x + s} 2C${x + s} ${s - 4} ${x + 10} ${s + 2} ${x} ${s + 2}z`} fill="currentColor" />
    default:
      return null
  }
}

// Renders an SVG wordmark; height controls size, width derives from text length.
// `fluid`: size via CSS (className sets height, width follows the viewBox ratio).
export default function PlaceholderLogo({ logo, height = 20, className = '', style, fluid = false }) {
  const hasMark = Boolean(logo.mark)
  const textX = hasMark ? 22 : 0
  const textW = logo.name.length * 10.6
  const w = textX + textW + 2
  return (
    <svg viewBox={`0 0 ${w} 20`} {...(fluid ? {} : { height, width: (w / 20) * height })} className={className} style={style} role="img" aria-label={`${logo.name} logo (placeholder)`}>
      {hasMark && <Mark type={logo.mark} />}
      <text x={textX} y="16" fill="currentColor" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="18" letterSpacing="-0.6" textLength={textW} lengthAdjust="spacingAndGlyphs">
        {logo.name}
      </text>
    </svg>
  )
}
