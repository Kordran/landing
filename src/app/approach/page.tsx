import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import CloseScene from "@/components/CloseScene";
import EvidenceStack from "@/components/EvidenceStack";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import TrackLink from "@/components/TrackLink";
import Axo from "@/components/figures/Axo";
import {
  evidenceRecords,
  evidenceScene,
  reconcileScene,
  recordsScene,
  resolveScene,
} from "@/components/figures/scenes";
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

const description =
  "How a Kordran engagement investigates supplier pricing, validates exposure, and supports an authorized commercial resolution.";

export const metadata: Metadata = {
  title: "Approach",
  description,
  alternates: {
    canonical: "/approach",
  },
  openGraph: {
    title: "Approach",
    description,
    url: "/approach",
    type: "website",
  },
};

const stages = [
  {
    title: "Records",
    body: "Quotations, agreements, orders, and invoices describe the same purchase. They do not always agree.",
    scene: recordsScene,
  },
  {
    title: "Reconciliation",
    body: "Set against each other, the records show where a billed price stands apart from the agreed one.",
    scene: reconcileScene,
  },
  {
    title: "Resolution",
    body: "A supported difference becomes an authorized correction, and the correction is confirmed.",
    scene: resolveScene,
  },
];

const index = [
  { href: "#fit", label: "Fit" },
  { href: "#evidence", label: "Evidence" },
  { href: "#workflow", label: "Workflow" },
  { href: "#measure", label: "Measurement" },
  { href: "#outputs", label: "Deliverables" },
  { href: "#relationship", label: "Control" },
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

const workflow = [
  {
    title: "Scope",
    body: "Identify the supplier, the commercial issue, the affected transactions, and the evidence required.",
    you: "Choose the supplier and the issue. Approve the scope.",
  },
  {
    title: "Reconcile",
    body: "Compare the relevant records and quantify the discrepancies they show.",
    you: "Provide the selected records through the agreed process.",
  },
  {
    title: "Validate",
    body: "Test the difference against terms, dates, amendments, exceptions, and supporting information.",
    you: "Confirm context and any exceptions you already know about.",
  },
  {
    title: "Resolve",
    body: "Prepare an evidence-backed course of action and support authorized supplier discussions where appropriate.",
    you: "Decide what to pursue. Authorize any contact with the supplier.",
  },
  {
    title: "Verify",
    body: "Confirm accepted corrections, credits applied, or other measurable outcomes.",
    you: "Confirm what was actually received or corrected.",
  },
  {
    title: "Prevent",
    body: "Recommend practical controls that reduce the chance of the same issue recurring.",
    you: "Decide which controls to adopt.",
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

const SQUARE = 100;
const allSquares = example.units / SQUARE;
const qualifiedSquares = qualifiedUnits / SQUARE;

const states = [
  {
    key: "observed",
    title: "Observed discrepancy",
    value: `${formatUsd(unitDelta, 2)} / unit`,
    math: `${formatUsd(example.billedUnit, 2)} billed − ${formatUsd(example.agreedUnit, 2)} agreed`,
    body: "A documented difference between relevant records.",
    tone: "is-pending",
    filled: allSquares,
  },
  {
    key: "potential",
    title: "Potential exposure",
    value: formatUsd(potentialDiscrepancy),
    math: `${formatCount(example.units)} × ${formatUsd(unitDelta, 2)}`,
    body: "The estimated financial value associated with that difference.",
    tone: undefined,
    filled: allSquares,
  },
  {
    key: "claim",
    title: "Validated claim",
    value: formatUsd(supportedExposure),
    math: `${formatCount(qualifiedUnits)} × ${formatUsd(unitDelta, 2)} · ${formatUsd(excludedExposure)} excluded`,
    body: "An amount supported by the applicable evidence and ready for resolution.",
    tone: undefined,
    filled: qualifiedSquares,
  },
  {
    key: "open",
    title: "Realized outcome",
    value: "Not assumed",
    math: "Depends on the supplier response",
    body: "A credit received, corrected invoice, applied adjustment, or actual cost reduction.",
    tone: "is-open",
    filled: allSquares,
  },
];

export default function ApproachPage() {
  return (
    <>
      <JsonLd data={getApproachJsonLd()} />
      <Header />
      <main id="content" className="site-main">
        <section
          className="section approach-hero"
          aria-labelledby="approach-heading"
        >
          <div className="container">
            <p className="label">
              <span className="mark" aria-hidden="true" />
              Approach
            </p>
            <h1 id="approach-heading" className="display-hero">
              From supplier records to commercial resolution.
            </h1>
            <p className="lede">
              A focused process for investigating pricing discrepancies,
              validating financial exposure, and supporting corrective action.
              It begins with a defined problem and ends with a confirmed result.
            </p>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "approach-hero", target: "contact" }}
              >
                Discuss a specific issue
                <span className="btn-glyph" aria-hidden="true" />
              </TrackLink>
            </div>

            <figure className="stages-figure">
              <ol>
                {stages.map((stage, i) => (
                  <li key={stage.title}>
                    <div className="stages-art">
                      <Axo scene={stage.scene} />
                    </div>
                    <div>
                      <p className="label">
                        <span className="label-index">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </p>
                      <h2 className="title">{stage.title}</h2>
                      <p className="body">{stage.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </figure>

            <nav className="page-index" aria-label="On this page">
              {index.map((item, i) => (
                <a key={item.href} href={item.href}>
                  <span aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section
          id="fit"
          className="section section-sheet"
          aria-labelledby="fit-heading"
        >
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">01</span>
                  Fit
                </p>
                <h2 id="fit-heading" className="heading">
                  Start with a defined problem.
                </h2>
              </div>
              <p className="lede">
                Kordran is deliberately specialized. A defined issue keeps the
                investigation focused and commercially useful.
              </p>
            </Reveal>
            <div className="fit-grid">
              <Reveal className="fit-col is-yes">
                <h3 className="label">Suitable issues</h3>
                <ul>
                  {suitable.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="fit-col is-not" delay={80}>
                <h3 className="label">Not an initial fit</h3>
                <ul>
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
          className="section"
          aria-labelledby="evidence-heading"
        >
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">02</span>
                  Evidence
                </p>
                <h2 id="evidence-heading" className="heading">
                  Follow the pricing evidence.
                </h2>
              </div>
              <p className="lede">
                A supplier pricing issue often spans several records. We
                reconcile the relevant sources to establish the applicable terms
                and the financial differences.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <EvidenceStack scene={evidenceScene} records={evidenceRecords} />
            </Reveal>
            <p className="body evidence-note">
              Purchasing history and relevant internal correspondence add
              context. An initial review does not require a full system
              integration. The records depend on the issue.
            </p>
          </div>
        </section>

        <section
          id="workflow"
          className="section section-sheet"
          aria-labelledby="workflow-heading"
        >
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">03</span>
                  Workflow
                </p>
                <h2 id="workflow-heading" className="heading">
                  A defined path to resolution.
                </h2>
              </div>
              <p className="lede">
                Each step has work we do and a part that stays with you.
              </p>
            </Reveal>
            <div className="workflow">
              <p className="workflow-head micro" aria-hidden="true">
                <span>Step</span>
                <span>Kordran</span>
                <span>Your part</span>
              </p>
              <ol>
                {workflow.map((step, i) => (
                  <li className="workflow-step" key={step.title}>
                    <span className="label-index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="title">{step.title}</h3>
                    <p className="body">{step.body}</p>
                    <p className="workflow-you">
                      <span className="micro">Your part</span>
                      {step.you}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <p className="body workflow-note">
              Not every engagement includes negotiation, a credit, or a control
              change. The work follows the findings and the agreed scope.
            </p>
          </div>
        </section>

        <section
          id="measure"
          className="section"
          aria-labelledby="measure-heading"
        >
          <div id="results" className="anchor" />
          <div id="case" className="anchor" />
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">04</span>
                  Measurement
                </p>
                <h2 id="measure-heading" className="heading">
                  A finding is not a recovery.
                </h2>
              </div>
              <p className="lede">
                These states stay separate. A negotiated discount is not a cash
                recovery, and an unaccepted claim is not realized value.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <figure className="sheet states-sheet">
                <figcaption className="sheet-head">
                  <span>
                    Example continued · {example.item} · one square = {SQUARE}{" "}
                    units
                  </span>
                  <span>Hypothetical figures</span>
                </figcaption>
                <ol className="states">
                  {states.map((state, n) => (
                    <li className={`state is-${state.key}`} key={state.key}>
                      <p className="label">
                        <span className="label-index">
                          {String(n + 1).padStart(2, "0")}
                        </span>
                        {state.title}
                      </p>
                      <div>
                        <p className="figure-num num">{state.value}</p>
                        <p className="state-math">{state.math}</p>
                      </div>
                      <div className="unit-grid" aria-hidden="true">
                        {Array.from({ length: allSquares }, (_, i) => (
                          <i
                            key={i}
                            className={i < state.filled ? state.tone : "is-out"}
                            style={{ "--i": i } as CSSProperties}
                          />
                        ))}
                      </div>
                      <p className="body">{state.body}</p>
                    </li>
                  ))}
                </ol>
              </figure>
            </Reveal>

            <p className="exhibit-caption">{caseLabel}</p>

            <div className="case-copy">
              <p>
                The review tests whether all {formatCount(example.units)} units
                were actually subject to the {formatUsd(example.agreedUnit, 2)}{" "}
                price. Some could fall outside the agreement or be covered by a
                valid amendment.
              </p>
              <p>
                If {formatCount(qualifiedUnits)} units qualify and{" "}
                {formatCount(excludedUnits)} do not, the supported difference is{" "}
                {formatUsd(supportedExposure)}. You may then pursue a credit, a
                pricing correction, or another negotiated resolution.
              </p>
              <p>
                That amount is not collected cash, and the supplier has not been
                assumed to accept it. If the cause was an outdated purchasing
                price, updated controls reduce the chance of a repeat.
              </p>
            </div>
          </div>
        </section>

        <section
          id="outputs"
          className="section section-sheet"
          aria-labelledby="outputs-heading"
        >
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">05</span>
                  What you receive
                </p>
                <h2 id="outputs-heading" className="heading">
                  Evidence you can act on.
                </h2>
              </div>
              <p className="lede">
                Depending on the engagement, Kordran may produce the following.
                Scope and deliverables are set in the engagement agreement.
              </p>
            </Reveal>
            <dl className="register">
              {outputs.map((item, i) => (
                <div key={item.title}>
                  <span className="label-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <dt>{item.title}</dt>
                  <dd>{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="relationship"
          className="section section-deep"
          aria-labelledby="relationship-heading"
        >
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">06</span>
                  Working relationship
                </p>
                <h2 id="relationship-heading" className="display">
                  We work alongside your team.
                </h2>
              </div>
              <p className="lede">
                You retain supplier relationships, purchasing approvals, and
                commercial decisions. Direct supplier engagement happens only
                with your authorization.
              </p>
            </Reveal>
            <div className="control-grid">
              <Reveal className="control-col is-you">
                <h3 className="label">Stays with you</h3>
                <ul>
                  <li>The supplier relationship</li>
                  <li>Purchasing approvals</li>
                  <li>Every commercial decision</li>
                </ul>
              </Reveal>
              <Reveal className="control-col is-kordran" delay={80}>
                <h3 className="label">Kordran provides</h3>
                <ul>
                  <li>Investigation and evidence</li>
                  <li>Recommendations</li>
                  <li>Authorized coordination</li>
                </ul>
              </Reveal>
            </div>
            <p className="control-note">
              Information follows the confidentiality and data-handling terms of
              the engagement. Legal, customs, or other regulated work is
              referred to qualified professionals when it is required.
            </p>
          </div>
        </section>

        <section
          className="section section-sheet"
          aria-labelledby="begin-heading"
        >
          <div className="container begin">
            <div>
              <p className="label">
                <span className="mark" aria-hidden="true" />
                Begin
              </p>
              <h2 id="begin-heading" className="heading">
                Bring us the problem.
              </h2>
              <p className="lede">
                A supplier, a disputed charge, or a price increase is enough to
                begin the conversation.
              </p>
            </div>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "approach-close", target: "contact" }}
              >
                Discuss a supplier issue
                <span className="btn-glyph" aria-hidden="true" />
              </TrackLink>
            </div>
          </div>
        </section>

        <CloseScene />
      </main>
    </>
  );
}
