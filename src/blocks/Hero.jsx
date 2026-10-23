import Media from '../components/Media.jsx'
import { Cta } from './ui.jsx'

// §3.1 Hero.defaultRoot. `natural` = mediaNatural (552x557 contain). `ratio` = media w/h when the image is not square
// (measured 552x736 = 3/4 on /platform/act and /solutions/csrd, 552x828 = 2/3 on /ai-fellowship).
export default function Hero({ eyebrow, title, sub, primary = { label: 'Request a demo', to: '/demo' }, secondary, media = {}, bg, slotPrefix = 'product.hero' }) {
  const paras = Array.isArray(sub) ? sub : [sub]
  return (
    // MOTION: IntersectionObserver threshold .05 on the header (no visual change measured)
    <header className="py-[53px] md:py-20" style={{ background: bg ?? 'linear-gradient(#f5f8ff 0%, #fff 100%)' }}>
      <div className="container-ws grid grid-cols-1 items-center gap-8 lg:gap-12 wide:grid-cols-2">
        <div className="flex flex-col gap-[21px] md:gap-8">
          <div className="flex flex-col gap-[13px] md:gap-5">
            <div className="flex flex-col gap-2 md:gap-3">
              {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
              <h1 className="b-h1">{title}</h1>
            </div>
            {/* Gap between multiple subhead paragraphs is unmeasured; 16 used */}
            <div className="flex flex-col gap-4">
              {paras.map((p, i) => (
                <p key={i} className="t-lead max-w-[720px]">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {primary && <Cta {...primary} shine />}
            {secondary && <Cta {...secondary} variant="light" />}
          </div>
        </div>
        <Media
          slot={media.slot ?? `${slotPrefix}.0`}
          tone={media.tone ?? 'cool'}
          fit={media.natural ? 'contain' : 'cover'}
          className={`w-full rounded-btn ${media.ratio ? '' : media.natural ? 'aspect-[552/557]' : 'aspect-square'}`}
          style={media.ratio ? { aspectRatio: String(media.ratio) } : undefined}
        />
      </div>
    </header>
  )
}
