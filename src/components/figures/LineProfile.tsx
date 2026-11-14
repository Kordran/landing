import type { CSSProperties } from "react";
import {
  annualPrevented,
  excludedExposure,
  formatUsd,
  potentialDiscrepancy,
  supportedExposure,
} from "@/lib/example";

/**
 * Three bars, one story. What was observed, the part the records support,
 * and a year of it not billed if the price is corrected.
 */

const rows = [
  {
    label: "Observed",
    value: potentialDiscrepancy,
    tone: "over",
  },
  {
    label: "Opportunity",
    value: supportedExposure,
    tone: "back",
  },
  {
    label: "A year, if corrected",
    value: annualPrevented,
    tone: "ahead",
  },
] as const;

export default function LineProfile() {
  return (
    <figure className="outcome">
      <p className="outcome-story">
        Of the {formatUsd(potentialDiscrepancy)} observed,{" "}
        {formatUsd(supportedExposure)} is an opportunity the records can
        support. If the price is corrected and buying continues,{" "}
        {formatUsd(annualPrevented)} a year is not billed.
      </p>

      <div className="outcome-rows">
        {rows.map((row, index) => (
          <div className="outcome-row" key={row.label}>
            <div className="outcome-meta">
              <span className="micro">{row.label}</span>
              <strong className={`num ${row.tone === "over" ? "is-over" : "is-back"}`}>
                {formatUsd(row.value)}
              </strong>
            </div>
            <div className="outcome-track">
              <i
                className={`outcome-fill is-${row.tone}`}
                style={
                  {
                    "--w": row.value / potentialDiscrepancy,
                    "--i": index,
                  } as CSSProperties
                }
              />
            </div>
          </div>
        ))}
      </div>

      <p className="outcome-foot">
        {formatUsd(excludedExposure)} of the finding sits on other terms. The
        year ahead is future cost avoidance.
      </p>
    </figure>
  );
}
