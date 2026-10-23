import { useState } from 'react'
import { ArrowRight } from '../components/Icons.jsx'
import Media from '../components/Media.jsx'

// §3.28 PersonnelSlider (/solutions/ceda): bg #fff; header column (title 36/42.12 400 552 wide, paragraphs 16/24 400,
// gaps 24, normal tracking), filled cobalt 40x40 circle controls; header → cards 48; full-bleed row of 240 cards
// (gap 16, padding 0 144).
export default function PersonnelSlider({ title, paras = [], people = [], slotPrefix = 'product.people' }) {
  const [i, setI] = useState(0)
  const max = Math.max(0, people.length - 4)
  return (
    <section className="bg-white py-16 md:py-section">
      <div className="container-ws grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1fr)_88px] lg:gap-8 xl:grid-cols-[1032px_88px]">
        <div className="flex flex-col gap-6">
          <h2 className="max-w-[552px] text-2xl font-normal leading-[28px] tracking-[normal] text-ink md:text-5xl md:leading-[42.12px]">{title}</h2>
          {paras.map((p) => (
            <p key={p} className="max-w-[520px] text-md font-normal leading-6 tracking-[normal] text-ink-secondary">
              {p}
            </p>
          ))}
        </div>
        <div className="flex gap-2">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d < 0 ? 'Previous' : 'Next'}
              onClick={() => setI((v) => Math.min(max, Math.max(0, v + d)))}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cobalt text-white hover:opacity-80"
            >
              <ArrowRight className={d < 0 ? 'rotate-180' : ''} />
            </button>
          ))}
        </div>
      </div>
      <div className="no-scrollbar mt-10 overflow-x-auto md:mt-12 lg:overflow-hidden">
        {/* MOTION: keen-slider transform on index change */}
        <div className="flex gap-4 px-4 lg:px-36 lg:[transform:translateX(var(--psx))]" style={{ '--psx': `${-i * 256}px` }}>
          {people.map((p, n) => (
            <div key={p.name} className="w-[240px] shrink-0 border border-line bg-white">
              <Media slot={`${slotPrefix}.${n}`} tone="neutral" className="h-[240px] w-full bg-gray-20" />
              <div className="flex flex-col gap-1 p-4">
                <h3 className="text-lg font-normal leading-[22.5px] tracking-[normal] text-ink">{p.name}</h3>
                <p className="text-sm font-normal leading-[21px] tracking-[normal] text-ink-secondary">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
