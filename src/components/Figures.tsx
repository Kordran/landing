export function ComplianceFigure() {
  return (
    <svg className="figure" viewBox="0 0 240 88" aria-hidden="true">
      <rect className="figure-support" x="18" y="14" width="148" height="52" />
      <rect className="figure-sheet" x="40" y="26" width="148" height="52" />
      <rect className="figure-teal" x="40" y="26" width="148" height="52" />
      <line className="figure-ink" x1="54" y1="46" x2="128" y2="46" />
      <line className="figure-teal" x1="54" y1="62" x2="168" y2="62" />
      <circle className="figure-dot" cx="172" cy="62" r="3.5" />
    </svg>
  );
}

export function IncreaseFigure() {
  return (
    <svg className="figure" viewBox="0 0 240 88" aria-hidden="true">
      <line className="figure-support" x1="24" y1="64" x2="216" y2="64" />
      <line className="figure-ink" x1="36" y1="64" x2="108" y2="64" />
      <line className="figure-teal" x1="108" y1="64" x2="108" y2="28" />
      <line className="figure-teal" x1="108" y1="28" x2="204" y2="28" />
      <circle className="figure-ink-dot" cx="36" cy="64" r="3.5" />
      <circle className="figure-dot" cx="108" cy="28" r="3.5" />
      <circle className="figure-dot" cx="204" cy="28" r="3.5" />
    </svg>
  );
}

export function SurchargeFigure() {
  return (
    <svg className="figure" viewBox="0 0 240 88" aria-hidden="true">
      <line className="figure-support" x1="24" y1="58" x2="216" y2="58" />
      <line className="figure-ink" x1="48" y1="46" x2="48" y2="70" />
      <line className="figure-ink" x1="96" y1="46" x2="96" y2="70" />
      <line className="figure-ink" x1="144" y1="46" x2="144" y2="70" />
      <line className="figure-teal" x1="144" y1="58" x2="208" y2="58" />
      <circle className="figure-dot" cx="208" cy="58" r="3.5" />
    </svg>
  );
}

export function ConvergeFigure() {
  return (
    <svg className="figure figure-wide" viewBox="0 0 640 72" aria-hidden="true">
      <line className="figure-support" x1="8" y1="16" x2="280" y2="36" />
      <line className="figure-teal" x1="8" y1="56" x2="280" y2="36" />
      <line className="figure-ink" x1="280" y1="36" x2="632" y2="36" />
      <circle className="figure-ink-dot" cx="8" cy="16" r="3.5" />
      <circle className="figure-dot" cx="8" cy="56" r="3.5" />
      <circle className="figure-dot" cx="280" cy="36" r="4" />
    </svg>
  );
}
