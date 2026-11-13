import {
  example,
  formatCount,
  formatUsd,
  illustrativeLabel,
  potentialDiscrepancy,
} from "@/lib/example";

const sources = [
  {
    kind: "Agreement",
    ref: example.agreementRef,
    price: example.agreedUnit,
    exception: false,
  },
  {
    kind: "Invoice",
    ref: example.invoiceRef,
    price: example.billedUnit,
    exception: true,
  },
] as const;

const summary = [
  {
    label: "Agreed unit price",
    value: formatUsd(example.agreedUnit, 2),
    result: false,
  },
  {
    label: "Billed unit price",
    value: formatUsd(example.billedUnit, 2),
    result: false,
  },
  {
    label: "Units reviewed",
    value: formatCount(example.units),
    result: false,
  },
  {
    label: "Potential discrepancy",
    value: formatUsd(potentialDiscrepancy),
    result: true,
  },
] as const;

export default function ExampleRecord() {
  return (
    <article className="sheet record" aria-label={illustrativeLabel}>
      <p className="record-mast">
        <span>
          <span className="mark" aria-hidden="true" />
          {illustrativeLabel}
        </span>
      </p>

      <div className="comparison">
        {sources.map((source) => (
          <div className="comparison-col" key={source.kind}>
            <div className="doc-head">
              <p>{source.kind}</p>
              <p className="specimen-ref">Sample ref. {source.ref}</p>
            </div>
            <dl className="field-list">
              <div className="field-row">
                <dt>Item</dt>
                <dd>{example.item}</dd>
              </div>
              <div className={`field-row${source.exception ? " is-exception" : ""}`}>
                <dt>Unit price</dt>
                <dd className="num">{formatUsd(source.price, 2)}</dd>
              </div>
              <div className="field-row">
                <dt>Quantity</dt>
                <dd className="num">{formatCount(example.units)}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="summary">
        {summary.map((item) => (
          <div
            className={item.result ? "summary-result" : undefined}
            key={item.label}
          >
            <p className="summary-label">{item.label}</p>
            <p className="num">{item.value}</p>
          </div>
        ))}
      </div>

      <p className="formula">
        <span className="sr-only">Calculation. </span>
        {`${formatCount(example.units)} × (${formatUsd(example.billedUnit, 2)} − ${formatUsd(example.agreedUnit, 2)}) = ${formatUsd(potentialDiscrepancy)}`}
      </p>
    </article>
  );
}
