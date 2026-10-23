Source: https://watershed.com/en-GB

# Asset manifest: Watershed homepage (placeholders only; nothing downloaded)

Every visual asset the homepage loads or renders, measured at **1440 desktop**, with the **390 mobile** size where it differs.

- **Do not reuse any of these assets.** They are Watershed photography, product UI, illustrations, award badges, customer logos and the Watershed wordmark/mark.
- Build same-size placeholders instead. Recreate generic UI icons as simple inline SVGs.
- "Natural" is the intrinsic size the CDN served (Sanity CDN `cdn.sanity.io`, auto-format, so it is WebP/AVIF where supported).

## A. Brand (replace with neutral placeholders)
| # | Where | Kind | Rendered (desktop) | Mobile | Notes |
|---|---|---|---|---|---|
| A1 | Nav, left | Watershed wordmark + globe mark (inline SVG, viewBox 131x28, 14 paths) | 148x30 | same | Replace with a generic wordmark. The mark stroke colour is #265cff. |
| A2 | Footer logo row | Same wordmark, white | 197x40 | same | |
| A3 | Footer `::after` | Large outlined globe-mark decoration (SVG data URI 720x789, backdrop-blur) | 800x800, bottom-right, bleeds off | `width/height: 600px; right: -15%` | Brand mark; replace with a generic outlined circle/arcs. |
| A4 | Hero background | Unicorn Studio WebGL canvas: dithered pale-blue mountains (static fallback image underneath) | 1440x779 (DPR 1.5 backing 2160x1169) | 390x712 | Canvas-rendered. Use a decorative dither landscape PNG placeholder, `object-fit: cover`. |
| A5 | Agents section background | Unicorn Studio WebGL canvas: blurred purple/blue field | 1440x900 | 390x900 | Use a CSS gradient blob placeholder. |

## B. Photos and product screenshots (same-size placeholder boxes)
| # | Section | Kind | Rendered | Aspect | object-fit / position | Natural served | Mobile |
|---|---|---|---|---|---|---|---|
| B1 | Hero composition | Product UI screenshot over photo (denim supply-chain card + prompt pill) | 576x324 | 16:9 | cover, 50% 50%, radius 2px | 1440x810 (src 1728x972 png) | 358x201 |
| B2 | Hero testimonial | Portrait photo of a person on a cobalt gradient | 382x398 | ~0.96:1 | cover, **50% 20%** | 1440x1440 (src 768x768 png) | 356x448 |
| B3 | Product overview stage | Background photo/texture behind the glass panel (CSS background-image) | 852x630 | ~1.35:1 | cover | src 852x639 png | 358x400 |
| B4 | Product overview stage | Dashboard product screenshot inside the white card | 683x496 | 1.377:1 (1440x1046) | fill | 720x523 jpg | 288x209 |
| B5-B9 | Feature carousel, 5 cards | Product UI screenshots | 334x223 each (frame) / img 332x221 | 3:2 (672x448) | cover | 750x500 jpg | 289x193 |
| B10 | Stats bottom-left | Diagram illustration (two connected data nodes) | 575x288 | ~2:1 (1198x600) | **contain** | 720x360 png | 356x178 |
| B11 | Mission right half | Landscape photo (solar panels + wind turbines) | 720x960 | 3:4 crop of a 3:2 source (4096x2729) | cover | 720x480 jpg (w=750) | 390x320 |
| B12 | Content card 1 | Customer-story banner graphic | 352x198 | 16:9 | cover, radius 5px | 400x350 (rect crop of 3600x1100) | 358x201 |
| B13 | Content card 2 | PDF guide cover graphic | 352x198 | 16:9 | cover, radius 5px | 400x210 (src 1360x714 jpg) | 358x201 |
| B14 | Content card 3 | Illustration (chat UI) | 352x198 | 16:9 | cover, radius 5px | 400x200 (src 1920x960 jpg) | 358x201 |

## C. Award badges (placeholder rounded squares or circles)
| # | Where | Rendered | Notes |
|---|---|---|---|
| C1 | Awards box, main badge | 200x200 | contain, shadow 0 12px 24px rgba(12,13,17,.15). Source 2048x2048 png. |
| C2 | Awards vertical slider | 80x80 (some 70x80 or 65x80, portrait) | 8 unique badges (png, 400-2709px squares), duplicated by keen-slider loop clones (about 30 nodes). Pitch 150px. Contain. |

## D. Customer logos (placeholder grey wordmark bars)
| # | Where | Count | Rendered box | Treatment |
|---|---|---|---|---|
| D1 | Hero logo grid (6x2 desktop, 3x4 mobile) | 12 | wrapper max 90x20 for the image; rendered boxes vary from 90x20 to 180x48 (mobile 68x15 to 135x30) | `object-fit: contain`. CSS filter tints them navy (see spec §2.3). Mixed SVG/PNG. |
| D2 | Testimonial stat card | 1 | 85x32 (mobile 64x24) | opacity .85 |
| D3 | Logo marquee | 35 | heights 14-31px, widths 40-74px, 128px gap | Rendered as CSS-masked `div`s (mask = logo, fill #666c80 at opacity .4), plus a colour layer (background-image blob URL) revealed on hover. |

## E. Decorative textures and patterns (recreate your own)
| # | Where | Kind | Size / tiling |
|---|---|---|---|
| E1 | Hero logo tiles 1, 3, 5, 8, 10, 12 and the testimonial flank blocks (214x110) | Dither "pixel mountain" PNG (`/img/dither-pattern.png`) | `background-size: 750px auto`, no-repeat, `background-blend-mode: multiply` over #f5f8ff, per-tile offsets |
| E2 | Product stage, agents section, mission left panel | Dark dither/grain PNG (`/img/demo/demo--background-texture-….png`) | Tile 80px wide; `mix-blend-mode: soft-light` on mission |
| E3 | Footer, global | Noise SVG (feTurbulence, data URI) | 200px tile, opacity .42 (footer); 160px tile (token) |
| E4 | Awards box | Dot grid (CSS radial-gradient) | 4x4 |
| E5 | Mission photo | Gold dot grid (CSS) | 3x3, multiply |
| E6 | Agents eyebrow | Small "sparkle" SVG icon (`/img/sustainability-ai-eyebrow.svg`) | 18x18. Decorative brand icon; a generic sparkle is fine. |
| E7 | Hero image composition | Solid colour blocks (CSS only) | 192x108 modules: #ff9966, #658dfd, #1b7a5a, #265cff, #ff6633, #232c40 |
| E8 | Nav dropdown header icons | "Platform overview" globe icon (20x20 SVG) and "Compare" composite globe+circle icon (32x33) in 40x40 boxes | Brand-derived; use a generic globe icon. |
| E9 | Nav dropdown link icons (Sustainability AI, Measure, Report, Act) | 14x14 cobalt mask icons | Use simple generic icons. |
| E10 | Agents prompt card | 32x32 "paper" logo icon at the left of the input | Generic icon. |

## F. Generic UI icons (recreate as simple inline SVGs)
| Icon | Where | Size | Colour / notes |
|---|---|---|---|
| Chevron left / right | Promo bar prev/next | 7x12 (viewBox 8x14) | stroke #bec7da, hover #f5f7fa |
| Chevron down (disclosure) | Nav Product/Resources/Company | ~10x6, margin-left 4px | currentColor; rotates 180° when open |
| Hamburger / X | Mobile nav toggle | 24x24 in a 40x40 button | #242633, lines animate .2s |
| Chevron right | Mobile menu rows | 24x24 | #666c80 (mask) |
| Chevron left (back) | Mobile submenu header | ~16 | #242633 |
| Arrow right (→, line arrow) | Buttons with arrow; HubSpot submit (background SVG, path `M7.467 1.75L12.25 7 7.467 12.25M12.25 7H1.75`, white stroke) | 14x14 | currentColor / white |
| Arrow right, small | Stats mono link (12x10), Mission link (11x11), content-card "Read more" | 10-12px | cobalt / #658dfd |
| Arrow-circle left / right | Feature carousel nav (CSS mask of `/icons/ArrowCircleLeft.svg` and `/icons/ArrowCircleRight.svg`) | 40x40 | #c1d2fe disabled, #658dfd active |
| Send (paper plane / arrow-up) | Agents prompt send button | 16x16 in a 40x36 button | white |
| Up/down select chevron | Footer locale select, HubSpot selects (background SVG 9x24) | 9x24 | light / dark |
| Caret ▾ (text glyph) | Footer "Regulatory frameworks" | 10px Arial | #94a3b8 |
| LinkedIn "in" | Footer social | 18x18 in a 32x32 tile | #f8fafc, hover #7dd3fc (generic social icon) |
| Privacy-choices toggle | Footer legal | 30x14 | Blue/white check-X pill (standard CCPA icon) |
| "↘" and "→" text glyphs | Hero caption, stat, links | Font glyphs (GeistMono weight 250 for ↘) | No asset needed |

## G. Fonts (from @font-face; licensing details in CLONE_SPEC §1)
| File | Family / weight | Licence | Substitute |
|---|---|---|---|
| MessinaSansWeb_Light / Book / Regular / SemiBold (+ Bold, RegularItalic declared but not loaded) .woff2 | messinaSans 300 / 400 / 500 / 600 | Commercial | Inter (Google Fonts) 300-600 |
| P22MackinacProBook (+ Medium declared but not loaded) .woff2 | mackinacPro 400 | Commercial | Newsreader (Google Fonts) 400 |
| GeistMono_Variable.woff2 | GeistMono 100-900 | OFL (open source) | Geist Mono (Google Fonts) |
| Crimson Text (6 subsets, 400 / 400i) | Declared but unused on the homepage | OFL | Not needed |

## H. Video / Lottie / iframes
- No `<video>`, Lottie or embedded media on the homepage.
- Two hidden HubSpot `iframe`s (0x0, form targets) can be ignored.
