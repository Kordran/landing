# 1. Research dossier

## Method and limits

Twenty-one external sites and the live kordran.com were loaded in Chrome on
13 November 2026 (3:29 to 3:47 PM Pacific). Each was captured at 1440 × 900
(six frames down the page) and 390 × 844 (four frames), and computed styles
were read from the page: heading typeface, size, weight, tracking, background
color, and counts of canvas, video, SVG, and image elements.

What this method can and cannot support:

- The browser was headless and rendered WebGL in software. Sites that depend
  on a GPU showed their failure state, which is itself recorded below.
- Scroll-linked and pointer-linked motion was seen as a sequence of still
  frames, not as continuous playback. Motion is described only where the
  frames show it.
- Three captures were incomplete. Hudson River Trading served a bot check at
  desktop width (mobile loaded). Vercel's desktop capture timed out (mobile
  loaded). Active Theory returned "Your browser is not supported" at both
  widths.
- The contact sheets are third-party imagery and are not committed to this
  repository. They were delivered alongside the work as run artifacts.

Each entry separates what was **observed** from what it **suggests**.

## References

### Required

**Hyperliquid** — https://hyperliquid.xyz

- Observed: Headline in a light serif (Teodor Light, 80px, weight 300, −2.4px
  tracking) over a near-white ground (`rgb(248,249,249)`); body in ABC
  Diatype at 18px. Hairline vertical rules run the full height of the page
  and every section aligns to them. Navigation is a row of small chips. A
  dark band of fine particles sits under the hero. A purpose passage is set
  as numbered lines. The footer ends on a very large wordmark. No canvas
  elements; the particle band is video.
- Why it works: The rules make the grid visible, so restraint reads as
  structure instead of emptiness. One serif and one dark band carry the whole
  identity.
- Relevant to Kordran: Visible structure as a brand element. A single dense
  graphic band against a quiet page. Numbered statements for a purpose
  section.
- Do not copy: The serif-over-rules look is now strongly associated with this
  site and with crypto finance. Direction C tested it and it read as wealth
  management.
- Trade-off: About 12.5 MB transferred on first load, mostly media.

**Orderful** — https://www.orderful.com

- Observed: Light grey ground (`rgb(245,245,245)`) with content in white
  panels separated by 4px gaps, like tiles. Headline in Telegraf at 72px,
  weight 300. Navigation labels in monospace capitals. An isometric diagram
  explains the product. One orange accent.
- Why it works: The tiled panels make a dry subject (EDI) feel engineered.
  The isometric diagram explains the mechanism without a screenshot.
- Relevant to Kordran: Isometric explanation of a records process. Mono
  capitals as a technical register. Panels as physical objects.
- Do not copy: The dense multi-product navigation; Kordran has one offer.
- Trade-off: About 21.7 MB transferred on first load and 250 requests.

**Robinhood** — https://robinhood.com/us/en/

- Observed: Black ground. Headline in a serif (Martina Plantijn, 72px) beside
  rendered chrome 3D forms. A single lime accent used sparingly. Section
  headings switch to a sans (Phonic, 52px). Large wordmark at the foot.
- Why it works: One rendered material and one accent, applied with
  discipline, are enough to be recognizable.
- Relevant to Kordran: Accent discipline. One material language for every
  dimensional object.
- Do not copy: Chrome and black read as consumer finance and entertainment.
- Trade-off: Rendered imagery is heavy and does not adapt to content changes.

**DataRobot** — https://www.datarobot.com

- Observed: Headline in STK Miso at 78px with −2.34px tracking. A tick-mark
  motif recurs as a divider and background texture. Full-width color bands
  (yellow, green) separate sections.
- Why it works: A small repeated mark gives a large site a signature without
  illustration.
- Relevant to Kordran: A measuring mark as a recurring device. This became
  the graduated rule used between sections.
- Do not copy: Saturated bands; the long enterprise navigation.
- Trade-off: 117 requests and about 550 KB of script on first load.

### Financial and commercial

**Stripe** — https://stripe.com

- Observed: Thirteen canvas elements on the desktop page, including the
  gradient wave. Headline in Söhne at 48px, weight 300. Dense product
  vignettes built from real interface fragments.
- Suggests: Many small live graphics can coexist when they share a palette.
  It also shows the cost: about 1.3 MB of script.
- For Kordran: One live scene, not thirteen. Vignettes built from real
  record fragments (the agreement and invoice pair).

**Ramp** — https://ramp.com

- Observed: White ground, Lausanne at 64px, short declarative headline
  ("Time is money. Save both."), nine canvas elements, product vignettes,
  customer-count claims directly under the hero.
- Suggests: A two-sentence headline with a period after each reads as
  confident. Kordran's "Supplier costs. Verified and resolved." has the same
  shape.
- Do not copy: Customer counts and growth multiples. Kordran has none to
  state and must not imply them.

**Mercury** — https://mercury.com

- Observed: Dark ground, Arcadia Display at 49px. A list of capabilities
  where selecting an item changes the adjacent graphic. Five videos, about
  12 MB transferred.
- Suggests: A selectable list driving one graphic is a compact way to
  explain several related things. This became the evidence stack on the
  Approach page.

**Modern Treasury** — https://www.moderntreasury.com

- Observed: White ground with a faint square grid behind the hero and a
  flow diagram of labelled nodes. Display face at 71px, weight 450. Pale
  tinted panels hold product fragments and code. Dark green footer.
- Suggests: A grid ground plus a diagram is the standard payments look. It is
  clear and already common.
- Do not copy: Node-and-line flow diagrams. They are the most generic
  available picture of "systems".

**Jane Street** — https://www.janestreet.com

- Observed: White ground, heavy uppercase headline (Alright Sans, 72px,
  weight 800), a hexagon motif built from photographs. Short page (2,955px).
- Suggests: A firm can be distinctive with one geometric motif and very
  little copy. The valuable exception here is brevity.

**Hudson River Trading** — https://www.hudsonrivertrading.com

- Observed (mobile only): White ground, very large light headline (IBM Plex
  Sans, 96px, weight 300) made of stacked single words.
- Limit: Desktop returned a bot check, so nothing is claimed about it.

### Industrial and engineering

**Hadrian** — https://www.hadrian.co

- Observed: Deep navy ground (`rgb(0,37,72)`). Blueprint-style wireframe
  drawings of parts. A yellow accent (`rgb(243,160,0)`). Söhne headings at
  72px with Söhne Mono labels. Frames with chamfered corners. Facility
  clocks in the header.
- Why it works: The drawing style comes from the trade itself, so it reads
  as credible instead of decorative.
- Relevant to Kordran: Drawing conventions from the shop floor (projection,
  dimension lines, datum marks) as the illustration system.
- Do not copy: Navy and yellow blueprint. It is Hadrian's, and Kordran is
  not a manufacturer.

**Anduril** — https://www.anduril.com

- Observed: Black ground, centered uppercase headline, a mosaic of product
  photography and renders in tiles, then grey and cream editorial sections.
- Suggests: Product photography carries the page. Kordran has no product to
  photograph, so this structure does not transfer.

**Palantir** — https://www.palantir.com

- Observed: White ground, technical line drawings with leader lines and
  labels, very large type lower on the page, six videos, about 24.6 MB.
- Relevant to Kordran: Labelled line drawings. The plate's legend and
  hover readout follow this convention.
- Trade-off: Weight. The page is slow to settle.

**Monumental** — https://www.monumental.co

- Observed: Warm paper ground (`rgb(244,242,234)`), Satoshi headline at
  97px, one orange-red accent (`rgb(247,72,35)`), photography of machines
  on real sites.
- Relevant to Kordran: A warm paper ground makes an industrial company feel
  considered instead of cold. Kordran's paper is in the same family and
  keeps teal, not orange, as the accent.

**Relativity Space** — https://www.relativityspace.com

- Observed: Full-bleed factory photography, rounded dark cards, purple-blue
  gradients, a persistent cookie bar across every frame.
- Suggests: Photography is the asset; the interface around it is ordinary.
  The gradients date it.

### Product and interface craft

**Linear** — https://linear.app

- Observed: Near-black ground (`rgb(8,9,10)`), Inter at 64px, 231 inline
  SVGs, isometric wireframe figures set above three columns of text.
- Relevant to Kordran: Small isometric figures above short columns. The
  "What we examine" section uses this arrangement with solid tiles instead
  of wireframes.

**Vercel** — https://vercel.com

- Observed (mobile only): Light ground (`rgb(250,250,250)`), Geist at 48px
  with tight tracking (−2.88px), mono captions, two canvases.
- Limit: Desktop capture timed out.

**Teenage Engineering** — https://teenage.engineering

- Observed: Black ground, a single product lit from above with a long cast
  shadow that the page scrolls down, icon navigation, a thin custom face,
  and copy that jokes about the shadow. Three kilobytes of script.
- Suggests: One object and one physical idea (a shadow) can be the entire
  page. The lesson is commitment to a single device.

### Interactive studios

**Lusion** — https://lusion.co

- Observed: White ground, a single framed WebGL stage with rounded corners,
  solids in three flat colors, Aeonik at 36px. Three canvases.
- Relevant to Kordran: Flat-toned solids with no gloss look deliberate and
  hold up when still. The plate uses three face tones and no lighting model.

**Igloo Inc** — https://www.igloo.inc

- Observed: A grey ground and nothing else in the capture; about 15 MB
  transferred while loading. No heading or text in the document.
- Suggests: When the experience is the canvas, a visitor on a slow or
  unsupported device gets an empty page.

**Active Theory** — https://activetheory.net

- Observed: "Your browser is not supported" at both widths.
- Suggests: The same point as Igloo, more bluntly. Kordran's content must
  never depend on the canvas.

### Baseline

**Kordran (previous site)** — https://kordran.com

- Observed: White ground, Instrument Sans at 53px, IBM Plex Mono labels, a
  thin wireframe "registration field" in the hero, the painting at the foot
  under a dark scrim, navigation with both a Contact link and a contact
  button. A hydration mismatch was logged in the console.
- Assessment: The copy and positioning were sound. The page was sparse, the
  hero graphic needed a caption to be understood, and the painting was
  hidden.

## Strongest attributes across the set

1. **A visible structure.** Hyperliquid's rules, Orderful's tile gaps,
   DataRobot's ticks, Hadrian's frames. The best sites show their grid.
2. **One material language.** Robinhood's chrome, Lusion's flat solids,
   Hadrian's wireframes. Every dimensional object looks made the same way.
3. **Accent discipline.** One accent, used for meaning.
4. **Mono capitals for the technical register.** Orderful, Hadrian, Vercel.
5. **Explanation by diagram.** Orderful, Linear, Palantir, Mercury.
6. **Short declarative headlines.** Ramp, Jane Street.

## Most promising approaches for Kordran

- Draw the service itself (records compared against each other) instead of
  a metaphor for technology.
- Use shop-floor drawing conventions: one projection, dimension lines,
  datum marks, a legend.
- Keep one live scene and make it legible as a still image.
- Put real record fragments on the page: an agreement line and an invoice
  line with the same part on them.
- Let a warm paper ground and one painting carry the feeling of physical
  industry, so the interface can stay exact.

## Clichés to avoid

- Node-and-line network diagrams and globe graphics.
- Gradient meshes, glows, and glass panels.
- Dark mode with a neon accent.
- Dashboard screenshots of software that does not exist.
- Logo walls, counters, and testimonial carousels. Kordran has none to
  show, and inventing them is prohibited.
- Stock photography of factories with a color overlay.
- Scroll-driven camera flights.
- "AI-powered" as a headline.

## Three original opportunities

1. **The reconciliation matrix as an object.** Price lines against invoices
   is a real table. Drawn as machined tiles on a surface plate, agreement is
   flatness and a discrepancy is a measurable height. Nothing in the
   reference set does this.
2. **Units you can count.** $36,000 is 18,000 units at $2.00. Drawn as 180
   squares of 100 units, the figure becomes something a reader can verify
   by eye, and a validated subset becomes a visibly smaller filled area.
3. **The logo as the unit.** The mark is two offset squares. Tiles, list
   markers, button glyphs, and unit squares can all be that square, so the
   identity is built out of its own logo.
