import Wordmark from '../../components/Wordmark.jsx'
import { Cta } from '../ui.jsx'

// §3.34 BrandTemplate (/brand). Logos are the clone's own placeholder wordmark (no source brand marks).
// Measured 1440 (live): every band is a 1176 container (x 132) with 1px rgba(13,89,242,.5) left/right rules and no
// background; header padding 50 48, sections padding 86 48.
//  - H1 60/66 400 -1.8 midnight. Section H2 48/52.8 400 -1.44 midnight → body 20 (20/30 #666c80, 720 wide) → content 32.
//  - Logo grid 2x515, gap 36 48; tiles 515x258 (light #fffbf3, dark #242c47) + a 46-tall spec row (label 14/20 500
//    #415591; two download chips, 98 wide, gap 8). Then a rule (55 below) and the trademark note 14/20 400 #415591
//    (720 wide, 56 below the rule).
//  - Colour: 9 swatches 102x102 (1px #265cff border), gap 20; 12 below: name 14/15.4 500 + hex Mono 14/20 500
//    #415591, 20x20 copy button right.
//  - Typography: body, rule (55), samples 56 below the rule, each followed by a 14/22 500 -0.3 #8494c3 caption (10),
//    50 between samples: Sans 48/52.8 300 midnight; Serif 28/32.2 500 -0.84 #666c80; Mono 14/20 cobalt.
//  - Press kit: H2 → primary withArrow button 70.
const SWATCHES = [
  ['Cobalt', '#265CFF'], ['Midnight', '#0B2471'], ['Paper', '#FFFBF3'], ['Sage', '#8AB280'], ['Periwinkle', '#93AEFF'],
  ['Poppy', '#FF6633'], ['Sunbeam', '#FFE8A3'], ['Mint', '#ABF1D0'], ['Marigold', '#ECA74E'],
]
const META = 'text-sm font-medium leading-5 tracking-[normal] text-[#415591]'
const CAPTION = 'mt-[10px] text-sm font-medium leading-[22px] tracking-[-0.3px] text-[#8494c3]'

function Band({ children, header = false }) {
  return (
    <section className={`mx-auto max-w-[1176px] border-x border-[rgba(13,89,242,.5)] px-4 md:px-12 ${header ? 'py-8 md:py-[50px]' : 'py-12 md:py-[86px]'}`}>
      {children}
    </section>
  )
}

function H2({ children }) {
  return <h2 className="text-[36px] font-normal leading-[39.6px] tracking-[-1.08px] text-midnight md:text-[48px] md:leading-[52.8px] md:tracking-[-1.44px]">{children}</h2>
}

function Body({ children }) {
  return <p className="mt-5 max-w-[720px] text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-ink-secondary">{children}</p>
}

function Chip({ children }) {
  return <button type="button" className="h-7 rounded-btn bg-cobalt-10 px-2 font-mono text-xs text-cobalt hover:bg-cobalt-20">{children}</button>
}

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 13V5.5A1.5 1.5 0 0 1 5.5 4H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export default function Brand() {
  const tiles = [
    ['Horizontal dark', false, false],
    ['Vertical dark', false, true],
    ['Horizontal white', true, false],
    ['Vertical white', true, true],
  ]
  return (
    <div>
      <Band header>
        <h1 className="text-[40px] font-normal leading-[44px] tracking-[-1.2px] text-midnight md:text-[60px] md:leading-[66px] md:tracking-[-1.8px]">Brand essentials</h1>
      </Band>
      <Band>
        <H2>Logo</H2>
        <Body>The Northwind logo may be used in full colour, or all white over dark colours and imagery.</Body>
        <ul className="mt-8 grid grid-cols-1 gap-x-12 gap-y-9 md:grid-cols-2">
          {tiles.map(([label, dark, stacked]) => (
            <li key={label}>
              <div className={`flex aspect-[515/258] items-center justify-center px-[100px] py-14 ${dark ? 'bg-[#242c47]' : 'bg-[#fffbf3]'}`}>
                <span className={`flex items-center gap-3 ${stacked ? 'flex-col' : ''}`}>
                  <span aria-hidden="true" className={`h-12 w-12 rounded-full border-[5px] ${dark ? 'border-white' : 'border-cobalt'}`} />
                  <Wordmark light={dark} className={`${stacked ? 'text-2xl' : 'text-[40px]'} ${dark ? '' : '!text-midnight'}`} />
                </span>
              </div>
              <div className="flex h-[46px] items-center justify-between gap-3">
                <p className={META}>{label}</p>
                <span className="flex gap-2">
                  <Chip>SVG</Chip>
                  <Chip>PNG</Chip>
                </span>
              </div>
            </li>
          ))}
        </ul>
        <hr className="mt-[55px] border-0 border-t border-gray-30" />
        <p className="mt-14 max-w-[720px] text-sm font-normal leading-5 tracking-[normal] text-[#415591]">
          The Northwind trademark includes the name, logo and any word, phrase, image or other designation that identifies Northwind products or services. Please do not alter the marks, combine them with other marks or use them in a way that suggests sponsorship or endorsement.
        </p>
      </Band>
      <Band>
        <H2>Colour</H2>
        <ul className="mt-8 grid grid-cols-3 gap-5 sm:grid-cols-5 lg:grid-cols-9 xl:grid-cols-[repeat(9,102px)]">
          {SWATCHES.map(([name, hex]) => (
            <li key={name} className="flex flex-col gap-3">
              <span className="block aspect-square w-full border border-cobalt" style={{ background: hex }} />
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-[15.4px] tracking-[normal] text-[#415591]">{name}</p>
                  <span className="font-mono text-sm font-medium leading-5 tracking-[normal] text-[#415591]">{hex}</span>
                </div>
                <button type="button" aria-label={`Copy ${hex}`} className="mt-1 h-5 w-5 shrink-0 text-[#415591] hover:text-cobalt">
                  <CopyIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Band>
      <Band>
        <H2>Typography</H2>
        <Body>We use a clean sans serif as our primary typeface, a serif for display and editorial moments, and a mono for metadata and links.</Body>
        <hr className="mt-[55px] border-0 border-t border-gray-30" />
        <div className="mt-14 flex flex-col gap-[50px]">
          <div>
            <p className="max-w-[1000px] text-[32px] font-light leading-[38px] tracking-[-0.96px] text-midnight md:text-[48px] md:leading-[52.8px] md:tracking-[-1.44px]">The climate data platform for every team</p>
            <p className={CAPTION}>H3 Sans Light 48 px</p>
          </div>
          <div>
            <p className="font-serif text-[28px] font-medium leading-[32.2px] tracking-[-0.84px] text-ink-secondary">Get to net zero, fast</p>
            <p className={CAPTION}>H5 Serif 28 px</p>
          </div>
          <div>
            <p className="font-mono text-sm leading-5 tracking-[normal] text-cobalt">Get to net zero, fast</p>
            <p className={CAPTION}>Eyebrow Mono 14 px</p>
          </div>
        </div>
      </Band>
      <Band>
        <H2>Press kit</H2>
        <div className="mt-[70px]">
          <Cta label="Download assets" to="/news" arrow shine />
        </div>
      </Band>
    </div>
  )
}
