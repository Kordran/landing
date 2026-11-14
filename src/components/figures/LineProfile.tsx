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
 * One example, with the loss and the win on the same chart.
 *
 * Red is what was billed over the agreement. Green under it is the
 * opportunity the records support. After month 24, a second green grows:
 * what is not billed each month if the price is corrected. That second
 * green is future cost avoidance, not cash already recovered.
 */

const MONTHS = example.months;
const FORWARD = 12;
const SPAN = MONTHS + FORWARD;

const W = 240;
const H = 100;
const TOP = 14;

type Stage = "observed" | "opportunity" | "saved" | "year";

const phases: Array<{
  id: Stage;
  at: number;
  tone: "over" | "back";
  label: string;
  detail: string;
}> = [
  {
    id: "observed",
    at: 11,
    tone: "over",
    label: "Observed",
    detail: `${formatUsd(monthlyDifference * 12)} found`,
  },
  {
    id: "opportunity",
    at: MONTHS - 1,
    tone: "back",
    label: "Opportunity",
    detail: `${formatUsd(supportedExposure)} supported`,
  },
  {
    id: "saved",
    at: MONTHS + 5,
    tone: "back",
    label: "Saved",
    detail: `${formatUsd(monthlyDifference * 6)} not billed`,
  },
  {
    id: "year",
    at: SPAN - 1,
    tone: "back",
    label: "A year later",
    detail: `${formatUsd(annualPrevented)} if corrected`,
  },
];

function x(boundary: number): number {
  return (boundary / SPAN) * W;
}

function y(value: number): number {
  return TOP + (H - TOP) * (1 - value / potentialDiscrepancy);
}

function observedAt(boundary: number): number {
  return monthlyDifference * Math.min(boundary, MONTHS);
}

function opportunityAt(boundary: number): number {
  return Math.round((supportedExposure * Math.min(boundary, MONTHS)) / MONTHS);
}

function savedAt(boundary: number): number {
  return monthlyDifference * Math.max(0, Math.min(boundary, SPAN) - MONTHS);
}

function stageFor(at: number): Stage {
  if (at < MONTHS - 1) return "observed";
  if (at === MONTHS - 1) return "opportunity";
  if (at < SPAN - 1) return "saved";
  return "year";
}

function story(at: number): string {
  const boundary = at + 1;
  const observed = observedAt(boundary);
  const opportunity = opportunityAt(boundary);
  const saved = savedAt(boundary);
  if (boundary <= MONTHS) {
    return `Month ${boundary}. ${formatUsd(observed)} observed. ${formatUsd(opportunity)} of it is an opportunity the records can support.`;
  }
  const after = boundary - MONTHS;
  if (after >= FORWARD) {
    return `A year after a corrected price, ${formatUsd(annualPrevented)} is not billed. That is future cost avoidance, not cash already recovered.`;
  }
  return `Month ${after} after a corrected price. ${formatUsd(saved)} is not billed so far. A full year is ${formatUsd(annualPrevented)}, if buying continues. That is future cost avoidance, not cash already recovered.`;
}

function points(pairs: Array<[number, number]>): string {
  return pairs.map(([px, py]) => `${px},${py}`).join(" ");
}

function area(samples: Array<[number, number]>): string {
  const last = samples[samples.length - 1];
  const first = samples[0];
  return points([...samples, [last[0], y(0)], [first[0], y(0)]]);
}

export default function LineProfile() {
  const [at, setAt] = useState(SPAN - 1);
  const boundary = at + 1;
  const observed = observedAt(boundary);
  const opportunity = opportunityAt(boundary);
  const saved = savedAt(boundary);
  const excluded = boundary <= MONTHS ? observed - opportunity : excludedExposure;
  const stage = stageFor(at);
  const text = story(at);
  const seen = Math.min(boundary, MONTHS);

  const observedLine: Array<[number, number]> = [];
  const opportunityLine: Array<[number, number]> = [];
  for (let b = 0; b <= seen; b++) {
    observedLine.push([x(b), y(observedAt(b))]);
    opportunityLine.push([x(b), y(opportunityAt(b))]);
  }

  const savedLine: Array<[number, number]> = [];
  if (boundary > MONTHS) {
    for (let b = MONTHS; b <= boundary; b++) savedLine.push([x(b), y(savedAt(b))]);
  }

  const ticks = [potentialDiscrepancy, supportedExposure, annualPrevented, 0];

  function moveTo(index: number) {
    setAt(Math.max(0, Math.min(SPAN - 1, index)));
  }

  function onPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    moveTo(Math.floor(ratio * SPAN));
  }

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      moveTo(at + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      moveTo(at - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveTo(SPAN - 1);
    }
  }

  const winBoundary = boundary > MONTHS ? boundary : seen;
  const winValue = boundary > MONTHS ? saved : opportunity;

  return (
    <figure className="ledger">
      <figcaption className="profile-head micro">
        <span>Same example · {formatUsd(monthlyDifference)} a month</span>
        <span>Red is the finding · green is the win</span>
      </figcaption>

      <p className="ledger-story">{text}</p>

      <div className="ledger-figures">
        <p className="is-over">
          <span className="micro">Observed</span>
          <strong className="num">{formatUsd(observed)}</strong>
        </p>
        <p className="is-back">
          <span className="micro">Opportunity</span>
          <strong className="num">{formatUsd(opportunity)}</strong>
        </p>
        <p className="is-back" data-on={saved > 0 ? "true" : "false"}>
          <span className="micro">Saved, if corrected</span>
          <strong className="num">{formatUsd(saved)}</strong>
        </p>
        <p className="is-muted">
          <span className="micro">Excluded</span>
          <strong className="num">{formatUsd(excluded)}</strong>
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
            aria-valuemax={SPAN}
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
              <polygon className="ledger-rise" points={area(observedLine)} />
              <polygon className="ledger-opportunity" points={area(opportunityLine)} />
              {savedLine.length > 1 && (
                <polygon className="ledger-saved" points={area(savedLine)} />
              )}
              <polyline className="ledger-climb" points={points(observedLine)} />
              <polyline className="ledger-win" points={points(opportunityLine)} />
              {savedLine.length > 1 && (
                <polyline className="ledger-saved-line" points={points(savedLine)} />
              )}
              <line
                className="ledger-mark"
                x1={x(MONTHS)}
                x2={x(MONTHS)}
                y1="0"
                y2={H}
              />
              <line
                className="ledger-cursor"
                x1={x(boundary)}
                x2={x(boundary)}
                y1="0"
                y2={H}
              />
            </svg>
            {boundary <= MONTHS && (
              <span
                className="ledger-dot is-over"
                style={
                  {
                    left: `${(seen / SPAN) * 100}%`,
                    top: `${(y(observed) / H) * 100}%`,
                  } as CSSProperties
                }
              />
            )}
            <span
              className="ledger-dot is-back"
              style={
                {
                  left: `${(winBoundary / SPAN) * 100}%`,
                  top: `${(y(winValue) / H) * 100}%`,
                } as CSSProperties
              }
            />
          </div>
          <div className="ledger-axis micro" aria-hidden="true">
            <span>Month 1</span>
            <span className="is-review">Review</span>
            <span>+1 year</span>
          </div>
        </div>
      </div>

      <ul className="ledger-legend micro">
        <li>
          <i className="is-rise" />
          Observed
        </li>
        <li>
          <i className="is-opportunity" />
          Opportunity
        </li>
        <li>
          <i className="is-saved" />
          Saved, if corrected
        </li>
      </ul>

      <p className="ledger-note">
        Illustration of one part. Opportunity is what the records support, not
        an accepted credit. Saved is what is not billed after a corrected
        price. It is not cash already recovered.
      </p>

      <div className="ledger-phases">
        {phases.map((item) => (
          <button
            key={item.id}
            type="button"
            data-tone={item.tone}
            aria-pressed={stage === item.id}
            onClick={() => moveTo(item.at)}
          >
            <span className="micro">{item.label}</span>
            <span>{item.detail}</span>
          </button>
        ))}
      </div>
    </figure>
  );
}
