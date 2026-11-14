"use client";

import { useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import {
  annualPrevented,
  example,
  excludedExposure,
  formatUsd,
  formatUsdShort,
  monthlyDifference,
  potentialDiscrepancy,
  supportedExposure,
} from "@/lib/example";

/**
 * The same machined-housing example as the Approach page.
 *
 * Twenty-four months are observed. Part of that is excluded. The rest is a
 * supported claim we help pursue. A corrected price would change the run rate
 * later. None of those later figures is cash already recovered.
 */

const MONTHS = example.months;
const CLAIM_AT = Math.round(supportedExposure / monthlyDifference);

const W = 240;
const H = 100;
const TOP = 14;

type Stage = "observed" | "validated" | "accepted" | "realized";

const phases: Array<{
  id: Stage;
  tone: "over" | "claim" | "back";
  label: string;
  detail: string;
}> = [
  {
    id: "observed",
    tone: "over",
    label: "Observed",
    detail: `${formatUsd(potentialDiscrepancy)} identified`,
  },
  {
    id: "validated",
    tone: "claim",
    label: "Validated",
    detail: `${formatUsd(supportedExposure)} supported`,
  },
  {
    id: "accepted",
    tone: "claim",
    label: "Accepted",
    detail: "Claim we pursue",
  },
  {
    id: "realized",
    tone: "back",
    label: "Realized",
    detail: `${formatUsd(annualPrevented)} a year, if corrected`,
  },
];

function x(boundary: number): number {
  return (boundary / MONTHS) * W;
}

function y(value: number): number {
  return TOP + (H - TOP) * (1 - value / potentialDiscrepancy);
}

function through(monthIndex: number): number {
  return monthlyDifference * (monthIndex + 1);
}

function story(stage: Stage, at: number): string {
  const month = at + 1;
  if (stage === "observed") {
    return `Month ${month} of ${MONTHS}. ${formatUsd(through(at))} observed so far, at ${formatUsd(monthlyDifference)} a month. Over ${MONTHS} months, that is ${formatUsd(potentialDiscrepancy)}.`;
  }
  if (stage === "validated") {
    return `${formatUsd(potentialDiscrepancy)} observed. ${formatUsd(excludedExposure)} was bought on separate terms, so it comes out. ${formatUsd(supportedExposure)} is what the records support.`;
  }
  if (stage === "accepted") {
    return `We build the case and help pursue a supported credit or pricing correction for the ${formatUsd(supportedExposure)}. Whether it is accepted depends on the supplier and your decision.`;
  }
  return `If the price is corrected to ${formatUsd(example.agreedUnit, 2)} and buying continues, about ${formatUsd(annualPrevented)} a year is not billed. That is future cost avoidance, not cash already recovered.`;
}

function points(pairs: Array<[number, number]>): string {
  return pairs.map(([px, py]) => `${px},${py}`).join(" ");
}

export default function LineProfile() {
  const [stage, setStage] = useState<Stage>("realized");
  const [at, setAt] = useState(MONTHS - 1);
  const showSplit = stage !== "observed";
  const boundary = showSplit ? MONTHS : at + 1;
  const observed = showSplit ? potentialDiscrepancy : through(at);
  const text = story(stage, showSplit ? MONTHS - 1 : at);

  const climb: Array<[number, number]> = [];
  for (let b = 0; b <= boundary; b++) climb.push([x(b), y(monthlyDifference * b)]);

  const ahead: Array<[number, number]> = [];
  if (boundary < MONTHS) {
    for (let b = boundary; b <= MONTHS; b++) ahead.push([x(b), y(monthlyDifference * b)]);
  }

  const riseArea = points([...climb, [x(boundary), y(0)], [x(0), y(0)]]);

  const tip: Array<[number, number]> = [];
  if (showSplit) {
    for (let b = CLAIM_AT; b <= MONTHS; b++) tip.push([x(b), y(monthlyDifference * b)]);
    tip.push([x(MONTHS), y(supportedExposure)], [x(CLAIM_AT), y(supportedExposure)]);
  }

  const ticks = showSplit
    ? [potentialDiscrepancy, supportedExposure, 0]
    : [potentialDiscrepancy, 0];

  function show(next: Stage, monthIndex = MONTHS - 1) {
    setStage(next);
    setAt(monthIndex);
  }

  function onPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.max(0, Math.min(MONTHS - 1, Math.floor(ratio * MONTHS)));
    show("observed", index);
  }

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    const current = showSplit ? MONTHS - 1 : at;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      show("observed", Math.min(MONTHS - 1, current + 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      show("observed", Math.max(0, current - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      show("observed", 0);
    } else if (event.key === "End") {
      event.preventDefault();
      show("observed", MONTHS - 1);
    }
  }

  return (
    <figure className="ledger">
      <figcaption className="profile-head micro">
        <span>
          Same example · {formatUsd(monthlyDifference)} a month
        </span>
        <span>{MONTHS} months observed</span>
      </figcaption>

      <p className="ledger-story">{text}</p>

      <div className="ledger-figures">
        <p className="is-over">
          <span className="micro">Observed</span>
          <strong className="num">{formatUsd(observed)}</strong>
        </p>
        <p className="is-muted">
          <span className="micro">Excluded</span>
          <strong className="num">{formatUsd(excludedExposure)}</strong>
        </p>
        <p className="is-claim" data-on={showSplit ? "true" : "false"}>
          <span className="micro">Supported claim</span>
          <strong className="num">{formatUsd(supportedExposure)}</strong>
        </p>
        <p className="is-back" data-on={stage === "realized" ? "true" : "false"}>
          <span className="micro">A year, if corrected</span>
          <strong className="num">{formatUsd(annualPrevented)}</strong>
        </p>
      </div>

      <div className="ledger-chart">
        <div className="ledger-scale micro" aria-hidden="true">
          {ticks.map((value) => (
            <span key={value} style={{ "--at": value / potentialDiscrepancy } as CSSProperties}>
              {value === 0 ? "$0" : formatUsdShort(value)}
            </span>
          ))}
        </div>
        <div className="ledger-field">
          <div
            className="ledger-plot"
            role="slider"
            tabIndex={0}
            aria-valuemin={1}
            aria-valuemax={MONTHS}
            aria-valuenow={boundary}
            aria-valuetext={text}
            aria-label="Month in the example"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              onPointer(event);
            }}
            onPointerMove={onPointer}
            onKeyDown={onKey}
          >
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <pattern
                  id="ledger-hatch"
                  width="5"
                  height="5"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M0 5 L5 0" stroke="#f0b4ae" strokeWidth="0.7" />
                </pattern>
              </defs>
              <polygon className="ledger-rise" points={riseArea} />
              {showSplit && <polygon className="ledger-excluded" points={points(tip)} />}
              {showSplit && (
                <line
                  className="ledger-claim"
                  x1={x(CLAIM_AT)}
                  x2={x(MONTHS)}
                  y1={y(supportedExposure)}
                  y2={y(supportedExposure)}
                />
              )}
              {ahead.length > 1 && (
                <>
                  <polyline className="ledger-ahead-halo" points={points(ahead)} />
                  <polyline className="ledger-ahead" points={points(ahead)} />
                </>
              )}
              <polyline className="ledger-climb" points={points(climb)} />
              <line
                className="ledger-cursor"
                x1={x(boundary)}
                x2={x(boundary)}
                y1="0"
                y2={H}
              />
            </svg>
            <span
              className="ledger-dot is-over"
              style={
                {
                  left: `${(boundary / MONTHS) * 100}%`,
                  top: `${(y(monthlyDifference * boundary) / H) * 100}%`,
                } as CSSProperties
              }
            />
          </div>
          <div className="ledger-axis micro" aria-hidden="true">
            <span>Month 1</span>
            <span>Month {MONTHS}</span>
          </div>
        </div>
      </div>

      <ul className="ledger-legend micro">
        <li>
          <i className="is-rise" />
          Observed
        </li>
        <li>
          <i className="is-excluded" />
          Excluded
        </li>
        <li>
          <i className="is-claim" />
          Supported claim
        </li>
      </ul>

      <p className="ledger-note">
        Illustration of one part. A supported claim is not an accepted credit.
        The yearly figure is future cost avoidance, not cash already recovered.
      </p>

      <div className="ledger-phases">
        {phases.map((item) => (
          <button
            key={item.id}
            type="button"
            data-tone={item.tone}
            aria-pressed={stage === item.id}
            onClick={() => show(item.id)}
          >
            <span className="micro">{item.label}</span>
            <span>{item.detail}</span>
          </button>
        ))}
      </div>
    </figure>
  );
}
