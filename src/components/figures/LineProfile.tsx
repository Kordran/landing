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
 * A trailing total. Each quarter adds $39,000, bright cap on the sum.
 * Recovery is one green bar, the same height and width as the peak:
 * the whole amount, in one go. Savings then continue in quarters,
 * year 3 and year 4, on bars the same width as the cost bars.
 */

const LOSS_Q = 8;
const SAVE_Q = 8;
const STEPS = LOSS_Q + 1 + SAVE_Q;
const QUARTER = monthlyDifference * 3;
const CEILING = potentialDiscrepancy;
const QUARTER_SHARE = QUARTER / CEILING;

type Phase = "loss" | "recover" | "save";

type Bar = {
  phase: Phase;
  /** Aggregate below this period's own add, as a fraction of the ceiling. */
  body: number;
  /** This period's own add. Zero on the single recovery bar. */
  signal: number;
};

const bars: Bar[] = [
  ...Array.from({ length: LOSS_Q }, (_, index) => ({
    phase: "loss" as const,
    body: (QUARTER * index) / CEILING,
    signal: QUARTER_SHARE,
  })),
  {
    phase: "recover" as const,
    body: potentialDiscrepancy / CEILING,
    signal: 0,
  },
  ...Array.from({ length: SAVE_Q }, (_, index) => ({
    phase: "save" as const,
    body: (QUARTER * index) / CEILING,
    signal: QUARTER_SHARE,
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
  const added = formatUsd(QUARTER);
  if (step <= LOSS_Q) {
    const total = QUARTER * step;
    return {
      phase: "loss",
      headline: formatUsd(total),
      label: "Running total",
      asideLabel: "This quarter",
      aside: `+${added}`,
      move: `+${added}`,
      story:
        step < LOSS_Q
          ? `Quarter ${step}. ${added} in extra cost. The total is ${formatUsd(total)}.`
          : `Two years. ${formatUsd(total)} billed over the agreement.`,
    };
  }
  if (step === LOSS_Q + 1) {
    return {
      phase: "recover",
      headline: formatUsd(potentialDiscrepancy),
      label: "Recovered",
      asideLabel: "In one go",
      aside: formatUsd(potentialDiscrepancy),
      move: formatUsd(potentialDiscrepancy),
      story: `Recovered in one go. The full ${formatUsd(potentialDiscrepancy)}.`,
    };
  }
  const saveQuarter = step - LOSS_Q - 1;
  const saved = QUARTER * saveQuarter;
  const year = saveQuarter <= 4 ? 3 : 4;
  const quarter = saveQuarter <= 4 ? saveQuarter : saveQuarter - 4;
  return {
    phase: "save",
    headline: `+${formatUsd(saved)}`,
    label: "Not billed",
    asideLabel: "This quarter",
    aside: `+${added}`,
    move: `+${added}`,
    story:
      saveQuarter === SAVE_Q
        ? `Year 4. ${formatUsd(saved)} is not billed, the same pace as the two years before, if buying continues.`
        : `Year ${year}, quarter ${quarter}. ${added} not billed. ${formatUsd(saved)} so far.`,
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
      const pause = current === LOSS_Q || current === LOSS_Q + 1;
      timer.current = window.setTimeout(tick, pause ? 900 : 240);
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
    const cols = [...(plot ?? event.currentTarget).querySelectorAll(".trail-col")];
    const x = event.clientX;
    let next = 1;
    cols.forEach((col, index) => {
      if (x >= col.getBoundingClientRect().left) next = index + 1;
    });
    setStep(Math.min(STEPS, Math.max(1, next)));
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
        aria-label="Point in the example"
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
          {[CEILING, annualPrevented, 0].map((value) => (
            <span key={value} style={{ "--at": value / CEILING } as CSSProperties}>
              {value === 0 ? "$0" : formatUsdShort(value)}
            </span>
          ))}
        </div>
        <div className="trail-plot" aria-hidden="true">
          <span className="trail-grid" style={{ "--at": potentialDiscrepancy / CEILING } as CSSProperties} />
          <span className="trail-grid" style={{ "--at": annualPrevented / CEILING } as CSSProperties} />
          {bars.slice(0, LOSS_Q).map((bar, index) => (
            <Column key={`loss-${index}`} bar={bar} on={index < step} now={index === step - 1} />
          ))}
          <i className="trail-gap" />
          <Column bar={bars[LOSS_Q]} on={LOSS_Q < step} now={LOSS_Q === step - 1} />
          <i className="trail-gap" />
          {bars.slice(LOSS_Q + 1).map((bar, index) => {
            const at = LOSS_Q + 1 + index;
            return <Column key={`save-${index}`} bar={bar} on={at < step} now={at === step - 1} />;
          })}
        </div>
        <div className="trail-axis micro" aria-hidden="true">
          <span>Year 1</span>
          <span>Year 2</span>
          <span>Year 3</span>
          <span>Year 4</span>
        </div>
      </div>

      <ul className="trail-legend micro">
        <li>
          <i className="is-loss" />
          Extra cost
        </li>
        <li>
          <i className="is-recover" />
          Recovered
        </li>
        <li>
          <i className="is-save" />
          Savings
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
          <span className="trail-block is-recover" style={{ "--h": bar.body } as CSSProperties} />
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
