Source: https://watershed.com/en-GB

# Watershed inner-page templates: build spec

Companion to `CLONE_SPEC.md` (homepage, design tokens, nav, footer, buttons, carousels). This file covers every template group in `ROUTES.json`. Everything here was measured live on 2026-10-23 with Playwright (headless Chromium) at **1440x900** and **390x844**. Sources: getComputedStyle, getBoundingClientRect, document.getAnimations(), a wrapped IntersectionObserver, `transitionrun`/`animationstart` listeners and CSSOM rule dumps. Values are px unless marked otherwise. Colours are computed values.

**Content rule (same as CLONE_SPEC):** text is described by role and length only ("len 120" = about 120 characters, "L3" = 3 lines). Assets are described by size, aspect and type. Do not copy Watershed copy, photos, customer logos or brand marks.

**Shorthand used below:**
- `type 20/30 500 -0.2 #666c80` means font-size 20, line-height 30, weight 500, letter-spacing -0.2px, colour #666c80.
- Families: **Sans** = messinaSans (build with Inter), **Serif** = mackinacPro (Newsreader), **Mono** = GeistMono.
- **C** = the standard container: 1200 max width, 24 inline padding, so content is 1152 wide at x 144-1296. At 390 the side padding is 16 (content 358).
- Mobile is measured where a "390:" note appears. Where it doesn't, apply the global mobile rules in §1.4.

---

## 0. Key architectural finding: the site is a block CMS

Every marketing page is a Sanity document rendered as a vertical list of reusable **blocks**. Each block is a CSS module: `Hero`, `TextWithImage`, `Quote`, `Faq`, `PageLinkSet` and so on. The "product" group of 30 pages, plus most company, compare and LP pages, are **not separate layouts**. They are different orderings of the same ~45 blocks.

**Build recommendation:**
- Implement a block library (§3).
- Implement a generic `BlockPage` renderer that takes an ordered list of block configs (§4.1).
- Implement about 8 real page templates for the non-block pages: blog post, customer story, gated landing, sidebar index, feed index, customers index, legal document, and the SectionHeroForm demo/tool page.

Homepage blocks found on inner pages (REUSE from CLONE_SPEC):

| Inner-page block | Homepage equivalent (CLONE_SPEC) | Difference |
|---|---|---|
| `MicroFeatureCarousel` | §2.6 Feature carousel | Identical. Header can include a 20/30 subhead (len 100-180, max-width 720) under the H2, gap 24. Cards are 384x346 when there's no image caption. |
| `ContentCards` | §2.10 Content cards | Identical grid. Header becomes a flex row (space-between, align-end, gap 48) with an optional primary `withArrow` button on the right (228x47). The card adds a 16/24 500 #666c80 description (L2) instead of "Read more". |
| `ProductOverview` (dark) | §2.5 Product overview | Identical. Used on /platform/act. |
| `ProductOverview.modeLight` | §2.5 | Section bg #fff. H2 is #242633. The step title is #242633 and the description is #666c80. Stage bg is #f5f8ff with the dither, but no scrim or glass inset: the image fills the 852x640 stage. Can have 2 steps instead of 3. |
| `TextWithAwards` | §2.4 Awards section | Identical (520/520, gap 64, awards box 520x360). The paragraph is longer (L14). The CTA is a mono text link (`cta-link-mono` 14/15.4 500 #265cff) instead of buttons. |
| `CenteredAgent` + `PromptChat` | §2.7 agents (prompt card and chips) | Hero version (see §3.20). The prompt card and chips are identical to the homepage. |
| `LogoCarousel` (in `Logos` blocks, SectionHeroForm, FeatureGridNumbered) | §2.11 logo marquee | Same stepped keen-slider and same mono/colour hover swap. See `Logos` (§3.3) for sizes. |
| Footer, CTA strip, promo bar, nav | §2.1, §2.2, §2.12 | Variants are in §1. |
| Buttons (primary, light, outline, withArrow, shine) | §3.4 | New variants are in §1.3. |

---

## 1. Global chrome on inner pages

### 1.1 Nav variants (sticky, 68 tall, as homepage §2.2)

| Variant (classes) | Where | At scrollY 0 | After any scroll (y ≥ ~1) |
|---|---|---|---|
| `isOpaque` (default) | product, company, compare, guide, event, report, legal, customers, careers, story | bg rgba(255,255,255,.98), border-bottom 1px #e6ebf5, shadow 0 1px 0 rgba(0,0,0,.05) | unchanged |
| `isTranslucent` | /blog, /events, /guides (ContentHero pages), all blog posts, customer posts that use the BlogPostTemplate, /tools/*, /product-tours/* | bg transparent, border-bottom 1px rgba(4,19,48,.12), text #242633 | switches to the `isOpaque` styles. Transition `background-color .25s, --color-link .25s, --color-logo .25s` |
| `isTranslucent isInvertedDesktop` | /demo, /demo/* (dark hero) | bg transparent, border 1px rgba(255,255,255,.24), links/logo white | opaque white, text #242633 |

- Translucent pages pull their first section up under the nav with `margin-top:-68px` and extra top padding. ContentHero uses padding-top 164, PostHero 100, SectionHeroForm 116 to the content.
- **Demo nav** (/demo*) has no "Book a demo" button. It has logo, 3 dropdown triggers, the Customers link, "Sign in" and an overflow trigger.
- **LP pages** (`/lp/*`) render **no nav and no footer**. Only the promo bar remains, followed by the page blocks.

### 1.2 Promo bar and footer
- **Promo bar** (homepage §2.1) appears on every page except `/demo`, `/demo/*` and `/product-tours/*`. Those pages start at y 0.
- **Footer** (homepage §2.12) is identical everywhere: CTA strip 481 tall plus main 986 (1466 total at 1440). Exceptions:
  - `/demo*` and `/lp/*` have **no footer**.
  - `/climate-economy` has a shorter CTA strip (349).
- `CTABar` is a separate slim CTA used above the footer on /customers and /change:
  - Full-bleed, border-top and border-bottom 1px rgba(13,89,242,.5), bg #fff, height 145.
  - Inner container 1200 with padding 48 32. Flex space-between, gap 20, wraps.
  - Inner side rules: `borderLines` box at x 132-1308 with left and right 1px rgba(13,89,242,.5).
  - H2 32/38.4 500 -0.96 #0b2471 (len ~17), plus a primary withArrow button 149x47.
  - Transition `margin-top .15s ease`.
  - 390: padding 48 24, button 114x40.

### 1.3 New shared button and link variants (extend homepage §3.4)

| Variant | Spec |
|---|---|
| `Button.colorTextMono` | Text-only mono link button: Mono 14/21 400 -0.14 #265cff, radius 1, gap 4, arrow 14px moves +4px on hover (.13s ease-out). |
| `Button.colorTextDefault` | Same, but Sans 14/21 500 #265cff. |
| FAQ CTA button | 316x44, padding 8 16, radius **6**, bg #e3ebff, border 1px #c1d2fe, text #265cff. Hover/active bg #c1d2fe. |
| Outline "Load more" | 113x46, padding 10 16, radius 2, transparent bg, 1px #d1d8e5 border, #265cff 16/24 500. Transition bg/color .12s ease-in-out. |
| HubSpot submit (`button primary arrow`) | As homepage hero form: 16/24 500 white on #265cff, 14px arrow bg-image moving right 16→12 (.13s ease-out). Height 44 desktop, 40 mobile. |
| `cta-link-mono` (h6) | Mono 14/15.4 500 #265cff with an arrow. 390: 12/13.2. |
| `VideoLink` | Mono 14/17.5 400 #265cff, play icon, gap 6, radius 2, transition color/box-shadow .12s. |

### 1.4 Global mobile rules (apply wherever a block has no explicit 390 note)

These are measured, and consistent across ~15 blocks:
- Section vertical padding:
  - 96 → 64, except `TextWithImage` (96 → 43) and FAQ (80 → 43).
  - 80 → 53 for the hero.
  - 88 → 48 for carousels.
- Containers: side padding 16. Note that `TextWithImage`, `Quote` and `Faq` use **8px** side padding at 390 (content 374 wide, x 8). This is the real value.
- Type scale 1440 → 390:

| Role | 1440 | 390 |
|---|---|---|
| Hero H1 | 48/52.8 | 32/35.2 (-0.96) |
| Section H2 | 35/40.95 | 28/32.76 (-0.84) |
| 36/45 H2 | 36/45 | 24/30 |
| Body lead | 18/27 | 14/21 |
| Hero subhead | 20/30 | stays 20/30 |
| Eyebrow (Mono) | 14/20 | 12/13 |
| Card title | 21/26.25 | 16/20 |
| Serif quote | 24/31.2 | 18/23.4 |
| Button | 16/24, padding 10 16, height 47 | 13/19.5, padding 7 11, height 40 |

- Multi-column grids become 1 column. Gaps scale roughly ×0.66 (48→32, 32→21, 24→16, 16→11).
- **Article prose does NOT scale down** (§2.1). The blog body stays 20/30 at 390.

### 1.5 Forms (one shared primitive: `HubspotForm`)

All forms are a fallback HubSpot render (`hubspot-fallback-form`), so build one form component.

- **Field (`hubspot-fallback-control`):**
  - Height 42 (44 in email catchers), padding 10 16, bg #fff, border 1px #e6ebf5, radius 2.
  - Transition `border-color, box-shadow, background-color, color .15s ease`.
  - Placeholder/label text 14/19.6 500 -0.14 #7a8499.
- **Floating label:** sits inside the field. On focus or fill it moves up to straddle the top border:
  - `position:absolute; top 0; left 12; padding 0 4; bg #fff; font 12px; transform translateY(-7.2px)`.
  - Transition `top, transform, font-size, color, background-color, padding .24s cubic-bezier(.65,-.32,.38,1.23)` (a slight overshoot).
- **Grid:**
  - `hubspot-field-columns` is two columns with gap 12 (for example 222.9 + 222.9 inside a 458 form). Rows are separated by gap 14.
  - The last row is the legal copy: 12/18 500 -0.12 (#242633 or #666c80) with a #265cff link, L2.
  - The submit row comes after the legal copy.
- **Email catcher (inline single field)** is `hubspot-fallback-form` as a grid `[field 1fr][button ~112-176]`, gap 16 0:
  - The field has left radius only (2 0 0 2) and no right border; it is joined to the button.
  - Margin 4 (the glass-pill inset). The legal copy spans both columns underneath.
  - Used in InlineCtaForm, HeroCompete and EnergyForecast.
- **Select fields** use the same box with a 9x24 up/down chevron SVG at the right (padding-right 38).
- Typical field sets:
  - Demo / tool / product-tour: First name, Last name (2-col), Company, Job title, Phone, Email, Country (select), "How did you hear" (select). 5-8 fields.
  - Guide: 5-6 fields.
  - Email catcher: 1 field.

---

## 2. New shared primitives (build once, used by several templates)

### 2.1 `Prose` (article rich text): used by blog post, customer posts, legal docs, reading-list, SectionTextBlock, gated landings

Container `.blog-post`:
- Blog: 780 max width incl. 24 inline padding, so the text column is **720** (paragraph max-width 720). h2/blockquote/figure/table use the full 732.
- Legal and reading-list: 792 wide with 48 padding, so text is 696.

**Desktop and mobile are identical in size.** Measured at 1440 and 390:

| Element | Style | Margin (t r b l) | Notes |
|---|---|---|---|
| p | Sans 20/30 500 -0.2 #666c80 | 0 0 20 0 | max-width 720 |
| p strong | 700 (same size as context; 18/27 when inside 18px text) | | |
| p em | italic | | |
| a | #265cff, same size, no underline | | |
| h2 | Sans 35/38.5 500 -1.05 #666c80 | **48** 0 8 0 | Legal uses weight 400. Inner `<strong>` keeps 500 with letter-spacing -0.35. |
| h3 | Sans 28/30.8 500 -0.84 #666c80 | 24 0 8 0 | Legal uses 400. |
| h4 | Sans 24/26.4 500 -0.72 #666c80 | 32 0 8 0 | |
| ul / ol | padding-left 22, margin-bottom 16 | | disc / decimal outside |
| li | 20/30, margin 8 0 | | `::marker` #0b2471 20px 500. Nested ul has the same padding 22. |
| blockquote (plain) | border-left **3px** #265cff, padding-left 30 | 20 0 45 0 | Text inherits p. Last p is `.mb-0`. |
| figure.photo | centred | 0 auto | Size variants: `maxWidth-s` = min(100%, 360px); `maxWidth-m` = min(100%, 580px); default = 100% (732); `maxWidth-xs` also exists. On mobile `maxWidth-m` becomes 75%. `desktopOnly` / `mobileOnly` image pairs swap at 768. |
| figcaption | Sans 14/16.8 500 -0.14 #415591, padding 2 12, radius 9999 (pill), centred, margin-bottom 32 | | transition all .125s ease-in-out |
| aside.blog-aside (callout) | bg #f5f8ff, padding 28 48, margin 32 **-48** (bleeds 48 each side) | 32 -48 | Text 18/27. 390: padding 24 16, margin 32 -16 16. |
| StylizedQuote (blockquote.StylizedQuote) | border-left 3px #265cff, padding 48 48 60 30 (390: 45 45 90 30), margin 20 0 45 0, with a **full-bleed background image** inside (absolute, 732x~280-360) | | Text Serif 38/41.8 400 -0.48 **white** (390: 24/26.4). Cite Mono 12/15 500 +1.56 #1246e0, padding-top 30. A 50x50 quote-mark SVG sits bottom-right. Use a dark placeholder image. |
| Table (`Table.embedded`) | wrapper border 1px #e6ebf5 (top/left/right), radius 2, margin 32 0 | | `thead` border-bottom 1px #c1d2fe. th/td Sans 14/21 500 -0.14 #242633, padding 12 (legal 16 24; 390: 8, or 11 16 for legal), border-right and border-bottom 1px #e6ebf5, vertical-align top, text-align left. Body cells bg #f5f8ff, header row bg #f5f7fa. `border-collapse: collapse`. 390: 12/18. Wide tables scroll horizontally (840 wide at 390). |
| code / pre | **not present** in any sampled post, including the /inside engineering posts | | Use a sensible default (Geist Mono 16/24, #f5f7fa bg). Unmeasured. |

Measured vertical rhythm between siblings: p→p 20, p→h2 48, h2→p 8, p→h3 24, h3→p 8, h2→h3 24, p→ul 20, ul→p 16, p→blockquote 20, blockquote→p 45, p→figure 20, figure(with caption)→p 32, p→aside 32, aside→p 32 (16 at 390), table→p 32.

### 2.2 `TocSidebar` (sticky on-page table of contents)

Used by blog posts with a TOC (`rootWithToc`), legal docs, `SectionTextBlock.withToc` (reading list, /platform/disclosures/cdp, issb, tcfd).

- Layout: a 2-column grid `821.3px 410.6px` with gap 24 (blog) or `818.6px 409.3px` with gap 36 (legal and SectionTextBlock), inside padding 12 88 or 64 12 24.
- `section.toc`: `position: sticky; top 100` (blog) or `top 128` (legal/STB). Border-left 1px #93aeff, padding 0 32, margin-bottom 150.
- Items:
  - `a.toc-item.level-2`: Sans 16/22 **600** -0.16 #0b2471, padding 6 0, 34 tall per line.
  - `level-3`: 500 #6d7fb2, padding-left 24.
  - Active (`is-active`) and hover: #265cff. Level-2/3 hover is #658dfd (cobalt-40). Transition color .125s ease-in-out.
- Active tracking: IntersectionObserver on h2/h3 with `rootMargin: -120px 0 0 0` and threshold [0,1].
- **Hidden below 1024** (single column on mobile, no TOC).

### 2.3 `PostHero` (blog post and BlogPostTemplate customer posts)

- Section bg #f5f7fa, `margin-top -68` (under the translucent nav), padding 100 0 64. Inner is a 1200 container, flex column, gap 32.
- **Breadcrumbs** (`nav > ol`): flex, gap 8. Items are Sans 12/18 500 -0.12 #666c80 with a separator. Hover #242633 plus underline. 2 crumbs.
- Row: grid `552 552`, gap 48.
  - Media left: 552x311 (16:9), bg #e5e9f0, radius 2, img cover.
  - Content right, vertically centred, flex column gap 24:
    - date: Mono 14/17.5 400 #666c80 (len 15-25);
    - H1: Sans 36/45 500 -1.08 #242633 (L1-2);
    - optional subtitle: 18/27 500 #666c80.
- 390: padding 89 0 43. Single column, media first (358x201). Gap 16 (21 for the outer column). Crumbs 10/15. Date 12/15. H1 24/30 -0.72. Subtitle 14/21.

### 2.4 `SidebarIndexLayout` (/news and /legal index)

- Root: bg `linear-gradient(0deg, #93aeff -375.36%, #fffbf3 78.44%)` (warm cream), border-bottom 1px #93aeff.
- C-inner is a 12-column grid (95.8 columns, no gap) with left and right borders 1px #93aeff.
- **Sidebar** (columns 1-4, 383 wide): `position: sticky; top 68`, padding 96 24, border-right 1px #93aeff.
  - Title: Serif 90/94.5 **300** -2.88 #666c80 (len 4-5).
  - Nav list (`ul`, border-left 1px #658dfd, padding-left 20, grid gap 8 20):
    - level-one links Sans 20/30 600 (#265cff when current, otherwise #0b2471);
    - level-two nested list with the same border, margin-top 12.
  - Notice: 14/20 400 #265cff, padding-top 24.
- **Content** (columns 5-12, 767 wide):
  - Sections separated by **border-top 8px #265cff**.
  - Section heading: Sans 28/32.2 500 -0.84 #0b2471, padding 20 20 0, margin-bottom 20 (/legal only; visually hidden on /news).
- Rows:
  - `contentArticleRelease`: grid `32px 1fr`, gap 12 24, padding 20, border-bottom 1px #93aeff. Holds a 32x32 cobalt icon (masked SVG), a title (h6 Sans 20/22 500 -0.6 #0b2471, L2) and a date (Mono 14/22 500 -0.3 #265cff).
  - `contentArticleCoverage` (/news press coverage): grid `433.67px 197px`, gap 20 96. Title 20/22 500 #0b2471. A `meta` cell (border-left 1px #93aeff, padding 20 0 20 32) holds the outlet name (h6 20/22 500) and the date.
  - Row hover: bg #fff, title colour cobalt, arrow opacity 1 and translateX(4px). Transition bg .2s ease-in-out.
- **"Show more" toggle** (`contentArticlesToggle`): full-width 20/28 500 #265cff, padding 20, border-top 1px #93aeff, hover bg #fff. Expands the hidden rows; the toggle hides when open. /news shows 10 coverage rows plus the toggle, then a release list.
- 390:
  - Single column. Sidebar padding 48 12 (legal 96 24). Title Serif 60/60, margin-bottom 96.
  - /news adds a sticky 2-tab `mobileNav` (top 67, grid 195/195, border-top and border-bottom 1px #265cff, tabs 20/30 500 #0b2471, padding 20 2) instead of the sidebar list.
  - Rows padding 20 12, single column.

### 2.5 `GatedLanding` (guide, event, most report-landing, podcast): see §4.6

### 2.6 `SectionHeroForm` (demo, product tour, tool, product-tours index): see §3.33

### 2.7 `FeedCard` and `FeedGrid` (blog, guides, events indexes and RelatedContent): see §4.3

### 2.8 `InlineCtaForm` (newsletter / email catcher band)

Used on feed indexes (as an inset in the grid), blog posts (`BlogPostTemplate.newsletter`), compare and energy-management.

- Section padding 64 24 (inside feeds the 1440-wide `FeedGrid.inset` row).
- Card 1152, grid `503 503` (or 504), gap 48, padding 48, `align-items: end`. Variants:
  - **Outline** (feeds, blog): border 1px #c0d0f0, plus four 64x64 **corner brackets** outside the card corners at (-63,-63). Each is a pair of 1px gradient lines `linear-gradient(to top, #c0d0f0, transparent), linear-gradient(to right, #c0d0f0, transparent)`, mirrored per corner.
  - **Filled** (compare): bg #f5f7fa, radius 2, no corners. A right-half image (576x238, cover) under a `mediaFade` `linear-gradient(to right, #f5f7fa, transparent 60%)`. The form sits over it.
- Copy: H2 Sans 36/45 500 -1.08 #242633 (L1), margin-bottom 16. Description 18/27 500 #666c80 (L2-3).
- Form: the email catcher (§1.5).
- 390: not measured. Stack the copy above the form (same rules as §1.4).

### 2.9 `Faq` accordion (reused by product, company, compare, ai-emissions landing)

- Section padding 80 0. Grid `350px 754px`, gap 48.
- **Sidebar** (flex column, gap 32):
  - header (gap 16): mono eyebrow (len 3, "FAQ") and H2 `section-title` 35/38.5 500 -1.05 (L1-3);
  - **CTA box**: bg #f5f7fa, border 1px #e3ebff, radius **8**, padding 16, gap 16. Holds strong 16/24 700 #242633 (L1-3), optional p 16/24 400 and the FAQ CTA button (§1.3, 316x44).
- **Items** (Radix Accordion, single):
  - Trigger `button.itemTitle`: Sans 16/22 600 -0.16 #242633, padding 16 0, 56 tall per line. A 24x24 chevron (fill midnight #0b2471) on the right. Closed chevron is rotated; open is `rotate(0)`. Transition `transform .25s cubic-bezier(.85,0,.15,1)`.
  - Panel: Sans 14/20 500 -0.14 #666c80, width 720, margin-bottom 20 when open. Open/close keyframes `slideDown`/`slideUp` .3s cubic-bezier(.85,0,.15,1) (Radix height var).
  - The first item is open on load. No borders between items.
- 390: 1 column, gap 21. Sidebar gap 21. CTA box padding 11.

### 2.10 Scroll-reveal (the only reveal pattern on the site)

This applies **only to `PageLinks` cards** (gated landings).
- Cards start at `opacity 0; transform translateY(50px)`.
- When the section crosses an IntersectionObserver threshold of **0.25**, they animate to opacity 1 / translateY(0) over `.5s cubic-bezier(.215,.61,.355,1)`.
- **Stagger is 0.1s per card**, via `--slide-index` (0, .1s, .2s). Only the visible slides are staggered; off-screen slides have 0 delay.

Everything else is static on load (as on the homepage). Do not add other reveals.

---

## 3. Block library (for `BlockPage`)

Positions are at 1440 unless noted. Section paddings are given as top/bottom.

### 3.1 `Hero.defaultRoot` (product, industry, solutions, about, ai-fellowship)
- Header bg `linear-gradient(#f5f8ff 0%, #fff 100%)` (about-us uses #f5f7ff→#fff). Padding 80 0.
- C as a grid `552 552`, gap 48, `align-items: center`.
- Left (flex column, gap 32):
  - text group (gap 20): eyebrow+title group (gap 12) with mono eyebrow 14/20 400 #265cff (len 7-20) and **H1 48/52.8 500 -1.44 #242633** (len 30-65, L2-3);
  - subhead 20/30 500 -0.2 #666c80 (len 100-300; can be several paragraphs, L2-6);
  - CTA group (flex, gap 12): primary 151x47 (`shineAnimation`), optional light button (`colorLight`) 115x47.
- Right `Hero.media`: 552x552 square, radius 2, img cover. `mediaNatural` variant is 552x557 contain. Some images are 16:9 inside the square crop.
- Motion: IntersectionObserver threshold .05 on the header (no visual change measured).
- 390:
  - Padding 53. Grid 1 column, gap 32. Content gap 21, text gap 13, eyebrow gap 8.
  - H1 32/35.2 -0.96. Subhead 20/30 (L4). Buttons 119x40 / 90x40 (gap 8, wrap).
  - Media 358x358 **below** the text.

### 3.2 `Hero.videoRoot` (/platform/disclosures, /solutions/product-footprints)
- Padding 128 0 80. Shell (C, flex column, gap 64):
  - Header (flex column, gap 32): H1 `videoTitle` **64/64 500 -2.56 #242633** (812 wide, L2).
  - Meta row (flex, space-between, align-end, gap 24): subhead 20/30 (720 wide, L5) on the left; CTA group (gap 16) on the right: primary 115x47 and light 151x47.
- Media 1152x648 (16:9), bg #041330, radius 2:
  - poster img cover plus an autoplay muted preroll `<video>` (webm 1920x1080, cover);
  - centred **play button** 160x160, radius 2, shadow `0 12px 40px rgba(0,0,0,.24)`, with a CSS-triangle icon 46x56 white;
  - hover transition `transform, box-shadow .18s ease`.
- 390: not measured. Stack, media full width 16:9.

### 3.3 `Logos` (`.small` / `.medium`): logo strip under heroes
- `small`: padding 16 0, height ~159-186. `medium`: padding 40 0, height ~227.
- A mono label above the strip: 14/20 400 -0.14 #265cff (len ~35), centred, width ~290-306.
- Strip: `LogoCarousel` from x 90 to 1350 (1260 wide), height 19-46. Same mechanics as homepage §3.6:
  - monotone mask #666c80, colour layer opacity 0;
  - hover swaps them with opacity .25s ease-in-out;
  - wrapper opacity .4s ease;
  - IntersectionObserver threshold 0 starts/stops it.
- 390: padding 11. Label 12/13. Strip height 14.

### 3.4 `TextWithImage` (the most common block)
- Section padding 96 0. Inner grid `552 552`, gap 48, `align-items: center`. `rightAligned` swaps the sides (image right).
- Media 552x552 (557 box), radius 2, img contain (1080x1080 source).
- Content (max-width 520, flex column, gap 32, `justify-content: center`):
  - optional mono eyebrow (len ~36);
  - H2 `section-title` 35/40.95 500 -1.05 #242633 (L2);
  - body 18/27 500 #666c80 (len 220-300, L4-6);
  - **feature list** with a left rule: border-left 1px #93aeff, padding-left 12, gap 16, 2-5 items. Each item is clickable (`cursor:pointer`), Sans 16/19.2 600 normal tracking, L1-2. The **highlighted item is #242633, others #666c80**, transition color .4s cubic-bezier(.4,0,.2,1). The first item is highlighted on load; no auto-cycling was observed over 11s.
  - Some instances have a CTA instead of a list.
- Motion: IntersectionObserver threshold .3 per section (no visual change measured).
- 390: padding 43. Grid 1 column, gap 16, x 8 (374 wide). **Text first, image after** (374x379). Content gap 21. H2 28/32.76. Body 14/21. List gap 11, padding-left 8, items 13/15.6.

### 3.5 `TextWithImageOrderedList` (industry pages)
- Section padding 96 0. Up to 4 stacked items (`section.item`), each a grid `512 512`, gap 48, inner width 1072 (x 184-1256), alternating `rightAligned`.
- Spacing between items: item tops at 1075, 1623, 2252 and 2895, so about 192 between items.
- Media 512x341 or 512x288, radius **16**, contain.
- Content box (`showBoxNumbers`): border 1px #93aeff, padding 32, flex column, gap 24, max-width 520. Holds:
  - H2 35/40.95 500 (446 wide, L3-4);
  - body 18/27 (L3-6);
  - `cta-link-mono` (len ~10).
  - The step numbering is shown via the box (no visible numeral text was measured).
- 390: padding 64. Items 1 column (366 wide, x 12), gap 24, media 366x244 first. Box padding 32. H2 28/32.76. Body 14/21.

### 3.6 `Quote` (single testimonial with logo tile)
- Section padding 96 0. `quoteContentWrapper` is a 12-column grid (52 columns, gap 40 48, align-center).
- Logo tile (columns 1-4): a 352 cell with 12 padding, `logoInnerBorder` 328x328 (border 1px rgba(36,38,51,.1), radius 2) and `logoInner`, padding 40. bg is `linear-gradient(#fff 16%, rgba(255,255,255,.89) 39%, rgba(255,255,255,.71) 57%, transparent 100%)` over `radial-gradient(circle at 0% 100%, <per-customer tint>, …)`. Logo about 144x49, contain. Use a neutral pale-blue tint.
- Quote (columns 5-12, x 544, 752 wide, flex column, gap 32):
  - row (gap 16): QuoteMark SVG 33x28 plus quote text **Serif 24/31.2 400 #333e63** (len 150-340, L3-6);
  - author row (offset 49, flex, space-between): photo 48x48 circle (2px rgba(255,255,255,.15) border, img 44 cover), name 16/19.2 600 #333e63, title 14/16.8 500 #6e7786 (gap 4);
  - optional **nav arrows** 40x40 circles (prev #c1d2fe, next #658dfd, masked icon; same as the homepage carousel) when there are several quotes. Opacity transition .2s.
- 390: padding 64. Stacks centred, gap 40. Logo tile 240 (inner 216, padding 28). Quote 18/23.4 (325 wide). Name 13/15.6. Title 12/14.4.
- Variant **`Quote.singleBackgroundRoot`** (/solutions/ceda): full-bleed 1440x677, bg #242633, photo cover plus dither overlay. Quote Sans 24/36 400 white, 676 wide, L6. (Layout centred; measured 1440 only.)

### 3.7 `PageLinkSet` ("related pages" cards, product/company)
- Section padding 64 0. C with padding 24, flex column, gap 40.
- Title: h4 **35/38.5 500 -1.05 #0b2471** (L1).
- keen-slider of 3 visible cards (363 wide, pitch 395, so gap 32):
  - card: flex column. Media 363x204, radius 5, cover;
  - content padding-top 16, align-start: eyebrow Mono 13/13 400 #265cff (len 5-19), title h6 20/22 500 -0.6 #242633 (L1-2), CTA "Learn more" 16/19.2 500 #265cff plus arrow (gap 8).
- Hover: `cardInner` bg #fff (transition .2s ease-in-out); CTA span translateX(4px) (.2s ease-in-out).
- When there are more than 3 cards, a nav row shows: prev/next 32x32 (padding 8, hover opacity .7) and dots, centred, gap 16.
- IntersectionObserver threshold .25 on the section (no reveal measured; cards visible).
- 390: container padding 16. Cards 293 wide (pitch 325), media 293x165. The next card peeks.

### 3.8 `MicroFeatureCarousel`: REUSE homepage §2.6 (see table in §0)

### 3.9 `ContentCards`: REUSE homepage §2.10 (see table in §0)
- 390: header column (gap 16), button 179x40, cards 1 column, gap 21. Image 358x201. Title 16/20. Description 13/19.5.

### 3.10 `Faq`: §2.9

### 3.11 `FeatureText` (big centred statement)
- Section bg #fff, padding 96 0. H2 **48/60 400 -1.44 #242633**, centred (`headerContent` 369-569 wide), L1. 252 tall total.
- `.sectionHeading` variant is the same.

### 3.12 `SectionTextBlock` (plain prose band)
- Section padding 96 0. `.blog-post` column **752** wide, centred (x 344). Prose at **18/27** 500 #666c80, paragraph margin-bottom 18. Links #265cff.
- **`Annotation`** margin notes are absolutely positioned outside the column (x -298 and x 1450 at 1440, so off-screen). They hold a 288x192 image, a top 1px #0b2471 rule (padding 24) and an 18/27 caption. They are not visible at 1440 or 390: **do not render**.
- `.withToc` variant is the `TocSidebar` layout (§2.2) with a Serif H1 45/47.25 300 #666c80, 20/30 prose, images 696 wide and embedded tables.

### 3.13 `Grid` (2- or 3-column item grid)
- Section padding 96 0, bg #fff.
- Header (margin-bottom 80, max-width 752): H2 `h3 f-w-500` 36/45 500 -1.08 #242633; optional subtitle 18/27.
- Items:
  - `itemsThree`: 3x352, gap 48. Item: image 300x180 (margin-bottom 24), description 16/24 500 #666c80.
  - `itemsTwo`: 2x552, gap 48. Item: Mono number 14/16.8 #265cff (len 1), title h5 24/30 500 -0.72, description 16/24 (L3-4).
- 390: not measured. 1 column.

### 3.14 `HorizontalRule`
- `.medium`: padding 24, rule 1152x1, border-top 1px #e3ebff (cobalt-10).
- `.none`: 0 height spacer rule.

### 3.15 `Spacer`: 96 tall empty div.

### 3.16 `Video.medium` (YouTube embed)
- Section padding 24.
- `videoWrapper` 680x397, centred, border 1px #93aeff, padding 16. iframe 646x363 (16:9) with its own 1px #93aeff border.
- Use a 16:9 placeholder; do not embed.

### 3.17 `CustomerPhotoFeature` (3 photo stat cards)
- Section padding 96 0.
- Header (flex, space-between, baseline): H2 36/45 500 (L1) and a `VideoLink` CTA.
- keen-slider of 3 cards, each **379x505**, gap 8, radius 2, padding 24:
  - bg photo (cover);
  - `cardOverlay`: a bottom-heavy eased gradient from rgba(4,18,47,0) at 33% to about .6+ at the bottom;
  - logo (white) top-left, about 125x25;
  - body (bottom, gap 24): stat block (gap 8) with a metric **64/64 300 -1.92 white** (len 6-9) and a caption 16/19.2 500 rgba(255,255,255,.8) (240 wide, L1-2); then a blockquote Serif 18/22.5 400 -0.54 white (L4-5).
- Nav buttons hover #265cff.

### 3.18 `ContentGrid` (2x2 media cards)
- Section padding 96 0. Container flex column, gap 32.
- Header (space-between, align-end): title 36/45 500 (447 wide); description 18/27; a `colorTextDefault` link button.
- Rows of grid `576 576`, gap 0. Cells share 1px #c0d0f0 borders, bg #fff, padding 24, flex column, gap 24:
  - media 526x297 (16:9, bg #f5f7fa, cover);
  - body (gap 12): title 21/26.25 500 -0.63 (L1), description 16/24 500 #666c80 (L1-2).

### 3.19 `InlineCta` (three variants)
- `.recessed`: full-bleed band bg #fbfcfd, borders 1px #c0d0f0 top and bottom, 81 tall. Inner 1152 has left and right 1px #c0d0f0 rules, padding 16 24, centred row, gap 24: text 18/27 400 #666c80 (L1) plus a primary button 151x47.
- `.inline`: transparent band, bg rgba(255,255,255,.5). Inner max-width 635, padding 64 0, centred. Title 18/27 400; subtitle 20/30 500 (L2); primary button 152x47.
- `.stacked`: borders 1px #265cff top and bottom. Inner 1128 (x 156), padding 64 40, space-between. Left: 32x32 cobalt icon, then title h6 20/22 600 -0.6 #0b2471 and subtitle 20/30. Right: primary withArrow button 136x47.

### 3.20 `CenteredAgent` hero (/platform/sustainability-ai)
- Header bg #fff, padding 96 0. **Unicorn Studio WebGL canvas** 1440x900 behind (same unmeasurable gradient field as the homepage §2.7; use the CSS blob substitute).
- Overlays:
  - `overlay`: `linear-gradient(#fff 0%, #fff 40%, rgba(255,255,255,.62) 68%, transparent 100%)`, 513 tall;
  - dither `textureOverlay`.
- Container flex column, centred, gap 96. Content (centred):
  - **announcement pill**: 285x34, bg #f5f7fa, border 1px #e6ebf5, radius 80, padding 4 4 4 14. Mono 14/17.5 #265cff label (len ~28) plus an arrow chip;
  - H1 **72/72 500 -2.88 #242633** (1152, L2);
  - subhead 18/27 (702, L2);
  - CTA row (gap 12, centred): primary 151x47 and light.
- PromptChat (752 wide): homepage §2.7 prompt card and chips, identical.

### 3.21 `QuoteVideo` (`.medium` / `.small`)
- Section padding 96 (medium) or 64 (small).
- `callout` 1152x433: radius 2, border 1px rgba(36,38,51,.1), bg **#ebece4** (medium) or **#e3ebff** (small). A 12-column grid:
  - columns 1-8: thumbnail 767x431 cover, plus an autoplay muted preroll webm (medium only), plus a centred **play trigger** 80x80 square bg #265cff (hover opacity .8, transition bg/opacity .12s);
  - columns 9-12: `quotePane` 479 wide, padding 32 48 32 32, flex column, `justify-content: end`, gap 32:
    - blockquote Serif 24/30 400 -0.48 #041330 (L5-8);
    - meta row (space-between): name 16/20 500 -0.48 and title 14/17.5 #041330 on the left, logo 90-115 wide on the right.

### 3.22 `FeatureLarge`
- Section bg #fff. Container padding 80 24 0, flex column, gap 80.
- Hero (gap 32): eyebrow (18x18 icon plus mono 14/20); columns row (gap 48): H2 36/42.12 **400** -1.08 (552, L2) and body 18/27 (552, L3).
- Feature grid 4x270, gap 24, padding 24 0. Each item has gap 12: title 16/18.72 400 -0.48 #242633 and description 14/19.6 500 #666c80 (L2).

### 3.23 `InfoCards.withBackgroundImage` (/solutions/california)
- Section padding 64 0, full-bleed photo bg 1440x486 (cover).
- Grid `368 736`, gap 48. Left: H2 h4 35/38.5 500 **white** (L2).
- Cards 2x352, gap 32. Each card: border-left 1px rgba(255,255,255,.3), padding 24 24 24 32, flex column, gap 48:
  - pill (99x34, bg rgba(255,255,255,.15), border 1px rgba(255,255,255,.3), radius 80, padding 4 12 4 4, 24px icon plus 14/16.8 500 white label);
  - body 20/30 500 white (L3-6).

### 3.24 `TextWithImageList` (alternating rows, 12-column grid)
- Section padding 64 0 12. Rows: C as a 12-column grid (77.65 columns, gap 32 20), `align-center`, rows about 79 apart.
- Image 515x312 / 515x426 (no radius). Text wrapper 468 wide, flex column, centred:
  - H2 h4 35/38.5 **400** #0b2471;
  - body 20/30 (L4-5);
  - link 20/30 #265cff.

### 3.25 `TextWithList` (/platform/disclosures/csrd)
- Section padding 64 0. A 12-column grid.
- An 80x80 icon at top, then intro title **60/66 400 -1.8 #0b2471** (664 wide).
- Description 20/30 (L14). Subtitle h6 20/22 600 #0b2471. A list of 5 li at 20/30.

### 3.26 `Tables` (comparison tables)
- Section padding 64 0. A 12-column grid.
- Title 36/45 400 -1.08 #131b24. Description 16/24 #666c80 (524 wide).
- Table wrapper 1152, border 1px #e6ebf5 (top/left/right), radius 2:
  - rows: alternate rows bg #f5f7fa;
  - cells padding 12, border-right and border-bottom #e6ebf5;
  - group header 18/22.5 600 #242633.
- Legend (`Table.legendItems`): grid, gap 12 24, 14/20 #666c80.
- `iconColumns` variant uses check/cross icons in the cells.

### 3.27 `TextWithLogos.gridRoot`
- Section padding 160 0 96. Container flex row, gap 48.
- Left (520): H2 36/42.12 500 (L2), body 20/30 (L3).
- Right: logo grid 3x184, 416 tall, bg = dither texture:
  - cells 185x105 with mixed styles: `logoCellLogo` (white, border 1px #93aeff); `logoCellCutout` (transparent, shows the dither; border #93aeff or #c1d2fe); `logoCellEmpty` (white, no border);
  - one `gridCtaCell` spans 2 columns (369x105, bg #e3ebff, border #c1d2fe, padding 8) with a link 21/29.4 400 #265cff and an arrow that moves on hover (.2s);
  - an `overflowTile` pokes out to the left of the grid.
- Logo swap animation: opacity/transform .4s cubic-bezier(.22,1,.36,1).

### 3.28 `PersonnelSlider` (/solutions/ceda)
- Section padding 96. Header grid `1032 88` (align-end): title h3 36/42.12 400; 2 paragraphs 16/24 (520 wide); controls (2x 40x40 circles, bg #265cff icons, gap 8).
- Slide list: a full-bleed grid of 240 cards, gap 16, padding 0 144. Card: border 1px #c0d0f0, bg #fff, photo 240x240 (bg #e5e9f0, cover), text padding 16, gap 4. Name 18/22.5 400. Role 14/21 #666c80.

### 3.29 `LargeBackground` hero (/solutions/ceda)
- Padding 128 0 80. bg gradient #f5f8ff→#fff with a large illustration (926x1005, contain) centred behind.
- Content centred: a logo image 161x84, H1 **64/64 400 -1.92** (960, L2), subhead 20/30 (720, L3), a small primary button 108x36 (padding 4 16).

### 3.30 `ContentForm.cedaRoot`
- Panel 1152x664: border 1px #c0d0f0, grid 575/575.
- Left: option rows (padding 24, separated by borders), each with h3 21/26.25 400, p 16/24 and a list.
- Right: form (padding 32): title 21/26.25 400 and the HubspotForm (2-column rows, gap 12).

### 3.31 Compare-only blocks
- **`HeroCompete`**:
  - Header bg `linear-gradient(#f5f8ff, #fff 80%)`. Inner (1152, flex column, gap 80, centred), starting 96 below the nav.
  - Intro (centred): eyebrow Mono 14/17.5; H1 **64/64 500 -1.92 #242633** (L1); body 18/27 (702, L3); an email catcher 552 wide.
  - **Panel** 1152x408: border 1px #e6ebf5, radius 2, padding 20, gap 20. Header row: title 24/30 500 -0.72 and a `colorTextMono` link. Stat grid 4x271.5, gap 8:
    - tiles 272x316: bg #fff, border 1px rgba(4,19,48,.12), radius 2, padding 20, space-between;
    - value 64/64 300 -1.92, label 21/26.25 500 (L1-2), description 16/19.2 500 rgba(4,19,48,.8);
    - some tiles are full-bleed photos; `statTileDark` uses white text on a photo.
  - **Proof strip**: full-bleed, borders 1px #e6ebf5 top and bottom, 170 tall. A 3-column grid of 383 cells (border-right #e6ebf5), padding 64 24 24, align-end, each with an 80x80 badge, a title 18/22.5 500 and a description 12/18 #666c80. Decorative 528x168 graphics fill the outer gutters. The arrow icon colour transitions .12s.
- **`Stats.ruledRoot`**: padding 96. Grid 4x287.75. Cells have a 1px #c0d0f0 border, padding 20, gap 16. Value **72/72 300 -2.16 #265cff**. Description 16/19.2 500 #666c80 (L2-3).
- **`FaqFullWidth`**:
  - Padding 96 24. Centred `SectionHeader.centered` (H2 36/45, 752).
  - Items 952 wide (x 244), border-top 1px #e6ebf5. Trigger padding 24 0, gap 16, question 21/26.25 **600** -0.63. Caret transition .25s cubic-bezier(.85,0,.15,1).
  - Content padding-bottom 24, gap 20, 16/24 400 #666c80. A **proof** line underneath (border-top 1px #e6ebf5, padding-top 16, 12/18 #666c80 with an underlined link).
  - Collapse via `grid-template-rows .3s cubic-bezier(.85,0,.15,1)`.
- **`TableQuestionsStats`**:
  - bg #f5f7fa, padding 96 24. Header grid 552/552, gap 24 48, align-end: eyebrow Mono 12/14.4 #242633; H2 36/45; body 18/27 400.
  - Table rows: border-top 1px #e6ebf5, 97 tall. th Mono 12/14.4 #265cff, question 24/30 500 -0.72, answers 16/24 400.
  - Numbers: label Mono 12/14.4 #265cff, then 4 tiles 282x160, gap 8, radius **6**, padding 24, gap 12:
    - bg `rgba(147,174,255,.08)` plus `linear-gradient(transparent, rgba(245,248,255,.5))`;
    - inset shadows `0 0 0 1px rgba(255,255,255,.64) inset, 2px 2px 4px rgba(4,19,48,.08) inset, -3px -3px 8px rgba(255,255,255,.32) inset`;
    - value 48/52.8 300, description 14/21 400 rgba(4,19,48,.8);
    - the last tile is a CTA (title 21/26.25 500 plus a primary button 171x47).
- **`QuoteFeatures`**:
  - Padding 96 24. `SectionHeader` row (H2 36/45 plus body 18/27, 752; primary withArrow button right).
  - Feature row grid 552/552, align-center: quote (gap 24) in Serif **28/35 400 -0.56 #242633** (L6) with a Mono 12/14.4 #666c80 figcaption; image 552x552.
  - Then 4 feature items (252, gap 48), each with title 16/18.72 500 -0.48 and description 14/21.
- **`FeatureGridNumbered`**:
  - Padding 96 24. SectionHeader as above.
  - Grid 3x384, gap 12 0. Cards share 1px #c0d0f0 borders, bg #fff, padding 24, gap 16:
    - Mono number 12/14.4 #265cff (len 2);
    - title 24/30 500 -0.72 (L1-3);
    - description 16/24 500 (L4-7).
  - One `cardWide` spans 2 columns and embeds a LogoCarousel (monotone #242c47).
- **`LinkList`**: padding 64 24, centred. Caption 16/24. Chips are wrap-centred, gap 12; each chip is 40 tall, padding 8 14, border 1px #e6ebf5, radius 2, 14/21 500 #242633. Hover border #c0d0f0 and text cobalt (.12s).
- **`QuotesCarousel`**:
  - Padding 96 0. Header (baseline): H2 35/40.95 plus a `colorTextMono` link.
  - keen-slider of cards 384 wide: border-left 1px #658dfd, padding 0 24, gap 20 (content gap 40, space-between):
    - heading 24/26.4 600 -0.72 #265cff (len ~11, e.g. a stat);
    - quote Serif 18/22.5 400 -0.18 #0b2471 (L2-5);
    - byline: name 16/19.2 600 -0.48, detail 14/16.8 #666c80.
- **`CustomerPhotoFeature`**, **`InlineCtaForm`** (filled), **`Faq`**, **`TextWithImageOrderedList`**, **`Logos.small`**: as above.

### 3.32 LP-only blocks (`/lp/*`)
- **`heroSection`**:
  - 12-column grid. Left: eyebrow Sans 16/22 600 uppercase #265cff; H1 **60/66 300 -1.48 #666c80** (L3); body 20/30; primary withArrow button 144x47.
  - Right (566x414): a `ProductScreen` (an HTML mock dashboard: title 20/24 600, chart title 14/16.8 600, legend keys 10/12) plus a floating legend card.
  - A mouse-follow `highlight`: radial-gradient 650px circle, rgba(255,255,255,.25), opacity on hover .2s.
  - Use a placeholder image.
- **`Header.root`** (also /partners): bg `linear-gradient(#ebf0ff, #fff)`, padding 72 0 46.
  - A centred **arched blob** container 580 wide: bg #ebf0ff, `border-radius: 50% 50% 100px 100px`, `box-shadow: #ebf0ff 0 0 720px 90px` (a soft halo), padding 24.
  - Contents: eyebrow 14/20 uppercase #265cff; H1 45/49.5 400 #666c80; body 20/30; a mono link with border-top 1px #5d93ff.
- **`AnimatedSteps`**:
  - Borders 1px #265cff top and bottom. Headline 48/56.16 400 -0.4 #0b2471 (L1).
  - Grid 576/576. Left: 3 items, each padding 48 24, gap 16, with Mono index 16/19.2 500 #265cff and title strong 28/30.8 500 #0b2471 plus a description. Right: a stage image.
  - Progress: `item-progress` opacity .25s cubic-bezier(.22,1,.36,1). An indicator bar transform .05s linear (JS-driven progress). An autoplay cycle like ProductOverview (interval not sampled; use 6s).
- **`CTASection.slim`**: container 1152x64, radius 6, padding 12 24, bg `linear-gradient(to left, #265cff 0%, #e2f5fa 100%)`. Title 21/23.1 600 -0.63 #0b2471. Button 136x40 with Mono 14/21 500 #fffbf3 text.
- **`FeatureGrid`**: padding 96. Title 32/40 500 -0.96 #0b2471. 3x368 cards (gap 24, `outlined` border) with heading 21/26.25 600 and body 16/24 400 (L6-7).
- **`FeaturedHubspotForm`**: border-top 1px #93aeff, bg `linear-gradient(#fff, rgba(219,235,231,.31))`, padding 72 0 24. Centred title h3 35/40.95 400 #0b2471, body 20/30 (580), HubspotForm 474 wide (8 fields).

### 3.33 `SectionHeroForm` (demo / product-tour / tool hero: shared primitive)
- Full-bleed section starting at y 0 (no promo bar on demo/tours) or y 40 (tool). Padding-top 116 to the layout, which is a grid `566.14 537.84`, gap 48, padding-bottom 40, `align-items: start`.
- **Themes:**
  - `darkTheme` + `hasBackgroundImage` (/demo, /demo/csrd): bg #041330 plus a photo (cover) plus a dither grid overlay (opacity .85). Text white or rgba(255,255,255,.8).
  - Light (tours, tool): bg #fff with `linear-gradient(#f5f8ff 0%, #f5f8ff 28%, #fff 70%)` plus the dither grid.
- **Copy column** (552, grid, gap 40, padding 48 0):
  - optional eyebrow (flex, gap 8: dot plus Mono 14/16.8 #242633, or white on dark);
  - title block (gap 24): H1 **48/48 400 -1.44** (#041330, or white) (L2-3); lead 16/24 500 (#666c80, or rgba(255,255,255,.8)) (L2-5);
  - copy blocks (gap 40):
    - **featureList**: grid, gap 12; items flex, gap 8, with a check icon and 16/19.2 600 text (#666c80, or rgba(255,255,255,.86));
    - **stats** (dark): grid 272/272, gap 8. Glass tiles: bg rgba(255,255,255,.01), radius 5, padding 24, `backdrop-filter: blur(4px)`, the homepage glass inset shadow. Value **48/52.8 300 -1.44 white**, description 14/18.2 500 white;
    - **statsLabel** list (tours index): Mono 12/14.4 +0.6 #265cff, then 4 items with title 14/17.5 500 -0.42 #041330 and description 12/18;
    - **heroQuote** (tool): blockquote Serif 21/26.25 400 -0.42 #041330 (L4), a byline with a 40px round photo (bg #e3ebff), name 16/19.2 600 -0.48 and title 14/16.8 #666c80.
- **Form column**: `position: sticky; top 92`.
  - `formFrame`: padding 8, radius 8, `backdrop-filter: blur(4px)`. Dark: bg rgba(255,255,255,.01) with the glass inset shadows. Light: bg rgba(147,174,255,.08), shadow `inset 0 1px 0 rgba(255,255,255,.6), 0 0 0 1px rgba(4,19,48,.06)`.
  - `formBodySolo` (demo): white, radius 2, padding 32, gap 24. An intro row holds a title h2 24/26.88 500 -0.2 #242633 (L2) and 3 overlapping 40px round avatars (-8 overlap). Then the form (8 fields).
  - `formBodyBanner` (tours, tool): a `formMedia` image 522x294 (radius 2 2 0 0) above a white body (padding 48 32, radius 0 0 2 2) with the form (5-6 fields).
- **Logos strip** at the bottom of the hero: label Mono 14/16.8 +0.7 (#265cff, or rgba(255,255,255,.9) on dark), centred, then a full-bleed LogoCarousel (white logos on dark).
- 390 (/demo):
  - Section margin-top -68, inner padding 100 11 0. Grid 1 column (368), gap 16.
  - **Form comes second** (after the copy). Frame padding 5; body padding 21, gap 16; form full width 316.
  - Logos label 12/14.4.

### 3.34 Other bespoke blocks (one page each; build when that page is built)

| Block | Page | Key measurements |
|---|---|---|
| `HeroWithCarousel` + `HeroFooter` | /platform/marketplace | Header 1176 wide (x 132), padding 64 0 64 64. Left: eyebrow 14/20 #265cff, H1 60/66 400 -1.8 #0b2471 (L2), body 20/30, primary withArrow button 192x47. Right: a keen-slider of 502x330 image slides with a Mono 16/16 500 uppercase #265cff caption and 10 dots (gap 8). HeroFooter: description 16/22 plus a mono link. |
| `AnimatedGallery` (+ WatershedMarketplace / EmissionGraphs / Portfolios) | /platform/marketplace | 3 sticky stacked sections (each 1176x~706, header padding 40 40 57 24, eyebrow Mono numerals, H2 h4 35/38.5 500 #0b2471, body 20/30). Rows of 196x122 image tiles slide in (JS). Scroll-driven; only the static layout was measured. |
| `PeopleCarousel` / `Advisors` | /platform/marketplace | H3 48/52.8 400 #0b2471. Grid of 240-wide cards, gap 16, border 1px #93aeff, image 238x209, eyebrow Mono 14/20, name 14/20 #265cff. |
| `CTAForm.frame` | /platform/marketplace | Centred H2 48/52.8 400 -0.48 #0b2471, HubspotForm 544 wide (8 fields, 2-col rows 266/266). |
| `EnergyForecast` | /solutions/energy-management | Hero with a Unicorn canvas (as CenteredAgent): eyebrow, H1 72/72 500 -2.88, subhead 18/27, email catcher 552 wide. A `glassFrame` 752x332 (padding 0 16 24, gap 16) with a prompt pill (398x44, padding 10 16) and an `EnergyForecastChart` (SVG chart; use a placeholder). |
| `Interview` / `SideContent` | /climate-leads | Template `ClimateLeadsTemplate`: 1024-wide column (x 208). Sections padding 24. Avatar 160 round. H2 Serif 32/35.2 400 #000. Lead 18/28 600 #5d93ff. Body 18/28 500 #000. Pull quote Serif 48/60 500 #265cff with a `mark` highlight. Side logo 200x48 with a 1px #265cff top rule. |
| `blogPosts.themeImages` | /climate-leads, /partners | Border-top 1px #658dfd, padding 64 12. Title h5 28/32.2 500 #265cff. 3-column cards 310 wide (image 310x155, border-bottom 1px #93aeff; content padding 20; title 28/32.2 500 #0b2471; time Mono 14/22 uppercase #265cff). |
| `BrandTemplate` (Logo, Color) | /brand | Bordered section (left/right 1px rgba(13,89,242,.5)), padding 86 48. Logo grid 2x515 (gap 36 48) with light/dark 515x258 tiles plus a spec row (download chips). 9 colour swatches. **Brand marks are Watershed's own: use placeholders.** |
| `ChangeTemplate` | /change | Hero sections (`styles`), Grid.itemsThree (7 items, 352 wide, 627 tall with image), Quote, CTABar. Gated blocks. |
| `Manifesto` | /climate-economy | Single 752 column centred, padding 160 24 80. H1 64/64 500 -1.92 (L2). Body 18/27 (24 paragraphs). H2 32/40 500 -0.96. Figures 752 wide (gap 24). Footnotes 10/15 #666c80 with underlined links. Body links are underlined #666c80. |
| `Quiz` (+ RadioSelect, CheckboxSelect, Question) | /assessments/climate-disclosure | A 763x640 white card centred (x 339). keen-slider of 7 question slides (padding 40, gap 24). Radio and checkbox options are 25 tall rows (gap 15). The final slide is a HubspotForm 520 wide. Progress/next buttons. |
| `SOC2025Theme` + `FullWidthBackground` | /state-of-corporate-sustainability-ai-2026, /verdantix-2026 (and SOC 2025 guide) | Full-width hero 1440x400 (image). Content grid 568/568, gap 48. Text column padding 32, title 48/52.8 500 **#265cff** (L3), body 20/30. Form section with a HubspotForm 502 wide (8 fields). |
| `SummitEventTemplate` | /events/2023-climate-week (and other summit-style event pages) | bg #fffbf2 plus a 1800x2000 illustration, padding 64 0. Hero grid 595/397 (gap 112) with a form (325 wide). Speaker grid 4x240 (gap 24, cards 240x362). Session rows (flex, space-between, padding-bottom 48). Closing CTA wrapper (padding 40 48). |
| Careers (`jsx` styled) | /careers | `main.container` grid `691 461`, gap 24. Intro header spans both columns: bg #241f19 plus a photo, padding 80 48, white h1 35/38.5 600 and body 20/30. "Open roles" column: H2 32/35.2 600 #0b2471. **Filter pills** (Mono 14 uppercase, padding 5 10; active/hover bg #658dfd text #fffbf3, otherwise bg #f5f8ff text #265cff; `aria-checked`). Department groups (h3 23/25.3 600 #0b2471, padding 34 48 4) with job rows (li padding 12 40, radius 2, alternate rows bg #f5f8ff; title 20/30 500 #265cff, underline on hover; location Mono 14/21 #265cff, right-aligned, max 200). Job links go to `/careers/<id>-<slug>` (**not in ROUTES.json**). |

---

## 4. Templates

Format: sections top to bottom → **REUSE** (block/component plus differences) or **NEW** (refers to a primitive or block defined above).

### 4.1 `product` group (30 routes): ONE template = `BlockPage`, with no fixed section order

The groups do not split into distinct layouts. They share the same nav, footer and block set; only the block order and selection differ. Measured examples (the full list per page is in the appendix, §9):

| Pattern | Typical block order | Hero |
|---|---|---|
| `/industry/*` (6) | Hero.defaultRoot → Logos (small or medium) → TextWithImageOrderedList → Quote / Video.medium → Faq → PageLinkSet | defaultRoot |
| `/platform` | Hero → TextWithImage ×3 → ContentCards → TextWithAwards → Quote → Faq | defaultRoot |
| `/platform/measure`, `/platform/act` | Hero → (ProductOverview) → TextWithImage ×n → MicroFeatureCarousel → FeatureText → CustomerPhotoFeature → Quote → ContentGrid → InlineCta.recessed → ContentCards → Faq | defaultRoot |
| `/platform/disclosures` | **Hero.videoRoot** → Logos → MicroFeatureCarousel → TextWithImage ×2 → ProductOverview.modeLight → TextWithImage → Faq | videoRoot |
| `/platform/disclosures/{cdp,esg,issb,secr}`, `/platform/climate/tcfd`, `/platform/measure/carbon-accounting` | Hero → **SectionTextBlock(.withToc)** with embedded tables → Grid / FeatureText / TextWithImageList → InlineCta.inline → Faq → Quote → PageLinkSet | defaultRoot. These are the "long-form SEO" variant: they need `Prose` plus `TocSidebar` inside a block. |
| `/platform/disclosures/csrd` | Hero → TextWithList → TextWithImageList → Tables ×3 → Faq → PageLinkSet | defaultRoot |
| `/platform/disclosures/california` → **301 redirects to `/solutions/california`** (non-locale URL) | Hero → Logos.medium → InfoCards.withBackgroundImage → InlineCta.stacked → TextWithImage ×6 → Faq → PageLinkSet | defaultRoot |
| `/platform/marketplace` | HeroWithCarousel → HeroFooter → AnimatedGallery → Grid → Quote → Logos → PeopleCarousel → Faq → PageLinkSet → CTAForm | bespoke |
| `/platform/sustainability-ai` | **CenteredAgent** → QuoteVideo.medium → Logos → CustomerPhotoFeature → ContentGrid → InlineCta.inline → ContentCards → Quote → TextWithImage → FeatureLarge → ContentCards → Faq | CenteredAgent |
| `/solutions/{supply-chain,finance,csrd,california}` | Hero → (Logos) → (InlineCta.inline / MicroFeatureCarousel / Quote) → TextWithImage ×n → PageLinkSet → Faq | defaultRoot |
| `/solutions/ceda` | **LargeBackground** → TextWithImage → ContentForm.cedaRoot → Quote.singleBackgroundRoot → Quote → PersonnelSlider → TextWithImageOrderedList → Faq | LargeBackground |
| `/solutions/energy-management` | **EnergyForecast** → MicroFeatureCarousel → QuoteVideo.small → ContentGrid → ContentCards → Faq → InlineCtaForm | EnergyForecast |
| `/solutions/product-footprints` | Hero.videoRoot → Logos.medium → CustomerPhotoFeature → ContentGrid → TextWithLogos.gridRoot → InlineCta.inline → Tables(iconColumns) → Faq | videoRoot |
| `/solutions/consumer-goods` → **redirects to `/industry/consumer-goods`** | | |
| `/solutions/california/guaranteed-assurance` | SectionTextBlock.withToc only (a legal-style prose page) | none |

- Not fetched (network errors during sampling): `/platform/disclosures/rfp-guide` and `/platform/disclosures/secr`. They are in the same `/platform/disclosures/*` family; assume the cdp/issb long-form pattern.
- Build: the nav and footer come from the homepage, plus `BlockPage(blocks[])` with the §3 library.

### 4.2 `customers-index` (/customers)

Template `styles` (jsx/CSS-module mix). Nav opaque. Total height 10774 at 1440. All bands sit inside a C-wide frame with **left and right 1px #93aeff rules** and band separators (border-bottom 1px #93aeff).

1. **Hero** (header, 641 tall):
   - Grid of 3 x 383.65. Content spans columns 1-2 (767, padding 60, border-left 1px #93aeff): eyebrow **Sans 16/22 600 uppercase #265cff** (len 9); H1 **Serif 48/52.8 500 -1.44 #0b2471** (L3); body 20/30 500 #666c80 (L3).
   - Column 3 media 384x640: an autoplay muted video (webm, cover) with a centred glass **play button** 112x112 (bg rgba(0,0,0,.04), 1px #fff border, `backdrop-filter: blur(4px)`, hover bg rgba(0,0,0,.4), .2s) and a bottom **logo bar** 384x65 (2 cells, bg rgba(0,0,0,.04), border-top 1px #fff, blur 20px, white partner logos about 148x28).
   - 390: single column, padding 48. Media 358x269 below the text. Logo bar 63 tall.
2. **Logo grid** (233 tall): padding 64 48. A 6-column grid of 119-wide cells, gap 48 68, monotone logos (#666c80 mask, about 89x21). IntersectionObserver threshold 0, hover reveals colour as in the homepage marquee. 390: 3 columns.
3. **Featured stories carousel** (843 tall):
   - bg: dot grid `radial-gradient(#e3ebff 1px, transparent 0)` plus a bottom 120 fade `linear-gradient(transparent, #f5f8ff)`. Inner padding-top 32.
   - keen-slider (x 161-1279) of **30 cards, 351 wide, pitch 383** (gap 32). Each card (`styles.anchor`, 690 tall) has:
     - media 351x468: border **1px #265cff**, bg #f5f8ff, photo cover, with the customer logo centred over it;
     - an eyebrow H2 (Mono 16/16 500 #265cff, vertical; len 16);
     - title **Serif 24/26.4 500 -0.72 #0b2471** (L2-3);
     - footer 36 tall: borders 1px #032ca5 top and bottom, padding 6 0, space-between. Company name 14/22 500 -0.3 #666c80 plus a 14px arrow.
   - Card hover: `--overlay-opacity:1`, arrow translateX(4px).
   - Nav row (centred, gap 8): prev/next 32x32 plus a dot pager with an ellipsis (`navEllipsis` 10/10 #265cff).
   - 390: cards 265 wide, pitch 297.
4. **All customers grid + filters** (bg `linear-gradient(359deg, #fff 21.68%, #f7f9ff 59.56%, #fff 96.66%)`):
   - Header grid `704 350`, gap 32, padding **120 32**. H2 **Sans 48/52.8 400 -1.44 #0b2471** (L2). Filter form on the right: **3 selects stacked**, 350x42, gap 16, with floating labels ("Region", "Industry", "Type").
   - **Filter behaviour (measured):**
     - Select values: `region` = '' | `anz` | `europe` | `north-america`; `industry` = '' | `consumer-goods` | `financial-services` | `food-beverage-and-hospitality` | `manufacturing-and-industrial` | `professional-services` | `retail` | `technology` | `transportation`; `type` = '' | `customer-stories` | `climate-leads` | `milestones` | `reports`.
     - Changing a select filters the grid client-side immediately (83 → 29 for region=europe) and updates the URL to `/customers?region=europe` (replaceState, no reload).
     - Loading `/customers?industry=technology` or `?region=europe` pre-selects the select and pre-filters (32 / 29 cards). Params combine.
     - No pagination or "load more": all 83 cards render. Form transition `opacity, transform .3s ease`.
   - Grid: **3 x 383.65**, border-left 1px #93aeff. Each cell is 384x221. `anchorContent` has padding 24 and bg `radial-gradient(250px at 0 0, #fff, #f7f9ff)`, sitting 1px inside an `anchorHighlight` layer `radial-gradient(250px at 0 0, #ff6633, #265cff)`, which acts as a 1px gradient "border" that shows on hover.
   - The cell shows a customer logo centred (up to about 216x72, contain), title Serif 24/26.4 500 #0b2471 (L2-3), and footer 36 (borders 1px #032ca5; company 14/22 500 #032ca5 plus an arrow).
   - Hover: `--overlay-opacity:1`, arrow +4px. Card links go either to `/customers/<slug>` or to **external customer reports** (many ESG PDFs: see §7).
   - 390: header padding 48 16, single column. Grid 1 column (357), cells 189 tall.
   - IntersectionObserver threshold .2 on grid chunks (12 targets). No visual reveal measured.
5. **Quote carousel** (762 tall, padding 120 0):
   - Panes container 912 wide (x 264), radius 2, padding 64 0, bg `linear-gradient(127.16deg, #fffbf3 14.28%, #f5f8ff 71.56%)`.
   - Each slide (640 max, centred): logo about 100x60; quote h5 **Sans 28/36.4 400 #666c80** (L3-5); headshot 64 round; cite 20/24 600 -0.2 #0b2471; role eyebrow 14/20 #265cff.
   - 4 dots (16px SVG, gap 8) below.
   - 390: panes 228 wide.
6. **CTABar** (§1.2), then the footer.

### 4.3 `blog-index` (/news, /blog), `guides-index` (/guides), `events-index` (/events)

`/news` is **not** a feed: it's the `SidebarIndexLayout` (§2.4) press page (coverage list plus press releases). `/blog`, `/guides` and `/events` share **ContentHero + FeedGrid**. The nav is translucent over the hero.

1. **`ContentHero`**: bg #f5f7fa, margin-top -68, padding 164 0 48. Inner C, flex column, gap 48.
   - H1 `ContentHero.title` **48/48 500 -1.44 #242633** (len 4-16).
   - **`FeaturedCarousel`** (autoplay):
     - Track is a grid where slides stack in the same cell. Slide link is a grid `552 552`, gap 48, align-center.
     - Media 552x311 (bg #e5e9f0, radius 2, cover). Content (gap 24): date Mono 14/17.5 500 #666c80; title **36/45 500 -1.08 #242633** (L1-3, hover cobalt .2s); excerpt 18/27 500 #666c80 (L2-4).
     - Controls row (padding-top 16, space-between):
       - **progress dots**: 3-5 buttons. Each track is 6 tall, radius 999, bg #d1d8e5. The current track grows to **64 wide** (`width .3s ease`) and contains a fill #666c80 running `@keyframes progress` **6000ms linear** (`--autoplay-duration`). Hovering a non-current dot turns its track #666c80;
       - a play/pause toggle 16x16 (pause glyph: two 1px #666c80 bars);
       - **arrows** 2x 40x40 round (icon 32px #c0d0f0, hover #032ca5).
     - Slide change: the new slide's media fades `opacity 0→1 .6s ease`; content `opacity .45s ease .2s` plus `transform translateY(8px)→none .6s cubic-bezier(.22,1,.36,1) .2s`.
     - IntersectionObserver threshold .4 starts or pauses the autoplay.
     - /blog has 5 slides, /guides 5, /events 3.
   - 390: padding 132 0 32, gap 32. H1 32/32. Slide 1 column (media 358x201, then content gap 16): date 12/15, title 24/30, excerpt 14/21. Dots: track 4 tall, current 43 wide.
2. **`FeedGrid`**: padding 64 0 96. Inner C, flex column, gap 32.
   - **`FeedFilters`** (/blog: chips plus search; /events: chips only; /guides: none):
     - chips are flex-wrap, gap 8; each is 40 tall, padding 8 14, bg #fff, border 1px #e6ebf5, radius 2, 14/21 500 #242633;
     - the **active chip has border #242633** ("All" by default); hover border #c0d0f0 (.2s ease);
     - clicking sets `?filter=<slug>` (e.g. `/blog?filter=guides`) and filters client-side. 7 chips on /blog, 8 on /events;
     - **search** (`FeedSearch`) is 160x40, right-aligned: an `input type=search` with padding 8 14 8 38, a 16px search icon at the left, border 1px #e6ebf5, radius 2, hover border #c0d0f0. Typing alone did not change results in sampling (probably submits on Enter; unverified).
   - **Grid**: 3 x 352, gap 48 (row gap 48).
     - `FeedCard` (a): flex column, gap 24. Media 352x198 (bg #f5f7fa, border 1px #e6ebf5, radius 2, cover). Text (gap 12): title **h2 21/26.25 500 -0.63 #242633** (L2-3) and date Mono 14/17.5 500 #666c80 (len 15-27).
     - Hover: title #265cff, media border #c0d0f0 (.2s ease). Focus-visible outline 2px cobalt, offset 4.
   - After the first 6 cards, a full-bleed **`FeedGrid.inset`** row holds the outline `InlineCtaForm` (§2.8), then the next 6 cards.
   - **Pagination**: a centred outline "Load more" button (§1.3). Initial 12 cards; each click appends 12 more (12 → 24 measured). No numbered pagination.
   - 390: padding 43 0 64, gap 21. Chips are a horizontal row (gap 5, height 30, padding 5 9, 12px text, overflow scroll with -16 bleed). Search full width 358x30 below. Grid 1 column, gap 32. Card media 358x201, gap 16. Title 16/20 -0.48. Date 12/15.
3. Footer.

### 4.4 `blog-post` (251 routes incl. `/inside/*`)

One template, `BlogPostTemplate`, with two variants by content: **with TOC** (`rootWithToc`, when the post has many h2/h3; e.g. /blog/esg-disclosure-toolkit) and **without**. `/inside/*` engineering posts use the same template.

1. **`PostHero`** (§2.3).
2. **Main** (`main.BlogPostTemplate.root`, max 1280, padding-top 64 (390: 43)):
   - No TOC: `article.blog-post` 780 centred (margin 0 250 within 1280, so text x 354-1074). `Prose` (§2.1).
   - With TOC: grid `821.3px 410.6px`, gap 24, padding 64 12 24. Article left; `aside.sidebar` (sticky top 100, padding-right 16, margin-bottom 150) holds the `TocSidebar` (§2.2). Hidden below 1024.
   - Embedded blocks inside prose: `photo` figures, `StylizedQuote`, `Table.embedded`, `blog-aside` callouts, `blockquote`.
   - **Tags row** (`ul.blogTags.tags`, flex-wrap, gap 12, margin-bottom 16): label Mono 14/22 500 -0.3 #6d7fb2 (len 7), then tag links (flex, gap 4). Each has an 8x8 colour dot (radius 8, per-tag colour, e.g. #053ce1, #00bb81) and 14/18.06 500 #0b2471 text.
3. **Newsletter**: `BlogPostTemplate.newsletter` (padding-top 64) containing the outline `InlineCtaForm` (§2.8).
4. **`RelatedContent`**: padding 96 0. Visually hidden h2. Grid 3x352, gap 48, of `FeedCard`s (title only, no date).
5. Footer.

Customer "post" stories (see §4.5 variant B) use exactly this template.

### 4.5 `customer-story` (51 routes): TWO variants

- **Variant A: `CustomerStoryTemplate`** (most `/customers/<brand>` slugs, e.g. canva, adventhealth, burton, celonis1, essity, flexera, harrisfarmmarkets, medtronic, okta1, skyscanner, tipgroup). Nav opaque.
  1. **Story hero** (`Hero.hero`):
     - Container as a 12-column grid. Content spans columns 2-12 (957), padding 48 0, centred.
     - Customer logo 72x27 (link). H1 `h2` **Sans 60/66 400 -1.8 #0b2471** (len ~100, L4). Subtitle h4 **35/38.5 400 -0.35 #666c80** (L3), margin-top 20.
     - Then a **full-bleed banner image** 1440x450 (cover).
     - 390: H1 38/41.8 -1.14 (L6), subtitle 30/33 (L7), banner 390x422.
  2. **Content frame**: C with left and right 1px #93aeff, as a 12-column grid.
     - **Sidebar** (columns 1-3, 288 wide): border-right and border-bottom 1px #93aeff, padding 86 40. The inner part is **sticky top 68**, padding 40 0:
       - logo (centred, 80x40, margin-bottom 40);
       - meta `dl` (borders 1px #93aeff top and bottom, padding 20 0). dt Mono 14/22 500 -0.3 **#658dfd** (Industry, Location, Size, Products…). dd 14/22 500 #666c80 (margin-top 4; next dt margin-top 20);
       - `TableOfContents` (margin-top 20): list with border-left 1px #658dfd, padding-left 20, gap 4. Links 14/22 500 -0.3 #415591; active (`data-state=active`) #265cff; color .2s. IntersectionObserver `rootMargin -148px 0 0 -50%` on each RichText section;
       - actions (padding-top 40, gap 12): light withArrow button 129x47.
     - **Main** (columns 4-12, 863 wide, padding-top 80), a stack of sections:
       - `Video.video` (padding 40): eyebrow Mono 14/20 #265cff, then a player frame 783x452 (border 1px #93aeff, padding 12) around a 16:9 Vimeo iframe (use a placeholder);
       - `Intro` (padding 40): **Serif 28/33.6 500 -0.112 #666c80** (720 wide, len ~700, L14);
       - `Keypoints`: grid 432/432 with a bottom 1px border. Items have border-top and border-right 1px #93aeff, padding 40. Each has an eyebrow Mono 14/20 #265cff (margin-bottom 20; it's a link) and a 20/30 500 paragraph. The 3rd item spans both columns;
       - `RichText` sections (padding 40): eyebrow Mono 14/20 (margin-bottom 16); h2 `h4` **35/38.5 500 -1.05 #0b2471** (margin 16 0); h3 `h5` 28/32.2 500 -0.84 #0b2471; p 20/30 500 #666c80 (margin-bottom 20); links #265cff; strong 700;
       - **blockquote**: border-left **1px** #265cff, padding-left 32, margin 32 0. A 20/30 quote plus an attribution `p.eyebrow.f-w-600` **Sans 14/20 600 #265cff** (L2).
     - 390: single column. Sidebar becomes a top block (padding 40 0, border-bottom; no sticky, no TOC). Main sections padding 40 0. Keypoints 1 column (padding 40 0). Text sizes unchanged (20/30, Serif 28/33.6).
  3. Optional `PageLinks.default` (§4.6 card style) "Additional resources" (e.g. adventhealth, flexera).
  4. Footer.
- **Variant B: `BlogPostTemplate`** (editorial slugs: `profiling-leaders-in-climate-action-*`, `insights-from-shopify-*`, `doordash-okta-and-everlane-*`, `how-klarna-*`, `monzo-*`, `square-*`, `eventbrite-invests-*`, `earth-day-2021`, `watershed-summit-customer-recap`, `climate-leads-profile-*`, `more-ambition-*`, etc.): **identical to blog-post §4.4**. The breadcrumb's second crumb is "Customer stories". Profile posts use a `StylizedQuote` with a photo background.
- Rule of thumb: brand-name slugs (`/customers/<company>`, including `*1` suffixes and `fortune-500-media-company`, `global-technology-company`) are Variant A; sentence-style slugs are Variant B. Confirm per page from the CMS.

### 4.6 `guide` (14), `event` (180), `report-landing` (11), `/podcast`: ONE shared `GatedLanding` template (with variants)

This is the shared template the brief asked about: `guide`, most `event` pages and most `report-landing` pages are the same layout. It is plain (non-module) JSX with classes `grid-background`, `left-column`, `form-wrapper` and `page-links-wrapper`. The nav is opaque.

1. **Grid background band**:
   - bg #fff (events **#fffbf3**) plus a **blueprint grid**: `linear-gradient(to right, #c1d2fe 1px, transparent 1px), linear-gradient(#c1d2fe 1px, transparent 1px)`. The cell size matches the grid in the screenshot, about 80px. Bottom `background-fade` 128 tall `linear-gradient(transparent, <bg>)`.
   - Container padding-top 80. Inner grid `559.5px 559.5px` (events `600px 600px`), x 161-1280.
   - **Left column** (`article.left-column`, border-left and border-right 1px #c1d2fe):
     - `p.mono.eyebrow.header`: 40 tall bar, flex, align-center, padding 0 32, bg #fff, border-bottom 1px #c1d2fe. Mono 14/20 400 **#658dfd** (len ~15, e.g. "Watershed Guide").
     - `title-wrapper`: padding 32, bg #fff, border-bottom 1px #c1d2fe. H1 `h3 f-w-400` **Sans 48/52.8 400 -1.44 #0b2471** (L3-7). Events: padding 24 32, flex column centred.
     - **Event logistics** (events only, `logistics-wrapper`): bg **#0033cc**, padding 30 34. `dl` grid `100px 1fr`, row gap 22. dt Mono 20/24 500 #c1d2fe (Date, Time, Location). dd 20/24 500 -0.2 #fff. Class `is-past` for past events (no visual change measured).
     - `ul-wrapper`: padding 32 32 8, bg #fff. Prose 20/30 500 #666c80, p margin-bottom 20. A **checklist** `ul` (margin-top 24, padding-left 30, list-style none; li 20/30, margin 8 0, with a cobalt check icon as a pseudo-element). Optional `blog-aside` (report pages) and `em`.
     - `ul-fade`: a 60-tall bottom fade `linear-gradient(#fff, transparent)` overlapping the column end.
   - **Right column** (`form-wrapper`, bg #fff, border 1px #c1d2fe on top/bottom/left (events top/right/bottom), padding 0 32 48):
     - `img-wide`: a cover image (about 560x293, e.g. a report cover on a pale bg) flush at the top;
     - form title h2 `h5` **28/32.2 500 -0.84 #265cff** (padding-top 32, margin-bottom 36) (len ~18, L2);
     - HubspotForm (§1.5), 495 wide (first row 2 columns), 5-7 fields, then the legal copy and a submit "Get your guide →" (161x44).
   - The page's main content ends with the grid fade.
   - Variants:
     - `/ai-emissions-sustainability` has a **Faq accordion inside the left column** (items 428 wide);
     - `/forrester-wave-2026` has a `blog-aside`;
     - `/podcast` uses an h4 35/38.5 700 inside the prose.
2. **`page-links-wrapper`** (bg continues the band colour → #fff, border-bottom 1px #93aeff) → **`PageLinks.default`**:
   - Section padding 64 0. Title h5 **28/32.2 500 -0.84 #265cff** (padding-bottom 12) (len ~20, "Additional resources").
   - keen-slider (padding-bottom 50) of cards **371 wide** (max 370.67, gap 20; 3 visible):
     - `cardInner`: bg #fff, border **1px #265cff**;
     - figure 369x194 (border-bottom 1px #265cff, image fill);
     - content padding 24: eyebrow Mono 14/20 #265cff (margin-bottom 12), title h5 28/32.2 500 -0.84 **#0b2471** (L1-3; margin-bottom 64 when short), arrow row (padding-top 32) with a 24px cobalt arrow icon.
     - Hover/focus: `box-shadow 0 0 8px var(--color-grey-30)` (.125s ease-in-out), arrow +4px (.2s ease-in-out).
   - **Scroll reveal** (§2.10).
   - Nav (absolute at the bottom, centred, gap 8): prev/next 32x32 plus dots 8x8 (border 1px #265cff, radius 9999, active filled #265cff).
3. Footer.

390:
- Container margin 0 24 (342 wide). The `img-narrow` image (390x205, absolute, top 40) shows **above** the card stack, and the grid starts 120 lower.
- Single column. The left column comes first, then the form. Eyebrow bar padding 0 12, Mono 12/13. Title-wrapper padding 12, H1 **45/49.5** -1.35. `ul-wrapper` padding 32 32 36.
- Form title 25/28.75. Form 276 wide (fields stacked).
- PageLinks: container padding 16, cards 295 wide, figure 293x154, title 25/28.75.

**Which routes use what (report-landing grab-bag, 11 sampled):**

| Route | Template |
|---|---|
| /forrester-wave-2026, /verdantix-2025, /verdantix-smart-innovators-2026, /sustainability-policy-newsletter, /the-healthcare-product-carbon-footprint-playbook, /ai-emissions-sustainability (FAQ variant) | **GatedLanding** (same as guide) |
| /state-of-corporate-sustainability-ai-2026, /verdantix-2026 (+ /guides/state-of-corporate-sustainability-2025) | **SOC2025Theme** (§3.34): themed gated report |
| /climate-economy | **Manifesto** (§3.34): long-form essay, not gated |
| /assessments/climate-disclosure | **Quiz** (§3.34) |
| /spark-matrix-2023 | **redirects to /guides** (non-locale URL); `/guides/climate-economy` also redirects to /guides |

**Event routes (180):**
- The default is **GatedLanding (event variant)**.
- Summit/climate-week style pages (`/events/2023-climate-week` and similar) use **`SummitEventTemplate`** (§3.34).
- Some event slugs **redirect to /demo** (e.g. `/events/ai-features-demo-1`, `/events/california-climate-disclosures-demo`).
- `/events/sb-253-sb-261-senator-wiener` was not fetched (network error).

**Guide routes (14):** all GatedLanding except `/guides/state-of-corporate-sustainability-2025` (SOC2025Theme) and `/guides/climate-economy` (redirect).

### 4.7 `legal` (6)
- `/legal`: **SidebarIndexLayout** (§2.4). Title Serif "Legal"-style (len 5). Sidebar nav has 2 level-one groups, each with a level-two list. Content sections hold `contentArticleRelease` rows (cobalt 32px document icon, h6 title, Mono date).
- `/legal/privacy`, `/legal/terms`, `/legal/security`, `/legal/data-portal-terms` → **`LegalDocumentTemplate`**:
  - A top `.blog-post` strip (792 centred, padding 48; holds the back link or notice).
  - Section `LegalDocumentTemplate.withToc`: grid `818.6 409.3`, gap 36, padding 12 88. Left `.blog-post` 792 (padding 48) with **Serif H1 45/47.25 300 -1.12 #666c80** and `Prose` (§2.1; h2/h3 weight 400; `p strong` can be **#265cff 700**); very long embedded `Tables` (cells padding 16 24, max-width 280 per cell). Right: `TocSidebar` (sticky top 128).
  - Pages without enough headings (`terms`, `security`, `data-portal-terms`) use `LegalDocumentTemplate` without TOC (single 792 column).
  - 390: one column, padding 24 16. H1 45/45.
- `/data-portal-terms` **redirects to `/legal/data-portal-terms`** (non-locale URL).

### 4.8 `compare` (3)
`BlockPage`, no new template:
- `/compare`: HeroCompete → Logos.small → Stats.ruledRoot → QuoteFeatures → FeatureGridNumbered → LinkList → InlineCtaForm(filled) → CustomerPhotoFeature → TextWithImageOrderedList → QuotesCarousel → Faq.
- `/compare/workiva`: HeroCompete → Logos.small → **FaqFullWidth** → InlineCtaForm → **TableQuestionsStats** → QuoteFeatures → QuotesCarousel → Faq.
- `/compare/sweep`: as workiva, plus `Tables`(comparison, iconColumns) and `QuoteVideo.medium`.
- All blocks are in §3.31.

### 4.9 `demo` (5)
- `/demo`, `/demo/csrd`: **`DemoTemplate`** = `SectionHeroForm` dark theme (§3.33). No promo bar, inverted translucent nav, **no footer**. Below the hero:
  - /demo: `Quote` (REUSE §3.6) only.
  - /demo/csrd: Quote → MicroFeatureCarousel → PageLinkSet.
- `/lp/why-watershed-platform`, `/lp/why-watershed-disclosures`, `/lp/why-watershed-platform-scopes`: a **separate LP template**: promo bar, **no nav, no footer**. heroSection → Logos.small → Header → AnimatedSteps → CTASection.slim → FeatureGrid → (testimonial jsx block) → FeaturedHubspotForm. All three are identical in structure. Blocks are in §3.32.

### 4.10 `product-tour` (4)
- `/product-tours/<slug>`: `ProductToursTemplate.noAccess.detailNoAccessHero`. A `SectionHeroForm` light theme with a `formBodyBanner` (cover image above a 5-field form). No promo bar, translucent nav. Below the hero (`DemoTemplate.blocksProductTours`, C width): Quote (12-column grid with 48 columns) → TextWithLogos.gridRoot → footer.
- `/product-tours` (index): the same, but the hero copy column holds a `statsLabel` list (4 tour items with title and description) instead of a feature list.
- **The actual interactive tours are gated** (`noAccess`). After form submit they load third-party Storylane embeds (`watershed.storylane.io`). **Not measurable / not built:** show the gated state only.

### 4.11 `company` (9)

| Route | Template |
|---|---|
| /about-us | BlockPage: Hero (multi-paragraph subhead, `mediaNatural`) → Logos.medium → Grid.itemsThree → HorizontalRule → FeatureText → SectionTextBlock (with off-screen Annotations) → PageLinkSet (with nav dots) → Grid.itemsTwo (numbered) → FeatureText → SectionTextBlock → PageLinkSet |
| /ai-fellowship | BlockPage: Hero → Faq → Video.medium → CustomerPhotoFeature → Spacer ×3 |
| /partners | BlockPage: **Header.root** (arched blob, §3.32) → TextWithImageList → Quote → Faq → blogPosts.themeImages |
| /reading-list | BlockPage: SectionTextBlock.withToc only (prose plus TOC, many external links) |
| /careers | Bespoke (§3.34 Careers) |
| /brand | Bespoke `BrandTemplate` (§3.34) |
| /change | Bespoke `ChangeTemplate` (styles sections, gated blocks, Grid, Quote, CTABar) |
| /climate-leads | Bespoke `ClimateLeadsTemplate` (Interview sections ×5, blogPosts) |
| /podcast | **GatedLanding** (§4.6) |

### 4.12 `tool` (/tools/climate-policy-calendar)
- `GatedContentTemplate` → `SectionHeroForm` light theme with a `heroQuote` and `formBodyBanner` (§3.33), plus the logos strip.
- Translucent nav, promo bar present, footer present.
- The calendar itself (`PolicyCalendar`, with filter pills; `filterPillClear` hover bg #e3ebff) is **behind the form gate** and wasn't rendered. Not measurable.

---

## 5. Motion summary (inner pages; homepage motion still applies to reused blocks)

| Element | Trigger | Spec |
|---|---|---|
| Nav translucent → opaque | scrollY > 0 | `background-color .25s` (also the link and logo colour vars) |
| FeaturedCarousel autoplay | IntersectionObserver threshold .4 | 6000ms per slide. Progress fill linear. Media fade .6s ease. Content opacity .45s ease .2s, translateY(8px)→0 .6s cubic-bezier(.22,1,.36,1) .2s. Current dot track width .3s ease. |
| PageLinks card reveal | IntersectionObserver threshold .25 | opacity 0→1, translateY(50px)→0, .5s cubic-bezier(.215,.61,.355,1), stagger .1s |
| ProductOverview steps | autoplay | Homepage §3.3 (6s countdown) |
| AnimatedSteps (LP) | autoplay | Progress opacity .25s cubic-bezier(.22,1,.36,1). Bar transform .05s linear (JS-driven). Use 6s per step (not sampled). |
| Faq accordion | click | Content slideDown/slideUp .3s cubic-bezier(.85,0,.15,1). Chevron .25s same curve. |
| FaqFullWidth | click | `grid-template-rows .3s cubic-bezier(.85,0,.15,1)`, caret .25s |
| TextWithImage feature list | click/hover | Colour #666c80↔#242633 .4s cubic-bezier(.4,0,.2,1). No autoplay observed. |
| Floating form labels | focus/fill | .24s cubic-bezier(.65,-.32,.38,1.23) |
| Field focus | focus | border/box-shadow .15s ease |
| Cards (FeedCard, PageLinkSet, LinkList, sidebar rows) | hover | colour/border/bg .2s (LinkList .12s). Arrows +4px (.2s ease-in-out). |
| TOC active state | IntersectionObserver on headings | colour .125s ease-in-out |
| TextWithLogos tile swap | timed | opacity/transform .4s cubic-bezier(.22,1,.36,1) |
| Hero.videoRoot / QuoteVideo play | hover | transform/box-shadow .18s; QuoteVideo bg/opacity .12s |
| Logo strips | in view | Homepage §3.6 |
| Canvases | | CenteredAgent and EnergyForecast use Unicorn Studio WebGL (not measurable; use the CSS substitute from CLONE_SPEC §2.7) |

Other IntersectionObservers fire with no visual change: Hero threshold .05, TextWithImage .3, PageLinkSet .25, customers grid .2. Wire them up only if you add analytics; **no reveal animation**.

---

## 6. Internal vs external links

**Leave watershed.com: build as plain external `<a>`. Do not build these pages.**
- Nav "Sign in" → `https://dashboard.watershedclimate.com` (all pages).
- Footer LinkedIn → `https://www.linkedin.com/company/watershedclimate`.
- Product tours (after the gate) → `watershed.storylane.io` embeds (also linked from /platform/disclosures).
- /customers grid and carousel: many cards link to external customer sites and ESG report PDFs. Domains include stripe.com, squareup.com, monzo.com, news.airbnb.com, about.gitlab.com, issuu.com, cloudfront/ctfassets/sitecorecloud PDFs, businesswire.com, and about 60 more.
- /news coverage rows → press outlets (axios.com, time.com, fastcompany.com, heatmap.news, esgnews.com, sustainabilitymag.com, globenewswire.com, einpresswire.com…). Podcast links → podcasts.apple.com / open.spotify.com.
- Video embeds: YouTube (`youtube-nocookie.com`, Video.medium), Vimeo (`player.vimeo.com`, customer story Video). Replace with placeholders.
- Legal/privacy: policies.google.com, tools.google.com, aboutads.info, networkadvertising.org, youronlinechoices.eu, privacyrights.info.
- Reading list: about 40 external sources (books, articles, IPCC, WRI, etc.). Climate leads: customer sites and Spotify.
- Misc: g2.com (compare), forrester.com (report), cdp.net, arxiv.org, climatechange.ai, view-su2.highspot.com and creativecommons.org (CEDA), HubSpot share links (`*.share.hsforms.com`, `hubspotusercontent`), cdn.sanity.io file downloads (brand assets, CEDA data).

**Internal, not in ROUTES.json (decide whether to build or stub):**
- `/careers/<id>-<slug>` job detail pages (about 40 linked from /careers).
- `/blog?filter=<slug>` and `/customers?region=&industry=&type=` are query states of built pages, not new routes.

**Redirects (all go to non-locale paths):**
- `/platform/disclosures/california` → `/solutions/california`
- `/solutions/consumer-goods` → `/industry/consumer-goods`
- `/data-portal-terms` → `/legal/data-portal-terms`
- `/spark-matrix-2023` and `/guides/climate-economy` → `/guides`
- `/events/ai-features-demo-1` and `/events/california-climate-disclosures-demo` → `/demo`

---

## 7. Assets (by type; no originals to be copied)
- All CMS images come from `cdn.sanity.io/images/3ogo9b9g/production/<hash>-WxH.ext` (jpg/png/svg), served at 2x via `?w=&q=75&fit=clip&auto=format`.
- Videos are Sanity-hosted webm files (1920x1080) used as autoplay muted previews: customers hero, Hero.videoRoot, QuoteVideo.
- Recurring sizes:

| Use | Size |
|---|---|
| Hero squares | 552x552 (1080² source) |
| Feed/related cards | 352x198 (16:9) |
| PostHero / FeaturedCarousel media | 552x311 |
| PageLinkSet media | 363x204 |
| PageLinks figures | 369x194 (≈1.9:1) |
| CustomerPhotoFeature portraits | 379x505 (3:4) |
| Story banner | 1440x450 |
| Customers carousel media | 351x468 (3:4) |
| ContentGrid media | 526x297 |
| TextWithImageOrderedList media | 512x341 / 512x288 |
| Avatars | 40-64 round |
| Award badges | 80x80 / 200x200 |

- Icons are CSS-masked SVGs (`Icon.root`, `--icon:url(/icons/*.svg)`, `--size`) coloured by bg: Search, arrows, document, check, QuoteMark.svg 33x28.
- Textures: `/img/dither-pattern.png` (TextWithLogos grid) and `demo--background-texture-*.png` (grid/dither overlay for SectionHeroForm, ProductOverview, CenteredAgent, CEDA quote). Replace with your own (see CLONE_SPEC §0 textures).
- Fonts: as CLONE_SPEC (Messina Sans → Inter, Mackinac → Newsreader, Geist Mono). Mackinac weight 300 is used for sidebar titles and legal H1 (90px/45px). Newsreader 300 exists.

---

## 8. Ambiguities and limits
- **Gated content:**
  - Product tours (Storylane), the policy calendar tool and guide/report downloads are behind HubSpot forms. Only the pre-submit state was measured.
  - Post-submit states (thank-you messages, `formFrameClosed` → open) were not triggered.
- **Canvas/WebGL** (CenteredAgent, EnergyForecast) is not measurable. Use the substitute.
- **Mobile coverage:** measured at 390 for Hero, TextWithImage, MicroFeatureCarousel, Quote, ContentCards, Faq, PageLinkSet, TextWithImageOrderedList, Logos, customers index, customer story, blog index, blog post, PostHero, prose, gated landing, SectionHeroForm (demo), SidebarIndex (news, legal), legal document. The other blocks (compare, LP and bespoke) follow §1.4 but were not individually measured at 390.
- Tablet (768-1023) was not measured. TOC sidebars disappear below 1024 (inferred from the 390 layout and the grid; the exact breakpoint was not tested).
- **Customers grid cards:** both the logo and the serif title/footer are present in the DOM. The cell height (221) suggests the logo is the resting state and the title/footer belong to the hover overlay (`--overlay-opacity`). Hover was not screenshot-verified.
- `TextWithImageOrderedList`: no visible step numerals were found as text, despite `showBoxNumbers`. They may be pseudo-element counters (not read). Check the screenshot `reference/pages/product/industry_apparel-1440.jpg`.
- `SectionTextBlock` Annotations render off-screen at 1440 (x -298 / 1450). Treat them as hidden.
- Blog search did not filter on typing during sampling. The submit behaviour is unverified.
- Not fetched (network errors): `/platform/disclosures/rfp-guide`, `/platform/disclosures/secr`, `/events/sb-253-sb-261-senator-wiener`. Template inferred from siblings.
- Customer-story Variant A/B assignment is by sampled slug pattern (13 sampled). Edge cases should be checked against the CMS.
- Event pages: 12 of 180 sampled. Besides the GatedLanding event variant, Summit and demo-redirect variants exist; there may be more bespoke summit pages.
- The FeaturedCarousel content is slide-stacked, so a full-page screenshot shows only the current slide. The customers-index logo grid lazy-loads, so logos are blank in the full-page screenshot.

---

## 9. Appendix: sampled block orders per route (1440)

See §4.1 for product. Others are as listed in §4.2-4.12. Raw outline for routes not shown above:
- `/industry/technology`: Hero → Logos.small → TextWithImageOrderedList → Video.medium → Faq
- `/industry/food-beverage`, `/industry/retail`: Hero → Logos → TextWithImageOrderedList → Faq → PageLinkSet
- `/industry/apparel`: Hero → Logos.small → TextWithImageOrderedList → Quote → PageLinkSet
- `/industry/professional-services`, `/industry/consumer-goods`: Hero → Logos → TextWithImageOrderedList → Quote → Faq → PageLinkSet
- `/platform/disclosures/cdp`: Hero → HorizontalRule.none → SectionTextBlock.withToc (+ photo.maxWidth-xs, Table.embedded ×2) → HorizontalRule.none → FeatureText → TextWithImageList → InlineCta.inline → Faq → Quote → PageLinkSet
- `/platform/disclosures/esg`: Hero → TextWithImageList → SectionTextBlock (Table ×3) → Grid → Faq → SectionTextBlock (Table) → Quote → PageLinkSet
- `/platform/disclosures/issb`: Hero → SectionTextBlock.withToc → FeatureText → TextWithImageList → HorizontalRule.none → Faq → PageLinkSet
- `/platform/climate/tcfd`: Hero → SectionTextBlock.withToc → Grid → SectionTextBlock ×2 → Quote → Faq → PageLinkSet
- `/platform/measure/carbon-accounting`: Hero → FeatureText → Faq → SectionTextBlock ×3 → TextWithImageList → FeatureText → Quote → PageLinkSet
- `/solutions/csrd`: Hero → MicroFeatureCarousel → Logos.medium → FeatureText.sectionHeading → TextWithImage ×2 → MicroFeatureCarousel → Quote → TextWithImage → PageLinkSet → Faq
- `/solutions/finance`: Hero → Logos.medium → InlineCta.inline → TextWithImage ×3 → PageLinkSet → Faq
- `/solutions/supply-chain`: Hero → Quote → TextWithImage ×3 → PageLinkSet → Faq

## 10. Reference screenshots (`reference/pages/<template>/`)
Full-page JPEGs (quality 55), consent banner removed. Files are named `<path-with-underscores>-<width>.jpg`.

| Template | Files |
|---|---|
| product | `platform_measure-1440/390`, `industry_apparel-1440/390`, `solutions_supply-chain-1440/390`, `platform_act-1440`, `platform_disclosures_cdp-1440`, `platform_sustainability-ai-1440`, `platform_marketplace-1440`, `solutions_ceda-1440`, `solutions_energy-management-1440` |
| customers-index | `customers-1440/390` |
| customer-story | `customers_canva-1440/390` (Variant A), `customers_profiling-leaders-in-climate-action-mark-danzenbaker-1440/390` (Variant B) |
| blog-index | `blog-1440/390`, `news-1440/390` |
| guides-index / events-index | `guides-1440/390`, `events-1440/390` |
| blog-post | `blog_2025-year-in-review-1440/390`, `blog_esg-disclosure-toolkit-1440/390` (with TOC) |
| guide | `guides_mastering-scope-3-1440/390` |
| event | `events_economist-london-1440/390`, `events_2023-climate-week-1440` (summit) |
| report-landing | `forrester-wave-2026-1440/390`, `state-of-corporate-sustainability-ai-2026-1440`, `climate-economy-1440`, `assessments_climate-disclosure-1440`, `ai-emissions-sustainability-1440` |
| legal | `legal-1440/390`, `legal_privacy-1440/390` |
| compare | `compare-1440`, `compare_workiva-1440/390` |
| demo | `demo-1440/390`, `demo_csrd-1440`, `lp_why-watershed-platform-1440` |
| product-tour | `product-tours-1440`, `product-tours_ai-reporting-1440/390` |
| company | `about-us-1440/390`, `careers-1440/390`, `brand-1440`, `change-1440`, `climate-leads-1440`, `partners-1440`, `reading-list-1440` |
| tool | `tools_climate-policy-calendar-1440/390` |

Notes:
- Elements that reveal on scroll (PageLinks cards) or lazy-load (customers logos) may appear blank in the full-page captures.
- Carousels show one frame.
