import { useState } from "react";
import Media from "../components/Media.jsx";
import PlaceholderLogo, { LOGOS } from "../components/PlaceholderLogo.jsx";
import { CircleArrows, VideoLink } from "./ui.jsx";

// §3.17 CustomerPhotoFeature. Measured 1440: section padding 96 + container padding 24; header (H2 36/45, max 752;
// VideoLink right) → cards 48. Cards 379x505 (pitch 387, padding 24, logo top-left, metric 64/64 300, caption
// 16/19.2 rgba(255,255,255,.8) 240 wide, optional Serif 18/22.5 quote). More than 3 cards: keen-slider with 40x40
// prev/next below the cards (gap 24, left-aligned). `columns: 4` (/platform/sustainability-ai): four 282x376 cards.
// 390 (/platform/act): section padding 32 0 64, container padding 16, header → cards 32, 2-column grid (177x235,
// gap 5), card padding 16, metric 36/36 -1.08, caption 13/15.6, H2 22/27.5 -0.66.
export default function CustomerPhotoFeature({
  title,
  videoLabel = "Watch the stories",
  cards = [],
  columns,
  slotPrefix = "product.cpf",
}) {
  const [i, setI] = useState(0);
  const four = columns === 4;
  const slider = !four && cards.length > 3;
  return (
    <section className="pb-16 pt-8 md:py-section">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 p-4 md:gap-12 md:p-6">
        {/* /compare renders the cards with no header */}
        {title && (
          <header className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-8">
            <h2 className="max-w-[752px] text-[22px] font-medium leading-[27.5px] tracking-[-0.66px] text-ink md:text-[36px] md:leading-[45px] md:tracking-[-1.08px]">
              {title}
            </h2>
            {videoLabel && <VideoLink label={videoLabel} />}
          </header>
        )}
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden">
            {/* MOTION: keen-slider transform on index change */}
            <div
              className={`grid grid-cols-2 gap-[5px] lg:flex lg:gap-2 ${slider ? "lg:[transform:translateX(calc((100%+8px)/-3*var(--cpi)))] xl:[transform:translateX(var(--cpx))]" : ""}`}
              style={{ "--cpx": `${-i * 387}px`, "--cpi": i }}
            >
              {cards.map((c, n) => (
                <article
                  key={n}
                  className={`relative flex aspect-[177/235] flex-col justify-between overflow-hidden rounded-btn p-4 md:p-6 lg:shrink-0 xl:aspect-auto ${four ? "lg:aspect-[282/376] lg:w-[calc((100%-24px)/4)] xl:h-[376px] xl:w-[282px]" : "lg:aspect-[379/505] lg:w-[calc((100%-16px)/3)] xl:h-[505px] xl:w-[379px]"}`}
                >
                  <Media
                    slot={`${slotPrefix}.${n}`}
                    tone={["dark", "warm", "cool", "neutral"][n % 4]}
                    className="absolute inset-0 h-full w-full"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(rgba(4,18,47,0) 33%, rgba(4,18,47,.25) 55%, rgba(4,18,47,.5) 75%, rgba(4,18,47,.68) 100%)",
                    }}
                  />
                  <PlaceholderLogo
                    logo={LOGOS[(n + 2) % LOGOS.length]}
                    height={25}
                    className="relative max-w-[125px] text-white"
                  />
                  <div className="relative flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-col gap-[5px] md:gap-2">
                      <p className="text-[36px] font-light leading-[36px] tracking-[-1.08px] text-white md:text-8xl md:leading-[64px] md:tracking-[-1.92px]">
                        {c.metric}
                      </p>
                      <p className="max-w-[240px] text-[13px] font-medium leading-[15.6px] tracking-[-0.13px] text-white/80 md:text-md md:leading-[19.2px] md:tracking-[-0.16px]">
                        {c.caption}
                      </p>
                    </div>
                    {c.quote && (
                      <blockquote className="hidden font-serif text-lg font-normal leading-[22.5px] tracking-[-0.54px] text-white md:block">
                        “{c.quote}”
                      </blockquote>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
          {slider && (
            <CircleArrows
              index={i}
              max={cards.length - 3}
              setIndex={setI}
              gap="gap-0"
              className="hidden lg:flex"
            />
          )}
        </div>
      </div>
    </section>
  );
}
