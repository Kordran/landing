import { BASE, SETTLED } from "@/components/plate/model";
import { axoScene, tileField, type AxoBox } from "./axo";

/** One agreed price, one billed line out of register. */
export const complianceScene = axoScene({
  boxes: tileField({ cols: 6, rows: 3, raised: [{ col: 4, row: 1, h: 0.56 }] }),
});

/** A price that steps up, then steps up again, and stays. */
export const increaseScene = axoScene({
  boxes: tileField({
    cols: 6,
    rows: 3,
    raised: [
      { col: 2, row: 1, h: 0.28 },
      { col: 3, row: 1, h: 0.28 },
      { col: 4, row: 1, h: 0.62 },
      { col: 5, row: 1, h: 0.62 },
    ],
  }),
});

/** A thin charge that keeps coming back. */
export const surchargeScene = axoScene({
  boxes: tileField({
    cols: 6,
    rows: 3,
    raised: [
      { col: 0, row: 1, h: 0.14 },
      { col: 2, row: 1, h: 0.14 },
      { col: 4, row: 1, h: 0.14 },
    ],
  }),
});

const PITCH = 1.16;
const SHEET: [number, number, number] = [5.2, 0.07, 3.2];

/** Loose records: the same matter, described by sheets that do not line up. */
export const recordsScene = axoScene({
  boxes: [
    { at: [0, 0, 0], size: SHEET },
    { at: [0.5, 0.36, -0.2], size: SHEET },
    { at: [-0.25, 0.72, 0.3], size: SHEET },
    { at: [0.7, 1.08, 0.1], size: SHEET, tone: "teal" },
  ],
});

const proud = { col: 3, row: 1, h: 0.62 };
const proudX = proud.col * PITCH;
const proudZ = proud.row * PITCH;

/** Reconciled: the records become one surface and the difference stands out. */
export const reconcileScene = axoScene({
  boxes: tileField({ cols: 5, rows: 3, raised: [proud] }),
  lines: [
    {
      from: [proudX + 1, BASE, proudZ + 1],
      to: [proudX + 1, BASE + proud.h, proudZ + 1],
      kind: "accent",
    },
  ],
});

/** Resolved: the excess is gone. A thin plate marks what was corrected. */
export const resolveScene = axoScene({
  boxes: tileField({
    cols: 5,
    rows: 3,
    raised: [{ col: proud.col, row: proud.row, h: SETTLED }],
  }),
  // Reserve the height of the proud tile so the three figures share a baseline.
  lines: [
    {
      from: [proudX, BASE, proudZ],
      to: [proudX, BASE + proud.h, proudZ],
      kind: "space",
    },
  ],
});

export const evidenceRecords = [
  {
    id: "quotation",
    name: "Supplier quotation",
    what: "The price a supplier offered, the quantities it covered, and how long the offer stood.",
  },
  {
    id: "agreement",
    name: "Pricing agreement",
    what: "The agreed price, its effective dates, and any terms for escalation or surcharges.",
  },
  {
    id: "amendment",
    name: "Contract amendment",
    what: "What changed after signing, and the date the change took effect.",
  },
  {
    id: "approval",
    name: "Approved price change",
    what: "Which revisions your company actually accepted, and from when.",
  },
  {
    id: "order",
    name: "Purchase order",
    what: "What was ordered, in what quantity, and at what stated price.",
  },
  {
    id: "invoice",
    name: "Supplier invoice",
    what: "What was billed. This is the record the others are tested against.",
  },
] as const;

const STACK_SHEET: [number, number, number] = [5.4, 0.09, 3.6];
const STACK_STEP = 0.74;

/** The evidence, bottom to top in the order it is created. The invoice sits out of register. */
export const evidenceScene = axoScene({
  boxes: evidenceRecords.map((record, index): AxoBox => {
    const last = index === evidenceRecords.length - 1;
    return {
      id: record.id,
      at: [last ? 0.55 : 0, index * STACK_STEP, last ? -0.4 : 0],
      size: STACK_SHEET,
    };
  }),
  pad: [20, 12, 12, 12],
});
