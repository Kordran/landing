# 9. Creative critique

## What makes it distinctive

**The picture is the service.** Most company sites illustrate a mood. This
one draws the actual comparison Kordran performs, in a form borrowed from the
customer's own trade. A purchasing lead does not need the legend to see a
field of identical records with a few standing out.

**One drawing set.** The hero plate, the three scope figures, the stage
figures, the evidence stack, and the unit grids share a projection, three
face tones, and a tile. The site looks drawn by one hand because it is
generated from one model.

**The logo is the unit.** Tiles, list markers, button glyphs, and unit
squares are all the logo's square. The identity is made from its own mark,
which is why it can extend without new inventions.

**Honesty is a visual property.** The exposure figure carries its caveat in
the same block. On the Approach page the reader watches thirty squares drop
out between "potential exposure" and "validated claim", and sees an empty
grid under "realized outcome". The careful distinction the business depends
on is something you can see, not a disclaimer.

**The painting has a job.** It is the only warm, hand-made image on the
site and it arrives last, so the page moves from exact to physical. The
footer sits in its darkened foot.

## Trade-offs made

- **WebGL for one scene.** The live plate costs a lazy 121 KB chunk and a
  second renderer to maintain. The gain is GPU-side animation and picking.
  It was judged worth it only because the SVG twin makes the scene optional.
- **No serif, no second accent.** Both were attractive in prototypes and
  both pulled the identity toward someone else's. The result is more
  austere than Direction C would have been.
- **Paper instead of white.** Warmer and more material, at the cost of
  slightly lower contrast for hairlines, which is why form boundaries have
  their own darker token.
- **Two pages.** The site does not have About, case studies, or pricing
  because there is nothing true to put on them yet. It will feel small to a
  visitor who expects a larger firm.
- **The hero composition starts at 1120px.** Between 900 and 1119px the
  plate sits under the copy as it does on tablets. A side-by-side layout in
  that range crowded the call to action.
- **The plate's pointer detail is desktop-only.** Touch devices get the
  inspection light and the scroll settle, not the readout.

## What could still be improved

1. **Field performance is unmeasured.** The numbers in the validation
   document are lab results against a local production build. Real-user
   LCP and INP should be checked after deployment.
2. **The WebGL scene was verified on software rendering only.** It runs and
   matches the SVG, and its code paths for context loss and disposal are in
   place, but it has not been watched on a range of physical GPUs, high
   refresh displays, or low-end phones.
3. **The success path of the contact form was not exercised end to end.**
   The local environment has no database credentials, so the request
   returned the handled failure state. Validation, the failure message, and
   focus behavior were tested; a real submission should be confirmed in a
   configured environment.
4. **Assistive technology was not tested by hand.** Automated checks pass
   and the markup is semantic, but nobody has listened to the page in a
   screen reader.
5. **The plate could carry real meaning per engagement.** The raised runs
   are illustrative. With permission, a future case note could render its
   own anonymized plate from actual line counts.
6. **The mid-width hero.** From 1120 to about 1280px the legend's paper
   backing overlaps the plate's near corner. It reads as a title block, and
   a cleaner solution would re-crop the plate for that range.
7. **The painting is one image.** Art-directed crops for phone, tablet, and
   desktop are produced with `object-position`. A purpose-made tall crop of
   the same painting would give phones a stronger close. No additional
   painting should be introduced.
8. **Share images.** The Open Graph image uses the new palette and the
   example figures, not the plate. Rendering the plate into it would tie
   link previews to the identity.
9. **Remaining lint warning.** `Logo.tsx` uses a plain `img` for SVG logos,
   which predates this work and is intentional for SVG.

## Standing rules for whoever works on this next

- If a new figure is needed, build it from tiles in `axo.ts`. Do not import
  an icon set or a second illustration style.
- If a number appears, name what kind of number it is beside it.
- If a proof point is added, it must be real and approved.
- Keep one live scene. Keep the painting singular.
