"use client";

import { useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import {
  annualPrevented,
  example,
  formatUsd,
  formatUsdShort,
  potentialDiscrepancy,
  unitDelta,
} from "@/lib/example";

/**
 * The homepage example over 24 months.
 *
 * The overbilling climbs with the price left alone. At month 12 the credit
 * returns what was already billed over, and the corrected price stops the
 * rest. Moving across a month reads all four amounts.
 */

const MONTHS = example.months;
const CORRECTED = 12;
const perMonth = Math.round(unitDelta * example.unitsPerMonth);
const found = perMonth * CORRECTED;

const W = 240;
const H = 100;
const TOP = 14;

const phases = [
  {
    id: "verify",
    at: CORRECTED - 1,
    tone: "over",
    label: "Verify",
    detail: `${formatUsd(found)} built up`,
  },
  {
    id: "resolve",
    at: 17,
    tone: "back",
    label: "Resolve",
    detail: `${formatUsd(found)} recovered`,
  },
  {
    id: "prevent",
    at: MONTHS - 1,
    tone: "back",
    label: "Prevent",
    detail: `${formatUsd(annualPrevented)} stopped`,
  },
] as const;

function x(boundary: number): number {
  return (boundary / MONTHS) * W;
}

function y(value: number): number {
  return TOP + (H - TOP) * (1 - value / potentialDiscrepancy);
}

function aloneAt(monthIndex: number): number {
  return perMonth * (monthIndex + 1);
}

function story(at: number): string {
  const month = at + 1;
  const alone = aloneAt(at);
  if (at < CORRECTED) {
    return `Month ${month}. ${formatUsd(alone)} has been billed over the agreement, climbing by ${formatUsd(perMonth)} a month. Left alone, it reaches ${formatUsd(potentialDiscrepancy)}.`;
  }
  if (at === CORRECTED) {
    return `The credit lands. ${formatUsd(found)} comes back, and the price is corrected to ${formatUsd(example.agreedUnit, 2)}. The ${formatUsd(perMonth)} that would have been billed this month is stopped.`;
  }
  return `Month ${month}. Left alone, this would be ${formatUsd(alone)}. ${formatUsd(found)} has come back. ${formatUsd(alone - found)} was never billed.`;
}

function points(pairs: Array<[number, number]>): string {
  return pairs.map(([px, py]) => `${px},${py}`).join(" ");
}

export default function LineProfile() {
  const [at, setAt] = useState(MONTHS - 1);
  const alone = aloneAt(at);
  const increasing = Math.min(alone, found);
  const recovered = at >= CORRECTED ? found : 0;
  const stopped = at >= CORRECTED ? alone - found : 0;
  const phase = at < CORRECTED ? "verify" : at < MONTHS - 1 ? "resolve" : "prevent";
  const boundary = at + 1;
  const actual = at < CORRECTED ? alone : 0;
  const text = story(at);

  const climbEnd = Math.min(boundary, CORRECTED);
  const after = boundary > CORRECTED;

  const climb: Array<[number, number]> = [];
  for (let b = 0; b <= climbEnd; b++) climb.push([x(b), y(perMonth * b)]);
  const ahead: Array<[number, number]> = [];
  for (let b = after ? CORRECTED : boundary; b <= MONTHS; b++) {
    ahead.push([x(b), y(perMonth * b)]);
  }

  const riseArea = points([...climb, [x(climbEnd), y(0)], [x(0), y(0)]]);
  const recoveredArea = after
    ? points([
        [x(CORRECTED), y(found)],
        [x(boundary), y(found)],
        [x(boundary), y(0)],
        [x(CORRECTED), y(0)],
      ])
    : null;
  const stoppedPairs: Array<[number, number]> = [];
  if (after) {
    for (let b = CORRECTED; b <= boundary; b++) {
      stoppedPairs.push([x(b), y(perMonth * b)]);
    }
    stoppedPairs.push([x(boundary), y(found)], [x(CORRECTED), y(found)]);
  }
  const stoppedArea = after ? points(stoppedPairs) : null;

  const ticks = [potentialDiscrepancy, found, 0];

  function moveTo(index: number) {
    setAt(Math.max(0, Math.min(MONTHS - 1, index)));
  }

  function onPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    moveTo(Math.floor(ratio * MONTHS));
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
      moveTo(MONTHS - 1);
    }
  }

  return (
    <figure className="ledger">
      <figcaption className="profile-head micro">
        <span>
          Same example · {formatUsd(perMonth)} a month
        </span>
        <span>Credit at month {CORRECTED}</span>
      </figcaption>

      <p className="ledger-story">{text}</p>

      <div className="ledger-figures">
        <p className="is-over">
          <span className="micro">{at < CORRECTED ? "Increasing" : "Increased"}</span>
          <strong className="num">{formatUsd(increasing)}</strong>
        </p>
        <p className="is-over">
          <span className="micro">Would have been</span>
          <strong className="num">{formatUsd(alone)}</strong>
        </p>
        <p className="is-back" data-on={recovered > 0 ? "true" : "false"}>
          <span className="micro">Recovered</span>
          <strong className="num">{formatUsd(recovered)}</strong>
        </p>
        <p className="is-back" data-on={stopped > 0 ? "true" : "false"}>
          <span className="micro">Stopped</span>
          <strong className="num">{formatUsd(stopped)}</strong>
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
              <polygon className="ledger-rise" points={riseArea} />
              {recoveredArea && <polygon className="ledger-recovered" points={recoveredArea} />}
              {stoppedArea && <polygon className="ledger-stopped" points={stoppedArea} />}
              {after && (
                <line
                  className="ledger-level"
                  x1={x(CORRECTED)}
                  x2={x(boundary)}
                  y1={y(found)}
                  y2={y(found)}
                />
              )}
              <polyline className="ledger-ahead-halo" points={points(ahead)} />
              <polyline className="ledger-ahead" points={points(ahead)} />
              <polyline className="ledger-climb" points={points(climb)} />
              {after && (
                <line
                  className="ledger-drop"
                  x1={x(CORRECTED)}
                  x2={x(CORRECTED)}
                  y1={y(found)}
                  y2={y(0)}
                />
              )}
              {after && (
                <line
                  className="ledger-flat"
                  x1={x(CORRECTED)}
                  x2={x(boundary)}
                  y1={y(0)}
                  y2={y(0)}
                />
              )}
              <line
                className="ledger-cursor"
                x1={x(boundary)}
                x2={x(boundary)}
                y1="0"
                y2={H}
              />
            </svg>
            <span
              className={at < CORRECTED ? "ledger-dot is-over" : "ledger-dot is-back"}
              style={
                {
                  left: `${(boundary / MONTHS) * 100}%`,
                  top: `${(y(actual) / H) * 100}%`,
                } as CSSProperties
              }
            />
          </div>
          <div className="ledger-axis micro" aria-hidden="true">
            <span>Month 1</span>
            <span>Credit</span>
            <span>Month 24</span>
          </div>
        </div>
      </div>

      <ul className="ledger-legend micro">
        <li>
          <i className="is-rise" />
          Increasing
        </li>
        <li>
          <i className="is-ahead" />
          Would have been
        </li>
        <li>
          <i className="is-recovered" />
          Recovered
        </li>
        <li>
          <i className="is-stopped" />
          Stopped
        </li>
      </ul>

      <div className="ledger-phases">
        {phases.map((item) => (
          <button
            key={item.id}
            type="button"
            data-tone={item.tone}
            aria-pressed={phase === item.id}
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
