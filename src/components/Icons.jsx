// Generic UI icons recreated as inline SVG (ASSET_MANIFEST §F). All use currentColor unless noted.

export const ArrowRight = ({ size = 14, className = '', strokeWidth = 1.3 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
    <path d="M7.467 1.75L12.25 7 7.467 12.25M12.25 7H1.75" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronLeft = ({ className = '', width = 8, height = 14 }) => (
  <svg width={width} height={height} viewBox="0 0 8 14" fill="none" className={className} aria-hidden="true">
    <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronRightThin = ({ className = '', width = 8, height = 14 }) => (
  <svg width={width} height={height} viewBox="0 0 8 14" fill="none" className={className} aria-hidden="true">
    <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronDown = ({ className = '' }) => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={className} aria-hidden="true">
    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronRight24 = ({ className = '' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M9.5 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronLeft16 = ({ className = '' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Plus = ({ className = '', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
    <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

export const Close = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

// Circle arrow for the feature carousel (40x40)
export const ArrowCircle = ({ dir = 'right', className = '' }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <circle cx="20" cy="20" r="19.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d={dir === 'right' ? 'M21.5 12.5L29 20l-7.5 7.5M29 20H11' : 'M18.5 12.5L11 20l7.5 7.5M11 20h18'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const SendUp = ({ className = '' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
    <path d="M8 13.5v-11M3.5 7L8 2.5 12.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Generic sparkle (agents eyebrow, E6)
export const Sparkle = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
    <path d="M9 1.5c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="15" cy="3" r="1" fill="currentColor" />
  </svg>
)

// Generic globe icon for nav dropdown header boxes (E8)
export const Globe = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.3" />
    <ellipse cx="10" cy="10" rx="3.5" ry="8.25" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 10h16" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

// Small generic icons for nav links (E9) and agents features
export const IconSquares = ({ className = '', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
    <rect x="1.5" y="1.5" width="4.5" height="4.5" stroke="currentColor" strokeWidth="1.2" />
    <rect x="8" y="1.5" width="4.5" height="4.5" stroke="currentColor" strokeWidth="1.2" />
    <rect x="1.5" y="8" width="4.5" height="4.5" stroke="currentColor" strokeWidth="1.2" />
    <rect x="8" y="8" width="4.5" height="4.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)
export const IconBars = ({ className = '', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
    <path d="M2 12.5V7M5.33 12.5V4M8.67 12.5V8.5M12 12.5V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)
export const IconDoc = ({ className = '', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
    <path d="M3 1.5h5.5L11 4v8.5H3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M5 7h4M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)
export const IconTarget = ({ className = '', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)
export const IconUsers = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
    <circle cx="7" cy="6" r="2.75" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2 15c.5-2.6 2.4-4 5-4s4.5 1.4 5 4M12 3.5a2.6 2.6 0 010 5M13.5 11c1.4.5 2.3 1.8 2.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)
export const IconEye = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
    <path d="M1.5 9S4.2 4 9 4s7.5 5 7.5 5-2.7 5-7.5 5S1.5 9 1.5 9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)
export const IconSliders = ({ className = '', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
    <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M6 3v3M11.5 7.5v3M7.5 12v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

// Generic social "in" glyph (18x18)
export const SocialIn = ({ className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden="true">
    <rect x="3" y="7" width="2.6" height="8" />
    <circle cx="4.3" cy="4.3" r="1.5" />
    <path d="M7.5 7h2.5v1.2c.4-.8 1.4-1.4 2.6-1.4 2 0 2.9 1.3 2.9 3.4V15h-2.6v-4.3c0-1-.4-1.7-1.3-1.7s-1.5.7-1.5 1.7V15H7.5z" />
  </svg>
)

// Up/down chevron used on selects (9x24)
export const SelectChevrons = ({ className = '' }) => (
  <svg width="9" height="24" viewBox="0 0 9 24" fill="none" className={className} aria-hidden="true">
    <path d="M1 9.5L4.5 6 8 9.5M1 14.5L4.5 18 8 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Privacy-choices toggle (30x14), standard-style pill
export const PrivacyToggle = ({ className = '' }) => (
  <svg width="30" height="14" viewBox="0 0 30 14" className={className} aria-hidden="true">
    <rect x="0.5" y="0.5" width="29" height="13" rx="6.5" fill="#fff" stroke="#265cff" />
    <path d="M1 7a6.5 6.5 0 016.5-6.5H17L12 13.5H7.5A6.5 6.5 0 011 7z" fill="#265cff" />
    <path d="M5 7.2l2 2 3.6-4" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.5 4.5l5 5M24.5 4.5l-5 5" stroke="#265cff" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

// Prompt "paper" icon (E10), generic 32x32
export const PromptGlyph = ({ className = '', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 16c3-4 5-4 8 0s5 4 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
