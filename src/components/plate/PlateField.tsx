"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { formatUsd } from "@/lib/example";
import {
  BASE,
  frameFraction,
  tilePrices,
  varianceAt,
} from "./model";
import type { PlateHandle, PlateHover } from "./scene";

function canAnimate(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (connection?.saveData) return false;
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2"));
  } catch {
    return false;
  }
}

const pad = (value: number) => String(value + 1).padStart(2, "0");

/** Server position of a label: the tile's top face, as a share of the stage. */
function pinned(col: number, row: number): CSSProperties {
  const [x, y] = frameFraction(col, row, BASE + varianceAt(col, row));
  return { left: `${(x * 100).toFixed(2)}%`, top: `${(y * 100).toFixed(2)}%` };
}

/**
 * Hosts the signature visual. `children` is the server-drawn plate; the WebGL
 * scene mounts over it once the page is idle and replaces it only after its
 * first frame, so the drawing never blinks and content never waits on it.
 * Labels are pinned to tiles in both versions.
 */
export default function PlateField({
  aspect,
  children,
}: {
  aspect: number;
  children: ReactNode;
}) {
  const figureRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<PlateHover>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const figure = figureRef.current;
    if (!stage || !figure || !canAnimate()) return;

    let handle: PlateHandle | null = null;
    let cancelled = false;
    const clear = () => {
      figure.removeAttribute("data-live");
      setHover(null);
    };

    const mount = () => {
      void import("./scene")
        .then(({ mountPlate }) => {
          if (cancelled || !stageRef.current) return;
          try {
            handle = mountPlate(stageRef.current, {
              onReady: () => figure.setAttribute("data-live", "true"),
              onLost: clear,
              onHover: setHover,
              anchors: () =>
                Array.from(
                  stage.querySelectorAll<HTMLElement>("[data-pin]")
                ),
            });
          } catch {
            clear();
          }
        })
        .catch(clear);
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(mount, { timeout: 1500 })
      : window.setTimeout(mount, 300);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      if (!motion.matches) return;
      handle?.destroy();
      handle = null;
      clear();
    };
    motion.addEventListener("change", onMotion);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      motion.removeEventListener("change", onMotion);
      handle?.destroy();
      clear();
    };
  }, []);

  const prices = hover ? tilePrices(hover.col, hover.row) : null;
  const tagSide = hover && hover.col > 20 ? "is-left" : "";

  return (
    <figure
      ref={figureRef}
      className="plate"
      aria-label="Illustration. A grid of tiles, one per invoice line. Most sit flush because the billed price matches the agreement. Several runs stand above the surface where the billed price is higher than agreed."
    >
      <div
        ref={stageRef}
        className="plate-stage"
        style={{ aspectRatio: aspect.toFixed(4) }}
      >
        {children}

        {hover && prices ? (
          <div
            className={`plate-tag ${tagSide}`.trim()}
            data-pin
            data-col={hover.col}
            data-row={hover.row}
            data-state={
              hover.resolved ? "resolved" : hover.raised ? "above" : "agreed"
            }
            style={pinned(hover.col, hover.row)}
            aria-hidden="true"
          >
            <span className="plate-tag-body">
              <span className="plate-tag-ref">
                Line {pad(hover.row)} · Invoice {pad(hover.col)}
              </span>
              {hover.resolved ? (
                <>
                  <strong>Corrected to {formatUsd(prices.agreed, 2)}</strong>
                  <span>
                    {formatUsd(prices.excess, 2)} a unit corrected
                  </span>
                </>
              ) : hover.raised ? (
                <>
                  <strong>
                    +{formatUsd(prices.excess, 2)} a unit over agreement
                  </strong>
                  <span>
                    {formatUsd(prices.billed, 2)} billed ·{" "}
                    {formatUsd(prices.agreed, 2)} agreed
                  </span>
                </>
              ) : (
                <>
                  <strong>Billed as agreed</strong>
                  <span>{formatUsd(prices.agreed, 2)} a unit</span>
                </>
              )}
            </span>
          </div>
        ) : null}
      </div>

      <figcaption className="plate-key" aria-hidden="true">
        <p className="plate-progress">
          Raised tiles are billed above the agreement. Point at one to read it.
        </p>
        <ul className="plate-legend">
          <li>
            <i className="plate-swatch" />
            Billed as agreed
          </li>
          <li>
            <i className="plate-swatch is-raised" />
            Billed above agreement
          </li>
        </ul>
      </figcaption>
    </figure>
  );
}
