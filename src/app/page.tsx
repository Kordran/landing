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
  { term: "Where we start", detail: "One defined issue" },
  { term: "What you keep", detail: "The commercial decision" },
  { term: "What we do", detail: "Investigate and execute" },
];

const patterns = [
  {
    index: "A",
    kind: "compliance" as const,
    title: "Price above the term",
    body: "A line billed above what was agreed, often for months after the term was set.",
    found: "Billed above the term",
  },
  {
    index: "B",
    kind: "increase" as const,
    title: "An increase past the cap",
    body: "A supplier increase that went further, or started sooner, than the agreement allows.",
    found: "Increase beyond the cap",
  },
  {
    index: "C",
    kind: "surcharge" as const,
    title: "A charge that stayed",
    body: "A surcharge that kept billing after the condition behind it had ended.",
    found: "Charge still billed",
  },
];

const work = [
  {
    index: "01",
    title: "Supplier pricing and commercial terms",
    body: "Price increases, cost pass-throughs, surcharges, contract amendments, and negotiated terms that need investigation, a commercial response, or implementation.",
  },
  {
    index: "02",
    title: "Commercial disputes and exceptions",
    body: "Unexpected charges, disputed invoices, supplier claims, and cost responsibilities that need a clear economic case and a coordinated resolution.",
  },
  {
    index: "03",
    title: "Engineering-driven cost changes",
    body: "Supplier pricing and commercial consequences from design revisions, changing specifications, production ramps, and manufacturing changes.",
  },
  {
    index: "04",
    title: "Commercial implementation",
    body: "Approved changes to supplier pricing, sourcing arrangements, and commercial processes that have to move through purchasing, operations, and finance.",
  },
];

const steps = [
  {
    index: "01",
    title: "Establish",
    body: "Define the issue, the decision required, the economic exposure, and the people responsible.",
  },
  {
    index: "02",
    title: "Investigate",
    body: "Reconcile agreements, transactions, operational facts, and commercial assumptions. Establish what the evidence supports.",
  },
  {
    index: "03",
    title: "Execute",
    body: "Coordinate stakeholders, prepare the commercial response, support supplier discussions, and drive authorized actions through implementation.",
  },
  {
    index: "04",
    title: "Verify",
    body: "Confirm what changed, what value was realized, and what has to stay in place for the result to hold.",
  },
];

const next = [
  "Tell us the issue, what needs to change, and when a decision is needed.",
  "We reply with the scope, the records required, and whether the problem fits.",
  "If you want to go further, we propose a defined engagement with clear responsibilities.",
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
              Industrial commercial execution
            </p>
            <h1 id="hero-heading" className="display-hero">
              Complex commercial problems.
              <br />
              Taken through resolution.
            </h1>
            <p className="lede">
              Kordran helps industrial manufacturers resolve supplier pricing
              issues, execute commercial changes, and protect the economics of
              production. We establish the facts, coordinate the people
              involved, and drive approved actions through to measurable
              results.
            </p>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "hero", target: "contact" }}
              >
                Discuss a commercial issue
                <span className="btn-glyph" aria-hidden="true" />
              </TrackLink>
              <TrackLink
                href="/approach"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "hero", target: "approach" }}
              >
                How we work
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
                Important commercial issues rarely belong to one department.
              </h2>
              <p className="lede">
                A supplier changes its pricing. An engineering revision changes
                what a part should cost. A surcharge outlives its purpose. A
                commercial agreement gets negotiated and never fully
                implemented.
              </p>
              <p className="body">
                Finance sees the expense. Procurement manages the supplier.
                Engineering understands the change. Operations deals with the
                consequences. Each function has part of the picture. The
                commercial problem stays unresolved.
              </p>
              <p className="body">
                Kordran connects the evidence, the decisions, and the execution.
              </p>
            </Reveal>
            <Reveal className="split-figure" delay={80}>
              <div id="example" className="anchor" tabIndex={-1} />
              <ExampleSeen>
                <ExposureCalculator />
              </ExampleSeen>
              <p className="exhibit-caption">
                One pricing issue, drawn so the numbers can move. Not a client
                result.{" "}
                <TrackLink
                  href="/supplier-pricing"
                  className="inline-link"
                  event="cta_click"
                  eventParams={{ location: "problem", target: "supplier-pricing" }}
                >
                  Open the full illustration
                </TrackLink>
              </p>
            </Reveal>
          </div>
        </section>

        <section
          id="work"
          className="section section-sheet"
          aria-labelledby="work-heading"
        >
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">02</span>
                  What we do
                </p>
                <h2 id="work-heading" className="heading">
                  Commercial problems we take on.
                </h2>
              </div>
              <p className="lede">
                We start with a defined issue, not an enterprise-wide review.
                Supplier pricing is where most engagements begin. The job is
                the same either way: establish the economics, coordinate the
                response, and carry the approved action through.
              </p>
            </Reveal>
            <Reveal className="focus-grid" delay={40}>
              {patterns.map((item) => (
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
                  </div>
                </article>
              ))}
            </Reveal>
            <div className="work-grid">
              {work.map((item) => (
                <article className="work-item" key={item.title}>
                  <p className="label">
                    <span className="label-index">{item.index}</span>
                  </p>
                  <h3 className="title">{item.title}</h3>
                  <p className="body">{item.body}</p>
                </article>
              ))}
            </div>
            <p className="section-link">
              <TrackLink
                href="/supplier-pricing"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "work", target: "supplier-pricing" }}
              >
                See a supplier pricing illustration
              </TrackLink>
            </p>
          </div>
        </section>

        <section
          id="execution"
          className="section section-deep"
          aria-labelledby="value-heading"
        >
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">03</span>
                  How we work
                </p>
                <h2 id="value-heading" className="display">
                  From commercial issue to verified result.
                </h2>
              </div>
              <p className="lede">
                The work does not end at the recommendation. We stay through
                the decision, the supplier conversation, and the change that
                has to show up in the next transaction.
              </p>
            </Reveal>
            <LineProfile />
            <ol className="track-steps is-four">
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
            <p className="section-link">
              <TrackLink
                href="/approach"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "value", target: "approach" }}
              >
                Read how an engagement runs
              </TrackLink>
            </p>
          </div>
        </section>

        <section id="who" className="section" aria-labelledby="who-heading">
          <div className="container purpose-grid">
            <p className="label">
              <span className="label-index">04</span>
              Who we serve
            </p>
            <Reveal className="purpose-statement">
              <h2 id="who-heading" className="display">
                Built for companies that make physical things.
              </h2>
              <p className="muted">
                Industrial manufacturers and complex hardware businesses, where
                supplier economics, engineering requirements, and operations
                meet. We work alongside finance, procurement, supply chain, and
                operational leadership when a commercially important issue
                needs someone to carry it.
              </p>
            </Reveal>
            <div className="purpose-close">
              <div className="ruler" aria-hidden="true" />
              <p>
                Your team keeps the supplier relationship and the final
                commercial decision. Kordran provides the investigation, the
                coordination, and the follow-through.
              </p>
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
                Bring us the problem.
              </h2>
              <p className="lede">
                A supplier cost increase. A commercial dispute. A manufacturing
                change with unexpected financial consequences. Tell us what is
                happening, what needs to change, and when a decision is needed.
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
