"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SETTLED } from "@/components/plate/model";
import Axo from "./Axo";
import { axoScene, tileField } from "./axo";

type Cap = { col: number; row: number; h: number };

/** What each kind of overbilling looks like on a short run of invoices. */
const SPECS: Record<"compliance" | "increase" | "surcharge", Cap[]> = {
  // One line billed above the agreed price.
  compliance: [
    { col: 3, row: 1, h: 0.56 },
    { col: 4, row: 1, h: 0.56 },
    { col: 5, row: 1, h: 0.56 },
  ],
  // An increase that went further than allowed, then further again.
  increase: [
    { col: 2, row: 1, h: 0.24 },
    { col: 3, row: 1, h: 0.24 },
    { col: 4, row: 1, h: 0.62 },
    { col: 5, row: 1, h: 0.62 },
  ],
  // A thin charge that keeps coming back.
  surcharge: [
    { col: 0, row: 1, h: 0.16 },
    { col: 2, row: 1, h: 0.16 },
    { col: 4, row: 1, h: 0.16 },
  ],
};

/** Seconds: flat, rising, found, settling, resolved. */
const RISE_AT = 0.5;
const RISE = 0.9;
const STAGGER = 0.14;
const SETTLE_AT = 3.6;
const SETTLE = 0.8;
const CYCLE = 6.4;

const ease = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

/**
 * A small figure that plays the work it describes: the overbilled invoices
 * stand up, are read, then come down flush. It loops while in view and
 * rests on the finding when motion is reduced.
 */
export default function FindingLoop({
  kind,
  found,
  resolved,
}: {
  kind: keyof typeof SPECS;
  /** Status while the excess is standing. */
  found: string;
  /** Status once it has come down. */
  resolved: string;
}) {
  const caps = SPECS[kind];
  const [clock, setClock] = useState(RISE_AT + RISE + 1);
  const ref = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"found" | "resolved">("found");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = false;
    let last = 0;
    let t = 0;
    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      t = (t + dt) % CYCLE;
      // Only re-render while something is moving, or the phase changes.
      const moving =
        (t > RISE_AT && t < RISE_AT + RISE + STAGGER * caps.length) ||
        (t > SETTLE_AT && t < SETTLE_AT + SETTLE);
      const phase = t >= RISE_AT + 0.2 && t < SETTLE_AT + SETTLE / 2 ? "found" : "resolved";
      if (moving || phase !== phaseRef.current) setClock(t);
      phaseRef.current = phase;
      raf = requestAnimationFrame(frame);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        last = 0;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [caps.length]);

  const frameBoxes = useMemo(
    () => tileField({ cols: 6, rows: 3, raised: caps }),
    [caps]
  );

  const scene = useMemo(() => {
    const settle = ease((clock - SETTLE_AT) / SETTLE);
    const raised = caps.map((cap, i) => {
      const rise = ease((clock - RISE_AT - i * STAGGER) / RISE);
      const up = Math.max(SETTLED, cap.h * rise);
      return { ...cap, h: up + (SETTLED - up) * settle };
    });
    return axoScene({
      boxes: tileField({ cols: 6, rows: 3, raised }),
      frame: frameBoxes,
    });
  }, [caps, clock, frameBoxes]);

  const phase =
    clock >= RISE_AT + 0.2 && clock < SETTLE_AT + SETTLE / 2
      ? "found"
      : "resolved";

  return (
    <div ref={ref} className="finding-loop" data-phase={phase}>
      <Axo scene={scene} />
      <p className="finding-state micro" aria-hidden="true">
        <i />
        {phase === "found" ? found : resolved}
      </p>
    </div>
  );
}
