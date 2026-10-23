Source: https://watershed.com/en-GB

# Watershed homepage: clone spec (design system, layout, motion)

Measured live with Playwright on 2026-10-23 at **1440x900** (desktop) and **390x844** (mobile), using getComputedStyle, getBoundingClientRect, document.getAnimations(), CSSOM rule dumps and timed sampling. All px values are computed values unless marked otherwise. Reference screenshots are in `reference/` (see the end of this file).

**Content rule:** this spec records roles, sizes, character and line counts only. Do NOT reproduce Watershed copy, photos, illustrations, customer logos, award badges or the Watershed wordmark/globe mark. Use lorem/placeholder copy of the same length and same-size placeholder blocks (see `ASSET_MANIFEST.md`).

Page height: 9187px at 1440 and 10486px at 390. Body background is `#fff`. Source stack: Next.js with CSS modules, Radix NavigationMenu, keen-slider (carousels), Unicorn Studio WebGL (2 canvases), HubSpot forms. No GSAP, Lenis, Lottie or `<video>` on this page.

---

## 0. Global tokens (taken from the site's `:root` custom properties)

### Breakpoints
- Declared tokens: `sm 480`, `md 768`, `lg 1024`, `xl 1200`.
- Media queries used most on this page: `max-width:767px`, `min-width:768px`, `min-width:1024px`, `max-width:1023px`, `min-width:820px`, `min-width:1280px`, `(hover:hover)`, `prefers-reduced-motion`.
- Mobile layout applies below 768px. Tablet (768-1023px) is in between and was not measured.

### Container
- `--container-width: 1200px`, `--padding: 16px`, `--padding-inline: 32px`.
- Desktop: the `.container` is 1200px wide and centred (x=120 at 1440). It has 24px inline padding, so the **content width is 1152px (x 144 to 1296)**.
- Mobile: content is 358px wide with 16px side padding.

### Spacing scale (px)
- Named steps: 2xs 12, xs 16, sm 32, md 48, lg 80, xl 128, 2xl 208.
- Numeric steps: 0 1 2 4 6 8 10 12 14 16 20 24 28 32 36 40 44 48 56 64 80 96 112 128 144 160 176 192 208 224 240.
- Section padding: tight 64, default 96, open 128.

### Font-size scale (px)
| Token | Size |
|---|---|
| 2xs | 10 |
| xs | 12 |
| sm | 14 |
| md | 16 |
| lg | 18 |
| xl | 21 |
| 2xl | 24 |
| 3xl | 28 |
| 4xl | 32 |
| 5xl | 36 |
| 6xl | 42 |
| 7xl | 48 |
| 8xl | 64 |
| 9xl | 72 |
| 10xl | 96 |
| 11xl | 128 |
| 12xl | 160 |

- Line heights: 1, 1.25, 1.5.
- Tracking: display -0.04em, headline -0.03em, normal -0.01em, mono 0, mono-caps 0.12em.
- Mono font features: `"ss03","ss06","ss08","ss09"` on (plus `"tnum"` on the hero ticker).

### Colour tokens
| Token | Value | Use |
|---|---|---|
| text-headline | #131b24 | |
| text-primary | #242633 | Headings and body on light backgrounds |
| text-secondary | #666c80 | Paragraphs and subcopy |
| text-disabled / placeholder | #7a8499 | |
| cobalt-core (primary) | #265cff | CTAs, eyebrows, stat numbers |
| cobalt-70 (hover) | #1246e0 | |
| cobalt-100 (pressed) | #032ca5 | |
| cobalt-5 | #f5f8ff | Light band backgrounds |
| cobalt-10 | #e3ebff | |
| cobalt-20 | #c1d2fe | |
| cobalt-30 | #93aeff | |
| cobalt-40 | #658dfd | |
| cobalt-60 | #4a6fff | |
| midnight | #0b2471 | |
| navy-100 | #0b1d45 | |
| core-gray-100 (dark bands) | #041330 | |
| gray-10 | #f5f7fa | |
| gray-20 | #e5e9f0 | |
| gray-30 | #d1d8e5 | |
| border-default | #c0d0f0 | Card and grid lines |
| border-light | #e6ebf5 | Nav, inputs |
| border-soft | #dae3ff | |
| background-light | #f5f7fa | |
| background-xlight | #fbfcfd | |
| Accents | tangerine #ff9966, poppy #ff6633, teal #1b7a5a, forest #1d7368, slate block #232c40 | Hero colour blocks |
| Footer | slate-900 #0f172a, slate-300 #cbd5e1, slate-400 #94a3b8, slate-50 #f8fafc, sky-300 #7dd3fc | Footer text and links |
| alpha-dark-N | `#041330` at alpha 0a, 14, 1f, 29, 3d, 52, 66, 7a, a3, b8, cc, f5 | |
| alpha-light-N | white at the same alpha steps | |

### Radii and shadows
- The site is almost square-cornered. Radii: buttons 2px, inputs 2px (left side only on joined fields), images in cards 5px, nav dropdown panel 8px, glass prompt card 10px, chips 24px.
- Nav dropdown shadow: `0 32px 32px 1px rgba(4,19,48,.16), 0 16px 16px 1px rgba(4,19,48,.10), 0 8px 8px 1px rgba(4,19,48,.08), 0 4px 4px 1px rgba(4,19,48,.04), …`
- Award badge shadow: `0 12px 24px rgba(12,13,17,.15)`.
- Glass panel: `--glass-blur: 4px`. Inset edge shadow: `inset 0 1px 0 rgba(255,255,255,.12), inset 1px 0 0 rgba(255,255,255,.10), 0 0 0 1px rgba(255,255,255,.06)`.

### Textures, used across sections (recreate generically)
- **Noise SVG:** `feTurbulence fractalNoise baseFrequency .75 numOctaves 2`, desaturated, tile 160px. The footer version uses baseFrequency .8, opacity .42, tile 200px.
- **Dot grid:** `radial-gradient(circle, #041330 .5px, transparent 1.1px)` at 3.2px. The awards box uses `radial-gradient(rgba(218,227,255,.32) 1px, transparent 1px) / 4px 4px`. The mission photo overlay uses `radial-gradient(circle, rgba(212,168,85,.45) .75px, transparent .75px) / 3px 3px` with blend mode multiply.
- **Dither PNG:** a pixel-dither mountain texture (`/img/dither-pattern.png`, 750px wide).
  - Logo tiles and flank blocks use it with `background-blend-mode: multiply` over #f5f8ff, at different offsets per tile.
  - A separate dark dither texture is used on product, agents and mission bands, with `background-size: 80px auto` and `mix-blend-mode: soft-light`.
  - Replace both with your own dither/noise PNG.
- `--mask-smooth-fade`: a 16-stop eased linear-gradient mask (black at 0% to transparent at 100%).

### Global motion tokens
| Token | Value |
|---|---|
| --duration-hover | .12s |
| --duration-accordion | .3s |
| --duration-accordion-icon | .25s |
| --ease-accordion | cubic-bezier(.85,0,.15,1) |
| --duration-zoom | .4s |
| --ease-zoom | cubic-bezier(.215,.61,.355,1) |
| Nav and link "expo-out" | cubic-bezier(.22,1,.36,1) |
| Mobile menu | cubic-bezier(.4,0,.2,1) |

- **There are no scroll-triggered reveal animations.** I wrapped IntersectionObserver before scrolling and no observers were created. Every section's content is at opacity 1 on load. Do not add fade-up reveals.
- Every animation has a `prefers-reduced-motion: reduce` fallback. Carets stop, marquee and promo scroll stop, and the logo flip becomes a plain opacity change.

---

## 1. Typography

### Families loaded (@font-face, all woff2, `font-display: swap`)
| CSS family | Files / weights loaded | Role | Licence | Open-source substitute |
|---|---|---|---|---|
| `messinaSans` (also referenced as "Messina Sans") | MessinaSansWeb Light 300, Book 400, Regular 500, SemiBold 600, Bold 700, RegularItalic 500i. On this page 300, 400, 500 and 600 are used; 700 and the italic are declared but never load. | All UI, headings and body | **Commercial** (Messina Sans, Luzi Type) | **Inter** (closest metrics; keep the negative tracking). Alternative: Figtree or Instrument Sans. |
| `mackinacPro` | P22 Mackinac Pro Book (400) and Medium (mapped to 700). Only 400 loads; the quote renders at weight 500, so the browser falls back to the 400 face. | Testimonial quote (serif display) | **Commercial** (P22 / IHI) | **Newsreader** (opsz ~24-36, weight 400). Alternative: Source Serif 4. |
| `GeistMono` | GeistMono Variable, 100-900 | Eyebrows, labels, stat captions, footer and mobile tags | **Open source** (SIL OFL, Vercel) | Use **Geist Mono** from Google Fonts directly. |
| `Crimson Text` | 400 and 400i (Google Fonts) | Declared but **not used** on the homepage (status unloaded) | Open source | Skip it. |

**Fallback stacks:**
- Sans: `messinaSans, "messinaSans Fallback"`. The fallback is Arial with metric overrides: ascent 90.68%, descent 23.03%, line-gap 18.95%, size-adjust 105.53%.
- Serif: `mackinacPro, "mackinacPro Fallback"`. The fallback is Arial with ascent 70.23%, descent 18.14%, line-gap 23.5%, size-adjust 106.37%.
- For the build, use `Inter, Arial, sans-serif`; `Newsreader, Georgia, serif`; and `"Geist Mono", ui-monospace, monospace`.
- Root `font-size: 20px` is only a variable. Body text renders at the explicit sizes below.

### Text roles

Values are desktop 1440 → mobile 390. Format is size/line-height, weight, letter-spacing, colour.

| Role | Family | Desktop | Mobile | Colour | Notes |
|---|---|---|---|---|---|
| Promo bar badge | Mono | 10/10, 500, -0.1px | (hidden) | #ffafd2 | Small pill, about 12 characters |
| Promo bar text | Sans | 13/19.5, 500, -0.13px | 12/18 | #f5f7fa | About 70 characters, 1 line. Marquee below 700px. |
| Promo bar link | Mono | 11/16.5, 500, -0.11px | same | #bec7da, hover #f5f7fa | Underlined, ends in "→" |
| Nav item | Sans | 16/28, 500, -0.4px | (in menu) 20/28, 500, -0.5px | #242633, hover cobalt | |
| Nav "Sign in" | Sans | 15/28, 500, -0.3px | 16 | #666c80 on #f5f7fa | |
| Nav primary CTA | Sans | 15/28, 500, -0.3px | 16 | #fff on #265cff | |
| Hero eyebrow ticker | Mono | 14/16.8, 400, -0.14px, tnum | 12/14.4 | #242633 | Each character is in a fixed 1ch inline-block |
| **H1** | Sans | **72/72, 500, -2.88px (-0.04em)** | **40/40, 500, -2.88px** | #242633 | About 6 words / 40 characters. 2 lines at both widths, `text-wrap: balance`, max width about 850px. |
| Hero subhead | Sans | 20/30, 500, -0.2px | 20/30 | #666c80 | About 81 characters. 1 line at 1440 (711px wide), 3 lines at 390. |
| Form input / label | Sans | 14, 500, -0.14px | 12 | placeholder #7a8499 | |
| Form legal | Sans | 12/18, 500, -0.12px | 10/15 | #666c80, link #265cff | About 109 characters, 2 lines |
| Hero form button | Sans | 16/24, 500 | 13/19.5 | #fff | |
| Image-composition caption | Mono | 14/16.8, 500 | 12/14.4 | #fff | About 36 characters, ends in "↘" (the arrow glyph is weight 250) |
| Logo-tile hover CTA | Mono | 12/12, 500, -0.12px | 10/10 | #265cff, hover #032ca5 | |
| Testimonial stat number | Sans | 72/86.4, **300**, -0.72px | 40/48 | #265cff | Followed by a "↘" in Mono weight 250 at the same size |
| Testimonial stat caption | Mono | 14/16.8, 500 | 12/14.4 | #666c80 | |
| **Testimonial quote** | **Serif** | **32/40, 500 (renders 400), -0.32px** | 22/27.5 | #242633 | About 18 words, 5 lines in a 351px-wide column. Each word is wrapped in its own span. |
| Section eyebrow | Mono | 14/20, 400, normal | 12/13 | #265cff (#658dfd on dark) | 2-4 words |
| H2, standard section title | Sans | 35/40.95, 500, -1.05px (-0.03em) | 28/32.76, -0.84px | #242633 | |
| H2, product (dark band) | Sans | 48/60, 500, -1.44px | 22/27.5, -0.66px | #fff | 4 words, 1 line |
| H2, agents | Sans | 36/42.12, 500, -1.08px | 24/28.08 | #242633 | 6 words, 2 lines |
| H2, stats | Sans | 36/45, **400**, -1.08px | 24/30 | #242633 | About 7 words, 2 lines, 850px wide |
| H2, mission | Sans | 36/42.12, 400, -1.08px | 24/28.08 | #f5f7fa | 4 words, 2 lines |
| H2, footer CTA | Sans | 48/52.8, 400, -1.92px (-0.04em) | 32/35.2 | #242633 | About 4 words, 1 line, centred |
| Lead paragraph (awards) | Sans | 20/30, 500, -0.2px | 20/30 | #666c80 | About 470 characters, 10 lines at 520px wide (14 lines on mobile) |
| Body large | Sans | 18/27, 500, -0.18px | 14/21 | #666c80 (rgba(255,255,255,.8) on dark) | |
| Mission body | Sans | 18/25.2, 500, -0.18px | 14/19.6 | #f5f7fa | About 410 characters, 7 lines at 519px |
| Step index ("01") | Sans | 18/21.6, 400 | same | #657eff | |
| Step title | Sans | 18/21.6, 400 | same | #fff | |
| Step description | Sans | 12/18, 500 | same | rgba(255,255,255,.8) | About 214 characters, 5 lines at 284px |
| Feature card title | Sans | 21/24.57, 500, -0.6px | 16/18.72 | #242633 | 2-4 words |
| Feature card description | Sans | 16/22.4, 400, -0.32px | same | #666c80 | About 80 characters, 2 lines |
| H3, agents feature | Sans | 21/24.57, 500, -0.63px | 14/16.38 | #242633 | |
| Agents feature description | Sans | 16/22.4, 500, -0.16px | 12/16.8 | #666c80 | |
| Prompt-bar text | Sans | 20/20, 600, -0.6px | 18/18 | #fff | |
| Prompt chip | Sans | 18/28, 600, -0.18px | 16/24 | #fff | |
| Stat value (stats band) | Sans | 72/72, **300**, -2.88px | 40/40, -1.2px | #265cff | |
| Stat caption | Sans | 16/19.2, 400, -0.16px | 13/15.6 | #666c80 | |
| H3, stats feature | Sans | 18/22.5, 400, -0.54px | 14/17.5 | #242633 | |
| Stats feature body | Sans | 16/24, 400 | 13/19.5 | #666c80 | |
| Mono text link with arrow | Mono | 14/16.8, 400 | 12/14.4 | #265cff (#658dfd on dark) | |
| Content card eyebrow | Mono | 14/20, 400 | 12/13 | #265cff | |
| Content card title (H3) | Sans | 21/26.25, 500, -0.63px | 16/20 | #242633 | About 100 characters, 3 lines at 352px |
| Content card "Read more" | Sans | 14/17.5, 400 | 12/15 | #265cff | Followed by an arrow icon |
| Button label | Sans | 16/24, 500, normal | 13/19.5 | | |
| Footer column title | Sans | 16/16, 400, -0.16px | same | #f8fafc | Hover #265cff |
| Footer link | Sans | 14/22, 400, -0.14px | same | #cbd5e1 | Hover #f8fafc |
| Footer "NEW" badge | Sans | 11/13.2, 500, +0.22px, UPPERCASE | same | #265cff | |
| Footer legal and copyright | Sans | 14/21, 500, -0.14px | same | #94a3b8 | Hover #f8fafc. Legal links are underlined. |
| Nav dropdown group heading | Mono | 13/16, 400, -0.26px | same | #7a8499 | |
| Nav dropdown link | Sans | 15/16, 600, -0.3px | same | #242633 | |
| Nav dropdown description | Sans | 13/14, 500, -0.13px | same | #666c80 | |
| Nav tag ("New" / "Explore") | Mono | 10/10, 400 | same | New: #1d7368 on #d7f7f4. Explore: #032ca5 on #c1d2fe. | Padding 3px 6px 4px, radius 2px |

---

## 2. Sections, top to bottom (desktop 1440; mobile notes after each)

Each line below gives the section name, its y-range at 1440 and its height.

### 2.1 Promo bar: y 0-40, height 40
- Full-bleed background `#041330` ("promo-dark"). Inner wrapper is 1200px wide.
- Prev/next chevrons (8x14 SVG, stroke #bec7da, hover stroke #f5f7fa, transition .15s) sit at x 145 and x 1289.
- Centre row: flex, gap 8px. Holds the badge, the text and the mono link.
- It is a carousel of offers (previous/next buttons). Auto-rotation was not observed during sampling.
- **Mobile:** 0-40, padding 0 16px, badge hidden. The text is clipped, and below 700px it scrolls as a marquee (see Motion §3.10).
- It scrolls away with the page (not sticky).

### 2.2 Nav: height 68 (border-box), `position: sticky; top: 0; z-index: 100`
- Starts at y 40 and sticks at 0.
- Background `rgba(255,255,255,.98)`, border `1px solid #e6ebf5` (bottom visible), box-shadow `0 1px 0 rgba(0,0,0,.05)`. No backdrop-filter.
- It is always in this opaque state (class `isOpaque isSticky isV2`). Scrolling down or up does not hide it, change its background or shrink it. I checked at scrollY 0/50/200/600/1500/1200/800/0.
- Inner row: 1200px container (x 120-1320) with 24px padding, height 67, flex, space-between.
  - **Logo** at x 144, 148x30 (SVG viewBox 131x28; the mark stroke uses `--color-logo` = cobalt). Use a placeholder wordmark.
  - **Menu list:** `ul` flex, gap 10px, starting at x 316. Items are buttons: Product 96x40, Resources 114x40, Company 109x40, then a "Customers" link 98x40. Padding 6px 10px, radius 2px. Dropdown triggers have a chevron (margin-left 4px) that rotates -180° when open (transition .25s).
  - **Actions:** "Sign in" 80x36 (bg #f5f7fa, 1px #e6ebf5 border, padding 0 16px, radius 2px, margin-right 10px) at x 1087. "Book a demo" 119x36 (bg #265cff, white, radius 2px) at x 1177, ending at x 1296.
- Hover/open states:
  - Nav items: background #f5f7fa, colour #242633. Links transition `color .5s cubic-bezier(.22,1,.36,1), background-color .5s same`.
  - Primary CTA: background #1246e0 (cobalt-70).
  - Secondary CTA: background #e5e9f0.
- **Mobile:**
  - Logo at x 16. The hamburger is a 40x40 button at x 334 (bg #f5f7fa, 1px #e6ebf5 border, radius 2px). Its lines transition `transform .2s, opacity .2s` into an X.
  - Desktop list and actions are hidden.

### 2.3 Hero (`header`): y 108-1554, height 1446
- Root: `padding-top 80px`. Background `linear-gradient(#fff 40%, #f5f8ff 75%, #f5f8ff 100%)`.

**(a) Hero with background: y 108-887 (779 tall)**
- Background is a full-bleed **WebGL canvas (Unicorn Studio scene)**, 1440x779 (backing store 2160x1169). It renders a pale-blue dithered mountain-range image with an animated dither/shader effect. It sits inside an absolutely positioned 100vw wrapper; the static fallback `<img>` is translated `translateY(7%)`.
- **Not measurable:** the canvas internals (canvas-rendered). Rebuild it as a static pale-blue dithered landscape placeholder, optionally with a subtle CSS noise shimmer.

**Hero grid:** container 1200 (x 120) with 24px padding. `.homeHero` is a grid with columns `896px 224px`, gap 32px, at y 188 and 375 tall. Only the left column holds content.

Left column: flex column, gap 24px, padding-top 8px. From the top:
1. **Eyebrow ticker** (y about 196, 17px tall). It contains:
   - an 8x8 square dot whose colour changes per message (#265cff / #93aeff);
   - mono text, 30-45 characters, one line;
   - an 8px gap between dot and text.
2. **H1** at y 237, 850x144, 2 lines.
3. **Subhead** at y 405, 711x30, 1 line.
4. **Email form** at y 459, 452x104. It is a grid with columns `276px 176px`, row gap 16px.
   - The input (272x44, padding 10px 16px, border 1px #e6ebf5 with no right border, radius 2px 0 0 2px, bg #fff) is joined to the button "Request a demo" (172x44, bg #265cff, radius 0 2px 2px 0, padding 10px 36px 10px 16px, with a 14px white arrow SVG as background at `right 16px center`).
   - The legal text spans both columns, 452px wide, 2 lines.
   - The form sits on a frosted glass pill: `::before` with fill `color-mix(cobalt-30 8%)`, `backdrop-filter: blur(4px)`, edge `inset 0 1px 0 #fff9, 0 0 0 1px #0413300f`, plus 4px of inset margin around the field.
   - A soft cobalt glow sits under the form (desktop): gradient #e3ebff → #658dfd at 80% alpha, `blur(36px)`, translateY 24px. It is visible in the screenshot.

**Image composition:** y 563-887, 1152x324, `position: relative`. Colour blocks are absolutely positioned on a 192x108 module grid (the hero image is 576x324 = 3x3 modules):
| Block | Box (x,y,w,h) | Colour | z |
|---|---|---|---|
| Caption block (slate) | 144,779,384,108 | #232c40, padding 16px, mono caption bottom-left | 2 |
| Tangerine | 528,779,192,108 | #ff9966 | |
| Cobalt-40 | 528,671,192,108 | #658dfd | |
| **Hero product image** | 720,563,576,324 | #232c40 bg, radius 2px, overflow hidden, img `object-fit: cover` | 2 |
| Teal | 1104,449,192,114 | #1b7a5a | 2 |
| Cobalt | 1104,563,192,108 | #265cff | |
| Poppy (bleeds past the container) | 1296,671,192,108 | #ff6633 | |

- Inside the hero image there is a prompt-bar overlay (pill with icon and text, Sans 16.8px 600, caret blink). The overlay is part of the bitmap/HTML composite; on mobile it is an HTML overlay (`heroPromptOverlay`, padding 0 9px 0 26px). Treat it as a placeholder image plus a small HTML pill with a blinking caret (1px x 1em, #242633).

**(b) Social proof: y 887-1554 (667 tall)**
- Background #f5f8ff, padding-bottom 64px.

**Logo grid:** x 144, 1152x205.
- Grid of 6 columns (about 191.66px each), 2 rows of 102px.
- Background #fff. Border 1px #c0d0f0 on top, left and right. Each tile has border-right and border-bottom 1px #c0d0f0 (the last column has no right border). Overflow hidden.
- Tiles are 192x102 with bg #f5f8ff. Tiles 1, 3, 5, 8, 10 and 12 carry the dither texture (multiply, `background-size: 750px auto`, offsets per tile: -475px -15px, -190px -118px, -240px -400px, -90px -120px, -130px -250px, -350px -390px).
- Logo image: min-height 74px wrapper with padding 12px 16px. The img has max-width 90px, max-height 20px (rendered boxes vary from 90x20 to 180x48), `object-fit: contain`. Filter tints it navy: `brightness(0) saturate() invert(12%) sepia(15%) saturate(1200%) hue-rotate(210deg) brightness(.9)`.
- Four tiles are links with a hidden **CTA strip**: 32px tall at the bottom, bg #f5f8ff, border-top 1px #c0d0f0, mono 12px cobalt "Read case study →". See Motion §3.5.

**Testimonial row:** y 1092-1490, 1152x398.
- Grid `383px 383px 383px`. Background #f5f8ff. Border left/right 1px.
- Col 1: portrait photo 382x398, `object-fit: cover; object-position: 50% 20%`, sitting on a cobalt gradient backdrop.
- Col 2: **stat card**, 288x288 at x 576, y 1140 (centred in the column), border 1px #c0d0f0, padding 32px, flex column, content spread top to bottom. It holds a customer logo (85x32, opacity .85), the big stat ("15k" style plus ↘) and a mono caption.
- Col 3: quote block (431x384), padding 48px 48px 48px 32px, gap 24px, serif quote.
- **Flank blocks:** dither tiles 214x110 with a 1px #c0d0f0 border. One extends off the container to the left (bottom-aligned) and one to the right (top-aligned): `right: min(50% + 600px, 100% - 1px)` and `left: same`. They are hidden on mobile.

**Mobile hero:**
- Padding-top 53px. Text column is flex with gap 16px.
- The form stacks: input 358x40 (padding 7px 11px), button full width 358x40 below it, gap 5px.
- Image composition is a grid `239px 119px`. The hero image is 358x201 on top. Below it the caption block is 239x84 with teal 119x84 beside it. Side colour blocks are 119x71 and bleed off-screen at x -70 and x 341.
- Logo grid: 3 columns x 4 rows (119x102 tiles), x 16-374.
- Testimonial stacks: photo 356x448, then the stat card (padding about 49px from the sides), then the quote (22px serif).

### 2.4 "More teams choose…" + awards: y 1554-2367, height 813
- Background #fff, padding 96px 0.
- Container: flex row, gap 64px, padding 24px.
- **Left column, 520px wide:** flex column, gap 24px. From the top:
  - mono eyebrow, about 27 characters;
  - H2 (35px), 2 lines;
  - lead paragraph, 10 lines;
  - CTA group (flex, gap 12px) with a primary button (238x47, "withArrow" + shine) and a light button (241x47, bg #f5f7fa, text cobalt, border #f5f7fa).
- **Right column, awards box:** 520x360 at x 776, y 1780 (vertically centred). Background #f5f8ff with the 4px dot grid, border 1px #c0d0f0, overflow hidden. Flex row:
  - main award panel 318px wide, holding a 200x200 badge with shadow `0 12px 24px rgba(12,13,17,.15)`;
  - a **vertical auto-slider** 200px wide (border-left 1px #c0d0f0) of 80x80 badges at a 150px pitch (keen-slider, see Motion §3.7), with a 40px bottom fade `linear-gradient(to top, rgba(240,244,255,.36), transparent)`.
- Badge hover: slider badge `scale(1.02)` (transition .2s); main badge opacity .8.
- **Mobile:**
  - Container column, gap 32px, padding 16px. Buttons 186x40 and 189x40, which wrap onto 2 rows (gap 8px).
  - Awards box is 358x444, flex column: main award 356x242 (padding 21px), then the slider runs **horizontally** below it at a 150px pitch.

### 2.5 Product overview (dark): y 2367-3375, height 1008
- Background `#041330`. Container 1200, padding 96px 24px.
- **Header row** (y 2463-2601): flex row, space-between, gap 16px.
  - Left, 652px wide: H2 (48px white, 1 line) and description (18px, rgba(255,255,255,.8), 2 lines), gap 24px.
  - Right: primary button "Explore our platform", 182x47, bottom-aligned.
- **Two-column body** (y 2649, height 630): grid `284px 852px`, gap 16px.
  - **Step nav, 284px wide:** 3 stacked `button`s. Each has a 2px progress bar on top (track transparent, fill #265cff, `transform-origin: left`), content padding 24px 0, and a title row (index plus title, gap 8px).
    - Collapsed items are 80px tall.
    - The active item expands to show the description (grid-rows 0fr→1fr) and grows to about 172-192px.
    - Inactive items have opacity .48 (hover .7). Transition `opacity .3s`.
  - **Stage, 852x630:** radius 2px, overflow hidden. Layers from bottom to top:
    1. bg image (cover, #041330 base);
    2. dither texture overlay;
    3. scrim `linear-gradient(rgba(4,19,48,.2) 0%, rgba(4,19,48,.5) 50%, rgba(4,19,48,.8) 100%)`;
    4. **glass panel** at offset (163,128) from the stage top-left, 699x512, which bleeds off the right/bottom edge. It has padding 8px, bg rgba(255,255,255,.01), radius 4px, `backdrop-filter: blur(4px)`, and the glass inset shadow;
    5. inner white card 683x496, radius 2px, holding the dashboard screenshot.
  - The stage cross-fades per step (`.stageFade` opacity 0→1, .35s).
- **Mobile:**
  - Container padding 48px 16px 56px. Header stacks (gap 16px). The button is full width (358x40).
  - Steps become a **horizontal swipe track** (`smStepTrack`, flex row, gap 21px, each item 252px wide) that slides to centre the active step.
  - The stage is 358x400 below the track, and the glass panel is 304x225 offset to the bottom-right.

### 2.6 Feature carousel: y 3375-4015, height 640
- Background transparent (white). Padding 88px 0.
- **Header:** container padding 0 24px, flex row space-between. H2 35px on 1 line (1038px wide). Navigation group (gap 10px) holds two 40x40 circular arrow icons drawn as CSS-masked spans: prev in #c1d2fe (disabled, opacity .4) and next in #658dfd. Hover opacity .75.
- **Track:** 47px below the header, at y 3551.
  - The wrapper is full-bleed (1440) with padding 0 144px and an edge mask `linear-gradient(90deg, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%)`.
  - keen-slider, slide width **384px**, 5 slides with no gap.
  - Card: 384x375, bg #fff, border 1px #c0d0f0 (cards after the first have no left border, so lines are shared), padding 24px, flex column, gap 24px.
  - Card text block: gap 8px, title plus 2-line description.
  - Image frame: 334x223 (3:2), bg #e5e9f0, border 1px #e6ebf5, overflow hidden, img cover.
  - The last 2 cards render off-canvas to the right (x 1296 and 1680), faded by the mask.
- **Mobile:** padding 48px 0. Header is H2 28px on 2 lines (271px wide) with arrows 87px wide. Cards are 323x334 with padding 16px, and the image is 289x193. The track starts at x 8 and the next card peeks at x 347.

### 2.7 Sustainability AI / agents: y 4014-4994, height 980
- Base background #fff, with these layers:
  - **WebGL canvas (Unicorn Studio)**, 1440x900, starting 81px into the section (y 4095). It renders a blurred purple/blue gradient field, likely animated.
  - Top gradient 410px tall: `linear-gradient(#fff 0%, rgba(255,255,255,.95) 50%, rgba(255,255,255,.6) 75%, transparent 100%)`.
  - Dither texture overlay across the full section.
  - **Not measurable:** the canvas contents. Substitute a CSS radial-gradient blob of purple #a78bfa → cobalt #658dfd → transparent with a blur, plus noise.
- Container: padding 96px 24px, flex column, gap 48px.
- **Header** (gap 48px):
  - Mono eyebrow with an 18x18 icon (gap 10px).
  - Then a grid `565px 539px`, gap 48px. Left: H2 36px, 2 lines. Right (434px wide, flex column, gap 24px): 18px paragraph (2 lines) and an outline button (228x47, transparent background, border 1px #d1d8e5, text cobalt, hover bg #fbfcfd and text #1246e0).
- **Feature grid:** 3 columns of 363px, gap 32px. Each item is flex column, gap 12px: H3 21px on 1 line and a description on 2 lines.
- **Prompt demo:** centred, 752px wide, at y 4727. Flex column, gap 16px.
  - **Glass prompt card** 752x88: padding 4px, radius 10px, bg `rgba(11,36,113,.42)`. Shadow is stacked insets: `inset 1px 1px 2px rgba(255,255,255,.26), inset 0 0 0 1px rgba(255,255,255,.10), inset 0 0 16px rgba(11,29,69,.36), 0 0 16px rgba(11,29,69,.32) …`.
  - Inner 744x64: radius 7.5px, bg `rgba(101,141,253,.5)` plus `radial-gradient(140% 120% at 28% 52%, rgba(11,36,113,.42) 0%, rgba(11,29,69,.3) 34%, …)`.
  - Input row: 32x32 icon, typing text (white 20px 600) and a blinking caret. Send button 40x36, radius 8px.
  - **Chips row:** flex, gap 8px, overflow-x auto. Chips are 48px tall, padding 0 16px, radius 24px, bg `rgba(12,121,213,.7)`, glass inset shadows, white 18px 600. Three chips of about 17, 30 and 45 characters.
- **Mobile:**
  - Padding 43px 16px, gap 27px.
  - The header grid stacks (gap 32px). Button 179x40.
  - Feature grid is 1 column, gap 16px.
  - The prompt card is 358x72, and the chips overflow horizontally.

### 2.8 Stats / Cornerstone: y 4995-5822, height 827
- Transparent background. Container padding 96px 24px, flex column, gap 48px.
- H2 (36px weight 400) is 850px wide, 2 lines.
- **Card:** 1152x497 at y 5229. Bg #fff, border 1px #c0d0f0, radius 2px, overflow hidden.
  - **Stats row:** grid of 4 x 287.5px, 194 tall. Cells have padding 24px, flex column, gap 16px, border-right 1px #c0d0f0 (none on the last cell) and border-bottom 1px. Each cell holds a value (72px weight 300 cobalt; 2-5 characters) and a caption (16px, 1-3 lines).
  - **Bottom row:** grid `575px 575px`, 288 tall.
    - Left: illustration 575x288 (`object-fit: contain`).
    - Right: padding 24px, flex column, gap 32px. H3 (18px) on 1 line, a 4-line body (gap 16px) and a mono link with an arrow icon (12x10). Link hover opacity .75 (transition opacity .2s).
- **Mobile:**
  - Stats are a 2x2 grid (178px columns, cell padding 11px, value 40px).
  - The bottom row stacks: image 356x178, then the text block.

### 2.9 Mission (dark split): y 5822-6782, height 960
- Section bg #041330. Panel grid `720px 720px`, full-bleed.
- **Left (content)**, 720x960, bg #12131a, overflow hidden. Layers:
  - dither overlay (soft-light, 80px tile);
  - radial glow `radial-gradient(at 30% 20%, rgba(38,92,255,.2) 0%, transparent 70%)`, positioned -360px left, 720x739.
  - Inner box: x 120 (aligned to the container), 568x768, padding 192px 24px 24px, with a 1px left border rgba(255,255,255,…) (a faint vertical rule). It is laid out top to bottom:
    - top block (gap 16px): mono eyebrow #658dfd plus H2 on 2 lines;
    - bottom block (gap 36px): body (7 lines) plus a mono "Learn more" link with an 11x11 arrow, colour #658dfd. Hover opacity .8.
- **Right (media)**, 720x960: landscape photo (`object-fit: cover`) under a dot-grid overlay (gold dots, multiply).
- **Mobile:**
  - Stacks. The content block is 390x506 (inner padding 32px 16px 16px, gap 11px / 24px).
  - The photo is 390x320 below it.

### 2.10 Content cards: y 6782-7460, height 678
- Padding 96px 0. Container 1152.
- Header: H2 35px (1 line) plus a paragraph (18px, 640px max, 1 line), gap 24px.
- **Grid:** 3 x 352px, gap 56px 48px, at y 7002.
  - Each card is an `a`: flex column, gap 16px.
  - Image 352x198 (16:9), radius 5px, bg #e5e9f0, cover.
  - Then a mono eyebrow (shown on 2 of the 3 cards), H3 on 3 lines, and "Read more" plus an arrow icon. On card hover the icon moves `translateX(4px)` (transition transform .2s ease-in-out) and the link opacity goes to .92.
- **Mobile:** 1 column, gap 21px. Images 358x201, titles 16px.

### 2.11 Customer logo marquee: y 7460-7611, height 151
- Padding 40px 0. The whole strip is one link.
- Carousel is full-bleed 1440, height 31, overflow hidden, with an eased edge mask (`--logo-carousel-mask-image`, 15+ stops from transparent to black over about 128px at each side).
- 35 slides with a **128px gap**. Each slide's width equals the logo's natural width scaled to its height (logos 40-74 x 14-31).
- Each logo is two stacked layers:
  - **monotone:** a CSS mask of the logo filled with #666c80 at opacity .4;
  - **colour:** opacity 0.
  - On hover of a logo, colour goes to 1 and monotone to 0 (transition opacity .25-.3s).
- **Mobile:** 390 wide, height 50 (including 27px bottom padding).

### 2.12 Footer: y 7611-9187, height 1576
- Footer background, top to bottom: `linear-gradient(#fff 0%, #fab7a3 26%, #245eff 65%, #245eff 70%, #1e2338 100%)` plus a noise SVG overlay.
- `::after`: a **large outlined globe-mark decoration**, 800x800, starting at x 784, y +776 (bottom-right, bleeding off). It is an SVG with backdrop-blur. **This is Watershed's logo mark; replace it with a generic outlined circle/arc decoration.**

**CTA strip:** height 481, padding 80px 24px.
- H2 centred at y 7691.
- Below it (gap 32px) the **form card wrapper** is 560x236, centred: padding 8px, radius 8px, bg rgba(15,23,42,.02), `backdrop-filter: blur(10px)`, faint inset white edges. A bottom fade mask (`--mask-smooth-fade` style) makes the form fade out.
- The white form card (544x220, padding 32px, radius 2px) is **collapsed** (`max-height: 220px; overflow: hidden`). It shows the first 2-3 rows of an 8-field form: two 234px inputs side by side (gap 12px), then full-width 480px fields, each 42px tall with a 14px gap.
- A **floating gradient button** sits over the form centre (255x67 at x 593, y 7847, z 3). Its styles:
  - padding 15px 24px, radius 6px, border 1.5px transparent;
  - background `linear-gradient(#265cff, #1246e0) padding-box, linear-gradient(#4796ff 0%, #2c6cf9 30%, #0534e5 70%, #000cd2 100%) border-box`;
  - 24px white text with text-shadow `0 -1px 1px rgba(255,255,255,.35), 0 1px 1px rgba(0,0,0,.2)`;
  - stacked soft drop shadows;
  - hover `filter: brightness(1.08)`.
- Clicking the button expands the form (`max-height` transition .45s ease-in-out) and hides the button.

**Main:** height 1096.
- `mainInner` panel, bg #0f172a, spans from x 120 to 990 (870 wide). Its `::before` extends the dark colour to the left viewport edge (120px). The right 450px shows the footer gradient and the globe decoration.
- Padding 84px 48px 80px 25px, flex column, gap 60px.
- **Logo row:** grid of 3 x 233.66px, gap 48px. Footer wordmark 197x40 (white) in column 1. A LinkedIn icon button sits in column 3: 32x32, bg rgba(248,250,252,.1), radius 3px, icon #f8fafc, hover #7dd3fc.
- **Link columns:** grid of 3 x 233.66px, gap 60px 48px, 7 groups. Each group is flex column, gap 12px (title, then a list with gap 8px). Group sizes: 6, 6, 4, 6, 5, 3 and 2 links. Some links carry a "NEW" badge. One item is a disclosure button with a ▾ caret (10px, #94a3b8, rotates on open, .15s).
- **Locale select:** 173x45, padding 12px 38px 12px 16px, bg rgba(15,23,42,.6), border .5px rgba(248,250,252,.4), custom 9x24 up/down chevron SVG. Hover border rgba(248,250,252,.7).
- **Bottom bar:** grid of 3 columns, gap 16px 48px. Copyright in column 1. Legal links in columns 2-3 (flex, gap 8px 12px; the last item is a privacy-choices button with a 30x14 toggle icon).

**Mobile footer:**
- CTA strip padding 80px 16px. H2 32px. Form card wrapper 358x236. Floating button 162x44 (padding 8px 14px, 14px text).
- Main padding-left 16px. `mainInner` is 374 wide with padding 48px 24px.
- Link columns become 2 x 151px (gap 48px 24px).
- Bottom bar stacks.

---

## 3. Motion and interaction (measured)

### 3.1 Hero eyebrow ticker: scramble/decode text cycler
- Cycles through 3 stat messages (30-45 characters each). **Period is about 4.6s per message.**
- Exit: the wrapper animates to `translateY(-6px)` and `opacity 0`. The wrapper style is `transition: transform 320ms cubic-bezier(0,0,.2,1), opacity 1446ms ease-out`, but the exit is effectively quick: opacity hits 0 within about 300ms.
- About 100ms later it resets to translateY(0) and opacity 1, and a **left-to-right decode** starts:
  - Characters render in fixed `1ch` cells.
  - Already-resolved characters show the real glyph. A trailing window of 3-5 characters shows random block glyphs from the set `▓ ▒ ░ █ ■ □ ▪ ▫ ▀ ▄`, re-randomised every frame.
  - Unrevealed characters are blank.
  - The reveal front advances about 2.5 characters per 100ms (about 40ms per character), so a 35-character message decodes in about 1.5s.
- It holds for about 2.7s, then exits.
- The dot colour changes per message.
- Reduced motion: show the plain text.

### 3.2 Carets
- Hero prompt caret: 1px x 1em, `animation: heroPromptBlink 1s step-end infinite` (opacity 1 for 0-50%, 0 for 50.01-100%).
- Agents prompt caret: 2px wide, white, `promptChatBlink 1s step-end infinite`.
- The agents prompt text auto-types through example prompts (accessible label: "cycling through example prompts"). Per-character timing was not sampled. Use about 40-60ms per character, hold about 2s, delete, then type the next prompt.

### 3.3 Product steps: autoplay tabs
- Each step autoplays for **6s** (`--step-duration: 6s`).
- The active step's 2px bar fill runs `@keyframes stepCountdown { from { transform: scaleX(0) } to { transform: scaleX(1) } }` with `6s linear forwards`, `transform-origin: left`.
- When the bar finishes, the next step activates (01→02→03→01, verified).
- The description expands with `grid-template-rows 0fr→1fr, .35s`. Step opacity goes .48→1 (`.3s`). The stage image cross-fades (`opacity .35s`).
- Clicking a step activates it and restarts the bar. Hover on an inactive step sets opacity .7. Focus-visible: outline 2px cobalt, offset 2px.

### 3.4 Buttons
- **Base:** `transition: background-color .12s ease-in-out, border-color .12s, box-shadow .12s, color .12s, transform .12s`.
  - Primary: bg #265cff → hover #1246e0 → active #032ca5.
  - Light: #f5f7fa → #e5e9f0, text #265cff → #1246e0.
  - Outline: transparent → #fbfcfd, border #d1d8e5.
- **withArrow:** the 14px arrow SVG moves `translateX(4px)` on hover, `transition transform .13s ease-out`.
- **Shine** (`.shineAnimation`): an `::after` overlay with `radial-gradient(240px circle at var(--cursor-x) var(--cursor-y), color-mix(hover-bg 86%, white), transparent)` that follows the pointer. Its opacity goes 0→1 on hover (`.35s ease-in-out` in, `.25s ease-out` out). JS sets `--cursor-x/y` on pointermove.
- **HubSpot primary** (hero/footer forms): the background-image arrow moves from `right 16px` to `right 12px` on hover (`background-position .13s ease-out`).
- **Focus ring:** `0 0 0 2px #fff, 0 0 0 3px #265cff, 0 0 0 5px #e3ebff`.

### 3.5 Hero logo tiles
- On hover of a tile that has a CTA:
  - the logo wrapper moves `translateY(-15%)` (`transform .2s ease-out`);
  - the CTA strip moves `translateY(32px)` → 0 and opacity 0 → 1 (`transform .2s ease-out, opacity .15s ease-out`).
- Linked tiles without a strip lift by `translateY(-4px)`.

### 3.6 Logo marquee (customer logos): stepped, not continuous
- keen-slider. **Every about 2.03s** it advances by about 175-200px (roughly one logo plus the 128px gap).
- Each move takes **about 800-900ms with ease-in-out** (slow start, fast middle, slow end). Direction is leftward and the loop is infinite.
- It only runs while the strip is in the viewport. It did not move while off-screen.

### 3.7 Awards vertical slider
- keen-slider vertical. It advances one 150px slide **about every 4.6s**, with about 800ms ease-out movement. It loops infinitely.
- Mobile runs the same behaviour horizontally.

### 3.8 Feature carousel
- Not autoplay. Arrow click moves exactly one slide (384px; 323px plus 16px on mobile).
- Measured movement: 0→-384px in about 400ms with strong ease-out (about 60% done at 100ms). That is keen-slider's default easing; use `cubic-bezier(.22,1,.36,1)` at 450ms.
- The prev arrow is opacity .4 at the start. Drag/swipe is enabled.

### 3.9 Nav dropdown (desktop, Radix NavigationMenu, opens on hover)
- Trigger open: background #f5f7fa and the chevron rotates 180° (.25s).
- The viewport sits under the trigger row, centred on the menu, about 824px wide x 431 tall for "Product". Size transition: `width .25s, height .25s`.
- **Panel:** bg #f5f7fa, border 1px #e6ebf5, radius 8px, padding 6px, gap 4px, with the large layered shadow from §0.
  - Inside is a white card (radius 2px, border #e6ebf5).
  - Header links row: 2 cells of 404px, border-bottom #e6ebf5. Each has a 40x40 icon box (bg #fbfcfd, border, radius 2px), a 15px 600 title with "→", and a 13px description.
  - Then a 3-column link grid (269px each, padding 12px) with a mono group heading (13px #7a8499, padding 12px). Links are 40px tall, padding 12px, gap 8px, some with a 14px cobalt icon. Link hover bg #f5f8ff, title colour cobalt.
  - Footer strip link (810x45, padding 12px 24px): a tag plus 15px copy, and "Take a tour →" on the right.
- **Open animation:** `panelEnter` for V2 (opacity 0→1, scale .98→1), viewport `enterFromTop` (opacity 0, translateY(-25px) → 0), both `.3s cubic-bezier(.85,0,.15,1)`. Exit is `exitToTop .3s`.
- Switching between triggers slides the content in from left or right (`enterFromLeft/Right`: translateX(±128px) with opacity, .25s ease).
- Section-title arrow on hover: opacity 0→1, `translate(.5ch)`, .25s expo-out.
- Resources and Company menus use the same shell (not individually measured).

### 3.10 Mobile menu
- The hamburger toggles to a close X (lines `transform .2s, opacity .2s`). The button background stays #f5f7fa.
- **Panel:** `position: fixed`, from top 108 (below the promo bar and nav) to the bottom of the viewport, bg #fff, `overflow-y: auto`.
  - Open: `mobileMenuSlideIn .2s cubic-bezier(.4,0,.2,1) forwards` (opacity 0, translateY(20px) → 0). Close: `mobileMenuSlideOut`.
- Rows (Product, Resources, Company, Customers) are 390x60, padding 16px 24px 16px 16px, Sans 20px 500. Each dropdown row has a 24px chevron-right icon (#666c80) at x 342.
- Actions are fixed at the bottom: padding 16px, border-top 1px #e6ebf5, gap 9px. "Sign in" and "Book a demo" are full-width 358x44 with radius 1px.
- Tapping a dropdown row **drills in**: the submenu replaces the list with a "‹ Product" back header and the same content as the desktop panel, stacked (header links as rows, 2-column link grid, then the Reporting group). See `reference/mobile-menu-product-submenu.png`.

### 3.11 Promo bar marquee (≤700px)
- `.promo-text-inner { white-space: nowrap; animation: promo-marquee 14s linear infinite }`.
- `@keyframes promo-marquee { 0%, 12% { transform: translate(0) } 100% { transform: translate(-100%) } }`, which gives a pause and then scrolls left.

### 3.12 Links and misc
- Footer links: `color .15s ease-in-out`.
- Mono CTA links: opacity .75-.8 on hover (.2s).
- Content card arrow: +4px on hover.
- No parallax and no scroll-linked transforms were found (all `transform` values stayed constant while scrolling, apart from the carousels).
- The two WebGL canvases may animate internally (Unicorn Studio), but this cannot be measured.

---

## 4. Ambiguities and limits
- **Canvas-rendered backgrounds** (hero mountains, agents purple glow) are Unicorn Studio WebGL scenes. Their shader parameters and motion cannot be read via the DOM. Use static or CSS approximations.
- The hero prompt-bar overlay is partly baked into the product bitmap at desktop and partly HTML on mobile.
- I did not sample the agents prompt typing speed or the promo-bar rotation interval. Use the suggested values in §3.2 and §3.11.
- Tablet layout (768-1023px) was not measured.
- Mobile values that look odd (for example padding 7px 11px, gaps of 21px or 43px) are the actual computed values. Some section paddings appear fluid between breakpoints.
- The Resources and Company dropdown contents were not captured individually; they share the Product panel's styles.
- The cookie banner (Didomi) and HubSpot form internals are third-party and out of scope. Build a plain form with the measured field geometry.

## 5. Reference screenshots (`reference/`)
- Desktop 1440:
  - `desktop-1440-full.png`
  - `desktop-01-nav.png`, `desktop-02-hero.png`, `desktop-03-awards.png`, `desktop-04-product-overview.png`, `desktop-05-feature-carousel.png`, `desktop-06-ai-feature.png`, `desktop-07-stats.png`, `desktop-08-mission.png`, `desktop-09-content-cards.png`, `desktop-10-logo-marquee.png`, `desktop-11-footer.png`
  - `desktop-nav-dropdown-product.png` (dropdown open; the cookie banner is visible in this one)
- Mobile 390:
  - `mobile-390-full.png`
  - `mobile-02-hero.png`, `mobile-03-awards.png`, `mobile-04-product-overview.png`, `mobile-05-feature-carousel.png`, `mobile-06-ai-feature.png`, `mobile-07-stats.png`, `mobile-08-mission.png`, `mobile-09-content-cards.png`, `mobile-10-logo-marquee.png`, `mobile-11-footer.png`
  - `mobile-menu-open.png`, `mobile-menu-product-submenu.png`
- Note: element screenshots taken mid-page include the sticky nav overlapping their top 68px. Animated parts (ticker, carousels, canvases) show one frame only.
