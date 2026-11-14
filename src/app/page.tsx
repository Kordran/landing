import type { Metadata } from "next";
import Header from "@/components/Header";
import CloseScene from "@/components/CloseScene";
import ContactForm from "@/components/ContactForm";
import ExampleSeen from "@/components/ExampleSeen";
import ExposureExhibit from "@/components/ExposureExhibit";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import TrackLink from "@/components/TrackLink";
import Axo from "@/components/figures/Axo";
import {
  complianceScene,
  increaseScene,
  surchargeScene,
} from "@/components/figures/scenes";
import PlateArt from "@/components/plate/PlateArt";
import PlateField from "@/components/plate/PlateField";
import { plateDrawing } from "@/components/plate/model";
import { getHomeJsonLd } from "@/lib/jsonld";
import {
  contactEmail,
  defaultTitle,
  ogDescription,
  siteDescription,
} from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: defaultTitle },
  description: siteDescription,
  alternates: {
    canonical: "/",
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
  { term: "What we examine", detail: "Agreements, orders, invoices" },
  { term: "What you receive", detail: "Evidence you can act on" },
  { term: "Where to begin", detail: "One supplier" },
];

const focus = [
  {
    index: "A",
    title: "Pricing compliance",
    body: "Compare billed prices against applicable agreements and approved changes.",
    records: "Agreement · Invoice",
    scene: complianceScene,
  },
  {
    index: "B",
    title: "Price increases",
    body: "Evaluate supplier revisions, supporting explanations, and relevant contractual terms.",
    records: "Price notice · Contract terms",
    scene: increaseScene,
  },
  {
    index: "C",
    title: "Contractual surcharges",
    body: "Investigate recurring or changing charges against agreed conditions.",
    records: "Surcharge terms · Billing history",
    scene: surchargeScene,
  },
];

const steps = [
  {
    index: "01",
    title: "Verify",
    body: "Reconcile the records and quantify the exposure.",
  },
  {
    index: "02",
    title: "Resolve",
    body: "Support authorized corrections with your team.",
  },
  {
    index: "03",
    title: "Prevent",
    body: "Address the controls behind repeat discrepancies.",
  },
];

const questions = [
  {
    q: "What does Kordran do?",
    a: "Kordran investigates supplier pricing discrepancies and helps industrial manufacturers pursue appropriate commercial resolutions.",
  },
  {
    q: "What types of issues do you review?",
    a: "Initially, differences between agreed and billed prices, supplier increases, contractual surcharges, and related pricing-control problems.",
  },
  {
    q: "Do you negotiate directly with suppliers?",
    a: "Where appropriate and authorized, we can support supplier discussions alongside your team. Your company retains final purchasing authority.",
  },
  {
    q: "Do you guarantee recoveries or savings?",
    a: "No. Findings must be validated, and financial outcomes depend on applicable agreements, supplier responses, and actual corrective actions.",
  },
  {
    q: "Do we need to integrate our ERP?",
    a: "Not necessarily. An initial review can begin with selected quotations, pricing agreements, and purchasing records.",
  },
  {
    q: "How do you handle confidential information?",
    a: "Sensitive records are requested through an agreed process with appropriate confidentiality and data-handling arrangements.",
  },
  {
    q: "How do we get started?",
    a: "Describe a specific supplier pricing concern. We can then determine whether a focused review is appropriate.",
  },
];

const next = [
  "Describe the issue in general terms. No contracts, invoices, or pricing files.",
  "We review it and reply if Kordran is a fit.",
  "A focused review is scoped and set out in a separate written agreement.",
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
              Supplier costs.
              <br />
              Verified and resolved.
            </h1>
            <p className="lede">
              We help industrial manufacturers investigate supplier pricing,
              resolve supported discrepancies, and prevent recurring charges.
            </p>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "hero", target: "contact" }}
              >
                Discuss a supplier issue
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
                Real exposure.
              </h2>
              <p className="lede">
                Supplier pricing changes across contracts, quotations, and
                purchasing systems. A two-dollar gap on one part is easy to
                miss. Across every unit on every invoice, it is not.
              </p>
              <p className="body">
                Finding a discrepancy is one challenge. Determining what it
                means, and resolving it, is another.
              </p>
            </Reveal>
            <Reveal className="split-figure" delay={80}>
              <div id="example" className="anchor" tabIndex={-1} />
              <ExampleSeen>
                <ExposureExhibit />
              </ExampleSeen>
              <p className="exhibit-caption">
                The applicable agreement, effective dates, amendments, and
                eligible transactions must be verified before any amount is
                treated as supported.{" "}
                <TrackLink
                  href="/approach#measure"
                  className="inline-link"
                  event="cta_click"
                  eventParams={{ location: "example", target: "measure" }}
                >
                  See how a finding is validated
                </TrackLink>
                .
              </p>
            </Reveal>
          </div>
        </section>

        <section
          id="focus"
          className="section section-sheet"
          aria-labelledby="focus-heading"
        >
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">02</span>
                  What we examine
                </p>
                <h2 id="focus-heading" className="heading">
                  Focused on supplier pricing.
                </h2>
              </div>
              <p className="lede">
                We investigate selected pricing issues where the financial
                exposure, commercial records, and path to resolution can be
                meaningfully evaluated.
              </p>
            </Reveal>
            <Reveal className="focus-grid" delay={80}>
              {focus.map((item) => (
                <article className="focus-item" key={item.title}>
                  <div className="focus-figure">
                    <Axo scene={item.scene} />
                  </div>
                  <div>
                    <p className="label">
                      <span className="label-index">{item.index}</span>
                    </p>
                    <h3 className="title">{item.title}</h3>
                    <p className="body">{item.body}</p>
                    <dl className="focus-records micro">
                      <dt>Compared</dt>
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
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">03</span>
                  Intelligence + execution
                </p>
                <h2 id="value-heading" className="display">
                  The finding is only the beginning.
                </h2>
              </div>
              <p className="lede">
                We establish what the evidence supports, help pursue appropriate
                commercial corrections, and address the causes of recurring
                discrepancies.
              </p>
            </Reveal>

            <Reveal className="track" delay={80}>
              <div className="track-phases">
                <div className="track-phase">
                  <p className="label">Intelligence</p>
                  <p>
                    Understand the issue. Reconcile the records. Quantify the
                    exposure.
                  </p>
                </div>
                <div className="track-phase is-execution">
                  <p className="label">Execution</p>
                  <p>
                    Coordinate with your team, support supplier discussions, and
                    follow through on authorized corrective actions.
                  </p>
                </div>
              </div>
              <ol className="track-steps">
                <li className="track-line" aria-hidden="true" />
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
            <Reveal className="purpose-statement">
              <h2 id="purpose-heading" className="display">
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
                Before you contact us.
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
                Start with one supplier.
              </h2>
              <p className="lede">
                Have a price increase, disputed charge, or purchasing
                discrepancy? Tell us what&apos;s happening. We&apos;ll determine
                whether Kordran is a fit.
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
