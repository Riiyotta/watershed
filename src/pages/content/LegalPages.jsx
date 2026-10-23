import { Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { href } from '../../routing.js'
import { Prose, ReleaseRow, SidebarList, SidebarSection, Toc, tocFromBlocks } from '../../primitives/index.js'
import { LEGAL_GROUPS } from '../../content/news.js'
import { LEGAL_LONG, LEGAL_SHORT } from '../../content/bodies.js'

const DOCS = {
  '/legal/privacy': { title: 'Privacy policy', body: LEGAL_LONG, toc: true },
  '/legal/terms': { title: 'Website terms of service', body: LEGAL_SHORT },
  '/legal/security': { title: 'Security', body: LEGAL_SHORT },
  '/legal/data-portal-terms': { title: 'Data portal terms', body: LEGAL_SHORT },
}

export default function LegalPage({ path }) {
  if (path === '/data-portal-terms') return <Navigate to={href('/legal/data-portal-terms')} replace />
  if (path === '/legal') return <LegalIndex />
  return <LegalDocument {...DOCS[path]} />
}

function LegalIndex() {
  const nav = LEGAL_GROUPS.map((g, i) => ({
    label: g.heading,
    target: g.id,
    current: i === 0,
    children: g.id === 'archived' ? undefined : g.items.map((it) => ({ label: it.title, target: it.to })),
  }))
  return (
    <SidebarList title="Legal" nav={nav} legal notice={<>Contact our legal team:<br />legal@northwind.example</>}>
      {LEGAL_GROUPS.map((g, i) => (
        <SidebarSection key={g.id} id={g.id} heading={g.heading} first={i === 0}>
          {g.items.map((it, k) => (
            <ReleaseRow key={k} {...it} />
          ))}
        </SidebarSection>
      ))}
    </SidebarList>
  )
}

// §4.7 LegalDocumentTemplate (with / without TOC)
function LegalDocument({ title, body, toc = false }) {
  const items = toc ? tocFromBlocks(body) : []
  const article = (
    <div className="mx-auto w-full max-w-[792px] px-4 py-6 md:p-12">
      <h1 className="mb-5 font-serif text-[45px] font-light leading-[45px] tracking-[-1.12px] text-ink-secondary md:leading-[47.25px]">{title}</h1>
      <Prose blocks={body} variant="legal" />
    </div>
  )
  return (
    <>
      {/* measured: the top .blog-post strip is 48 tall at 390 and 96 at 768+ */}
      <div className="mx-auto flex h-12 max-w-[792px] items-center px-4 md:h-24 md:px-12">
        <Link to={href('/legal')} className="font-mono text-sm leading-5 text-cobalt hover:underline">
          ← All legal documents
        </Link>
      </div>
      {toc ? (
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,818.6px)_minmax(0,409.3px)] lg:justify-center lg:gap-9 xl:px-[88px] lg:py-3">
          {article}
          <div className="hidden pt-12 lg:block">
            <Toc items={items} top={128} />
          </div>
        </section>
      ) : (
        article
      )}
    </>
  )
}
