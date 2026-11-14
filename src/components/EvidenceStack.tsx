"use client";

import { useState, type CSSProperties } from "react";
import Axo from "@/components/figures/Axo";
import type { AxoScene } from "@/components/figures/axo";

type EvidenceRecord = { id: string; name: string; what: string };

/**
 * The records behind a pricing question. Choosing one lifts its sheet out of
 * the stack and says what that record can establish.
 */
export default function EvidenceStack({
  scene,
  records,
}: {
  scene: AxoScene;
  records: readonly EvidenceRecord[];
}) {
  const [active, setActive] = useState(records[records.length - 1].id);

  return (
    <div className="evidence">
      <ol className="evidence-list">
        {records.map((record, index) => (
          <li key={record.id} style={{ "--i": index } as CSSProperties}>
            <button
              type="button"
              aria-pressed={active === record.id}
              onClick={() => setActive(record.id)}
              onMouseEnter={() => setActive(record.id)}
              onFocus={() => setActive(record.id)}
            >
              <span className="label-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="evidence-name">{record.name}</span>
              <span className="evidence-what">
                <span>{record.what}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="evidence-stage" aria-hidden="true">
        <Axo scene={scene} active={active} />
      </div>
    </div>
  );
}
