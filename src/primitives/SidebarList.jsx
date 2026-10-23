import './primitives.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { href, isExternal } from '../routing.js'
import { CaretDown, DocMark } from './icons.jsx'

// §2.4 SidebarIndexLayout (/news, /legal).
// nav: [{label, target (anchor id or path), current?, children?: [{label, target}]}]
// mobileTabs (news only): [{label, target}] -> sticky 2-tab bar instead of the sidebar list.
export default function SidebarList({ title, nav = [], notice, mobileTabs, children, legal = false }) {
  // measured: grouped navs (/legal) have no rule on the top level and 600 level-one links (current = cobalt);
  // flat navs (/news) sit inside a cobalt-40 rule with 500 midnight links.
  const grouped = nav.some((g) => g.children)
  return (
    <div className="border-b border-cobalt-30" style={{ background: 'linear-gradient(0deg, #93aeff -375.36%, #fffbf3 78.44%)' }}>
      <div className="container-ws !px-0 md:!px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:border-x lg:border-cobalt-30">
          <aside className="border-cobalt-30 lg:col-span-4 lg:border-r">
            {/* measured: sticky header at least one viewport tall (100vh - 68); the notice sits at its bottom */}
            <div className={`flex flex-col lg:sticky lg:top-[68px] lg:min-h-[calc(100vh-68px)] lg:px-6 lg:pt-24 ${legal ? 'px-6 py-24' : 'px-3 py-12 lg:pb-6'}`}>
              <h1 className="mb-24 font-serif text-[60px] font-light leading-[60px] tracking-[-2.88px] text-ink-secondary lg:mb-0 lg:text-[90px] lg:leading-[94.5px]">{title}</h1>
              <ul className={`mt-5 hidden gap-y-2 lg:grid ${grouped ? '' : 'border-l border-cobalt-40 pl-5'}`}>
                {nav.map((g) => (
                  <li key={g.label}>
                    <SideLink
                      item={g}
                      className={`text-[20px] leading-[30px] tracking-[-0.2px] ${grouped ? `font-semibold ${g.current ? 'text-cobalt' : 'text-midnight'}` : 'font-medium text-midnight'}`}
                    />
                    {g.children && (
                      <ul className="mt-3 grid gap-y-2 border-l border-cobalt-40 pl-5">
                        {g.children.map((c) => (
                          <li key={c.label} className="leading-[30px] last:mb-2">
                            <SideLink item={c} className="text-base font-normal leading-[22.4px] tracking-[-0.16px] text-[#6d7fb2] hover:text-cobalt" />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              {notice && <p className="pt-6 text-xs font-normal leading-[13px] tracking-[normal] text-cobalt lg:mt-auto lg:text-sm lg:leading-5">{notice}</p>}
            </div>
          </aside>
          {mobileTabs && (
            <div className="sticky top-[67px] z-10 grid grid-cols-2 border-y border-cobalt lg:hidden">
              {mobileTabs.map((t, i) => (
                <a key={t.target} href={`#${t.target}`} className={`px-[2px] py-5 text-center text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-midnight ${i === 0 ? 'border-r border-cobalt' : ''}`}>
                  {t.label}
                </a>
              ))}
            </div>
          )}
          <div className="lg:col-span-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

function SideLink({ item, className }) {
  if (item.target?.startsWith('/'))
    return (
      <Link to={href(item.target)} className={className}>
        {item.label}
      </Link>
    )
  return (
    <a href={`#${item.target}`} className={className}>
      {item.label}
    </a>
  )
}

// Content section, separated by an 8px cobalt top border. Heading visible on /legal, visually hidden on /news.
export function SidebarSection({ id, heading, hideHeading = false, children, first = false }) {
  return (
    <section id={id} className={`${first ? '' : 'border-t-8 border-cobalt'}`} style={{ scrollMarginTop: 68 }}>
      <h2
        className={
          hideHeading
            ? 'sr-only-ws'
            : 'sb-heading mb-5 px-5 pt-5 text-[25px] font-medium leading-[28.75px] tracking-[-0.75px] text-midnight md:text-3xl md:leading-[32.2px] md:tracking-[-0.84px]'
        }
      >
        {heading}
      </h2>
      {children}
    </section>
  )
}

// contentArticleRelease row: 32px icon, title, mono date. `to` = internal path; without one (or for an
// off-site URL) the row renders as a non-link with no hover affordance.
export function ReleaseRow({ title, date, to }) {
  const linked = to && !isExternal(to)
  const Tag = linked ? Link : 'div'
  return (
    <Tag {...(linked ? { to: href(to) } : {})} className={`${linked ? 'sb-row group' : ''} sb-item grid grid-cols-1 gap-x-6 gap-y-3 border-b border-cobalt-30 px-3 py-5 md:grid-cols-[32px_1fr] md:px-5`}>
      <DocMark className="text-cobalt" />
      <div className="flex flex-col gap-3">
        <h3 className="sb-title text-[20px] font-medium leading-[22px] tracking-[-0.2px] text-midnight">{title}</h3>
        <p className="font-mono text-sm font-medium leading-[22px] tracking-[-0.3px] text-cobalt">{date}</p>
      </div>
    </Tag>
  )
}

// contentArticleCoverage row (/news press coverage): title | meta (outlet + date).
// Press outlets are off-site on the real site; the clone never links off-site, so rows are links only for internal `to`.
export function CoverageRow({ title, outlet, date, to }) {
  const linked = to && !isExternal(to)
  const Tag = linked ? Link : 'div'
  return (
    <Tag {...(linked ? { to: href(to) } : {})} className={`${linked ? 'sb-row group' : ''} sb-item grid grid-cols-1 gap-5 border-b border-cobalt-30 px-3 py-5 md:grid-cols-[minmax(0,433.67px)_197px] md:gap-x-24 md:px-5`}>
      <h3 className="sb-title text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-midnight">{title}</h3>
      <div className="flex flex-col gap-2 border-l border-cobalt-30 pl-5 md:-my-5 md:py-5 md:pl-8">
        <p className="text-[20px] font-medium leading-[22px] tracking-[-0.6px] text-midnight">{outlet}</p>
        <p className="font-mono text-sm font-medium leading-[22px] tracking-[-0.3px] text-cobalt">{date}</p>
      </div>
    </Tag>
  )
}

// Rows with a "Show more" toggle that reveals the rest and then hides itself.
export function ToggleList({ items, initial = 10, label, render }) {
  const [open, setOpen] = useState(false)
  const shown = open ? items : items.slice(0, initial)
  return (
    <>
      {shown.map(render)}
      {!open && items.length > initial && (
        <button type="button" onClick={() => setOpen(true)} className="sb-toggle flex w-full items-center justify-center gap-1 border-t border-cobalt-30 px-3 py-5 text-[20px] font-medium leading-7 text-cobalt transition-colors duration-200">
          {label}
          <CaretDown size={24} />
        </button>
      )}
    </>
  )
}
