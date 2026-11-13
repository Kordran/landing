"use client";

import { useEffect, useRef } from "react";
import { example, formatUsd, unitDelta } from "@/lib/example";
import { fieldDrawing } from "@/components/field/model";
import type { FieldHandle } from "@/components/field/scene";

function canAnimate(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (connection?.saveData) return false;
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function ReconciliationField() {
  const figureRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drawing = fieldDrawing();

  useEffect(() => {
    const stage = stageRef.current;
    const figure = figureRef.current;
    if (!stage || !figure || !canAnimate()) return;

    let handle: FieldHandle | null = null;
    let cancel = false;
    const clear = () => figure.removeAttribute("data-live");

    void import("@/components/field/scene")
      .then(({ mountField }) => {
        if (cancel) return;
        const node = stageRef.current;
        if (!node) return;
        try {
          handle = mountField(node, {
            onReady: () => figure.setAttribute("data-live", "true"),
            onLost: clear,
          });
        } catch {
          clear();
        }
      })
      .catch(() => {
        clear();
      });

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      if (!motion.matches) return;
      handle?.destroy();
      handle = null;
      clear();
    };
    motion.addEventListener("change", onMotion);

    return () => {
      cancel = true;
      motion.removeEventListener("change", onMotion);
      handle?.destroy();
      clear();
    };
  }, []);

  return (
    <figure
      ref={figureRef}
      className="field"
      aria-label={`Example. Agreed ${formatUsd(example.agreedUnit, 2)}, billed ${formatUsd(example.billedUnit, 2)}, difference ${formatUsd(unitDelta, 2)} per unit.`}
    >
      <div
        ref={stageRef}
        className="field-stage"
        style={{ aspectRatio: `${drawing.width} / ${drawing.height}` }}
        aria-hidden="true"
      >
        <svg
          className="field-fallback"
          viewBox={drawing.viewBox}
          preserveAspectRatio="xMidYMid meet"
        >
          {drawing.sheets.map((sheet) => (
            <polygon
              key={sheet.points}
              points={sheet.points}
              fill={sheet.fill}
              fillOpacity={sheet.opacity}
              stroke="none"
            />
          ))}
          {drawing.lines.map((line) => (
            <line
              key={`${line.x1}-${line.y1}-${line.x2}-${line.y2}-${line.stroke}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.stroke}
              strokeOpacity={line.opacity}
            />
          ))}
          {drawing.dots.map((dot) => (
            <circle
              key={`${dot.cx}-${dot.cy}-${dot.fill}`}
              cx={dot.cx}
              cy={dot.cy}
              r={0.034}
              fill={dot.fill}
            />
          ))}
        </svg>
      </div>
      <figcaption className="field-caption" aria-hidden="true">
        <span>
          Agreed
          <span className="num">{formatUsd(example.agreedUnit, 2)}</span>
        </span>
        <span>
          Billed
          <span className="num">{formatUsd(example.billedUnit, 2)}</span>
        </span>
        <span className="is-diff">
          Difference
          <span className="num">{formatUsd(unitDelta, 2)}</span>
        </span>
      </figcaption>
    </figure>
  );
}
