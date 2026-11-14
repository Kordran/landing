"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { example, formatCount, formatUsd } from "@/lib/example";

const MAX_SQUARES = 240;

function cents(value: number): number {
  return Math.round(value * 100) / 100;
}

function parse(text: string): number | null {
  const value = Number(text.replace(/[$,\s]/g, ""));
  return text.trim() !== "" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

/** Smallest round unit count per square that keeps the grid readable. */
function scaleFor(units: number): number {
  let per = 100;
  while (units / per > MAX_SQUARES) per *= 10;
  return per;
}

const defaults = {
  agreed: example.agreedUnit.toFixed(2),
  billed: example.billedUnit.toFixed(2),
  units: String(example.units),
};

/**
 * The worked example as an exhibit: two records, the measured gap, the units
 * it applies to, and the arithmetic. The figures can be replaced to see how a
 * small unit difference scales. It never reports more than potential exposure.
 */
export default function ExposureExhibit() {
  const [agreed, setAgreed] = useState(defaults.agreed);
  const [billed, setBilled] = useState(defaults.billed);
  const [units, setUnits] = useState(defaults.units);
  const titleId = useId();

  const isExample =
    agreed === defaults.agreed &&
    billed === defaults.billed &&
    units === defaults.units;

  const result = useMemo(() => {
    const a = parse(agreed);
    const b = parse(billed);
    const u = parse(units);
    if (a === null || b === null || u === null) return null;
    const count = Math.round(u);
    const delta = cents(b - a);
    const per = scaleFor(count);
    return {
      agreed: a,
      billed: b,
      units: count,
      delta,
      exposure: cents(count * delta),
      per,
      squares: Math.min(MAX_SQUARES, Math.ceil(count / per)),
    };
  }, [agreed, billed, units]);

  const sign =
    result && result.delta > 0 ? "+" : result && result.delta < 0 ? "−" : "";
  const state =
    !result || result.delta > 0
      ? { title: "Potential exposure", note: "Not an established recovery" }
      : result.delta === 0
        ? { title: "No difference", note: "Billed as agreed" }
        : {
            title: "Billed below agreement",
            note: "No exposure in these figures",
          };

  return (
    <figure className="sheet exhibit" aria-labelledby={titleId}>
      <figcaption className="sheet-head" id={titleId}>
        <span>Example · {example.item}</span>
        <span>Hypothetical figures</span>
      </figcaption>

      <div className="exhibit-pair">
        <div>
          <p className="micro">
            Agreement{isExample ? ` ${example.agreementRef}` : ""}
          </p>
          <p className="figure-num num">
            {result ? formatUsd(result.agreed, 2) : "—"}
          </p>
          <p className="exhibit-note">Agreed unit price</p>
        </div>
        <div className={result && result.delta !== 0 ? "is-off" : undefined}>
          <p className="micro">
            Invoice{isExample ? ` ${example.invoiceRef}` : ""}
          </p>
          <p className="figure-num num">
            {result ? formatUsd(result.billed, 2) : "—"}
          </p>
          <p className="exhibit-note">Billed unit price</p>
        </div>
      </div>

      <div className="dimension">
        <span className="micro">Difference per unit</span>
        <span className="dimension-line" aria-hidden="true" />
        <span className="figure-num num">
          {result ? `${sign}${formatUsd(Math.abs(result.delta), 2)}` : "—"}
        </span>
      </div>

      <div className="exhibit-units">
        <p className="micro">
          {result
            ? `${formatCount(result.units)} units reviewed · one square = ${formatCount(result.per)} units`
            : "Units reviewed"}
        </p>
        <div
          className="unit-grid"
          aria-hidden="true"
          style={{ "--unit-cols": 30 } as CSSProperties}
        >
          {Array.from({ length: result?.squares ?? 0 }, (_, index) => (
            <i
              key={index}
              className={result && result.delta > 0 ? undefined : "is-out"}
              style={{ "--i": index } as CSSProperties}
            />
          ))}
        </div>
      </div>

      <div className="exhibit-total">
        <div aria-live="polite">
          <p className="figure-num num">
            {result
              ? `${result.exposure < 0 ? "−" : ""}${formatUsd(Math.abs(result.exposure))}`
              : "—"}
          </p>
          <p className="exhibit-formula">
            {result
              ? `${formatCount(result.units)} × (${formatUsd(result.billed, 2)} − ${formatUsd(result.agreed, 2)}) = ${result.exposure < 0 ? "−" : ""}${formatUsd(Math.abs(result.exposure))}`
              : "Enter numeric figures to calculate the difference."}
          </p>
        </div>
        <p className="micro exhibit-state">
          <strong>{state.title}</strong>
          {state.note}
        </p>
      </div>

      <details className="exhibit-adjust">
        <summary>
          Try other figures
          <span className="toggle" aria-hidden="true" />
        </summary>
        <form
          className="exhibit-fields"
          onSubmit={(event) => event.preventDefault()}
          aria-label="Hypothetical discrepancy calculator"
        >
          <label>
            <span className="micro">Agreed unit price</span>
            <input
              inputMode="decimal"
              autoComplete="off"
              value={agreed}
              onChange={(event) => setAgreed(event.target.value)}
            />
          </label>
          <label>
            <span className="micro">Billed unit price</span>
            <input
              inputMode="decimal"
              autoComplete="off"
              value={billed}
              onChange={(event) => setBilled(event.target.value)}
            />
          </label>
          <label>
            <span className="micro">Units</span>
            <input
              inputMode="numeric"
              autoComplete="off"
              value={units}
              onChange={(event) => setUnits(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="text-action exhibit-reset"
            aria-disabled={isExample}
            onClick={() => {
              if (isExample) return;
              setAgreed(defaults.agreed);
              setBilled(defaults.billed);
              setUnits(defaults.units);
            }}
          >
            Reset
          </button>
        </form>
      </details>
    </figure>
  );
}
