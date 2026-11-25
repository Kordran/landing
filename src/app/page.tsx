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
  { term: "Who it is for", detail: "Precision manufacturers" },
  { term: "What we line up", detail: "Orders, entries, mill invoices" },
  { term: "What you keep", detail: "Title to the metal" },
  { term: "Where to start", detail: "One supplier" },
];

const focus = [
  {
    index: "A",
    kind: "compliance",
    title: "Purchase orders",
    body: "What you ordered, and what accounts payable recorded, line by line.",
    records: "Purchase order · AP export",
    found: "Ordered one price",
  },
  {
    index: "B",
    kind: "increase",
    title: "Customs entries",
    body: "What already crossed, read from the entry reports you export. We do not file.",
    records: "Entry summary · Your ACE export",
    found: "Entry doesn't match",
  },
  {
    index: "C",
    kind: "surcharge",
    title: "Mill invoices and scrap",
    body: "What the mill billed, and what the scrap ticket says came back.",
    records: "Mill invoice · Scrap ticket",
    found: "Billed above the order",
  },
] as const;

const steps = [
  {
    index: "01",
    title: "Reconcile",
    body: "We line up the order, the entry, and the mill invoice, and put a number on the gap.",
  },
  {
    index: "02",
    title: "Pursue",
    body: "We help you take a supported finding to the supplier. Your broker or counsel files.",
  },
  {
    index: "03",
    title: "Watch",
    body: "We keep the next invoice, duty line, and scrap ticket from drifting apart.",
  },
];

const next = [
  "Tell us the supplier, and whether the gap is in the price, the duty, or the scrap.",
  "We come back with what we would line up, and what it could be worth.",
  "If you want to go further, we reconcile the records and help pursue a correction.",
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
              Orders, entries, and mill invoices
            </p>
            <h1 id="hero-heading" className="display-hero">
              Three records.
              <br />
              One number.
            </h1>
            <p className="lede">
              We line up purchase orders, customs entries, and mill invoices
              for precision manufacturers. Then we help pursue what the
              records support.
            </p>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "hero", target: "contact" }}
              >
                Send us one supplier
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
                The gap
              </p>
              <h2 id="problem-heading" className="heading">
                Small differences.
                <br />
                Big money.
              </h2>
              <p className="lede">
                A <span className="num is-over">{formatUsd(unitDelta, 2)}</span>{" "}
                gap between the purchase order and the mill invoice is easy to
                miss. Billed {formatCount(example.unitsPerMonth)} times a month
                for two years, it is{" "}
                <span className="num is-over">{formatUsd(potentialDiscrepancy)}</span>.
              </p>
              <p className="body">
                The same kind of gap hides in a duty line or a scrap ticket.
                Left alone, this one keeps adding{" "}
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
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">02</span>
                  Three records
                </p>
                <h2 id="focus-heading" className="heading">
                  Where the money hides.
                </h2>
              </div>
              <p className="lede">
                We put the purchase order, the customs entry, and the mill
                invoice on the same line. The difference is the work.
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
                See how the work runs
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
                  Follow-through
                </p>
                <h2 id="value-heading" className="display">
                  The finding is only the beginning.
                </h2>
              </div>
              <p className="lede">
                A report is not a correction. We stay through the case. Your
                broker files. You decide, and you keep the metal.
              </p>
            </Reveal>

            <Reveal className="track" delay={80}>
              <div className="track-phases">
                <div className="track-phase">
                  <p className="label">Reconcile</p>
                  <p>
                    Line up the three records. Put a number on the gap.
                  </p>
                </div>
                <div className="track-phase is-execution">
                  <p className="label">Pursue</p>
                  <p>
                    Help take a supported finding to the supplier. Filings stay
                    with your broker or counsel.
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
                Read how it runs
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
                The economics of metal, in and out.
              </h2>
              <p className="muted">
                Precision manufacturers live on the gap between what was
                bought, what crossed the border, and what was billed. That gap
                should be visible, and acted on.
              </p>
            </Reveal>
            <div className="purpose-close">
              <div className="ruler" aria-hidden="true" />
              <p>Line up the records. Act on the difference.</p>
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
                Send us one supplier.
              </h2>
              <p className="lede">
                A mill invoice that doesn&apos;t match the order, a duty line
                that doesn&apos;t match the entry, or scrap that left for less
                than it was worth. Start with one supplier.
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
