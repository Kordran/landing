import type { Metadata } from "next";
import Header from "@/components/Header";
import CloseScene from "@/components/CloseScene";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import TrackLink from "@/components/TrackLink";
import { getApproachJsonLd } from "@/lib/jsonld";
import {
  caseLabel,
  example,
  excludedExposure,
  excludedUnits,
  formatCount,
  formatUsd,
  potentialDiscrepancy,
  qualifiedUnits,
  supportedExposure,
  unitDelta,
} from "@/lib/example";
export const metadata: Metadata = {
  title: "Approach",
  description:
    "How a Kordran engagement investigates supplier pricing, validates exposure, and supports an authorized commercial resolution.",
  alternates: {
    canonical: "/approach",
  },
  openGraph: {
    title: "Approach",
    description:
      "How a Kordran engagement investigates supplier pricing, validates exposure, and supports an authorized commercial resolution.",
    url: "/approach",
    type: "website",
  },
};

const path = [
  { index: "01", title: "Scope", body: "Define the supplier and the issue." },
  { index: "02", title: "Reconcile", body: "Compare the relevant records." },
  { index: "03", title: "Resolve", body: "Support an authorized correction." },
  { index: "04", title: "Verify", body: "Confirm what actually changed." },
];

const suitable = [
  "A supplier's billed price does not appear to match agreed terms.",
  "A price increase is difficult to reconcile with the commercial agreement.",
  "A contractual surcharge may have been applied incorrectly.",
  "Pricing terms changed, but the purchasing system may not reflect the revision.",
  "A financially material supplier dispute lacks a clear evidence trail.",
];

const unsuitable = [
  "General procurement outsourcing.",
  "Full enterprise supply-chain transformation.",
  "Broad strategic sourcing without a specific economic problem.",
  "Formal legal or customs advice.",
  "Requests for guaranteed recovery results.",
];

const sources = [
  "Supplier quotations",
  "Pricing agreements",
  "Contract amendments",
  "Purchase orders",
  "Supplier invoices",
  "Approved price changes",
  "Purchasing history",
  "Relevant internal correspondence",
];

const workflow = [
  {
    index: "01",
    title: "Scope",
    body: "Identify the supplier, the commercial issue, the affected transactions, and the evidence required.",
  },
  {
    index: "02",
    title: "Reconcile",
    body: "Compare the relevant records and quantify the discrepancies they show.",
  },
  {
    index: "03",
    title: "Validate",
    body: "Test the difference against terms, dates, amendments, exceptions, and supporting information.",
  },
  {
    index: "04",
    title: "Resolve",
    body: "Prepare an evidence-backed course of action and support authorized supplier discussions where appropriate.",
  },
  {
    index: "05",
    title: "Verify",
    body: "Confirm accepted corrections, credits applied, or other measurable outcomes.",
  },
  {
    index: "06",
    title: "Prevent",
    body: "Recommend practical controls that reduce the chance of the same issue recurring.",
  },
];

const outputs = [
  {
    title: "Findings register",
    body: "Identified discrepancies, supporting references, and validation status.",
  },
  {
    title: "Financial exposure analysis",
    body: "Calculations showing the potential financial impact of applicable differences.",
  },
  {
    title: "Recommended commercial actions",
    body: "A prioritized explanation of what should happen next.",
  },
  {
    title: "Resolution support",
    body: "Assistance coordinating approved discussions and corrective steps.",
  },
  {
    title: "Outcome verification",
    body: "Documentation of confirmed credits, price corrections, or realized cost changes.",
  },
  {
    title: "Prevention recommendations",
    body: "Controls or process changes addressing relevant root causes.",
  },
];

const states = [
  {
    index: "01",
    title: "Observed discrepancy",
    body: "A documented difference between relevant records.",
  },
  {
    index: "02",
    title: "Potential exposure",
    body: "The estimated financial value associated with that difference.",
  },
  {
    index: "03",
    title: "Validated claim",
    body: "An amount supported by the applicable evidence and ready for resolution.",
  },
  {
    index: "04",
    title: "Realized outcome",
    body: "A credit received, corrected invoice, applied adjustment, or actual cost reduction.",
  },
];

const sheets = [
  { name: "Quotation", detail: "Offered price" },
  { name: "Agreement", detail: "Dates and terms" },
  { name: "Purchase order", detail: "Instruction" },
  { name: "Invoice", detail: formatUsd(example.billedUnit, 2), off: true },
];

export default function ApproachPage() {
  return (
    <>
      <JsonLd data={getApproachJsonLd()} />
      <Header initialTone="on-light" />
      <main id="content" className="site-main">
        <section
          className="section hero-editorial approach-intro"
          data-header="on-light"
          aria-labelledby="approach-heading"
        >
          <div className="container">
            <p className="kicker">Approach</p>
            <h1 id="approach-heading" className="display">
              From supplier records to commercial resolution.
            </h1>
            <p className="lede">
              A focused process for investigating pricing discrepancies,
              validating financial exposure, and supporting corrective action.
            </p>
            <p className="approach-lead">
              An engagement begins with a defined problem and proceeds through
              evidence review, validation, resolution planning, and approved
              implementation.
            </p>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "approach-hero", target: "contact" }}
              >
                Discuss a specific issue
              </TrackLink>
            </div>
            <ol className="rail">
              {path.map((step) => (
                <li key={step.index}>
                  <p className="stage-index">{step.index}</p>
                  <p className="stage-title">{step.title}</p>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="fit"
          className="section chapter"
          data-header="on-light"
          aria-labelledby="fit-heading"
        >
          <div className="container">
            <Reveal>
              <p className="kicker">Fit</p>
              <h2 id="fit-heading" className="heading">
                Start with a defined problem.
              </h2>
              <p className="lede">
                Kordran is deliberately specialized. A defined issue keeps the
                investigation focused and commercially useful.
              </p>
            </Reveal>
            <div className="fit-grid">
              <Reveal>
                <h3 className="stage-title">Suitable issues</h3>
                <ul className="plain-list">
                  {suitable.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={80}>
                <h3 className="stage-title">Not an initial fit</h3>
                <ul className="plain-list">
                  {unsuitable.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section
          id="evidence"
          className="section band"
          data-header="on-light"
          aria-labelledby="evidence-heading"
        >
          <div className="container evidence-grid">
            <Reveal>
              <p className="kicker">Evidence</p>
              <h2 id="evidence-heading" className="heading">
                Follow the pricing evidence.
              </h2>
              <p className="lede">
                A supplier pricing issue often spans several records. We
                reconcile the relevant sources to establish the applicable
                terms and financial differences.
              </p>
              <ul className="source-list">
                {sources.map((source) => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
              <p className="approach-lead">
                A quotation may establish an offered price. An agreement may
                define dates and escalation. A purchase order records an
                instruction. An invoice documents an amount billed. Those
                sources do not always agree.
              </p>
              <p className="approach-lead">
                An initial review does not require a full system integration.
                The records depend on the issue.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="doc-stack" aria-hidden="true">
                <p className="doc-stack-label">Illustrative records</p>
                {sheets.map((sheet) => (
                  <div
                    className={`doc-sheet${sheet.off ? " is-off" : ""}`}
                    key={sheet.name}
                  >
                    <span>{sheet.name}</span>
                    <span className="num">{sheet.detail}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="workflow"
          className="section chapter"
          data-header="on-light"
          aria-labelledby="workflow-heading"
        >
          <div className="container workflow-wrap">
            <Reveal>
              <p className="kicker">Workflow</p>
              <h2 id="workflow-heading" className="heading">
                A defined path to resolution.
              </h2>
              <p className="lede">
                Not every engagement includes negotiation, a credit, or a
                control change. The work follows the findings and the agreed
                scope.
              </p>
            </Reveal>
            <ol className="sequence">
              {workflow.map((step) => (
                <li key={step.index}>
                  <p className="stage-index">{step.index}</p>
                  <div>
                    <h3 className="stage-title">{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="section chapter"
          data-header="on-light"
          aria-labelledby="outputs-heading"
        >
          <div className="container">
            <Reveal>
              <p className="kicker">What you receive</p>
              <h2 id="outputs-heading" className="heading">
                Evidence you can act on.
              </h2>
              <p className="lede">
                Depending on the engagement, Kordran may produce the following.
                Scope and deliverables are set in the engagement agreement.
              </p>
            </Reveal>
            <dl className="register">
              {outputs.map((item) => (
                <div key={item.title}>
                  <dt>{item.title}</dt>
                  <dd>{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="results"
          className="section band"
          data-header="on-light"
          aria-labelledby="results-heading"
        >
          <div className="container">
            <Reveal>
              <p className="kicker">Results</p>
              <h2 id="results-heading" className="heading">
                A finding is not a recovery.
              </h2>
              <p className="lede">
                These states stay separate. A negotiated discount is not a cash
                recovery, and an unaccepted claim is not realized value.
              </p>
            </Reveal>
            <ol className="states">
              {states.map((state) => (
                <li key={state.index}>
                  <p className="stage-index">{state.index}</p>
                  <h3 className="stage-title">{state.title}</h3>
                  <p>{state.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="case"
          className="section chapter"
          data-header="on-light"
          aria-labelledby="case-heading"
        >
          <div className="container">
            <Reveal>
              <p className="kicker">Illustrative case</p>
              <h2 id="case-heading" className="heading">
                A discrepancy in practice.
              </h2>
              <p className="case-label">{caseLabel}</p>
            </Reveal>
            <article className="sheet record case-record">
              <p className="record-mast">
                <span>
                  <span className="mark" aria-hidden="true" />
                  Same example, after validation
                </span>
              </p>
              <div className="summary">
                <div>
                  <p className="summary-label">Agreed unit price</p>
                  <p className="num">{formatUsd(example.agreedUnit, 2)}</p>
                </div>
                <div>
                  <p className="summary-label">Billed unit price</p>
                  <p className="num">{formatUsd(example.billedUnit, 2)}</p>
                </div>
                <div>
                  <p className="summary-label">Units reviewed</p>
                  <p className="num">{formatCount(example.units)}</p>
                </div>
                <div className="summary-result">
                  <p className="summary-label">Observed difference</p>
                  <p className="num">{formatUsd(potentialDiscrepancy)}</p>
                </div>
              </div>
              <div className="summary">
                <div>
                  <p className="summary-label">Units that qualify</p>
                  <p className="num">{formatCount(qualifiedUnits)}</p>
                </div>
                <div>
                  <p className="summary-label">Units excluded</p>
                  <p className="num">{formatCount(excludedUnits)}</p>
                </div>
                <div>
                  <p className="summary-label">Excluded amount</p>
                  <p className="num">{formatUsd(excludedExposure)}</p>
                </div>
                <div className="summary-result">
                  <p className="summary-label">Potentially supported</p>
                  <p className="num">{formatUsd(supportedExposure)}</p>
                </div>
              </div>
              <p className="formula">
                {`${formatCount(qualifiedUnits)} × ${formatUsd(unitDelta, 2)} = ${formatUsd(supportedExposure)}. ${formatUsd(potentialDiscrepancy)} observed − ${formatUsd(excludedExposure)} excluded = ${formatUsd(supportedExposure)}.`}
              </p>
            </article>
            <div className="case-copy">
              <p>
                The review would test whether all {formatCount(example.units)}{" "}
                units were actually subject to the {formatUsd(example.agreedUnit, 2)}{" "}
                price. Some could fall outside the agreement or be covered by a
                valid amendment.
              </p>
              <p>
                If {formatCount(qualifiedUnits)} units qualify, the supported
                difference is {formatUsd(supportedExposure)}. The customer may
                then pursue a credit, a pricing correction, or another
                negotiated resolution. That amount is not collected cash, and
                the supplier has not been assumed to accept it.
              </p>
              <p>
                If the cause was an outdated purchasing price, the customer
                could update its controls to reduce a repeat.
              </p>
            </div>
            <p className="section-link">
              <TrackLink
                href="/#contact"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "case", target: "contact" }}
              >
                Discuss your supplier issue
              </TrackLink>
            </p>
          </div>
        </section>

        <section
          id="relationship"
          className="section band"
          data-header="on-light"
          aria-labelledby="relationship-heading"
        >
          <div className="container">
            <Reveal>
              <p className="kicker">Working relationship</p>
              <h2 id="relationship-heading" className="heading">
                We work alongside your team.
              </h2>
              <p className="lede">
                You retain supplier relationships, purchasing approvals, and
                commercial decisions. Direct supplier engagement happens only
                with your authorization. Information follows the confidentiality
                and data-handling terms of the engagement. Legal, customs, or
                other regulated work is referred to qualified professionals
                when it is required.
              </p>
            </Reveal>
            <div className="duty-grid">
              <div>
                <h3 className="stage-title">Customer</h3>
                <p>Commercial authority, approvals, and the supplier relationship.</p>
              </div>
              <div>
                <h3 className="stage-title">Kordran</h3>
                <p>Investigation, evidence, recommendations, and authorized coordination.</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section chapter close-cta"
          data-header="on-light"
          aria-labelledby="begin-heading"
        >
          <div className="container">
            <p className="kicker">Begin</p>
            <h2 id="begin-heading" className="heading">
              Bring us the problem.
            </h2>
            <p className="lede">
              A supplier, a disputed charge, or a price increase is enough to
              begin the conversation.
            </p>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "approach-close", target: "contact" }}
              >
                Discuss a supplier issue
              </TrackLink>
            </div>
          </div>
        </section>

        <CloseScene />
      </main>
    </>
  );
}
