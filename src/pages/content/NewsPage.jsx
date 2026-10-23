import { CoverageRow, ReleaseRow, SidebarList, SidebarSection, ToggleList } from '../../primitives/index.js'
import { COVERAGE, RELEASES } from '../../content/news.js'

// §2.4 /news: coverage list (10 + "show more") then press releases.
export default function NewsPage() {
  const nav = [
    { label: 'News coverage', target: 'news-coverage', current: true },
    { label: 'News releases', target: 'news-releases' },
  ]
  return (
    <SidebarList title="News" nav={nav} mobileTabs={nav} notice={<>Contact our press team:<br />press@northwind.example</>}>
      <SidebarSection id="news-coverage" heading="News coverage" hideHeading first>
        <ToggleList items={COVERAGE} initial={10} label="See all news coverage" render={(c) => <CoverageRow key={c.title} {...c} />} />
      </SidebarSection>
      <SidebarSection id="news-releases" heading="News releases" hideHeading>
        {RELEASES.map((r) => (
          <ReleaseRow key={r.title} {...r} />
        ))}
      </SidebarSection>
    </SidebarList>
  )
}
