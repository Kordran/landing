import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExampleRecord from "@/components/ExampleRecord";
import ExampleSeen from "@/components/ExampleSeen";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import TrackLink from "@/components/TrackLink";
import JsonLd from "@/components/JsonLd";
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

const issues = [
  {
    index: "01",
    title: "Price discrepancies",
    body: "Billed prices differ from agreed terms.",
  },
  {
    index: "02",
    title: "Supplier increases",
    body: "Revised prices require commercial review.",
  },
  {
    index: "03",
    title: "Persistent surcharges",
    body: "Charges can continue after their contractual basis changes.",
  },
];

const stages = [
  {
    index: "01",
    title: "Verify",
    body: "Establish the facts through agreements, pricing records, and purchasing history.",
  },
  {
    index: "02",
    title: "Resolve",
    body: "Work with your team to pursue supported corrections and commercial solutions.",
  },
  {
    index: "03",
    title: "Prevent",
    body: "Address the underlying controls that allow recurring discrepancies.",
  },
];

const startingPoints = [
  "Supplier quotation or price notice",
  "Previous pricing",
  "Relevant agreement or purchasing record",
];

function SceneImage({
  src,
  priority = false,
}: {
  src: string;
  priority?: boolean;
}) {
  return (
    <div className="scene-motion">
      {/* The file is already the full painting. Skipping the image optimizer avoids a smaller derivative. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="scene-bg"
        src={src}
        alt=""
        width={1672}
        height={941}
        decoding="async"
        aria-hidden="true"
        {...(priority
          ? { fetchPriority: "high" as const }
          : { loading: "lazy" as const })}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <link rel="preload" as="image" href="/scenes/foundry.jpg" />
      <JsonLd data={getHomeJsonLd()} />
      <Header initialTone="on-dark" />
      <main id="content" className="site-main site-main-overlay">
        <section
          className="scene scene-hero"
          data-header="on-dark"
          aria-labelledby="hero-heading"
        >
          <SceneImage src="/scenes/foundry.jpg" priority />
          <div className="scene-scrim" aria-hidden="true" />
          <div className="container">
            <div className="scene-copy">
            <p className="kicker">Kordran / Industrial cost intelligence</p>
            <h1 id="hero-heading" className="display">
              Supplier costs.
              <br />
              Verified and resolved.
            </h1>
            <p className="lede">
              We identify purchasing-cost discrepancies and work with
              manufacturers to resolve them.
            </p>
            <div className="cta-row">
              <TrackLink
                href="#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "hero", target: "contact" }}
              >
                Discuss a supplier issue
              </TrackLink>
              <a href="#approach" className="text-action">
                How we work
              </a>
            </div>
            </div>
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
              <p className="kicker">Problem</p>
              <h2 id="problem-heading" className="heading">
                The price agreed isn&apos;t always the price paid.
              </h2>
              <p className="lede">
                Supplier prices change. Contracts get revised. Surcharges
                persist. The differences can be costly—and difficult to trace.
              </p>
            </Reveal>
            <Reveal as="ul" className="issues issues-board reveal-stagger" delay={80}>
              {issues.map((issue) => (
                <li key={issue.title}>
                  <p className="stage-index">{issue.index}</p>
                  <h3>{issue.title}</h3>
                  <p>{issue.body}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        <section
          className="scene scene-complexity"
          data-header="on-dark"
          aria-labelledby="complexity-heading"
        >
          <SceneImage src="/scenes/shop.jpg" />
          <div className="scene-scrim scene-scrim-right" aria-hidden="true" />
          <div className="container">
          <Reveal className="scene-copy scene-copy-end">
            <p className="kicker">Scale</p>
            <h2 id="complexity-heading" className="heading">
              Complex operations. Complex costs.
            </h2>
            <p className="lede">
              Across suppliers, contracts, and purchasing systems, small
              inconsistencies can become meaningful financial exposure.
            </p>
          </Reveal>
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
              <p className="kicker">Evidence</p>
              <h2 id="example-heading" className="heading">
                Find the difference.
              </h2>
              <p className="lede">
                We reconcile purchasing records against agreed terms to identify
                and quantify potential discrepancies.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ExampleSeen>
                <ExampleRecord />
              </ExampleSeen>
            </Reveal>
            <Reveal delay={180}>
              <div className="example-note">
                <p>
                  Kordran reviews the relevant agreement, validates eligible
                  transactions, and works toward an authorized commercial
                  correction.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="approach"
          className="section chapter"
          data-header="on-light"
          aria-labelledby="approach-heading"
          tabIndex={-1}
        >
          <div id="diagnostic" className="alias-anchor" />
          <div className="container">
            <Reveal>
              <p className="kicker">Approach</p>
              <h2 id="approach-heading" className="heading">
                From finding to resolution.
              </h2>
            </Reveal>
            <Reveal as="ol" className="stages reveal-stagger" delay={80}>
              {stages.map((stage) => (
                <li key={stage.index}>
                  <p className="stage-index">{stage.index}</p>
                  <h3 className="stage-title">{stage.title}</h3>
                  <p className="stage-body">{stage.body}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        <section
          className="scene scene-execute"
          data-header="on-dark"
          aria-labelledby="execute-heading"
        >
          <SceneImage src="/scenes/mill.jpg" />
          <div className="scene-scrim" aria-hidden="true" />
          <div className="container">
          <Reveal className="scene-copy">
            <p className="kicker">Execution</p>
            <h2 id="execute-heading" className="heading">
              We don&apos;t stop at the finding.
            </h2>
            <p className="lede">
              We work alongside procurement teams to resolve supplier issues,
              secure supported corrections, and prevent recurrence.
            </p>
            <p className="scene-note">Intelligence meets execution.</p>
          </Reveal>
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
              <p className="kicker">Engagement</p>
              <h2 id="contact-heading" className="heading">
                Start with one supplier.
              </h2>
              <p className="lede">
                Bring us a pricing discrepancy, disputed charge, or supplier
                increase. We&apos;ll help establish whether Kordran is a fit.
              </p>
              <p className="kicker list-kicker">Useful if you have them</p>
              <ul className="input-list">
                {startingPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="contact-mail">
                <a className="inline-link" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        <section
          className="scene scene-close"
          data-header="on-dark"
          aria-labelledby="close-heading"
        >
          <SceneImage src="/scenes/works.jpg" />
          <div className="scene-scrim scene-scrim-close" aria-hidden="true" />
          <div className="scene-close-stack">
            <Reveal className="container scene-close-statement">
              <h2 id="close-heading" className="display close-display">
                Find the cost.
                <br />
                Recover the value.
                <br />
                Fix the system.
              </h2>
            </Reveal>
            <Footer overlay />
          </div>
        </section>
      </main>
    </>
  );
}
