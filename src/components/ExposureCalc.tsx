"use client";

import { useMemo, useState } from "react";
import { example, formatCount, formatUsd } from "@/lib/example";

function money(value: number): number {
  return Math.round(value * 100) / 100;
}

export default function ExposureCalc() {
  const [agreed, setAgreed] = useState(String(example.agreedUnit));
  const [billed, setBilled] = useState(String(example.billedUnit));
  const [units, setUnits] = useState(String(example.units));

  const result = useMemo(() => {
    const agreedValue = Number(agreed);
    const billedValue = Number(billed);
    const unitValue = Number(units);
    if (
      !Number.isFinite(agreedValue) ||
      !Number.isFinite(billedValue) ||
      !Number.isFinite(unitValue)
    ) {
      return null;
    }
    const delta = money(billedValue - agreedValue);
    const exposure = money(unitValue * delta);
    return { agreedValue, billedValue, unitValue, delta, exposure };
  }, [agreed, billed, units]);

  return (
    <form
      className="calc"
      onSubmit={(event) => event.preventDefault()}
      aria-label="Hypothetical discrepancy calculator"
    >
      <div className="calc-head">
        <p>Try other figures</p>
        <button
          type="button"
          className="text-action"
          onClick={() => {
            setAgreed(String(example.agreedUnit));
            setBilled(String(example.billedUnit));
            setUnits(String(example.units));
          }}
        >
          Reset
        </button>
      </div>
      <div className="calc-fields">
        <label>
          Agreed unit price
          <input
            inputMode="decimal"
            value={agreed}
            onChange={(event) => setAgreed(event.target.value)}
          />
        </label>
        <label>
          Billed unit price
          <input
            inputMode="decimal"
            value={billed}
            onChange={(event) => setBilled(event.target.value)}
          />
        </label>
        <label>
          Units
          <input
            inputMode="numeric"
            value={units}
            onChange={(event) => setUnits(event.target.value)}
          />
        </label>
      </div>
      <p className="formula" aria-live="polite">
        {result
          ? `${formatCount(result.unitValue)} × (${formatUsd(result.billedValue, 2)} − ${formatUsd(result.agreedValue, 2)}) = ${formatUsd(result.exposure)}`
          : "Enter numeric figures to calculate the difference."}
      </p>
      <p className="calc-note">
        The result is arithmetic. It is potential exposure, not a recovery.
      </p>
    </form>
  );
}
