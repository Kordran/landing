"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  annualPrevented,
  formatUsd,
  monthlyDifference,
  potentialDiscrepancy,
  supportedExposure,
} from "@/lib/example";

/**
 * One example, played as a timeline.
 * Eight quarters of the loss, then the price is corrected and four
 * quarters of the win: the money that is not billed.
 * The supported amount appears at the turn. It is not an accepted credit,
 * and the year after is future cost avoidance.
 */

const LOSS_Q = 8;
const WIN_Q = 4;
const STEPS = LOSS_Q + WIN_Q;
const QUARTER = monthlyDifference * 3;

function storyFor(step: number): string {
  const loss = QUARTER * Math.min(step, LOSS_Q);
  const kept = QUARTER * Math.max(0, step - LOSS_Q);
  if (step < LOSS_Q) {
    return `Quarter ${step}. ${formatUsd(loss)} billed over the agreement.`;
  }
  if (step === LOSS_Q) {
    return `Two years. ${formatUsd(loss)} billed over the agreement. The records support ${formatUsd(supportedExposure)}.`;
  }
  if (step < STEPS) {
    return `Quarter ${step - LOSS_Q} after the correction. ${formatUsd(kept)} is not billed.`;
  }
  return `A year after the correction, ${formatUsd(annualPrevented)} is not billed. The records support ${formatUsd(supportedExposure)}.`;
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
      timer.current = window.setTimeout(tick, current === LOSS_Q ? 780 : 280);
    };
    timer.current = window.setTimeout(tick, 280);
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
    // runFrom closes over stable setters only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrub(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const next = Math.min(STEPS, Math.max(1, Math.ceil(ratio * STEPS - 1e-6)));
    setStep(next);
  }

  const loss = QUARTER * Math.min(step, LOSS_Q);
  const kept = QUARTER * Math.max(0, step - LOSS_Q);
  const inWin = step > LOSS_Q;
  const atTurn = step === LOSS_Q;
  const story = storyFor(step);

  const aside = inWin
    ? { label: "Loss, the two years", value: `−${formatUsd(potentialDiscrepancy)}`, tone: "loss" }
    : atTurn
      ? { label: "Win, the records support", value: formatUsd(supportedExposure), tone: "win" }
      : { label: "Win, once corrected", value: `${formatUsd(monthlyDifference)} a month`, tone: "win" };

  return (
    <figure ref={rootRef} className="turn" data-phase={inWin ? "win" : "loss"}>
      <div className="turn-readout">
        <p className="turn-hero">
          <span className="micro">{inWin ? "Not billed" : "Loss"}</span>
          <strong className="num">{inWin ? `+${formatUsd(kept)}` : `−${formatUsd(loss)}`}</strong>
        </p>
        <p className={`turn-aside is-${aside.tone}`}>
          <span className="micro">{aside.label}</span>
          <strong className="num">{aside.value}</strong>
        </p>
      </div>

      <p className="turn-story" aria-live="polite">
        {story}
      </p>

      <div
        className="turn-rail"
        role="slider"
        tabIndex={0}
        aria-valuemin={1}
        aria-valuemax={STEPS}
        aria-valuenow={step}
        aria-valuetext={story}
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
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
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
        <div className="turn-cells" aria-hidden="true">
          {Array.from({ length: LOSS_Q }, (_, index) => (
            <i
              key={`loss-${index}`}
              className={[
                "turn-cell",
                index < step ? "is-loss" : "is-wait",
                index === step - 1 ? "is-now" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
          <i className="turn-notch" />
          {Array.from({ length: WIN_Q }, (_, index) => {
            const at = LOSS_Q + index;
            return (
              <i
                key={`win-${index}`}
                className={[
                  "turn-cell",
                  "is-after",
                  at < step ? "is-win" : "is-wait",
                  at === step - 1 ? "is-now" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            );
          })}
        </div>
        <div className="turn-axis micro" aria-hidden="true">
          <span>Year 1</span>
          <span>Year 2</span>
          <span>After</span>
        </div>
      </div>

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
