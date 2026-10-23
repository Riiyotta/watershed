// Extra icons for inner-page primitives (generic shapes, currentColor).

export const SearchIcon = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
    <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export const CheckIcon = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
    <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Filled check in a circle (SectionHeroForm feature list)
export const CheckCircle = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
    <circle cx="9" cy="9" r="8" fill="currentColor" />
    <path d="M5.5 9.2l2.3 2.2 4.7-4.8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Arrow24 = ({ className = '' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M13 5.5L19.5 12 13 18.5M19.5 12H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const FaqChevron = ({ className = '' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M6 9.5l6 6 6-6" stroke="#0b2471" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PlayTriangle = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
  </svg>
)

// measured: two bars drawn as side borders, 5x7 / 1px at 390 and 8x10 / 2px at 768+
export const PauseGlyph = ({ className = '' }) => (
  <span aria-hidden="true" className={`block h-[7px] w-[5px] border-x border-ink-secondary md:h-[10px] md:w-2 md:border-x-2 ${className}`} />
)

// 32x32 generic document mark for release rows (stands in for the masked cobalt icon)
export const DocMark = ({ className = '', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle cx="16" cy="16" r="11.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 12.5h10M11 16h10M11 19.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const QuoteMark = ({ className = '', width = 33, height = 28 }) => (
  <svg width={width} height={height} viewBox="0 0 33 28" className={className} aria-hidden="true">
    <path d="M0 28V16.5C0 7.6 4.6 2 13 0l1.6 3.4C9.6 5 7.4 8.4 7.2 13H14v15H0zm19 0V16.5C19 7.6 23.6 2 32 0l1 3.4C28.6 5 26.4 8.4 26.2 13H33v15H19z" fill="currentColor" />
  </svg>
)

export const CaretDown = ({ className = '', size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SmallArrow = ({ className = '', size = 32, dir = 'right' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d={dir === 'right' ? 'M13 10l6 6-6 6' : 'M19 10l-6 6 6 6'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Select chevrons as measured on the HubSpot fallback select: two solid 9x24 triangles, #131b24
export const SelectTriangles = ({ className = '' }) => (
  <svg width="9" height="24" viewBox="0 0 9 24" fill="none" className={className} aria-hidden="true">
    <path d="M4.08379 4.36365L7.62046 10.0909H0.547125L4.08379 4.36365Z" fill="#131B24" />
    <path d="M4.08369 19.6364L0.547017 13.9091L7.62036 13.9091L4.08369 19.6364Z" fill="#131B24" />
  </svg>
)
