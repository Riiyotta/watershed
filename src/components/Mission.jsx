import { Link } from 'react-router-dom'
import { ArrowRight } from './Icons.jsx'
import { href } from '../routing.js'
import Media from './Media.jsx'

// §2.9 Mission (dark split).
export default function Mission() {
  return (
    <section className="grid grid-cols-1 bg-night md:grid-cols-2">
      {/* Left content panel */}
      <div className="relative flex items-center overflow-hidden bg-mission py-16 pl-4 md:h-[960px] md:py-0 md:pl-0 lg:h-auto wide:h-[960px]">
        <div aria-hidden="true" className="tex-dither-dark absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute left-[-360px] top-0 h-[739px] w-[720px] lg:left-[-50%] lg:h-[658px] lg:w-full wide:left-[-360px] wide:h-[739px] wide:w-[720px]"
          style={{ background: 'radial-gradient(at 30% 20%, rgba(38,92,255,.2) 0%, transparent 70%)' }}
        />
        {/* Inner box aligned to the 1200 container (x120 at 1440) */}
        <div className="relative flex w-[calc(100%-21px)] flex-col gap-8 border-l border-dashed border-cobalt-40 px-4 pb-4 pt-8 md:ml-6 md:h-[768px] md:w-[calc(100%-48px)] lg:mx-8 lg:my-24 lg:h-auto lg:w-[calc(100%-64px)] lg:max-w-[616px] lg:justify-start lg:gap-12 wide:my-0 wide:ml-[max(24px,calc(50vw-600px))] wide:h-[768px] wide:w-[568px] wide:justify-between wide:gap-0 md:justify-between md:gap-0 md:px-6 md:pb-6 md:pt-[192px]">
          <div className="flex flex-col gap-[11px] md:gap-4">
            <p className="t-eyebrow leading-[15px] text-cobalt-40 md:leading-[17.5px]">Our mission</p>
            <h2 className="text-2xl font-normal leading-[28.08px] tracking-headline text-gray-10 md:text-5xl md:leading-[42.12px]">
              Building the low-carbon
              <br className="hidden md:block" /> economy
            </h2>
          </div>
          <div className="flex flex-col gap-6 md:gap-9">
            <p className="text-sm font-medium leading-[19.6px] tracking-normal text-gray-10 wide:w-[519px] md:text-lg md:leading-[25.2px]">
              We want to help build an economy where climate work is part of everyday business. Good climate data supports better choices
              about energy, materials and suppliers, and those choices add up to real value. Northwind gives organisations the tools to make
              that shift simple, quick and dependable, with an aim of helping customers cut hundreds of millions of tonnes of carbon by 2030.
            </p>
            <Link to={href('/about-us')} className="t-mono-link self-start leading-[15px] text-cobalt-40 hover:opacity-80 md:leading-[17.5px]">
              Learn more <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Right media panel (B11) with gold dot-grid overlay */}
      <div className="relative h-[320px] overflow-hidden md:h-[960px] lg:h-auto wide:h-[960px]">
        <Media slot="home.mission.photo" alt="Wind turbines at sunset" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 mix-blend-multiply" style={{ backgroundImage: 'var(--dot-grid-gold)', backgroundSize: '3px 3px' }} />
      </div>
    </section>
  )
}
