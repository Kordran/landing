"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import {
  example,
  formatCount,
  formatUsd,
  formatUsdShort,
} from "@/lib/example";

/** Months still drawn after the period, to show what keeps accruing. */
const AHEAD = 12;

const controls = {
  excess: { min: 0.1, max: 10, step: 0.05 },
  units: { min: 500, max: 40_000, step: 500 },
  months: { min: 3, max: 36, step: 1 },
} as const;

const defaults: { excess: number; units: number; months: number } = {
  excess: Math.round((example.billedUnit - example.agreedUnit) * 100) / 100,
  units: example.unitsPerMonth,
  months: example.months,
};

/** A round scale step so the chart carries three or four gridlines. */
function niceStep(max: number): number {
  const raw = max / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * power >= raw) return m * power;
  }
  return 10 * power;
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(MOTION_QUERY);
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false
  );
}

/** Eases the displayed total toward its new value. */
function useTween(target: number, reduced: boolean, duration = 650): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (reduced) {
      from.current = target;
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const next = origin + (target - origin) * eased;
      from.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, duration]);
  return reduced ? target : value;
}

/**
 * The worked example as an instrument. One part number, billed above its
 * agreed price every month: the overbilling stacks up as a staircase, units
 * fall into the current month, and the figures can be changed.
 */
export default function ExposureCalculator() {
  const [excess, setExcess] = useState(defaults.excess);
  const [units, setUnits] = useState(defaults.units);
  const [months, setMonths] = useState(defaults.months);
  const [hovered, setHovered] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useReducedMotion();
  const inView = seen || reduced;
  const titleId = useId();
  const sheetRef = useRef<HTMLElement>(null);

  const isExample =
    excess === defaults.excess &&
    units === defaults.units &&
    months === defaults.months;

  const model = useMemo(() => {
    const perMonth = Math.round(excess * units * 100) / 100;
    const total = Math.round(perMonth * months * 100) / 100;
    const columns = months + AHEAD;
    const step = niceStep(perMonth * columns);
    const top = Math.ceil((perMonth * columns) / step) * step;
    return {
      perMonth,
      total,
      perYear: perMonth * 12,
      columns,
      top,
      grid: Array.from({ length: Math.round(top / step) }, (_, i) => (i + 1) * step),
    };
  }, [excess, units, months]);

  const shown = useTween(model.total, reduced);
  const billed = example.agreedUnit + excess;

  useEffect(() => {
    const node = sheetRef.current;
    if (!node || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const focus = hovered ?? months - 1;
  const focusAhead = focus >= months;
  const focusValue = model.perMonth * (focus + 1);

  return (
    <figure
      ref={sheetRef}
      className="sheet calc"
      aria-labelledby={titleId}
      data-in={inView || undefined}
    >
      <figcaption className="sheet-head" id={titleId}>
        <span>Example · {example.item}</span>
        <span>Adjust the figures</span>
      </figcaption>

      <div className="exhibit-pair">
        <div>
          <p className="micro">Agreement {isExample ? example.agreementRef : ""}</p>
          <p className="figure-num num">{formatUsd(example.agreedUnit, 2)}</p>
          <p className="exhibit-note">Agreed unit price</p>
        </div>
        <div className="is-off">
          <p className="micro">Invoice {isExample ? example.invoiceRef : ""}</p>
          <p className="figure-num num">{formatUsd(billed, 2)}</p>
          <p className="exhibit-note">Billed unit price</p>
        </div>
      </div>

      <div className="dimension">
        <span className="micro">Over agreement, per unit</span>
        <span className="dimension-line" aria-hidden="true" />
        <span className="figure-num num">+{formatUsd(excess, 2)}</span>
      </div>

      <div className="calc-plot">
        <p className="calc-readout micro" aria-hidden="true">
          <span>
            {focusAhead ? "If it continues · " : ""}Month {focus + 1}
          </span>
          <strong className={focusAhead ? "num is-over" : "num"}>
            {formatUsd(focusValue)}
          </strong>
        </p>
        <div
          className="calc-chart"
          aria-hidden="true"
          style={{ "--cols": model.columns } as CSSProperties}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const i = Math.floor(
              ((event.clientX - rect.left) / rect.width) * model.columns
            );
            setHovered(Math.max(0, Math.min(model.columns - 1, i)));
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {model.grid.map((value) => (
            <span
              key={value}
              className="calc-grid"
              style={{ "--at": value / model.top } as CSSProperties}
            >
              <span>{formatUsdShort(value)}</span>
            </span>
          ))}
          <div className="calc-bars">
            {Array.from({ length: model.columns }, (_, i) => {
              const ahead = i >= months;
              const classes = [
                "calc-bar",
                ahead ? "is-ahead" : "",
                i === months - 1 ? "is-now" : "",
                i === hovered ? "is-hover" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <i
                  key={i}
                  className={classes}
                  style={
                    {
                      "--v": (model.perMonth * (i + 1)) / model.top,
                      "--i": i,
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>
          <span
            className="calc-split"
            style={{ "--at": months / model.columns } as CSSProperties}
          >
            <span>Today</span>
          </span>
        </div>
        <p className="calc-axis micro" aria-hidden="true">
          <span>Month 1</span>
          <span>{months} months billed</span>
          <span>+{AHEAD} if unresolved</span>
        </p>
      </div>

      <div className="exhibit-total calc-total">
        <div aria-live="polite">
          <p className="figure-num num calc-sum">{formatUsd(Math.round(shown))}</p>
          <p className="exhibit-formula">
            {formatCount(units)} units × {months} months × {formatUsd(excess, 2)} ={" "}
            {formatUsd(model.total)}
          </p>
        </div>
        <p className="micro exhibit-state">
          <strong>Overbilled in {months} months</strong>
          <span className="is-over">
            Another {formatUsd(model.perYear)} a year until it is corrected
          </span>
        </p>
      </div>

      <form
        className="calc-controls"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Change the example"
      >
        <Slider
          label="Over agreement, per unit"
          value={excess}
          display={formatUsd(excess, 2)}
          {...controls.excess}
          onChange={setExcess}
        />
        <Slider
          label="Units a month"
          value={units}
          display={formatCount(units)}
          {...controls.units}
          onChange={setUnits}
        />
        <Slider
          label="Months unnoticed"
          value={months}
          display={String(months)}
          {...controls.months}
          onChange={setMonths}
        />
        <button
          type="button"
          className="text-action calc-reset"
          aria-disabled={isExample}
          onClick={() => {
            if (isExample) return;
            setExcess(defaults.excess);
            setUnits(defaults.units);
            setMonths(defaults.months);
          }}
        >
          Reset
        </button>
      </form>
    </figure>
  );
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="calc-slider">
      <label htmlFor={id}>
        <span className="micro">{label}</span>
        <span className="calc-value num">{display}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        style={{ "--fill": (value - min) / (max - min) } as CSSProperties}
        onChange={(event) =>
          onChange(Math.round(Number(event.target.value) * 100) / 100)
        }
      />
    </div>
  );
}
