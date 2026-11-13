import type { Metadata } from "next";
import Header from "@/components/Header";
import CloseScene from "@/components/CloseScene";
import ExampleRecord from "@/components/ExampleRecord";
import ExampleSeen from "@/components/ExampleSeen";
import ExposureCalc from "@/components/ExposureCalc";
import ReconciliationField from "@/components/ReconciliationField";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import TrackLink from "@/components/TrackLink";
import {
  ComplianceFigure,
  ConvergeFigure,
  IncreaseFigure,
  SurchargeFigure,
} from "@/components/Figures";
import JsonLd from "@/components/JsonLd";
import { getHomeJsonLd } from "@/lib/jsonld";
import { formatUsd, potentialDiscrepancy } from "@/lib/example";
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

const issues = [
  {
    title: "Price discrepancies",
    body: "Actual charges differ from agreed pricing.",
  },
  {
    title: "Changing terms",
    body: "Supplier increases and contract revisions require verification.",
  },
  {
    title: "Recurring charges",
    body: "Surcharges or outdated prices can persist when controls fail.",
  },
];

const focus = [
  {
    index: "01",
    title: "Pricing compliance",
    body: "Compare billed prices against applicable agreements and approved changes.",
    figure: ComplianceFigure,
  },
  {
    index: "02",
    title: "Price increases",
    body: "Evaluate supplier revisions, supporting explanations, and relevant contractual terms.",
    figure: IncreaseFigure,
  },
  {
    index: "03",
    title: "Contractual surcharges",
    body: "Investigate recurring or changing charges against agreed conditions.",
    figure: SurchargeFigure,
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

const priceLines = [
  { label: "Quotation", value: "$42.00", exception: false },
  { label: "Invoice", value: "$44.00", exception: true },
  { label: "Difference", value: "$2.00", exception: true },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={getHomeJsonLd()} />
      <Header initialTone="on-light" />
      <main id="content" className="site-main">
        <section
          className="section hero-editorial"
          data-header="on-light"
          aria-labelledby="hero-heading"
        >
          <div className="container hero-editorial-grid">
            <div>
              <p className="kicker">Industrial cost intelligence + execution</p>
              <h1 id="hero-heading" className="display">
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
                </TrackLink>
                <TrackLink
                  href="/approach"
                  className="text-action"
                  event="cta_click"
                  eventParams={{ location: "hero", target: "approach" }}
                >
                  Explore our approach
                </TrackLink>
              </div>
            </div>
            <ReconciliationField />
          </div>
        </section>

        <section
          id="problem"
          className="section chapter"
          data-header="on-light"
          aria-labelledby="problem-heading"
        >
          <div className="container">
            <Reveal>
              <p className="kicker">The problem</p>
              <h2 id="problem-heading" className="heading">
                Small differences. Real exposure.
              </h2>
              <p className="lede">
                Supplier pricing changes across contracts, quotations, and
                purchasing systems. Finding a discrepancy is one challenge.
                Determining what it means—and resolving it—is another.
              </p>
            </Reveal>
            <Reveal as="ul" className="price-strip" delay={40}>
              {priceLines.map((line) => (
                <li
                  key={line.label}
                  className={line.exception ? "is-exception" : undefined}
                >
                  <span>{line.label}</span>
                  <span className="num">{line.value}</span>
                </li>
              ))}
            </Reveal>
            <Reveal as="ul" className="issues issues-board reveal-stagger" delay={80}>
              {issues.map((issue) => (
                <li key={issue.title}>
                  <h3>{issue.title}</h3>
                  <p>{issue.body}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        <section
          id="focus"
          className="section band"
          data-header="on-light"
          aria-labelledby="focus-heading"
        >
          <div className="container">
            <Reveal>
              <p className="kicker">What we focus on</p>
              <h2 id="focus-heading" className="heading">
                Focused on supplier pricing.
              </h2>
              <p className="lede">
                We investigate selected pricing issues where the financial
                exposure, commercial records, and path to resolution can be
                meaningfully evaluated.
              </p>
            </Reveal>
            <Reveal as="div" className="focus-grid reveal-stagger" delay={80}>
              {focus.map((item) => (
                <article key={item.title}>
                  <item.figure />
                  <p className="stage-index">{item.index}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
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
          id="approach"
          className="section chapter"
          data-header="on-light"
          aria-labelledby="value-heading"
        >
          <div id="diagnostic" className="alias-anchor" />
          <div className="container">
            <Reveal>
              <p className="kicker">Intelligence + execution</p>
              <h2 id="value-heading" className="heading">
                The finding is only the beginning.
              </h2>
              <p className="lede">
                We establish what the evidence supports, help pursue
                appropriate commercial corrections, and address the causes of
                recurring discrepancies.
              </p>
            </Reveal>
            <div className="work-pair value-pair">
              <Reveal>
                <p className="kicker">Intelligence</p>
                <h3 className="stage-title">
                  Understand the issue. Reconcile the records. Quantify the
                  exposure.
                </h3>
              </Reveal>
              <Reveal delay={80}>
                <p className="kicker">Execution</p>
                <h3 className="stage-title">
                  Coordinate with your team, support supplier discussions, and
                  follow through on authorized corrective actions.
                </h3>
              </Reveal>
            </div>
            <Reveal delay={80}>
              <ConvergeFigure />
            </Reveal>
            <Reveal as="ol" className="stages reveal-stagger" delay={100}>
              {steps.map((step) => (
                <li key={step.index}>
                  <p className="stage-index">{step.index}</p>
                  <h3 className="stage-title">{step.title}</h3>
                  <p className="stage-body">{step.body}</p>
                </li>
              ))}
            </Reveal>
            <p className="section-link">
              <TrackLink
                href="/approach"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "value", target: "approach" }}
              >
                Our approach
              </TrackLink>
            </p>
          </div>
        </section>

        <section
          id="example"
          className="section evidence"
          data-header="on-light"
          aria-labelledby="example-heading"
          tabIndex={-1}
        >
          <div className="container">
            <Reveal>
              <p className="kicker">Example</p>
              <h2 id="example-heading" className="heading">
                See where the numbers diverge.
              </h2>
              <p className="lede">
                A simple pricing difference can reveal a larger commercial
                question.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <ExampleSeen>
                <ExampleRecord />
              </ExampleSeen>
            </Reveal>
            <Reveal delay={120}>
              <div className="example-note">
                <p>
                  {formatUsd(potentialDiscrepancy)} is potential exposure, not
                  an established recovery.
                </p>
                <p>
                  The applicable agreement, effective dates, amendments, and
                  eligible transactions must be verified.
                </p>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <ExposureCalc />
            </Reveal>
            <p className="section-link">
              <TrackLink
                href="/approach#workflow"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "example", target: "workflow" }}
              >
                See the full process
              </TrackLink>
            </p>
          </div>
        </section>

        <section
          id="purpose"
          className="section purpose"
          data-header="on-light"
          aria-labelledby="purpose-heading"
        >
          <div className="container purpose-grid">
            <Reveal>
              <p className="kicker">Purpose</p>
              <h2 id="purpose-heading" className="display">
                Better economics for physical industry.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="lede">
                Industrial companies depend on complex supplier relationships.
                We believe the economics behind those relationships should be
                understood, verified, and acted upon.
              </p>
              <p className="purpose-line">
                Understand the cost. Act on the evidence.
              </p>
            </Reveal>
          </div>
        </section>

        <section
          id="questions"
          className="section chapter"
          data-header="on-light"
          aria-labelledby="faq-heading"
        >
          <div className="container faq-layout">
            <Reveal>
              <p className="kicker">Questions</p>
              <h2 id="faq-heading" className="heading">
                Before you contact us.
              </h2>
            </Reveal>
            <div className="faq-list">
              {questions.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section chapter"
          data-header="on-light"
          aria-labelledby="contact-heading"
          tabIndex={-1}
        >
          <div className="container contact-grid">
            <Reveal className="contact-aside">
              <p className="kicker">Contact</p>
              <h2 id="contact-heading" className="heading">
                Start with one supplier.
              </h2>
              <p className="lede">
                Have a price increase, disputed charge, or purchasing
                discrepancy? Tell us what&apos;s happening. We&apos;ll determine
                whether Kordran is a fit.
              </p>
              <p className="contact-mail">
                <a className="inline-link" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </p>
            </Reveal>
            <Reveal delay={80}>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        <CloseScene />
      </main>
    </>
  );
}
