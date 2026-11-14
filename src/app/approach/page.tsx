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
import { approachDescription, approachTitle, llmAlternates } from "@/lib/site";
import {
  annualPrevented,
  example,
  excludedExposure,
  excludedUnits,
  formatCount,
  formatUsd,
  potentialDiscrepancy,
  qualifiedUnits,
  supportedExposure,
  totalUnits,
  unitDelta,
} from "@/lib/example";

export const metadata: Metadata = {
  title: approachTitle,
  description: approachDescription,
  alternates: {
    canonical: "/approach",
    types: llmAlternates,
  },
  openGraph: {
    title: `${approachTitle} | Kordran`,
    description: approachDescription,
    url: "/approach",
    type: "website",
  },
};

const stages = [
  {
    title: "Records",
    body: "Quotes, agreements, orders, and invoices describe the same purchase. When they disagree, money moves.",
    scene: recordsScene,
  },
  {
    title: "Reconciliation",
    body: "Set side by side, the records show exactly where the billed price left the agreed one.",
    scene: reconcileScene,
  },
  {
    title: "Resolution",
    body: "Where the records support it, we help pursue a credit or a pricing correction. The outcome depends on the supplier and your decision.",
    scene: resolveScene,
  },
];

const index = [
  { href: "#fit", label: "Where to start" },
  { href: "#evidence", label: "Evidence" },
  { href: "#workflow", label: "Workflow" },
  { href: "#measure", label: "Results" },
  { href: "#outputs", label: "What you get" },
  { href: "#relationship", label: "Working together" },
];

const starts = [
  "Invoices don't seem to match the agreed price.",
  "A price increase went further than the contract allows.",
  "A surcharge stayed on after its conditions ended.",
  "Pricing changed in the contract but not in the purchasing system.",
  "A supplier dispute needs a clear, documented case.",
];

const sendUs = [
  "The supplier agreement or current price list",
  "A few recent invoices",
  "Purchase orders for the items in question",
  "Any price-increase or surcharge notices",
  "Whatever you have already flagged",
];

const workflow = [
  {
    title: "Scope",
    body: "Pin down the supplier, the issue, the invoices affected, and the records we need.",
    you: "Pick the supplier and the issue.",
  },
  {
    title: "Reconcile",
    body: "Line up agreements, orders, and invoices, and put a number on every difference.",
    you: "Share the records through a secure channel.",
  },
  {
    title: "Validate",
    body: "Test each difference against dates, amendments, and terms so the case holds up.",
    you: "Tell us about any context you know of.",
  },
  {
    title: "Resolve",
    body: "Build the case and help pursue a supported credit or pricing correction, alongside you.",
    you: "Decide what to pursue and approve supplier contact.",
  },
  {
    title: "Verify",
    body: "Confirm what was actually accepted: a credit, a corrected price, or another outcome.",
    you: "Confirm what was received or corrected.",
  },
  {
    title: "Prevent",
    body: "Put simple checks in place so the same issue does not return.",
    you: "Choose which checks to keep.",
  },
];

const outputs = [
  {
    title: "Findings register",
    body: "Every difference we found, with the invoice and agreement behind it.",
  },
  {
    title: "Value summary",
    body: "What each issue is worth, looking back and going forward.",
  },
  {
    title: "Supplier case",
    body: "The evidence package for the conversation with the supplier.",
  },
  {
    title: "Resolution support",
    body: "Hands-on help pursuing an authorized credit or pricing correction.",
  },
  {
    title: "Outcome record",
    body: "What was actually accepted, and what changed on new invoices.",
  },
  {
    title: "Prevention plan",
    body: "Simple checks that keep the same issue from coming back.",
  },
];

const scale = potentialDiscrepancy;

/** The same illustration as the homepage, from observed difference to a conditional run rate. */
const flow = [
  {
    key: "observed",
    title: "Observed",
    value: formatUsd(potentialDiscrepancy),
    math: `${formatCount(example.unitsPerMonth)} × ${formatUsd(unitDelta, 2)} × ${example.months} months`,
    from: 0,
    to: potentialDiscrepancy,
  },
  {
    key: "excluded",
    title: "Excluded",
    value: `−${formatUsd(excludedExposure)}`,
    math: `${formatCount(excludedUnits)} units on separate terms`,
    from: supportedExposure,
    to: potentialDiscrepancy,
  },
  {
    key: "claim",
    title: "Supported claim",
    value: formatUsd(supportedExposure),
    math: `${formatUsd(potentialDiscrepancy)} − ${formatUsd(excludedExposure)}`,
    from: 0,
    to: supportedExposure,
  },
  {
    key: "forward",
    title: "A year, if corrected",
    value: formatUsd(annualPrevented),
    math: `${formatCount(example.unitsPerMonth)} × ${formatUsd(unitDelta, 2)} × 12, if volume continues`,
    from: 0,
    to: annualPrevented,
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
              <span className="hero-line">
                <span>From supplier records to money back.</span>
              </span>
            </h1>
            <p className="lede">
              How we find the difference, prove what the records support, and
              help pursue a credit or a corrected price. It starts with one
              supplier.
            </p>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "approach-hero", target: "contact" }}
              >
                Send us a supplier issue
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
            <Reveal className="head-split" motion="headline">
              <div>
                <p className="label">
                  <span className="label-index">01</span>
                  Where to start
                </p>
                <h2 id="fit-heading" className="heading">
                  Start with what you&apos;re seeing.
                </h2>
              </div>
              <p className="lede">
                Most engagements begin with a hunch about one supplier. These
                are the patterns we see most, and what helps us move fast.
              </p>
            </Reveal>
            <div className="fit-grid">
              <Reveal className="fit-col is-yes">
                <h3 className="label">Good places to start</h3>
                <ul>
                  {starts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="fit-col is-yes" delay={80}>
                <h3 className="label">Helpful to send</h3>
                <ul>
                  {sendUs.map((item) => (
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
            <Reveal className="head-split" motion="headline">
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
                A pricing issue usually spans several records. We line them up
                to show which terms apply and exactly where the money went.
              </p>
            </Reveal>
            <Reveal motion="diagram">
              <EvidenceStack scene={evidenceScene} records={evidenceRecords} />
            </Reveal>
            <p className="body evidence-note">
              Spreadsheets, PDFs, and system exports all work. There is nothing
              to integrate to get started.
            </p>
          </div>
        </section>

        <section
          id="workflow"
          className="section section-sheet"
          aria-labelledby="workflow-heading"
        >
          <div className="container">
            <Reveal className="head-split" motion="headline">
              <div>
                <p className="label">
                  <span className="label-index">03</span>
                  Workflow
                </p>
                <h2 id="workflow-heading" className="heading">
                  A clear path through the work.
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
            <Reveal className="head-split" motion="headline">
              <div>
                <p className="label">
                  <span className="label-index">04</span>
                  Results
                </p>
                <h2 id="measure-heading" className="heading">
                  A finding is not a recovery.
                </h2>
              </div>
              <p className="lede">
                The same machined housing as the homepage, from what was
                observed to what the records support, and what a correction
                would be worth later.
              </p>
            </Reveal>

            <Reveal motion="diagram">
              <figure className="sheet flow-sheet">
                <figcaption className="sheet-head">
                  <span>Example continued · {example.item}</span>
                  <span>Illustration</span>
                </figcaption>
                <ol className="flow">
                  {flow.map((step, n) => (
                    <li
                      className={`flow-step is-${step.key}`}
                      key={step.key}
                      style={
                        {
                          "--from": step.from / scale,
                          "--to": step.to / scale,
                          "--n": n,
                        } as CSSProperties
                      }
                    >
                      <p className="label">
                        <span className="label-index">
                          {String(n + 1).padStart(2, "0")}
                        </span>
                        {step.title}
                      </p>
                      <div className="flow-track" aria-hidden="true">
                        <i />
                      </div>
                      <div className="flow-figure">
                        <p className="figure-num num">{step.value}</p>
                        <p className="state-math">{step.math}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </figure>
            </Reveal>

            <div className="case-copy">
              <p>
                Of the {formatCount(totalUnits)} units observed,{" "}
                {formatCount(excludedUnits)} were bought on a separate order.
                They come out of the claim.
              </p>
              <p>
                The other {formatCount(qualifiedUnits)} units support a{" "}
                <span className="num is-claim">{formatUsd(supportedExposure)}</span>{" "}
                claim. We build that case and help pursue a credit or a pricing
                correction. Acceptance is not assumed.
              </p>
              <p>
                If the price goes back to {formatUsd(example.agreedUnit, 2)} and
                buying continues, about{" "}
                <span className="num is-back">{formatUsd(annualPrevented)}</span>{" "}
                a year is not billed. That is future cost avoidance, not cash
                already recovered.
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
            <Reveal className="head-split" motion="headline">
              <div>
                <p className="label">
                  <span className="label-index">05</span>
                  What you receive
                </p>
                <h2 id="outputs-heading" className="heading">
                  What you get.
                </h2>
              </div>
              <p className="lede">
                Clear findings, a case that holds up, and follow-through on
                what you decide to pursue.
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
            <Reveal className="head-split" motion="headline">
              <div>
                <p className="label">
                  <span className="label-index">06</span>
                  Working together
                </p>
                <h2 id="relationship-heading" className="heading">
                  We work alongside your team.
                </h2>
              </div>
              <p className="lede">
                You keep the supplier relationship and every decision. We do
                the digging, build the case, and work it through with you.
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
                  <li>The supplier case</li>
                  <li>Follow-through on what you decide to pursue</li>
                </ul>
              </Reveal>
            </div>
            <p className="control-note">
              Everything you share stays confidential and is used only for your
              engagement.
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
                One supplier, one invoice that doesn&apos;t look right, or one
                price increase is enough to start.
              </p>
            </div>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "approach-close", target: "contact" }}
              >
                Send us a supplier issue
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
