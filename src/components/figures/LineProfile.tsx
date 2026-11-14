import type { CSSProperties } from "react";
import {
  annualPrevented,
  excludedExposure,
  formatUsd,
  formatUsdShort,
  monthlyDifference,
  potentialDiscrepancy,
  supportedExposure,
} from "@/lib/example";

/**
 * A vertical bar chart of one example over time.
 * Losses go below zero. Wins go above it.
 * Eight quarters: the overbilling grows downward, and the opportunity
 * the records support grows upward. Four more quarters show what is
 * not billed if the price is corrected.
 */

function signed(value: number): string {
  if (value === 0) return "$0";
  const text = formatUsdShort(Math.abs(value));
  return value > 0 ? `+${text}` : `−${text}`;
}

function level(value: number): number {
  return (value + potentialDiscrepancy) / (2 * potentialDiscrepancy);
}

const HISTORY = 8;
const FORWARD = 4;
const quarter = monthlyDifference * 3;

const found = Array.from({ length: HISTORY }, (_, index) => {
  const observed = quarter * (index + 1);
  const opportunity = Math.round(
    (supportedExposure * observed) / potentialDiscrepancy
  );
  return { step: index + 1, observed, opportunity };
});

const saved = Array.from({ length: FORWARD }, (_, index) => ({
  step: index + 1,
  amount: quarter * (index + 1),
}));

const scale = [
  potentialDiscrepancy,
  annualPrevented,
  0,
  -annualPrevented,
  -potentialDiscrepancy,
];

export default function LineProfile() {
  return (
    <figure className="outcome">
      <p className="outcome-story">
        Below zero, two years of overbilling reach {formatUsd(potentialDiscrepancy)}.
        Above it, {formatUsd(supportedExposure)} is the opportunity the records
        can support. If the price is corrected, the next year is{" "}
        {formatUsd(annualPrevented)} not billed.
      </p>

      <div className="vbars">
        <div className="vbars-scale micro" aria-hidden="true">
          {scale.map((value) => (
            <span
              key={value}
              style={{ "--at": level(value) } as CSSProperties}
            >
              {signed(value)}
            </span>
          ))}
        </div>

        <div className="vbars-plot" aria-hidden="true">
          <span className="vbars-zero" />
          <span className="vbars-grid" style={{ "--at": level(annualPrevented) } as CSSProperties} />
          <span className="vbars-grid" style={{ "--at": level(-annualPrevented) } as CSSProperties} />
          {found.map((bar) => (
            <div
              key={`found-${bar.step}`}
              className="vbar"
              style={{ "--i": bar.step } as CSSProperties}
              title={`Quarter ${bar.step}. Loss ${formatUsd(bar.observed)}. Opportunity ${formatUsd(bar.opportunity)}.`}
            >
              <span
                className="vbar-fill is-loss"
                style={{ "--h": bar.observed / potentialDiscrepancy } as CSSProperties}
              />
              <span
                className="vbar-fill is-win"
                style={{ "--h": bar.opportunity / potentialDiscrepancy } as CSSProperties}
              />
            </div>
          ))}
          <i className="vbars-mark" />
          {saved.map((bar) => (
            <div
              key={`saved-${bar.step}`}
              className="vbar"
              style={{ "--i": HISTORY + bar.step } as CSSProperties}
              title={`Quarter ${bar.step} after a corrected price. ${formatUsd(bar.amount)} not billed.`}
            >
              <span
                className="vbar-fill is-win is-ahead"
                style={{ "--h": bar.amount / potentialDiscrepancy } as CSSProperties}
              />
            </div>
          ))}
        </div>

        <div className="vbars-axis micro" aria-hidden="true">
          <span>Year 1</span>
          <span>Year 2</span>
          <span>+1 year</span>
        </div>
      </div>

      <ul className="outcome-legend micro">
        <li>
          <i className="is-loss" />
          Loss
        </li>
        <li>
          <i className="is-win" />
          Opportunity
        </li>
        <li>
          <i className="is-ahead" />
          Not billed, if corrected
        </li>
      </ul>

      <p className="outcome-foot">
        {formatUsd(excludedExposure)} of the finding sits on other terms. The
        year ahead is future cost avoidance, if buying continues.
      </p>

      <ul className="sr-only">
        <li>After one year, a loss of {formatUsd(quarter * 4)}.</li>
        <li>
          After two years, a loss of {formatUsd(potentialDiscrepancy)} and an
          opportunity of {formatUsd(supportedExposure)}.
        </li>
        <li>
          A year after a corrected price, {formatUsd(annualPrevented)} is not
          billed.
        </li>
      </ul>
    </figure>
  );
}
