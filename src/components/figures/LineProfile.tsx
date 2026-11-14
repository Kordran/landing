"use client";

import { useMemo, useState } from "react";
import { BASE, SETTLED } from "@/components/plate/model";
import { example, formatUsd } from "@/lib/example";
import Axo from "./Axo";
import { axoScene, tileField, type AxoBox } from "./axo";

/**
 * One price line of the hero plate, seen close. The left third is what Verify
 * finds, the middle is that excess coming back down to the agreement, and the
 * right is every invoice after the fix.
 */

const COLS = 18;
const FOUND = 0.86;
const PITCH = 1.16;

/** Height of the excess on each invoice. Zero means billed as agreed. */
function excessAt(col: number): number {
  if (col < 2 || col >= 12) return 0;
  if (col < 6) return FOUND;
  const step = (col - 6) / 5;
  return FOUND + (SETTLED - FOUND) * step;
}

const raised = Array.from({ length: COLS }, (_, col) => {
  const h = excessAt(col);
  return h > 0 ? { col, row: 0, h } : null;
}).filter((cap): cap is { col: number; row: number; h: number } => cap !== null);

/** The tallest invoice, where the gap is measured. */
const MEASURED = 4;
const corner = MEASURED * PITCH + 1;

const frame: AxoBox[] = tileField({
  cols: COLS,
  rows: 1,
  raised: [{ col: MEASURED, row: 0, h: FOUND + 0.55 }],
});

const phases = [
  { name: "Verify", line: "Billed above the agreement" },
  { name: "Resolve", line: "Brought back down" },
  { name: "Prevent", line: "Billed as agreed after that" },
];

export default function LineProfile() {
  const [at, setAt] = useState<number | null>(null);
  const excess = Math.round((example.billedUnit - example.agreedUnit) * 100) / 100;

  const scene = useMemo(
    () =>
      axoScene({
        boxes: tileField({ cols: COLS, rows: 1, raised }),
        frame,
        lines: [
          {
            from: [corner, BASE, 1],
            to: [corner, BASE + FOUND, 1],
            kind: "accent",
          },
        ],
        labels: [
          {
            at: [corner, BASE + FOUND, 1],
            text: `+${formatUsd(excess, 2)}`,
            accent: true,
            anchor: "middle",
            dy: -6,
          },
        ],
        pad: [22, 10, 6, 10],
      }),
    [excess]
  );

  const read = at === null ? null : phases[Math.min(2, Math.floor(at / 6))];

  return (
    <div className="profile">
      <p className="profile-head micro">
        <span>One price line, invoice by invoice</span>
        <span className="profile-readout" data-on={read ? "true" : undefined}>
          {read ? (
            <>
              <span>{read.name}</span> {read.line}
            </>
          ) : (
            `Agreed ${formatUsd(example.agreedUnit, 2)} · billed ${formatUsd(example.billedUnit, 2)}`
          )}
        </span>
      </p>
      <div
        className="profile-art"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const share = (event.clientX - rect.left) / rect.width;
          setAt(Math.max(0, Math.min(COLS - 1, Math.floor(share * COLS))));
        }}
        onPointerLeave={() => setAt(null)}
      >
        <Axo scene={scene} />
      </div>
      <ul className="profile-key micro">
        <li>Found on the invoices</li>
        <li>Corrected, one invoice at a time</li>
        <li>Every invoice after</li>
      </ul>
    </div>
  );
}
