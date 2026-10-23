import { Link } from 'react-router-dom'
import { ArrowRight } from './Icons.jsx'
import { href } from '../routing.js'
import Media from './Media.jsx'

// §2.8 Stats card.
const STATS = [
  { value: '3.8Gt', label: 'emissions tracked on the platform' },
  { value: '24', label: 'staff on industry standards working groups' },
  { value: '37', label: 'advisers across science, policy, finance and supply chain roles worldwide' },
  { value: '70+', label: 'published research contributions' },
]

export default function Stats() {
  return (
    <section>
      <div className="container-ws flex flex-col gap-8 py-[43px] md:gap-12 md:py-section lg:py-20 wide:py-section">
        <h2 className="text-2xl font-normal leading-[30px] tracking-headline text-ink md:max-w-[850px] md:text-5xl md:leading-[45px] lg:text-[30px] lg:leading-[37.5px] lg:tracking-[-0.9px] wide:text-5xl wide:leading-[45px] wide:tracking-headline">
          Sharing our research to improve
          <br className="hidden md:block" /> climate data everywhere
        </h2>

        <div className="overflow-hidden rounded-btn border border-line bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.value}
                className={`flex flex-col gap-2 border-line p-[11px] md:gap-4 wide:h-[194px] md:border-b-0 md:p-6 lg:gap-[14px] lg:p-5 wide:gap-4 wide:p-6 ${i < 2 ? 'border-b' : ''} ${i % 2 === 0 ? 'border-r' : ''} md:border-r ${i === 3 ? 'md:border-r-0' : ''}`}
              >
                <p className="text-[40px] font-light leading-[40px] tracking-[-1.2px] text-cobalt md:text-7xl md:leading-[48px] md:tracking-[-1.92px] lg:text-[56px] lg:leading-[56px] lg:tracking-[-1.68px] wide:text-9xl wide:leading-[72px] wide:tracking-[-2.88px]">{s.value}</p>
                <p className="text-[13px] font-normal leading-[15.6px] text-ink-secondary md:text-md md:leading-[19.2px] lg:text-[15px] lg:leading-[18px] lg:tracking-[-0.15px] wide:text-md wide:leading-[19.2px] wide:tracking-normal">{s.label}</p>
              </div>
            ))}
          </div>
          {/* Dither separator band: 14px border-box with 1px top + bottom rules (measured featureDitherBar) */}
          <div aria-hidden="true" className="-mt-px h-[14px] border-y border-line bg-cobalt-5" style={{ backgroundImage: 'radial-gradient(#c0d0f0 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
          <div className="grid grid-cols-1 md:grid-cols-2 wide:h-[288px]">
            <div className="h-[178px] md:h-full md:min-h-[288px] lg:min-h-0 wide:min-h-[288px]">
              <Media slot="home.stats.diagram" alt="Diagram: two data sources linked through a shared hub" fit="contain" className="block h-full w-full" />
            </div>
            <div className="flex flex-col justify-center gap-[13px] p-[11px] md:gap-8 md:p-6 lg:gap-[26px] lg:p-5 wide:gap-8 wide:p-6">
              <h3 className="text-sm font-normal leading-[17.5px] tracking-headline text-ink md:text-lg md:leading-[22.5px] lg:text-md lg:leading-5 lg:tracking-[-0.48px] wide:text-lg wide:leading-[22.5px] wide:tracking-headline">Open Emissions Data Project</h3>
              <p className="text-[13px] font-normal leading-[19.5px] text-ink-secondary md:text-md md:leading-6 lg:text-[15px] lg:leading-[22.5px] lg:tracking-[-0.15px] wide:text-md wide:leading-6 wide:tracking-normal">
                A shared effort between universities, research groups and Northwind, the Open Emissions Data Project publishes free, high-quality
                climate data for companies, public bodies, researchers and other organisations around the world.
              </p>
              <Link to={href('/solutions/ceda')} className="t-mono-link">
                Explore the project <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
