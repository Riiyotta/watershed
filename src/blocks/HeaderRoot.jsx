import { Nudge, SmartLink, VideoMedia } from './ui.jsx'

// §3.32 Header.root (/partners): arched blob with a soft #ebf0ff halo. Measured 1440: blob 580 (padding 24);
// eyebrow Sans 14/20 400 uppercase cobalt, LEFT-aligned → H1 45/49.5 400 -1.35 (12) → body 20/30 (20) → link row
// (36; 1px #5d93ff top rule, padding-top 12, Mono 14/20 -0.14). Below the blob the live page embeds a video
// (586x330 on black, padding 32, 30 below the blob): placeholder here, no embed. 390 unmeasured: blob full width.
export default function HeaderRoot({ eyebrow, title, body, link, video = true }) {
  return (
    <header className="overflow-hidden pb-[46px] pt-12 md:pt-[72px]" style={{ background: 'linear-gradient(#ebf0ff, #fff)' }}>
      <div className="container-ws flex flex-col items-center">
        <div className="flex w-full max-w-[580px] flex-col items-center p-6 text-center" style={{ background: '#ebf0ff', borderRadius: '50% 50% 100px 100px', boxShadow: '#ebf0ff 0 0 720px 90px' }}>
          <p className="w-full text-left text-xs uppercase leading-[18px] tracking-[normal] text-cobalt md:text-sm md:leading-5">{eyebrow}</p>
          <h1 className="mt-3 text-[32px] font-normal leading-[35.2px] tracking-[-0.96px] text-ink-secondary md:text-[45px] md:leading-[49.5px] md:tracking-[-1.35px]">{title}</h1>
          <p className="t-lead mt-5 text-left">{body}</p>
          {link && (
            <div className="mt-9 border-t border-[#5d93ff] pt-3">
              <SmartLink to={link.to} className="b-text-mono !leading-5">
                {link.label}
                <Nudge />
              </SmartLink>
            </div>
          )}
        </div>
        {video && (
          <div className="w-full max-w-[1092px] pt-[30px]">
            <VideoMedia slot="company.partners.video" tone="dark" className="mx-auto aspect-[586/330] w-full max-w-[586px] bg-black" />
          </div>
        )}
      </div>
    </header>
  )
}
