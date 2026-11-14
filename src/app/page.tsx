import type { Metadata } from "next";
import Header from "@/components/Header";
import CloseScene from "@/components/CloseScene";
import ContactForm from "@/components/ContactForm";
import ExampleSeen from "@/components/ExampleSeen";
import ExposureCalculator from "@/components/ExposureCalculator";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import TrackLink from "@/components/TrackLink";
import FindingLoop from "@/components/figures/FindingLoop";
import LineProfile from "@/components/figures/LineProfile";
import PlateArt from "@/components/plate/PlateArt";
import PlateField from "@/components/plate/PlateField";
import { plateDrawing } from "@/components/plate/model";
import {
  annualPrevented,
  example,
  formatCount,
  formatUsd,
  potentialDiscrepancy,
  unitDelta,
} from "@/lib/example";
import { questions } from "@/lib/faq";
import { getHomeJsonLd } from "@/lib/jsonld";
import {
  contactEmail,
  defaultTitle,
  ogDescription,
  llmAlternates,
  siteDescription,
} from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: defaultTitle },
  description: siteDescription,
  alternates: {
    canonical: "/",
    types: llmAlternates,
  },
  openGraph: {
    title: defaultTitle,
    description: ogDescription,
    url: "/",
    type: "website",
  },
};

const facts = [
  { term: "Who it is for", detail: "Industrial manufacturers" },
  { term: "What we check", detail: "Agreements, orders, invoices" },
  { term: "What you get", detail: "A supported case" },
  { term: "Where to start", detail: "One supplier" },
];

const focus = [
  {
    index: "A",
    kind: "compliance",
    title: "Prices above agreement",
    body: "Invoices billed above the agreed price, line by line, often for months after a contract was signed.",
    records: "Agreement · Invoice",
    found: "Billed above agreement",
  },
  {
    index: "B",
    kind: "increase",
    title: "Increases beyond terms",
    body: "Price increases that went further, or started sooner, than the contract allows.",
    records: "Price notice · Contract terms",
    found: "Increase beyond the cap",
  },
  {
    index: "C",
    kind: "surcharge",
    title: "Surcharges that stayed",
    body: "Fuel, material, and freight charges that kept coming after the conditions behind them ended.",
    records: "Surcharge terms · Billing history",
    found: "Charge still billed",
  },
] as const;

const steps = [
  {
    index: "01",
    title: "Verify",
    body: "We reconcile the records and put a number on what was overbilled.",
  },
  {
    index: "02",
    title: "Resolve",
    body: "We build the case and help pursue a supported credit or pricing correction.",
  },
  {
    index: "03",
    title: "Prevent",
    body: "We help fix the cause so the next invoice can be right.",
  },
];

const next = [
  "Tell us about the supplier and what you're seeing.",
  "We review it and come back to you with what we'd check and what it could be worth.",
  "If you want to go further, we reconcile, build the case, and help pursue a correction.",
];

export default function HomePage() {
  const plate = plateDrawing();

  return (
    <>
      <JsonLd data={getHomeJsonLd()} />
      <Header />
      <main id="content" className="site-main">
        <section className="hero" aria-labelledby="hero-heading">
          <PlateField aspect={plate.aspect}>
            <PlateArt />
          </PlateField>
          <div className="container hero-body">
            <p className="label">
              <span className="mark" aria-hidden="true" />
              Industrial cost intelligence + execution
            </p>
            <h1 id="hero-heading" className="display-hero">
              <span className="hero-line">
                <span>Supplier costs.</span>
              </span>
              <span className="hero-line">
                <span>Verified and resolved.</span>
              </span>
            </h1>
            <p className="lede">
              We help industrial manufacturers find where a supplier billed
              more than was agreed, build the case, and pursue a correction.
            </p>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "hero", target: "contact" }}
              >
                Send us a supplier issue
                <span className="btn-glyph" aria-hidden="true" />
              </TrackLink>
              <TrackLink
                href="/approach"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "hero", target: "approach" }}
              >
                See how it works
              </TrackLink>
            </div>
          </div>
          <div className="hero-rail-wrap">
            <dl className="container hero-rail">
              {facts.map((fact) => (
                <div key={fact.term}>
                  <dt>{fact.term}</dt>
                  <dd>{fact.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="problem"
          className="section"
          aria-labelledby="problem-heading"
        >
          <div className="container split">
            <Reveal className="split-copy">
              <p className="label">
                <span className="label-index">01</span>
                The problem
              </p>
              <h2 id="problem-heading" className="heading">
                Small differences.
                <br />
                Big money.
              </h2>
              <p className="lede">
                A <span className="num is-over">{formatUsd(unitDelta, 2)}</span>{" "}
                gap on one part number is easy to miss. Billed{" "}
                {formatCount(example.unitsPerMonth)} times a month for two
                years, it is{" "}
                <span className="num is-over">{formatUsd(potentialDiscrepancy)}</span>.
              </p>
              <p className="body">
                It hides in invoices that look normal: an increase that went
                further than agreed, a surcharge that never came off, a
                contract update that never reached purchasing. Left alone, this
                one keeps adding{" "}
                <span className="num is-over">{formatUsd(annualPrevented)}</span> a
                year. That yearly figure is what continues, not cash already
                recovered.
              </p>
              <p className="split-link">
                <TrackLink
                  href="/#contact"
                  className="text-action"
                  event="cta_click"
                  eventParams={{ location: "problem", target: "contact" }}
                >
                  Send us what you&apos;re seeing
                </TrackLink>
              </p>
            </Reveal>
            <Reveal className="split-figure" delay={80}>
              <div id="example" className="anchor" tabIndex={-1} />
              <ExampleSeen>
                <ExposureCalculator />
              </ExampleSeen>
            </Reveal>
          </div>
        </section>

        <section
          id="focus"
          className="section section-sheet"
          aria-labelledby="focus-heading"
        >
          <div className="container">
            <Reveal className="head-split" motion="headline">
              <div>
                <p className="label">
                  <span className="label-index">02</span>
                  What we examine
                </p>
                <h2 id="focus-heading" className="heading">
                  Where overbilling hides.
                </h2>
              </div>
              <p className="lede">
                We check what you were billed against what you agreed to, on
                every invoice, and show exactly where the two part ways. Then
                we bring them back together.
              </p>
            </Reveal>
            <Reveal className="focus-grid" delay={80}>
              {focus.map((item) => (
                <article className="focus-item" key={item.title}>
                  <div className="focus-figure">
                    <FindingLoop
                      kind={item.kind}
                      found={item.found}
                      resolved="Resolved"
                    />
                  </div>
                  <div>
                    <p className="label">
                      <span className="label-index">{item.index}</span>
                    </p>
                    <h3 className="title">{item.title}</h3>
                    <p className="body">{item.body}</p>
                    <dl className="focus-records micro">
                      <dt>We compare</dt>
                      <dd>{item.records}</dd>
                    </dl>
                  </div>
                </article>
              ))}
            </Reveal>
            <p className="section-link">
              <TrackLink
                href="/approach#workflow"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "focus", target: "workflow" }}
              >
                See how we investigate
              </TrackLink>
            </p>
          </div>
        </section>

        <section
          id="execution"
          className="section section-deep"
          aria-labelledby="value-heading"
        >
          <div id="approach" className="anchor" />
          <div id="diagnostic" className="anchor" />
          <div className="container">
            <Reveal className="head-split" motion="headline">
              <div>
                <p className="label">
                  <span className="label-index">03</span>
                  Intelligence + execution
                </p>
                <h2 id="value-heading" className="heading">
                  The finding is only the beginning.
                </h2>
              </div>
              <p className="lede">
                Most reviews stop at a report. We stay through the case, the
                supplier conversation, and a correction that can keep it from
                coming back.
              </p>
            </Reveal>

            <Reveal className="track" delay={80}>
              <div className="track-phases">
                <div className="track-phase">
                  <p className="label">Intelligence</p>
                  <p>
                    Find it. Reconcile the records. Put a number on it.
                  </p>
                </div>
                <div className="track-phase is-execution">
                  <p className="label">Execution</p>
                  <p>
                    Work the issue with your team and the supplier, and help
                    pursue a supported credit or pricing correction.
                  </p>
                </div>
              </div>
              <LineProfile />
              <ol className="track-steps">
                {steps.map((step) => (
                  <li className="track-step" key={step.index}>
                    <p className="label">
                      <span className="label-index">{step.index}</span>
                    </p>
                    <h3 className="title">{step.title}</h3>
                    <p className="body">{step.body}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <p className="section-link">
              <TrackLink
                href="/approach"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "value", target: "approach" }}
              >
                Read the full approach
              </TrackLink>
            </p>
          </div>
        </section>

        <section
          id="purpose"
          className="section"
          aria-labelledby="purpose-heading"
        >
          <div className="container purpose-grid">
            <p className="label">
              <span className="label-index">04</span>
              Purpose
            </p>
            <Reveal className="purpose-statement" motion="statement">
              <h2 id="purpose-heading" className="statement">
                Better economics for physical industry.
              </h2>
              <p className="muted">
                Industrial companies depend on complex supplier relationships.
                We believe the economics behind those relationships should be
                understood, verified, and acted upon.
              </p>
            </Reveal>
            <div className="purpose-close">
              <div className="ruler" aria-hidden="true" />
              <p>Understand the cost. Act on the evidence.</p>
            </div>
          </div>
        </section>

        <section
          id="questions"
          className="section section-sheet"
          aria-labelledby="faq-heading"
        >
          <div className="container faq-layout">
            <Reveal className="faq-head">
              <p className="label">
                <span className="label-index">05</span>
                Questions
              </p>
              <h2 id="faq-heading" className="heading">
                How we help.
              </h2>
            </Reveal>
            <div className="faq-list">
              {questions.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>
                    {item.q}
                    <span className="toggle" aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section"
          aria-labelledby="contact-heading"
          tabIndex={-1}
        >
          <div className="container contact-grid">
            <Reveal className="contact-aside">
              <p className="label">
                <span className="label-index">06</span>
                Contact
              </p>
              <h2 id="contact-heading" className="heading">
                Send us what you&apos;re seeing.
              </h2>
              <p className="lede">
                A price increase that doesn&apos;t look right, a surcharge that
                never went away, or a supplier you just want checked. Start
                with one supplier. We&apos;ll take a look.
              </p>
              <ol className="next-steps">
                {next.map((item, index) => (
                  <li key={item}>
                    <span className="label-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
              <p className="contact-mail">
                <a className="inline-link" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </p>
            </Reveal>
            <Reveal className="contact-form" delay={80}>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        <CloseScene />
      </main>
    </>
  );
}
