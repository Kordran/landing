export default function ReconcileMark() {
  return (
    <figure className="reconcile" aria-hidden="true">
      <div className="reconcile-sheet reconcile-sheet-back">
        <p className="reconcile-k">Agreed</p>
        <p className="reconcile-num">$42.00</p>
        <span className="reconcile-rule" />
      </div>
      <div className="reconcile-sheet reconcile-sheet-front">
        <p className="reconcile-k">Billed</p>
        <p className="reconcile-num reconcile-num-diff">$44.00</p>
        <span className="reconcile-rule reconcile-rule-diff" />
      </div>
      <p className="reconcile-delta">
        <span className="reconcile-join" />
        <span className="reconcile-num reconcile-num-diff">$2.00</span>
        <span className="reconcile-k">Difference</span>
      </p>
    </figure>
  );
}
