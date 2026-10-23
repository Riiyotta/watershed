// Placeholder text wordmark (replaces the original brand logo, ASSET_MANIFEST A1/A2).
export default function Wordmark({ className = '', light = false, style }) {
  return (
    <span
      className={`inline-flex items-center font-sans font-semibold ${light ? 'text-white' : 'text-ink'} ${className}`}
      style={{ letterSpacing: '-0.04em', ...style }}
    >
      Northwind
    </span>
  )
}
