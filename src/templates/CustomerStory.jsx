import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Media from '../components/Media.jsx'
import PlaceholderLogo from '../components/PlaceholderLogo.jsx'
import { href } from '../routing.js'
import { PageLinks, PlayTriangle, Prose, useActiveSection } from '../primitives/index.js'
import { STORY_INTRO, STORY_KEYPOINTS, STORY_SECTIONS } from '../content/bodies.js'
import { INDUSTRIES, REGIONS } from '../content/customers.js'

// §4.5 Variant A: CustomerStoryTemplate. story: item from content/customers.js
export default function CustomerStory({ story, next, related }) {
  const sectionIds = STORY_SECTIONS.map((s) => s.id)
  const active = useActiveSection(sectionIds, { offset: 148, rootMargin: '-148px 0px 0px -50%' })
  const meta = [
    ['Region', REGIONS.find((r) => r.value === story.region)?.label],
    ['Industry', INDUSTRIES.find((r) => r.value === story.industry)?.label],
    ['Number of employees', story.size],
    ['Products used', story.products],
  ]
  return (
    <>
      {/* Story hero */}
      <header>
        {/* measured: 12-column grid (gap 20); content spans columns 2-11 (957 wide), centred */}
        <div className="container-ws grid grid-cols-12 lg:gap-x-5">
          <div className="col-span-12 flex flex-col items-center py-12 text-center lg:col-span-10 lg:col-start-2 lg:px-0">
            <Link to={href('/customers')} aria-label={`${story.company} (placeholder logo)`} className="flex h-[35px] items-center text-midnight">
              <PlaceholderLogo logo={story.logo} height={27} className="max-w-[72px]" />
            </Link>
            <h1 className="mt-5 max-w-[957px] text-[38px] font-normal leading-[41.8px] tracking-[-1.14px] text-midnight md:text-[60px] md:leading-[66px] md:tracking-[-1.8px]">{story.title}</h1>
            <p className="mt-5 max-w-[957px] text-[30px] font-normal leading-[33px] tracking-[-0.3px] text-ink-secondary md:text-[35px] md:leading-[38.5px] md:tracking-[-0.35px]">{story.subtitle}</p>
          </div>
        </div>
        <Media slot={story.slot} tone={story.tone} className="h-[450px] w-full" />
      </header>

      {/* Content frame */}
      <div className="container-ws">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:border-x lg:border-cobalt-30">
          <aside className="border-b border-cobalt-30 py-10 lg:col-span-3 lg:border-r lg:px-10 lg:py-[86px]">
            {/* measured: sticky inner at least one viewport tall (100vh - 68); actions pushed to its bottom */}
            <div className="flex flex-col lg:sticky lg:top-[68px] lg:min-h-[calc(100vh-68px)] lg:py-10">
              <div className="mb-5 flex h-[45px] items-center justify-center text-midnight lg:mb-10">
                <PlaceholderLogo logo={story.logo} height={40} className="max-w-[80px]" />
              </div>
              <dl className="border-y border-cobalt-30 py-5">
                {meta.map(([k, v], i) => (
                  <div key={k} className={i ? 'mt-5' : ''}>
                    <dt className="font-mono text-sm font-medium uppercase leading-[22px] tracking-[-0.3px] text-cobalt-40">{k}</dt>
                    {(Array.isArray(v) ? v : [v]).map((x) => (
                      <dd key={x} className="mt-1 text-sm font-medium leading-[22px] tracking-[-0.3px] text-ink-secondary [&+dd]:mt-2">
                        {x}
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
              <nav aria-label="Table of contents" className="mt-5 hidden lg:block">
                <ul className="flex flex-col gap-1 border-l border-cobalt-40 pl-5">
                  {STORY_SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} data-state={active === s.id ? 'active' : 'inactive'} className={`text-sm font-medium leading-[22px] tracking-[-0.3px] transition-colors duration-200 ease-in-out ${active === s.id ? 'text-cobalt' : 'text-[#415591]'}`}>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              {next && (
                <div className="flex flex-col gap-3 pt-5 lg:mt-auto lg:pt-10">
                  <Button as={Link} to={href(next)} variant="light" arrow className="self-start">
                    Next story
                  </Button>
                </div>
              )}
            </div>
          </aside>

          <div className="lg:col-span-9 lg:pt-20">
            {/* Video.video: Vimeo embed replaced by a same-size placeholder */}
            <section className="py-10 lg:px-10">
              <p className="mx-[10px] mb-4 max-w-[720px] font-mono text-xs leading-[13px] tracking-[normal] text-cobalt md:text-sm md:leading-5">Watch the video</p>
              <div className="border border-cobalt-30 p-3">
                <div className="relative aspect-video w-full">
                  <Media slot={`${story.slot}.video`} tone="dark" className="h-full w-full" alt="Video placeholder" />
                  <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-cobalt text-white" aria-hidden="true">
                    <PlayTriangle size={32} />
                  </span>
                </div>
              </div>
            </section>
            {/* Intro */}
            <section className="py-10 lg:px-10">
              <p className="max-w-[720px] font-serif text-3xl font-medium leading-[33.6px] tracking-[-0.112px] text-ink-secondary">{STORY_INTRO}</p>
            </section>
            {/* Keypoints */}
            <section className="grid grid-cols-1 border-b border-cobalt-30 md:grid-cols-2">
              {STORY_KEYPOINTS.map((k, i) => (
                <div key={k.label} className={`border-t border-cobalt-30 py-10 md:border-r md:p-10 ${i === 2 ? 'md:col-span-2' : ''} ${i % 2 === 1 || i === 2 ? 'md:border-r-0' : ''}`}>
                  <a href={`#${STORY_SECTIONS[i].id}`} className="mb-5 block font-mono text-xs leading-[13px] tracking-[normal] text-cobalt md:text-sm md:leading-5">
                    {k.label}
                  </a>
                  <p className="max-w-[720px] text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-ink-secondary">{k.text}</p>
                </div>
              ))}
            </section>
            {/* RichText sections */}
            {STORY_SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="py-10 lg:px-10" style={{ scrollMarginTop: 100 }}>
                <p className="mb-4 max-w-[720px] font-mono text-xs leading-[13px] tracking-[normal] text-cobalt md:text-sm md:leading-5">{s.label}</p>
                <Prose variant="story" blocks={s.blocks} />
              </section>
            ))}
          </div>
        </div>
      </div>
      {related?.length > 0 && <PageLinks cards={related} />}
    </>
  )
}
