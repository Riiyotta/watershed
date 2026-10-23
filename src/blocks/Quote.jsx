import { useState } from 'react'
import Media from '../components/Media.jsx'
import PlaceholderLogo, { LOGOS } from '../components/PlaceholderLogo.jsx'
import { CircleArrows, QuoteMark } from './ui.jsx'

// §3.6 Quote: logo tile + serif quote. Several quotes → nav arrows. 390: centred stack.
export default function Quote({ quotes = [], slotPrefix = 'product.quote' }) {
  const [i, setI] = useState(0)
  const q = quotes[i] ?? quotes[0]
  if (!q) return null
  const logo = LOGOS[(q.logo ?? i) % LOGOS.length]
  return (
    <section className="py-16 md:py-section lg:py-20 wide:py-section">
      <div className="mx-auto max-w-[1200px] px-2 md:px-6 lg:px-5 wide:px-6">
        <div className="flex flex-col items-center gap-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:gap-y-10 wide:gap-x-12">
          {/* Logo tile 352 (inner 328, padding 40); 390: 240 (inner 216, padding 28) */}
          <div className="w-[240px] p-3 lg:col-span-4 lg:w-[315px] lg:justify-self-center wide:w-[352px]">
            <div className="aspect-square rounded-btn border border-[rgba(36,38,51,.1)]">
              <div
                className="flex h-full w-full items-center justify-center p-7 md:p-10 lg:p-8 wide:p-10"
                style={{
                  background:
                    'linear-gradient(#fff 16%, rgba(255,255,255,.89) 39%, rgba(255,255,255,.71) 57%, transparent 100%), radial-gradient(circle at 0% 100%, #c1d2fe, #f5f8ff 70%)',
                }}
              >
                <PlaceholderLogo logo={logo} height={49} className="max-w-[144px] text-midnight" />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-8 pt-4 lg:col-span-8 lg:pt-0 wide:max-w-[752px]">
            {/* MOTION: quote swap opacity .2s */}
            <div className="flex gap-4">
              <QuoteMark />
              <blockquote className="b-quote tracking-[normal]">“{q.text}”</blockquote>
            </div>
            <div className="flex items-center justify-between gap-4 lg:pl-[49px]">
              <div className="flex items-center gap-4">
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/15">
                  <Media slot={`${slotPrefix}.avatar.${i}`} tone="neutral" className="h-11 w-11 rounded-full" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[13px] font-semibold leading-[15.6px] tracking-[normal] text-[#333e63] md:text-md md:leading-[19.2px]">{q.name}</span>
                  <span className="text-xs font-medium leading-[14.4px] tracking-[normal] text-[#6e7786] md:text-sm md:leading-[16.8px]">{q.role}</span>
                </span>
              </div>
              {quotes.length > 1 && <CircleArrows index={i} max={quotes.length - 1} setIndex={setI} gap="gap-3" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
