"use client";

import { useState, type CSSProperties } from "react";
import { example, formatUsd } from "@/lib/example";

/**
 * One price line seen from the side, one monthly invoice per column: the
 * plate in elevation. Overbilled invoices stand up, the price is corrected
 * in one step, and the excess already billed comes back as a credit. The
 * three thirds sit over Verify, Resolve and Prevent.
 */

const PER_STEP = 12;
const FIRST_OVER = 3;
/** Index of the first invoice billed at the corrected price. */
const CORRECTED = PER_STEP + 2;
const COUNT = PER_STEP * 3;

const excess = Math.round((example.billedUnit - example.agreedUnit) * 100) / 100;
const perInvoice = excess * example.unitsPerMonth;
const overbilled = CORRECTED - FIRST_OVER;
const credit = perInvoice * overbilled;

const invoices = Array.from({ length: COUNT }, (_, i) => ({
  over: i >= FIRST_OVER && i < CORRECTED,
}));

const states = [
  `${overbilled} invoices billed over`,
  "Price corrected · credit issued",
  "Billed as agreed",
];

function describe(i: number) {
  const ref = `Invoice ${String(i + 1).padStart(2, "0")}`;
  if (invoices[i].over)
    return {
      ref,
      line: `${formatUsd(example.billedUnit, 2)} billed · ${formatUsd(perInvoice)} over`,
    };
  if (i === CORRECTED)
    return {
      ref,
      line: `Corrected to ${formatUsd(example.agreedUnit, 2)} · ${formatUsd(credit)} credited`,
    };
  return { ref, line: `${formatUsd(example.agreedUnit, 2)} billed · as agreed` };
}

export default function LineProfile() {
  const [at, setAt] = useState<number | null>(null);
  const read = at === null ? null : describe(at);

  return (
    <div className="profile" aria-hidden="true">
      <p className="profile-head micro">
        <span>One price line · one invoice a month</span>
        <span className="profile-readout" data-on={read ? "true" : undefined}>
          {read ? (
            <>
              <span>{read.ref}</span> {read.line}
            </>
          ) : (
            `Agreed ${formatUsd(example.agreedUnit, 2)} a unit`
          )}
        </span>
      </p>
      <div
        className="profile-row"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const i = Math.floor(((event.clientX - rect.left) / rect.width) * COUNT);
          setAt(Math.max(0, Math.min(COUNT - 1, i)));
        }}
        onPointerLeave={() => setAt(null)}
      >
        {invoices.map((invoice, i) => (
          <i
            key={i}
            className={[
              invoice.over ? "is-raised" : "",
              i === CORRECTED ? "is-corrected" : "",
              i === at ? "is-at" : "",
            ]
              .filter(Boolean)
              .join(" ") || undefined}
            style={{ "--i": i, "--k": i - FIRST_OVER } as CSSProperties}
          />
        ))}
      </div>
      <ul className="profile-key micro">
        {states.map((state) => (
          <li key={state}>{state}</li>
        ))}
      </ul>
    </div>
  );
}
