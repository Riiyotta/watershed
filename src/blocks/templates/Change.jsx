import Media from '../../components/Media.jsx'
import PlaceholderLogo, { LOGOS } from '../../components/PlaceholderLogo.jsx'
import { CTABar } from '../../primitives/index.js'
import Quote from '../Quote.jsx'
import { Cta } from '../ui.jsx'
import { QUOTES } from '../../content/pages/kit.js'

// §3.34 ChangeTemplate (/change). Measured 1440 (live), top to bottom:
//  1. Hero 900: full-bleed photo, a 1176 logo row (68 tall), a 700x501 three-line wordmark at y 189, a 10/15 caption.
//  2. Statement 4328 (padding-bottom 80): a 3500-tall scroll runway with a sticky 60/66 400 -0.6 midnight statement,
//     then 35/42 500 -1.05 #666c80 paragraphs (gap 40) with white <mark> highlights (padding 3 6 2 4, midnight) and a
//     primary arrow button (172x44).
//  3. Bottom wrapper (padding-bottom 48): SectionTextBlock intro (752 column, 18/27 400, 580-wide title image),
//     Grid.itemsThree of 7 people (352 wide: photo 352x481, logo 158x32 (24), name 24/30 500 -0.72 (24),
//     role 16/24 (12); rows 48 apart), Quote.
//  4. Stats 4000: a scroll runway with a pinned 900-tall photo panel: two 371x273 boxes (2px cobalt border, padding
//     16 24; value 116/127.6 400 cobalt, label Mono 16/24 #658dfd, source Mono 14/21 #415591 with padding-top 40) and a
//     664-wide column of 26/31.2 600 white paragraphs with a cobalt "mark".
//  5. CTABar.
// Scroll-driven reveals (word fade, box parallax) are motion and not reproduced; the runways and pinned panels are.
const PEOPLE = [
  ['Jamie Cole', 'Co-founder and Chief Product Officer'],
  ['Mia Hart', 'Global Sustainability Lead'],
  ['Sofia Grant', 'ESG and Sustainability Lead'],
  ['Louis Marsh', 'Senior Manager, Sustainable Operations and ESG'],
  ['Rob Rowe', 'Chief Investment Officer, Head of Sustainability'],
  ['Marisa Fenn', 'Chief Supply Chain Officer, Head of Sustainability'],
  ['Arjun Patel', 'Global Head of Corporate Sustainability'],
]
const MARK = 'bg-white px-[6px] pb-[2px] pl-1 pt-[3px] tracking-[-0.35px] text-midnight [box-decoration-break:clone]'
const H4 = 'text-[24px] font-medium leading-[30px] tracking-[-0.72px] text-ink-secondary md:text-[35px] md:leading-[42px] md:tracking-[-1.05px]'

export default function Change() {
  return (
    <>
      <section className="relative h-[560px] overflow-hidden bg-white p-4 md:h-[900px] md:p-8">
        <Media slot="company.change.hero" tone="warm" className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto flex h-[68px] max-w-[1176px] items-center px-[22px]">
          <span className="text-[22px] font-semibold tracking-[-0.5px] text-white">Northwind</span>
        </div>
        <h1 className="relative mx-auto mt-10 w-fit text-[64px] font-semibold uppercase leading-[78px] tracking-[-0.02em] text-white md:mt-[89px] md:text-[128px] md:leading-[182px]">
          Change
          <br />
          <span className="pl-[0.8em]">climate</span>
          <br />
          change
        </h1>
        <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] font-normal uppercase leading-[15px] tracking-[0.3px] text-white">Image: placeholder artwork</p>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="h-[1600px] md:h-[3500px]">
            <p className="sticky top-[calc(50vh-198px)] text-[36px] font-normal leading-[40px] tracking-[-0.36px] text-midnight md:text-[60px] md:leading-[66px] md:tracking-[-0.6px]">
              Climate change is the greatest challenge of our time, and our greatest opportunity. We can meet it with fear and paralysis, or with the creativity and determination to build something better.
            </p>
          </div>
          <div className="flex flex-col items-start gap-10">
            <p className={H4}>
              At Northwind, <mark className={MARK}>we choose optimism</mark>. In the actions of the companies we work with, we see a future that is cleaner, fairer and more prosperous.
            </p>
            <p className={H4}>Northwind helps companies around the world measure, report and reduce their emissions with the speed and rigour that real progress requires. Every day, our customers prove that ambitious climate action is good business.</p>
            <p className={H4}>
              We are climate optimists and builders, and we believe in <mark className={MARK}>changing the story of climate change from one of loss to one of progress</mark>.
            </p>
            <div className="pt-[60px] md:pt-[80px]">
              <Cta label="Request a demo" to="/demo" arrow />
            </div>
          </div>
        </div>
      </section>

      <div className="pb-12">
        <section className="py-16 md:py-section">
          <div className="mx-auto flex max-w-[800px] flex-col gap-[18px] px-4 text-[18px] font-normal leading-[27px] tracking-[-0.18px] text-ink-secondary md:px-6">
            <p>Meet the</p>
            <p className="font-serif text-[36px] font-semibold uppercase leading-[44px] tracking-[-0.02em] text-midnight md:w-[580px] md:text-[64px] md:leading-[67px]">Changemakers</p>
            <p>
              Climate action needs creativity, determination and relentless optimism. Behind every corporate climate programme is a group of people pushing it forward.
              <br />
              <br />
              We call these individuals changemakers, and they are driving us towards a more sustainable future for businesses and the planet.
            </p>
            <p>Here are just a few of the leaders we are proud to support on their journey to change climate change.</p>
          </div>
        </section>
        <section className="py-16 md:py-section">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-4 md:grid-cols-3 md:px-6">
            {PEOPLE.map(([name, role], i) => (
              <div key={name} className="flex max-w-[352px] flex-col">
                <Media slot={`company.change.person.${i}`} tone="warm" className="aspect-[352/476] w-full" />
                <span className="mt-[29px] flex h-8 w-[158px] items-center">
                  <PlaceholderLogo logo={LOGOS[i % LOGOS.length]} height={22} className="text-midnight" />
                </span>
                <h2 className="mt-6 text-2xl font-medium leading-[30px] tracking-[-0.72px] text-ink">{name}</h2>
                <p className="mt-3 text-md font-medium leading-6 tracking-[-0.16px] text-ink-secondary">{role}</p>
              </div>
            ))}
          </div>
        </section>
        <Quote quotes={[QUOTES[3]]} slotPrefix="company.change.quote" />
      </div>

      <section className="relative h-[2400px] md:h-[4000px]">
        <div className="sticky top-0 h-[900px] overflow-hidden">
          <Media slot="company.change.hero" tone="warm" className="absolute inset-0 h-full w-full" />
          <div className="relative mx-auto grid h-full max-w-[1200px] grid-cols-1 content-center gap-x-5 gap-y-20 px-4 md:grid-cols-[371px_664px] md:justify-between md:px-6">
            <div className="flex flex-col gap-4">
              {[
                ['1%', 'Global emissions reduced each year', 'Northwind goal'],
                ['1 Gt', 'estimated emissions under management', 'Northwind today'],
              ].map(([v, label, src]) => (
                <div key={v} className="border-2 border-cobalt bg-white/90 px-6 py-4">
                  <p className="text-[72px] font-normal leading-[80px] tracking-[-0.72px] text-cobalt md:text-[116px] md:leading-[127.6px] md:tracking-[-1.16px]">{v}</p>
                  <p className="font-mono text-md font-medium leading-6 tracking-[-0.16px] text-cobalt-40">{label}</p>
                  <p className="pt-10 font-mono text-sm font-medium leading-[21px] tracking-[-0.14px] text-[#415591]">{src}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-10 self-center">
              <p className="text-[22px] font-semibold leading-[28px] tracking-[-0.26px] text-white md:text-[26px] md:leading-[31.2px]">
                <mark className="bg-cobalt px-1 text-white">Our mission</mark> is to help remove a meaningful share of global emissions every year, the equivalent of taking millions of cars off the road, by giving companies the data they need to act.
              </p>
              <p className="text-[22px] font-semibold leading-[28px] tracking-[-0.26px] text-white md:text-[26px] md:leading-[31.2px]">Through our customers, Northwind already supports emissions reporting and reduction across a footprint larger than many national economies.</p>
            </div>
          </div>
        </div>
      </section>

      <CTABar title="Let's work together to change climate change" label="Request a demo" />
    </>
  )
}
