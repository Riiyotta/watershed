import './primitives.css'
import Media from '../components/Media.jsx'
import { EmailCatcher } from './Form.jsx'

// §2.8 InlineCtaForm. variant 'outline' (feeds, blog) has corner brackets; 'filled' (compare) has a right-half image.
export default function NewsletterBand({
  title = 'Stay in the loop',
  description = 'Get a short monthly note from Northwind with new guides, product notes and practical ideas for climate teams.',
  buttonLabel = 'Sign up',
  variant = 'outline',
  className = '',
}) {
  const outline = variant === 'outline'
  return (
    <section className={`overflow-x-clip px-4 py-[43px] md:px-6 md:py-16 ${className}`}>
      <div
        className={`relative mx-auto grid max-w-[1152px] grid-cols-1 items-end gap-8 px-[21px] py-8 md:grid-cols-2 md:gap-12 md:p-12 ${
          outline ? 'border border-line' : 'overflow-hidden rounded-btn bg-gray-10'
        }`}
      >
        {outline ? (
          <>
            <span aria-hidden="true" className="cta-corner tl" />
            <span aria-hidden="true" className="cta-corner tr" />
            <span aria-hidden="true" className="cta-corner bl" />
            <span aria-hidden="true" className="cta-corner br" />
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
            <Media slot="cta.inline.filled" tone="cool" className="h-full w-full" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #f5f7fa, transparent 60%)' }} />
          </div>
        )}
        <div className="relative">
          <h2 className="mb-[11px] text-2xl font-medium leading-[30px] tracking-[-0.72px] text-ink md:mb-4 md:text-5xl md:leading-[45px] md:tracking-[-1.08px]">{title}</h2>
          <p className="text-sm font-medium leading-[21px] text-ink-secondary md:text-lg md:leading-[27px]">{description}</p>
        </div>
        <EmailCatcher buttonLabel={buttonLabel} label="Your work email address" className="relative" />
      </div>
    </section>
  )
}
