"use client";

import { useState, type CSSProperties } from "react";
import { example, formatCount, formatUsd } from "@/lib/example";

/**
 * One price line, flat. Bar height is the amount billed above the agreement,
 * on a labeled scale. Moving across an invoice reads that invoice and the
 * running total.
 */

const MONTHS = 24;
/** First invoice billed above the agreement, and the first one back on it. */
const OVER_FROM = 0;
const CORRECTED = 8;

const excess = Math.round((example.billedUnit - example.agreedUnit) * 100) / 100;
const perInvoice = Math.round(excess * example.unitsPerMonth * 100) / 100;
const overCount = CORRECTED - OVER_FROM;
const recovered = perInvoice * overCount;

const invoices = Array.from({ length: MONTHS }, (_, i) => i >= OVER_FROM && i < CORRECTED);

function through(index: number): number {
  let count = 0;
  for (let i = 0; i <= index && i < CORRECTED; i += 1) {
    if (invoices[i]) count += 1;
  }
  return count * perInvoice;
}

const ticks = [
  { at: 1, label: formatUsd(excess, 2) },
  { at: 0.5, label: formatUsd(excess / 2, 2) },
];

export default function LineProfile() {
  const [at, setAt] = useState<number | null>(null);
  const over = at !== null && invoices[at];
  const total = at === null ? recovered : through(at);

  return (
    <div className="profile">
      <p className="profile-head micro">
        <span>One price line · dollars over the agreement</span>
        <span className="profile-readout" data-on={at !== null || undefined}>
          {at === null ? (
            `${formatCount(overCount)} invoices · ${formatUsd(recovered)} over`
          ) : (
            <>
              <span>Invoice {String(at + 1).padStart(2, "0")}</span>
              {over
                ? ` ${formatUsd(example.billedUnit, 2)} billed · ${formatUsd(excess, 2)} over · ${formatUsd(total)} to here`
                : ` ${formatUsd(example.agreedUnit, 2)} billed · as agreed`}
            </>
          )}
        </span>
      </p>

      <div className="profile-chart">
        <div className="profile-scale micro" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick.at} style={{ "--at": tick.at } as CSSProperties}>
              {tick.label}
            </span>
          ))}
          <span style={{ "--at": 0 } as CSSProperties}>Agreed</span>
        </div>
        <div
          className="profile-plot"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const index = Math.floor(((event.clientX - rect.left) / rect.width) * MONTHS);
            setAt(Math.max(0, Math.min(MONTHS - 1, index)));
          }}
          onPointerLeave={() => setAt(null)}
        >
          {ticks.map((tick) => (
            <span
              key={tick.at}
              className="profile-grid"
              style={{ "--at": tick.at } as CSSProperties}
              aria-hidden="true"
            />
          ))}
          {invoices.map((isOver, i) => (
            <i
              key={i}
              className={[
                isOver ? "is-over" : "",
                i === CORRECTED ? "is-corrected" : "",
                i === at ? "is-at" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined}
              style={{ "--v": isOver ? 1 : 0, "--i": i } as CSSProperties}
            />
          ))}
        </div>
      </div>

      <ul className="profile-key micro">
        <li>Found · {formatUsd(excess, 2)} a unit</li>
        <li>Corrected back to {formatUsd(example.agreedUnit, 2)}</li>
        <li>Held there</li>
      </ul>
    </div>
  );
}
