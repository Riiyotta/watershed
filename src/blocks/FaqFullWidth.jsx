import { useState } from 'react'
import { ChevronDown } from '../components/Icons.jsx'
import SectionHeader from './SectionHeader.jsx'
import { SmartLink } from './ui.jsx'

// §3.31 FaqFullWidth (compare): 952-wide items, first open, proof line under each answer.
// 390 (measured /compare/workiva): header → list 27; trigger padding 16 0, gap 11, question 16/20 600 -0.48;
// answer 13/19.5 (padding-bottom 16, gap 13); proof 10/15 with padding-top 11, gap 3.
export default function FaqFullWidth({ title, items = [] }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="px-4 py-16 md:px-6 md:py-section">
      <SectionHeader title={title} centered />
      <div className="mx-auto mt-[27px] max-w-[952px] md:mt-10">
        {items.map((it, i) => {
          const isOpen = open === i
          return (
            <div key={it.q} className="border-t border-line-light">
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-[11px] py-4 text-left md:gap-4 md:py-6">
                <span className="text-md font-semibold leading-5 tracking-[-0.48px] text-ink md:text-xl md:leading-[26.25px] md:tracking-[-0.63px]">{it.q}</span>
                {/* MOTION: caret rotate .25s cubic-bezier(.85,0,.15,1) */}
                <ChevronDown className={`shrink-0 text-midnight ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* MOTION: grid-template-rows .3s cubic-bezier(.85,0,.15,1) */}
              <div className={`grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-[13px] pb-4 md:gap-5 md:pb-6">
                    <p className="text-[13px] font-normal leading-[19.5px] tracking-[-0.13px] text-ink-secondary md:text-md md:leading-6 md:tracking-[-0.16px]">{it.a}</p>
                    {it.proof && (
                      <p className="border-t border-line-light pt-[11px] text-[10px] leading-[15px] text-ink-secondary md:pt-4 md:text-xs md:leading-[18px]">
                        Proof ·{' '}
                        <SmartLink to={it.proof.to} className="underline">
                          {it.proof.label}
                        </SmartLink>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
