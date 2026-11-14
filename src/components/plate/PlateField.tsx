"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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

/**
 * Hosts the signature visual. `children` is the server-drawn plate; the WebGL
 * scene mounts over it once the page is idle and replaces it only after its
 * first frame, so the drawing never blinks and content never waits on it.
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
      </div>
      <figcaption className="plate-key" aria-hidden="true">
        <p className="plate-readout" data-on={hover ? "true" : undefined}>
          {hover ? (
            <>
              <span>
                Line {pad(hover.row)} · Invoice {pad(hover.col)}
              </span>
              <span className={hover.raised ? "is-raised" : undefined}>
                {hover.raised ? "Billed above agreement" : "Billed as agreed"}
              </span>
            </>
          ) : (
            <>
              <span>Price lines × invoices</span>
              <span>Illustration</span>
            </>
          )}
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
