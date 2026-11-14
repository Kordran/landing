# 4. Selection

## Scores

Each direction was scored 0 to 10 per criterion after viewing its prototype
at desktop and phone widths. Total = Σ (score × weight).

| Criterion | Weight | A — Register | B — Plate | C — Exhibit |
| --------- | -----: | -----------: | --------: | ----------: |
| Commercial clarity | 25% | 7 | 9 | 8 |
| Originality and memorability | 20% | 5 | 8 | 6 |
| Visual cohesion and polish | 20% | 7 | 8 | 8 |
| Content communication | 15% | 7 | 8 | 9 |
| Performance and feasibility | 10% | 9 | 7 | 9 |
| Accessibility and usability | 10% | 9 | 8 | 8 |
| **Weighted total** | | **7.00** | **8.15** | **7.85** |

Working: A = 1.75 + 1.00 + 1.40 + 1.05 + 0.90 + 0.90. B = 2.25 + 1.60 + 1.60 +
1.20 + 0.70 + 0.80. C = 2.00 + 1.20 + 1.60 + 1.35 + 0.90 + 0.80.

The scores are one designer's judgment against prototypes, not measurements.
They are here to make the trade-offs explicit. The gap between B and C is
small enough that the reasoning below matters more than the number.

## Reasoning

**Commercial clarity.** B's picture is understood before the legend is read:
a field of identical things with a few standing out. A's needs its labels.
C leads with dollar amounts, which is clear about money and less clear about
what the company does.

**Originality.** Nothing in the reference set draws its service as a
metrology object. A is a refinement of what Kordran already had. C is
recognizably in Hyperliquid's manner.

**Cohesion.** B and C both produce a full system from one idea. A's line
figures are consistent and too slight to hold long sections together.

**Content communication.** C is the best container for numbers with caveats.
B is nearly as good once it borrows C's structure.

**Performance and feasibility.** B is the only direction that needs WebGL to
be at its best, which costs a lazy-loaded chunk and careful fallbacks.

**Accessibility.** All three can meet WCAG 2.2 AA. B loses a point for
pointer-dependent detail (the hover readout), which is supplementary and has
a text legend beside it.

## Decision

**Direction B, with two things taken from the others.**

- From C: the exhibit structure. Every figure sits on a sheet with a mono
  header naming what it is and stating that it is hypothetical. Numbers carry
  their arithmetic and their caveat next to them.
- From A: dimension lines. The $2.00 gap between agreed and billed is drawn
  as a dimension, the way a drawing marks a tolerance.

These are compatible because all three share the same underlying subject and
none of the borrowed parts brings a second visual style with it.

## What was deliberately left out

- **C's serif.** It was the most attractive single element in any prototype
  and the most borrowed. One sans, with width and weight variation, keeps the
  voice engineering-led.
- **A second accent.** A warm "heat" color for raised tiles was tried in the
  plate prototype. It made the plate look like an alert dashboard. Teal
  alone does the job, and the painting stays the only warm thing on the page.
- **Shadows, gloss, and lighting on the tiles.** Any of them moves the plate
  toward a game. Faces are three flat tones chosen by hand.
- **A dark hero.** The plate reads best as a drawing on paper.

## Decisions that would need authorization

None were required to proceed. Two were left for Kordran because they are
commercial, not design, choices: whether to name specific industries served,
and whether to publish any engagement terms. The site states neither.
