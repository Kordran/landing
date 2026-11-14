# 7. Design system

All tokens and component styles live in `src/app/globals.css`. Plate geometry
and tones live in `src/components/plate/model.ts`. This document explains the
rules behind them.

## The world

One drawn world: warm paper, ink, and a blue-leaning teal. A brick red and a
green name money and nothing else. Records are sheets that sit on the paper.
Everything dimensional is drawn in the same axonometric projection as the hero
plate. The footer painting is the only place the palette warms up.

## Color

| Token | Value | Use |
| ----- | ----- | --- |
| `--paper` | `#f4f2ed` | Page ground |
| `--paper-deep` | `#ebe8e1` | Recessed areas, figure wells |
| `--sheet` | `#fcfbf8` | Sheets, exhibits, alternate sections |
| `--ink` | `#161a1d` | Headings and primary text |
| `--ink-2` | `#414b55` | Body text |
| `--ink-3` | `#5d6771` | Labels, captions, secondary text |
| `--line` | `#dcd9d0` | Hairlines between rows |
| `--line-strong` | `#aeaba1` | Sheet borders, rules, graduated rule |
| `--line-control` | `#7d8388` | Form field boundaries (3:1 against every ground) |
| `--teal` | `#1c3d57` | The accent: difference, primary action, the mark |
| `--teal-mid` | `#2f6079` | Links on light grounds, secondary teal |
| `--teal-pale` | `#9bb8c6` | Teal on the deep ground, cap edges |
| `--tint` | `#dde6ea` | Units under observation in the unit grid |
| `--over` | `#8f2c28` | Money billed over the agreement, on light grounds |
| `--over-soft` | `#f4ddd9` | The same amount as a fill |
| `--over-on-deep` | `#f0b4ae` | That red on the deep ground |
| `--back` | `#14663f` | Money recovered or stopped, on light grounds |
| `--back-soft` | `#d7eee3` | The same amount as a fill |
| `--back-on-deep` | `#8ed4b0` | That green on the deep ground |
| `--deep` | `#0f1f2b` | The one dark band per page and the footer |
| `--on-deep` | `#f4f2ed` | Headings on deep |
| `--on-deep-2` | `#b7c5cd` | Body and labels on deep |

Axonometric solids use three fixed face tones per material, lit from the
upper left: paper tile `#fdfcfa` / `#dedbd3` / `#c3c0b7`, teal cap `#27506b` /
`#1c3d57` / `#142e42`. The CSS custom properties `--solid-*` and the `TONES`
object in `model.ts` must stay in step.

**Rules**

- Teal marks a difference, the primary action, or the brand mark. It is not
  used for decoration, section backgrounds, or large fills.
- Red (`--over`) is only for money billed above the agreement. Green
  (`--back`) is only for money recovered or stopped. They color the number,
  and the part of a chart that number names. They are not used for buttons,
  links, section backgrounds, or the plate.
- No amber. Bright cyan is outside the palette.
- The deep ground appears once per page before the close.
- Text contrast, measured: ink on paper 15.7:1, body 8.0:1, labels 5.2:1
  (4.7:1 on `--paper-deep`), teal on paper 10.1:1, body on deep 9.5:1,
  `--over` on paper 7.3:1, `--back` on paper 6.3:1, `--over-on-deep` on deep
  9.5:1, `--back-on-deep` on deep 9.8:1.

## Type

Two families, both loaded with `next/font` and self-hosted.

- **Instrument Sans** (variable, with the width axis). Headings are set at
  94 to 95% width and weight 500 with tight tracking, which gives a compact,
  engineered look without a second display face.
- **IBM Plex Mono** (400, 500). Labels, exhibit headers, record numbers,
  arithmetic. Always uppercase at 0.08em tracking when used as a label.

| Role | Class | Size | Weight / width | Leading | Tracking |
| ---- | ----- | ---- | -------------- | ------- | -------- |
| Hero | `.display-hero` | `clamp(1.75rem, min(9.1vw, 1.2rem + 4.3vw), 5.25rem)` | 500 / 94% | 0.98 | −0.04em |
| Display | `.display` | `clamp(2.125rem, 1.2rem + 3vw, 4.25rem)` | 500 / 94% | 1.02 | −0.038em |
| Heading | `.heading` | `clamp(1.875rem, 1.25rem + 2vw, 3.25rem)` | 500 / 95% | 1.05 | −0.035em |
| Title | `.title` | 1.375rem | 500 | 1.2 | −0.02em |
| Lede | `.lede` | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` | 400 | 1.5 | — |
| Body | `.body` | 1rem | 400 | 1.6 | — |
| Small | — | 0.875rem | 400 | 1.55 | — |
| Label | `.label`, `.micro` | 0.75rem mono | 500 | 1.4 | 0.08em, uppercase |
| Figure | `.figure-num` | large sans, tabular lining numerals | 500 | 1 | tight |

**Rules**

- Measure is capped: ledes at 34em, body at 36em.
- The hero size is tied to viewport width below 400px so "Verified and
  resolved." never breaks onto a third line.
- Numbers that are compared use tabular lining figures.
- No serif. No italics for emphasis. No all-caps sans.

## Space

A 4px base. Sections and gutters come from this scale only.

| Token | Value | | Token | Value |
| ----- | ----- | - | ----- | ----- |
| `--s-1` | 4px | | `--s-6` | 32px |
| `--s-2` | 8px | | `--s-7` | 48px |
| `--s-3` | 12px | | `--s-8` | 64px |
| `--s-4` | 16px | | `--s-9` | 96px |
| `--s-5` | 24px | | `--s-10` | 128px |

- `--section: clamp(84px, 10vw, 148px)` is the vertical padding of every
  section.
- `--stack: clamp(48px, 5.6vw, 84px)` separates a section's heading block from
  its content.
- Vertical relationships inside a block: label to heading 24px, heading to
  lede 32px, lede to body 24px. Body copy is set at 1.65.

## Layout

- **Page:** `--page: 1312px` maximum content width, with
  `--margin: clamp(20px, 4.4vw, 64px)` on each side.
- **Grid:** 12 columns, `--gutter: clamp(16px, 2vw, 24px)`.
- **Section head:** from 900px, the heading takes columns 1 to 7 and its
  lede takes columns 8 to 12, baseline-aligned (`.head-split`).
- **Header:** 72px, fixed, paper ground; a hairline appears once the page
  has scrolled.
- **Corners:** square everywhere. No radius, no drop shadows, no blur.

**Breakpoints** (mobile first)

| Width | What changes |
| ----- | ------------ |
| 640px | Form fields and exhibit inputs sit side by side; the plate crop loosens; the closing painting widens to 4:3 |
| 900px | The 12-column layout; split section heads; desktop navigation; the footer overlays the painting |
| 1120px | The hero becomes one composition: copy on the left, plate behind and to the right. The lede is held to three lines and the plate is raised so it clears both the copy and the legend |
| 1200px | The closing painting uses its full 16:9 frame |
| 1360px | The plate shifts left and lower; the lede returns to two lines |

Checked at 1920, 1440, 1360, 1280, 1200, 1120, 1024, 900, 768, 480, 414,
390, 360, and 320px, and on short screens at 1120 × 700, 1280 × 720, and
1360 × 768.

## Graphic vocabulary

Every form on the site comes from this short list.

1. **The tile.** A square solid in three flat tones. It is the logo's
   square, the plate's record, the bullet in a list, the two squares in a
   button, and one hundred units in a grid.
2. **The cap.** A teal solid standing on a tile. It means "billed above
   agreement" and nothing else.
3. **The projection.** One axonometric view for all solids: azimuth −0.62
   rad, elevation 0.6 rad, orthographic. `axo.ts` and `model.ts` share it.
4. **The sheet.** A flat rectangle on `--sheet` with a 1px `--line-strong`
   border and a mono header that names the exhibit on the left and its
   status on the right.
5. **The dimension line.** A rule with end ticks and a value, used once: the
   $2.00 gap.
6. **The graduated rule.** A hairline with 12 major and 48 minor ticks,
   used to open a statement the way a scale marks a datum.
7. **The unit grid.** Rows of small squares, each 100 units. Solid teal
   is a counted unit, tint is a unit under observation, a grey outline is
   excluded, and a pale outline is not assumed.
8. **The profile.** The plate seen from the side: one row of tiles in
   elevation on a datum line, each with its cap standing on it. It appears
   once, across the dark band on the homepage, where one price line is
   followed from "billed above agreement" through "corrected" to "billed as
   agreed". Top faces are the lightest tone, as on the plate.
9. **The mark.** A 7px teal square before a label.
10. **The painting.** Industrial Wash, once per page, at the close.

Do not add: icons from a library, gradients, glows, rounded cards, node
diagrams, photographs, or a second illustration style.

## The plate

- 28 columns × 14 rows. Rows are price lines, columns are invoices.
- A tile is 1 unit square with a 0.16 gap and 0.18 height. A cap adds
  between 0.26 and 0.86.
- Fifty tiles are raised, in five runs that each depict a real pattern: a
  price change partway through a contract, a short run followed by a longer
  larger one, a recurring charge on every fourth invoice, a late cluster of
  large differences, and an isolated pair.
- Edges are a constant width on screen at 30% opacity (38% on caps).
- Datum ticks run along the two near edges.
- The camera frame is fixed in the model, so the SVG and the WebGL canvas
  overlay to the pixel.

To change the picture, change `model.ts`. Both renderers follow.

## Motion

| Token | Value | Use |
| ----- | ----- | --- |
| `--ease` | `cubic-bezier(0.2, 0.7, 0.1, 1)` | Entrances, state changes |
| `--ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | Drawn lines |
| `--t-fast` | 160ms | Hover color and border |
| `--t-state` | 320ms | Toggles, glyphs, selected records |
| `--t-reveal` | 640ms | Sections rising into view |
| `--t-draw` | 900ms | Rules drawing across |

**Behaviors**

- **Inspection light.** A narrow pale band crosses the plate every 18
  seconds. Caps brighten slightly as it passes.
- **Tilt.** The plate leans up to 0.045 rad toward the pointer, damped.
- **Readout.** Hovering a tile highlights it and names it in the legend.
- **Settle.** Over the first 460px of scroll, caps lower until they are
  thin teal marks: the difference, corrected.
- **Reveal.** Blocks rise 16px and fade in once, when 12% visible.
- **Draw.** Rules scale in from the left.
- **Count in.** Unit squares appear in reading order.
- **Stand up.** Caps in the profile rise from the datum in invoice order.
- **Register.** On hover, the two squares in a button slide into
  alignment.

**Rules**

- Nothing animates out. Reveals run once and stay; menus and disclosures
  close immediately.
- The hero text does not animate in. It is the largest paint and is there
  on the first frame.
- Nothing loops except the inspection light, and it stops when the hero is
  off screen or the tab is hidden.
- Hover effects exist only on things that can be activated, plus the plate.
- With `prefers-reduced-motion: reduce`, reveals, draws, counts, smooth
  scrolling, and the live plate are all off. The page shows its finished
  state.

## Components

| Component | Notes |
| --------- | ----- |
| Button `.btn` | 52px high (40px `.btn-small`), teal fill, square, two-square glyph. On deep grounds it inverts to paper. |
| Text action `.text-action` | Ink text over a hairline that darkens to ink on hover. 48px target. |
| Inline link `.inline-link` | Teal, underlined; ink on hover. |
| Label `.label` | Mono capitals, optional mark, optional teal index number. |
| Sheet `.sheet` | Exhibit container with `.sheet-head`. |
| Exhibit | Agreement and invoice pair, dimension line, unit grid, total, caveat, optional inputs. |
| Axo figure | Server-rendered SVG from a scene description. |
| Evidence stack | Six buttons with `aria-pressed`; the selected record's sheet lifts and turns teal. |
| Disclosure | Native `details` with a plus that becomes a minus when open. |
| Form field | Mono label above an underlined input. Focus thickens the underline to teal and colors the label. |
| Header | Fixed. Current page marked with a teal square. |
| Close scene | Statement, painting, footer. |

## Accessibility built into the system

- Focus: 2px teal outline with 3px offset on every interactive element;
  form fields use a 3px teal underline and a teal label instead.
- Targets: 24px minimum everywhere; primary actions, text actions, and
  disclosures are 44px or taller.
- The plate and all figures are `aria-hidden` or have text equivalents
  beside them. No information exists only in a drawing.
- Footer text over the painting sits on a scrim measured from the footer,
  so its contrast does not depend on the painting's crop.
