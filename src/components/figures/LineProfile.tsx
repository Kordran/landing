"use client";

import { useState, type CSSProperties } from "react";
import {
  annualPrevented,
  example,
  formatCount,
  formatUsd,
  formatUsdShort,
  potentialDiscrepancy,
  unitDelta,
} from "@/lib/example";

/**
 * The homepage example as a chart. One part, billed $2.60 over the agreement
 * every month. Left alone it reaches $312,000. Corrected halfway, the second
 * half never gets billed. Moving across a month reads both.
 */

const MONTHS = example.months;
const CORRECTED = 12;
const perMonth = Math.round(unitDelta * example.unitsPerMonth);
const found = perMonth * CORRECTED;

const phases = [
  {
    id: "verify",
    at: CORRECTED - 1,
    label: "Verify",
    detail: `${formatUsd(found)} found`,
  },
  {
    id: "resolve",
    at: CORRECTED,
    label: "Resolve",
    detail: "Price corrected",
  },
  {
    id: "prevent",
    at: MONTHS - 1,
    label: "Prevent",
    detail: `${formatUsd(annualPrevented)} stopped`,
  },
] as const;

function aloneThrough(month: number): number {
  return perMonth * (month + 1);
}

function billedThrough(month: number): number {
  return perMonth * Math.min(month + 1, CORRECTED);
}

export default function LineProfile() {
  const [at, setAt] = useState(MONTHS - 1);
  const monthOver = at < CORRECTED;
  const billed = billedThrough(at);
  const alone = aloneThrough(at);
  const stopped = alone - billed;
  const phase = at < CORRECTED ? "verify" : at === CORRECTED ? "resolve" : "prevent";

  const width = 240;
  const height = 100;
  const inset = 14;
  const x = (month: number) => ((month + 0.5) / MONTHS) * width;
  const y = (value: number) =>
    inset + (height - inset) * (1 - value / potentialDiscrepancy);

  const aloneLine = Array.from({ length: MONTHS }, (_, month) => {
    return `${x(month)},${y(aloneThrough(month))}`;
  }).join(" ");

  const billedLine = Array.from({ length: MONTHS }, (_, month) => {
    return `${x(month)},${y(billedThrough(month))}`;
  }).join(" ");

  const billedArea = [
    `${x(0)},${height}`,
    billedLine,
    `${x(MONTHS - 1)},${height}`,
  ].join(" ");

  const ticks = [potentialDiscrepancy, found, 0];

  return (
    <figure className="ledger">
      <figcaption className="profile-head micro">
        <span>
          Same example · {formatCount(example.unitsPerMonth)} units a month
        </span>
        <span className="profile-readout" data-on="true">
          <span>Month {String(at + 1).padStart(2, "0")}</span>
          {monthOver
            ? ` ${formatUsd(example.billedUnit, 2)} billed · ${formatUsd(perMonth)} over`
            : ` ${formatUsd(example.agreedUnit, 2)} billed · as agreed`}
        </span>
      </figcaption>

      <div className="ledger-figures">
        <p>
          <span className="micro">Billed over</span>
          <strong className="num">{formatUsd(billed)}</strong>
        </p>
        <p>
          <span className="micro">If left alone</span>
          <strong className="num">{formatUsd(alone)}</strong>
        </p>
        <p className="is-stopped" data-on={stopped > 0 || undefined}>
          <span className="micro">Stopped</span>
          <strong className="num">{formatUsd(stopped)}</strong>
        </p>
      </div>

      <div className="ledger-chart">
        <div className="ledger-scale micro" aria-hidden="true">
          {ticks.map((value) => (
            <span
              key={value}
              style={{ "--at": value / potentialDiscrepancy } as CSSProperties}
            >
              {value === 0 ? "$0" : formatUsdShort(value)}
            </span>
          ))}
        </div>
        <div
          className="ledger-plot"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const index = Math.floor(((event.clientX - rect.left) / rect.width) * MONTHS);
            setAt(Math.max(0, Math.min(MONTHS - 1, index)));
          }}
        >
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
            <line className="ledger-grid" x1="0" x2={width} y1={y(found)} y2={y(found)} />
            <polygon className="ledger-area" points={billedArea} />
            <polyline className="ledger-billed" points={billedLine} />
            <polyline className="ledger-alone" points={aloneLine} />
            <line
              className="ledger-mark"
              x1={x(CORRECTED - 0.5)}
              x2={x(CORRECTED - 0.5)}
              y1="0"
              y2={height}
            />
            <line
              className="ledger-cursor"
              x1={x(at)}
              x2={x(at)}
              y1="0"
              y2={height}
            />
          </svg>
        </div>
      </div>

      <div className="ledger-phases">
        {phases.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={phase === item.id}
            onClick={() => setAt(item.at)}
          >
            <span className="micro">{item.label}</span>
            <span>{item.detail}</span>
          </button>
        ))}
      </div>

      <ul className="ledger-legend micro">
        <li>
          <i className="is-billed" />
          Billed over the agreement
        </li>
        <li>
          <i className="is-alone" />
          If the price is left alone
        </li>
      </ul>

      <p className="sr-only">
        {formatCount(example.unitsPerMonth)} units a month at {formatUsd(unitDelta, 2)}{" "}
        over the agreement is {formatUsd(perMonth)} a month. Left alone for{" "}
        {MONTHS} months that is {formatUsd(potentialDiscrepancy)}. Corrected after{" "}
        {CORRECTED} months, {formatUsd(found)} has been billed over and the next{" "}
        {formatUsd(annualPrevented)} is not.
      </p>
    </figure>
  );
}
