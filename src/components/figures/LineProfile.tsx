import type { CSSProperties } from "react";

/**
 * One price line seen from the side, invoice by invoice: the plate in
 * elevation. Caps stand above the agreed level, come down as the correction
 * is carried through, and stay down. The three thirds sit over the three
 * steps they illustrate.
 */

const PER_STEP = 12;
const LEAD = 3;

const heights: number[] = [
  ...Array.from({ length: PER_STEP }, (_, i) => (i < LEAD ? 0 : 1)),
  ...Array.from({ length: PER_STEP }, (_, i) => 1 - (i + 1) / (PER_STEP + 1)),
  ...Array.from({ length: PER_STEP }, () => 0),
];

const states = ["Billed above agreement", "Corrected", "Billed as agreed"];

export default function LineProfile() {
  return (
    <div className="profile" aria-hidden="true">
      <p className="profile-head micro">
        <span>One price line, invoice by invoice</span>
        <span>Illustration</span>
      </p>
      <div className="profile-row">
        {heights.map((h, i) => (
          <i
            key={i}
            className={h > 0 ? "is-raised" : undefined}
            style={{ "--h": h.toFixed(3), "--i": i } as CSSProperties}
          />
        ))}
      </div>
      <ul className="profile-key micro">
        {states.map((state) => (
          <li key={state}>{state}</li>
        ))}
      </ul>
    </div>
  );
}
