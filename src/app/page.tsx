import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExampleRecord from "@/components/ExampleRecord";
import ExampleSeen from "@/components/ExampleSeen";
import ContactForm from "@/components/ContactForm";
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
    title: "Price discrepancies",
    body: "Billed prices that differ from agreed terms.",
  },
  {
    title: "Supplier increases",
    body: "New prices that need commercial review.",
  },
  {
    title: "Persistent surcharges",
    body: "Charges that continue after terms change.",
  },
];

const stages = [
  {
    index: "01",
    title: "Verify",
    body: "We reconcile pricing records, agreements, and purchasing history to establish what the evidence supports.",
  },
  {
    index: "02",
    title: "Resolve",
    body: "We work with your team to pursue supported corrections and resolve supplier disputes.",
  },
  {
    index: "03",
    title: "Prevent",
    body: "We help implement controls that reduce repeat discrepancies.",
  },
];

function SceneImage({
  src,
  priority = false,
}: {
  src: string;
  priority?: boolean;
}) {
  return (
    <Image
      className="scene-bg"
      src={src}
      alt=""
      fill
      sizes="100vw"
      priority={priority}
      aria-hidden
    />
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
          <div className="container scene-copy">
            <p className="kicker">Supplier cost intelligence + execution</p>
            <h1 id="hero-heading" className="display">
              Supplier costs.
              <br />
              Verified and resolved.
            </h1>
            <p className="lede">
              Kordran helps industrial manufacturers identify pricing
              discrepancies, resolve supplier issues, and prevent repeat
              charges.
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
                See how it works
              </a>
            </div>
          </div>
        </section>

        <section
          className="scene scene-problem"
          data-header="on-dark"
          aria-labelledby="problem-heading"
        >
          <SceneImage src="/scenes/shop.jpg" />
          <div className="scene-scrim" aria-hidden="true" />
          <div className="container scene-copy">
            <p className="kicker">Problem</p>
            <h2 id="problem-heading" className="heading">
              The price agreed isn&apos;t always the price paid.
            </h2>
            <p className="lede">
              Supplier prices change. Contracts get revised. Surcharges
              persist. The differences can be difficult to trace—and costly to
              leave unresolved.
            </p>
            <ul className="issues">
              {issues.map((issue) => (
                <li key={issue.title}>
                  <h3>{issue.title}</h3>
                  <p>{issue.body}</p>
                </li>
              ))}
            </ul>
            <p className="scene-note">
              For manufacturers buying industrial equipment, electromechanical
              assemblies, and precision components.
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
            <p className="kicker">Example</p>
            <h2 id="example-heading" className="heading">
              Illustrative supplier price discrepancy
            </h2>
            <ExampleSeen>
              <ExampleRecord />
            </ExampleSeen>
            <div className="example-note">
              <p>A pricing difference is a finding, not yet a recovery.</p>
              <p>
                Kordran reviews the relevant agreement, validates eligible
                transactions, and works toward an authorized commercial
                correction.
              </p>
            </div>
          </div>
        </section>

        <section
          id="approach"
          className="scene scene-resolve"
          data-header="on-dark"
          aria-labelledby="approach-heading"
          tabIndex={-1}
        >
          <div id="diagnostic" className="alias-anchor" />
          <SceneImage src="/scenes/mill.jpg" />
          <div className="scene-scrim" aria-hidden="true" />
          <div className="container scene-copy">
            <p className="kicker">Method</p>
            <h2 id="approach-heading" className="heading">
              We don&apos;t stop at the finding.
            </h2>
            <p className="lede">
              Verification is the start. Kordran stays through the correction,
              and the control that keeps the charge from returning.
            </p>
            <ol className="stages">
              {stages.map((stage) => (
                <li key={stage.index}>
                  <p className="stage-index">{stage.index}</p>
                  <h3 className="stage-title">{stage.title}</h3>
                  <p className="stage-body">{stage.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="contact"
          className="scene scene-close"
          data-header="on-dark"
          aria-labelledby="close-heading"
          tabIndex={-1}
        >
          <SceneImage src="/scenes/works.jpg" />
          <div className="scene-scrim scene-scrim-close" aria-hidden="true" />
          <div className="container scene-close-grid">
            <div className="scene-copy">
              <p className="kicker">Contact</p>
              <h2 id="close-heading" className="heading">
                Find the cost. Recover the value. Fix the system.
              </h2>
              <p className="lede">
                Tell us what changed. We&apos;ll determine whether Kordran is a
                fit.
              </p>
              <p className="scene-note">
                Start with one supplier — a price increase, a disputed charge,
                or a purchasing discrepancy.
              </p>
              <p className="contact-mail">
                <a className="inline-link" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </p>
            </div>
            <ContactForm variant="scene" />
          </div>
          <Footer overlay />
        </section>
      </main>
    </>
  );
}
