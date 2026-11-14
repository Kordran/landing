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
 * Eight quarters climb to the finding. The green in each bar is the
 * opportunity; the red cap is what does not hold. Four more quarters
 * show what is not billed if the price is corrected.
 */

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

const scale = [potentialDiscrepancy, annualPrevented, 0];

export default function LineProfile() {
  return (
    <figure className="outcome">
      <p className="outcome-story">
        Over two years the difference climbs to {formatUsd(potentialDiscrepancy)}.{" "}
        {formatUsd(supportedExposure)} of it is an opportunity the records can
        support. If the price is corrected, the next year is{" "}
        {formatUsd(annualPrevented)} not billed.
      </p>

      <div className="vbars">
        <div className="vbars-scale micro" aria-hidden="true">
          {scale.map((value) => (
            <span
              key={value}
              style={{ "--at": value / potentialDiscrepancy } as CSSProperties}
            >
              {value === 0 ? "$0" : formatUsdShort(value)}
            </span>
          ))}
        </div>

        <div className="vbars-plot" aria-hidden="true">
          <span className="vbars-grid" style={{ "--at": 0.5 } as CSSProperties} />
          {found.map((bar) => (
            <div
              key={`found-${bar.step}`}
              className="vbar"
              style={{ "--i": bar.step } as CSSProperties}
              title={`Quarter ${bar.step}. ${formatUsd(bar.observed)} observed. ${formatUsd(bar.opportunity)} supported.`}
            >
              <span
                className="vbar-fill is-over"
                style={{ "--h": bar.observed / potentialDiscrepancy } as CSSProperties}
              />
              <span
                className="vbar-fill is-back"
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
                className="vbar-fill is-ahead"
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
          <i className="is-back" />
          Opportunity
        </li>
        <li>
          <i className="is-over" />
          Excluded
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
        <li>After one year, {formatUsd(quarter * 4)} observed.</li>
        <li>
          After two years, {formatUsd(potentialDiscrepancy)} observed and{" "}
          {formatUsd(supportedExposure)} supported.
        </li>
        <li>
          A year after a corrected price, {formatUsd(annualPrevented)} is not
          billed.
        </li>
      </ul>
    </figure>
  );
}
