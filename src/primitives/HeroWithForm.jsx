import './primitives.css'
import Media from '../components/Media.jsx'
import LogoMarquee from '../components/LogoMarquee.jsx'
import HubspotForm from './Form.jsx'
import { CheckCircle } from './icons.jsx'

// §3.33 SectionHeroForm (demo / product tour / tool). theme 'dark' | 'light'.
// form: { variant: 'solo'|'banner', title?, avatars?, mediaSlot?, fields, submitLabel }
export default function HeroWithForm({ theme = 'light', eyebrow, eyebrowDot = '#ff6633', title, lead, features, stats, statsLabel, quote, form, logosLabel = 'Trusted by sustainability teams at' }) {
  const dark = theme === 'dark'
  return (
    <section
      className={`relative -mt-[68px] overflow-hidden ${dark ? 'bg-night text-white' : 'bg-white'}`}
      style={dark ? undefined : { backgroundImage: 'linear-gradient(#f5f8ff 0%, #f5f8ff 28%, #fff 70%)' }}
    >
      {dark ? (
        <>
          <Media slot="hero.form.bg" tone="dark" className="absolute inset-0 h-full w-full" />
          <div aria-hidden="true" className="tex-dither-dark absolute inset-0" style={{ opacity: 0.85 }} />
        </>
      ) : (
        <div aria-hidden="true" className="tex-dither-light pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-40" style={{ backgroundColor: 'transparent' }} />
      )}

      <div className="relative mx-auto max-w-[1200px] px-[11px] pt-[100px] md:px-6 md:pt-[116px]">
        {/* 390 (measured): one column, gap 16, ordered title block -> form -> copy blocks; the copy column's
            children join the outer grid (display: contents) so the form can sit between them. */}
        <div className="grid grid-cols-1 items-start gap-4 pb-[53px] lg:grid-cols-[566.14px_537.84px] lg:gap-12 lg:pb-10">
          {/* Copy column */}
          <div className="contents lg:grid lg:max-w-[552px] lg:gap-10 lg:py-12">
            <div className="order-1 grid gap-4 lg:order-none lg:gap-10">
              {eyebrow && (
                <p className={`flex items-center gap-2 font-mono text-xs leading-[14.4px] tracking-[-0.12px] md:text-sm md:leading-[16.8px] md:tracking-[-0.14px] ${dark ? 'text-white' : 'text-ink'}`}>
                  <span className="h-[5px] w-[5px] md:h-2 md:w-2" style={{ background: eyebrowDot }} aria-hidden="true" />
                  {eyebrow}
                </p>
              )}
              <div className="grid gap-4 md:gap-6">
                <h1 className={`text-[22px] font-normal leading-[22px] tracking-[-0.66px] md:text-7xl md:leading-[48px] md:tracking-[-1.44px] ${dark ? 'text-white' : 'text-night'}`}>{title}</h1>
                {lead && <p className={`text-[13px] font-medium leading-[19.5px] tracking-[-0.13px] md:text-md md:leading-6 md:tracking-[-0.16px] ${dark ? 'text-white/80' : 'text-ink-secondary'}`}>{lead}</p>}
              </div>
            </div>
            {(features || stats || statsLabel || quote) && (
              <div className="order-3 grid gap-[27px] lg:order-none lg:gap-10">
                {features && (
                  <ul className="grid gap-2 md:gap-3">
                    {features.map((f) => (
                      <li key={f} className={`flex gap-[5px] text-[13px] font-semibold leading-[15.6px] tracking-[-0.16px] md:gap-2 md:text-md md:leading-[19.2px] ${dark ? 'text-white/[.86]' : 'text-ink-secondary'}`}>
                        <CheckCircle className={`mt-px shrink-0 ${dark ? 'text-cobalt-40' : 'text-cobalt'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {stats && (
                  <div className="grid grid-cols-1 gap-[5px] md:grid-cols-[272px_272px] md:gap-2">
                    {stats.map((s) => (
                      <div key={s.value} className="rounded-card bg-white/[.01] p-[13px] shadow-glass md:p-6" style={{ backdropFilter: 'blur(4px)' }}>
                        <p className="text-[28px] font-light leading-[30.8px] tracking-[-1.44px] text-white md:text-7xl md:leading-[52.8px]">{s.value}</p>
                        <p className="mt-2 text-xs font-medium leading-[15.6px] tracking-[-0.14px] text-white md:mt-[14px] md:text-sm md:leading-[18.2px]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
                {statsLabel && (
                  // measured (/product-tours): label then 2x2 tiles (272, gap 8; 390: 1 column), tile padding 12 (390: 8),
                  // bg rgba(147,174,255,.08), radius 5, 64x80 thumbnail + title/description (gap 4)
                  <div className="grid gap-3">
                    <p className="font-mono text-[10px] leading-3 tracking-[0.5px] text-cobalt md:text-xs md:leading-[14.4px] md:tracking-[0.6px]">{statsLabel.label}</p>
                    <ul className="grid grid-cols-1 gap-[5px] md:grid-cols-[272px_272px] md:gap-2">
                      {statsLabel.items.map((it, i) => (
                        <li key={it.title} className="flex items-center gap-2 rounded-card p-2 md:gap-3 md:p-3" style={{ background: 'rgba(147,174,255,.08)' }}>
                          <span className="h-20 w-16 shrink-0 overflow-hidden rounded-btn bg-cobalt-10">
                            <Media slot={`hero.form.tour.${i}`} tone="cool" className="h-full w-full" />
                          </span>
                          <span className="flex flex-col gap-1">
                            <span className="text-xs font-medium leading-[15px] tracking-[-0.42px] text-night md:text-sm md:leading-[17.5px]">{it.title}</span>
                            <span className="text-[10px] font-medium leading-[15px] tracking-[-0.12px] text-ink-secondary md:text-xs md:leading-[18px]">{it.desc}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {quote && (
                  <figure className="grid gap-4">
                    <blockquote className="font-serif text-md font-normal leading-5 tracking-[-0.42px] text-night md:text-[21px] md:leading-[26.25px]">{quote.text}</blockquote>
                    <figcaption className="flex items-center gap-3">
                      <span className="h-[27px] w-[27px] shrink-0 overflow-hidden rounded-full bg-cobalt-10 md:h-10 md:w-10">
                        <Media slot="hero.form.quote.avatar" className="h-full w-full" />
                      </span>
                      <span>
                        <span className="block text-[13px] font-semibold leading-[15.6px] tracking-[-0.48px] text-night md:text-md md:leading-[19.2px]">{quote.name}</span>
                        <span className="block text-xs font-medium leading-[14.4px] tracking-[-0.3px] text-ink-secondary md:text-sm md:leading-[16.8px]">{quote.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                )}
              </div>
            )}
          </div>

          {/* Form column */}
          <div className="order-2 lg:sticky lg:top-[92px] lg:order-none lg:mb-24">
            <div
              className={`rounded-panel p-[5px] md:p-2 ${dark ? 'bg-white/[.01] shadow-glass' : ''}`}
              style={{
                backdropFilter: 'blur(4px)',
                ...(dark ? {} : { background: 'rgba(147,174,255,.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6), 0 0 0 1px rgba(4,19,48,.06)' }),
              }}
            >
              {form.variant === 'banner' ? (
                <>
                  <div className="w-full overflow-hidden rounded-t-btn" style={{ aspectRatio: form.mediaAspect ?? '522 / 294' }}>
                    <Media slot={form.mediaSlot ?? 'hero.form.banner'} tone="cool" className="h-full w-full" />
                  </div>
                  <div className="rounded-b-btn bg-white p-[21px] md:px-8 md:py-12">
                    {form.title && <h2 className="mb-4 text-[18px] leading-[20.16px] md:mb-6 md:text-2xl font-medium leading-[26.88px] tracking-[-0.2px] text-ink">{form.title}</h2>}
                    <HubspotForm fields={form.fields} submitLabel={form.submitLabel} />
                  </div>
                </>
              ) : (
                <div className="grid gap-4 rounded-btn bg-white p-[21px] md:gap-6 md:p-8">
                  <div className="flex items-start justify-between gap-[11px] md:gap-4">
                    <h2 className="text-[18px] font-medium leading-[20.16px] tracking-[-0.2px] text-ink md:text-2xl md:leading-[26.88px]">{form.title}</h2>
                    <div className="flex shrink-0" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className={`h-[27px] w-[27px] overflow-hidden rounded-full border-2 border-white bg-cobalt-10 md:h-10 md:w-10 ${i ? '-ml-[5px] md:-ml-2' : ''}`}>
                          <Media slot={`hero.form.avatar.${i}`} tone={['warm', 'cool', 'neutral'][i]} className="h-full w-full" />
                        </span>
                      ))}
                    </div>
                  </div>
                  <HubspotForm fields={form.fields} submitLabel={form.submitLabel} legalVerb="requesting a demo" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logos strip */}
      {/* measured: label left-aligned in the container, mb 16 (24 at 768+); strip padding-bottom 27 (40) */}
      <div className="relative pb-[27px] md:pb-10">
        <p className={`container-ws mb-4 font-mono text-xs leading-[14.4px] tracking-[0.6px] md:mb-6 md:text-sm md:leading-[16.8px] md:tracking-[0.7px] ${dark ? 'text-white/90' : 'text-cobalt'}`}>{logosLabel}</p>
        <LogoMarquee tone={dark ? 'dark' : 'light'} />
      </div>
    </section>
  )
}
