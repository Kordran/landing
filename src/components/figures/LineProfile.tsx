"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  annualPrevented,
  formatUsd,
  formatUsdShort,
  monthlyDifference,
  potentialDiscrepancy,
} from "@/lib/example";

/**
 * A trailing total. Each quarter adds $39,000, and the bright cap on the
 * bar is that quarter's marginal amount. The total climbs for two years,
 * green recovery brings the whole amount back down, then yellow savings
 * climb the same way: cost that is not billed.
 */

const LOSS_Q = 8;
const RECOVER_Q = 8;
const SAVE_Q = 4;
const STEPS = LOSS_Q + RECOVER_Q + SAVE_Q;
const QUARTER = monthlyDifference * 3;
const MAX = potentialDiscrepancy;
const MARGIN = QUARTER / MAX;

type Phase = "loss" | "recover" | "save";

type Bar = {
  phase: Phase;
  /** Height of the solid aggregate, as a fraction of the two-year total. */
  body: number;
  /** The quarter's own move, drawn as the bright signal. */
  signal: number;
};

const bars: Bar[] = [
  ...Array.from({ length: LOSS_Q }, (_, index) => ({
    phase: "loss" as const,
    body: (QUARTER * index) / MAX,
    signal: MARGIN,
  })),
  ...Array.from({ length: RECOVER_Q }, (_, index) => ({
    phase: "recover" as const,
    body: (QUARTER * (LOSS_Q - index - 1)) / MAX,
    signal: MARGIN,
  })),
  ...Array.from({ length: SAVE_Q }, (_, index) => ({
    phase: "save" as const,
    body: (QUARTER * index) / MAX,
    signal: MARGIN,
  })),
];

function describe(step: number): {
  phase: Phase;
  headline: string;
  label: string;
  asideLabel: string;
  aside: string;
  move: string;
  story: string;
} {
  const move = formatUsd(QUARTER);
  if (step <= LOSS_Q) {
    const total = QUARTER * step;
    return {
      phase: "loss",
      headline: formatUsd(total),
      label: "Running total",
      asideLabel: "This quarter",
      aside: `+${move}`,
      move: `+${move}`,
      story:
        step < LOSS_Q
          ? `Quarter ${step}. ${move} added. The total is ${formatUsd(total)}.`
          : `Two years. ${formatUsd(total)} billed over the agreement.`,
    };
  }
  if (step <= LOSS_Q + RECOVER_Q) {
    const recoveredQuarters = step - LOSS_Q;
    const recovered = QUARTER * recoveredQuarters;
    const remaining = MAX - recovered;
    const done = remaining === 0;
    return {
      phase: "recover",
      headline: formatUsd(recovered),
      label: done ? "Recovered in full" : "Recovered",
      asideLabel: "Still open",
      aside: formatUsd(remaining),
      move: `−${move}`,
      story: done
        ? `Recovered. The full ${formatUsd(MAX)} is back.`
        : `${move} recovered this quarter. ${formatUsd(remaining)} still open.`,
    };
  }
  const savedQuarters = step - LOSS_Q - RECOVER_Q;
  const saved = QUARTER * savedQuarters;
  return {
    phase: "save",
    headline: `+${formatUsd(saved)}`,
    label: "Not billed",
    asideLabel: "Recovered",
    aside: formatUsd(MAX),
    move: `+${move}`,
    story:
      saved === annualPrevented
        ? `A year on, ${formatUsd(annualPrevented)} is not billed. The savings keep adding, a quarter at a time.`
        : `Quarter ${savedQuarters} after recovery. ${move} not billed. ${formatUsd(saved)} so far.`,
  };
}

export default function LineProfile() {
  const [step, setStep] = useState(STEPS);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const touched = useRef(false);
  const timer = useRef(0);

  function stop() {
    window.clearTimeout(timer.current);
    timer.current = 0;
  }

  function runFrom(start: number) {
    stop();
    setPlaying(true);
    setStep(start);
    let current = start;
    const tick = () => {
      if (current >= STEPS) {
        setPlaying(false);
        return;
      }
      current += 1;
      setStep(current);
      const pause = current === LOSS_Q || current === LOSS_Q + RECOVER_Q;
      timer.current = window.setTimeout(tick, pause ? 820 : 240);
    };
    timer.current = window.setTimeout(tick, 240);
  }

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started || touched.current) return;
        started = true;
        observer.disconnect();
        runFrom(1);
      },
      { threshold: 0.55 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      stop();
    };
    // The player only uses refs and state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrub(event: ReactPointerEvent<HTMLDivElement>) {
    const plot = event.currentTarget.querySelector(".trail-plot");
    const rect = (plot ?? event.currentTarget).getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const next = Math.min(STEPS, Math.max(1, Math.ceil(ratio * STEPS - 1e-6)));
    setStep(next);
  }

  const view = describe(step);

  return (
    <figure ref={rootRef} className="turn" data-phase={view.phase}>
      <div className="turn-readout">
        <p className="turn-hero">
          <span className="micro">{view.label}</span>
          <strong className="num">{view.headline}</strong>
        </p>
        <p className={`turn-aside is-${view.phase === "loss" ? "loss" : view.phase === "recover" ? "recover" : "save"}`}>
          <span className="micro">{view.asideLabel}</span>
          <strong className="num">{view.aside}</strong>
        </p>
      </div>

      <p className="turn-story" aria-live="polite">
        {view.story}
      </p>

      <div
        className="trail"
        role="slider"
        tabIndex={0}
        aria-valuemin={1}
        aria-valuemax={STEPS}
        aria-valuenow={step}
        aria-valuetext={view.story}
        aria-label="Quarter in the example"
        onPointerDown={(event) => {
          touched.current = true;
          stop();
          setPlaying(false);
          event.currentTarget.setPointerCapture(event.pointerId);
          scrub(event);
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
          scrub(event);
        }}
        onKeyDown={(event) => {
          if (
            event.key !== "ArrowRight" &&
            event.key !== "ArrowLeft" &&
            event.key !== "Home" &&
            event.key !== "End"
          ) {
            return;
          }
          event.preventDefault();
          touched.current = true;
          stop();
          setPlaying(false);
          if (event.key === "Home") setStep(1);
          else if (event.key === "End") setStep(STEPS);
          else if (event.key === "ArrowRight") setStep((value) => Math.min(STEPS, value + 1));
          else setStep((value) => Math.max(1, value - 1));
        }}
      >
        <div className="trail-scale micro" aria-hidden="true">
          <span>{formatUsdShort(MAX)}</span>
          <span>{formatUsdShort(annualPrevented)}</span>
          <span>$0</span>
        </div>
        <div className="trail-plot" aria-hidden="true">
          <span className="trail-grid" />
          {bars.slice(0, LOSS_Q).map((bar, index) => (
            <Column key={`loss-${index}`} bar={bar} on={index < step} now={index === step - 1} />
          ))}
          <i className="trail-gap" />
          {bars.slice(LOSS_Q, LOSS_Q + RECOVER_Q).map((bar, index) => {
            const at = LOSS_Q + index;
            return <Column key={`recover-${index}`} bar={bar} on={at < step} now={at === step - 1} />;
          })}
          <i className="trail-gap" />
          {bars.slice(LOSS_Q + RECOVER_Q).map((bar, index) => {
            const at = LOSS_Q + RECOVER_Q + index;
            return <Column key={`save-${index}`} bar={bar} on={at < step} now={at === step - 1} />;
          })}
        </div>
        <div className="trail-axis micro" aria-hidden="true">
          <span>Year 1</span>
          <span>Year 2</span>
          <span>Recovery</span>
          <span>Saved</span>
        </div>
      </div>

      <ul className="trail-legend micro">
        <li>
          <i className="is-loss" />
          Added
        </li>
        <li>
          <i className="is-recover" />
          Recovered
        </li>
        <li>
          <i className="is-save" />
          Saved
        </li>
      </ul>

      <button
        type="button"
        className="text-action turn-play"
        onClick={() => {
          touched.current = true;
          runFrom(1);
        }}
      >
        {playing ? "Playing" : "Play it through"}
      </button>
    </figure>
  );
}

function Column({ bar, on, now }: { bar: Bar; on: boolean; now: boolean }) {
  const style = { "--body": bar.body, "--m": bar.signal } as CSSProperties;
  return (
    <div className={["trail-col", on ? "is-on" : "", now ? "is-now" : ""].filter(Boolean).join(" ")}>
      {on ? (
        bar.phase === "recover" ? (
          <>
            <span className="trail-ghost is-recover" style={style} />
            {bar.body > 0 ? <span className="trail-body is-recover" style={style} /> : null}
          </>
        ) : (
          <>
            <span className={`trail-cap is-${bar.phase}`} style={style} />
            {bar.body > 0 ? <span className={`trail-body is-${bar.phase}`} style={style} /> : null}
          </>
        )
      ) : (
        <span className={`trail-wait is-${bar.phase}`} />
      )}
    </div>
  );
}
