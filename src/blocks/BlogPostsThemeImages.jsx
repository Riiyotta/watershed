import Media from '../components/Media.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { SmartLink } from './ui.jsx'

// §3.34 blogPosts.themeImages (/climate-leads, /partners). Measured 1440 (/partners): section 1200 with padding 64 12,
// title h4 28/32.2 500 -0.84 cobalt → grid 30; gridThree gap 16 32, cards 371 wide: white, 1px #658dfd border,
// figure 369x185 (border-bottom #93aeff), content padding 20: title 28/32.2 500 -0.28 midnight, date Mono 14/22 500
// -0.3 uppercase cobalt (gap 20), 16px arrow pinned to the bottom. Cards reveal on scroll in the original.
export default function BlogPostsThemeImages({ title, posts = [], bordered = false, slotPrefix = 'company.posts' }) {
  return (
    <div className={bordered ? 'border-t border-cobalt-40' : ''}>
      <section className="mx-auto max-w-[1200px] px-3 py-16">
        <h2 className="text-2xl font-medium leading-[28px] tracking-[-0.84px] text-cobalt md:text-[28px] md:leading-[32.2px]">{title}</h2>
        <div className="mt-[30px] grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
          {posts.map((p, i) => (
            <SmartLink key={p.title} to={p.to} className="group flex flex-col border border-cobalt-40 bg-white">
              <Media slot={`${slotPrefix}.${i}`} tone={['cool', 'warm', 'neutral'][i % 3]} className="aspect-[369/185] w-full border-b border-cobalt-30" />
              <span className="flex flex-1 flex-col p-5">
                <span className="text-2xl font-medium leading-[28px] tracking-[-0.28px] text-midnight md:text-[28px] md:leading-[32.2px]">{p.title}</span>
                <time className="mt-5 font-mono text-sm font-medium uppercase leading-[22px] tracking-[-0.3px] text-cobalt">{p.date}</time>
                <span className="mt-auto pt-10 text-cobalt">
                  {/* MOTION: arrow +4px on hover (.2s ease-in-out) */}
                  <ArrowRight size={16} className="transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                </span>
              </span>
            </SmartLink>
          ))}
        </div>
      </section>
    </div>
  )
}
