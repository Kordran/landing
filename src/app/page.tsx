import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ExampleRecord from "@/components/ExampleRecord";
import ExampleSeen from "@/components/ExampleSeen";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { getHomeJsonLd } from "@/lib/jsonld";
import { contactEmail, defaultTitle, ogDescription, siteDescription } from "@/lib/site";

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

const environments = [
  "Industrial equipment",
  "Electromechanical assemblies",
  "Precision manufactured components",
];

const inputs = [
  "Supplier quotation or price notice",
  "Previous pricing",
  "Relevant agreement or purchasing record",
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={getHomeJsonLd()} />
      <Header />
      <main id="content" className="site-main">
        <HeroSection />

        <section className="section" aria-labelledby="problem-heading">
          <div className="container split">
            <div>
            <p className="kicker">Problem</p>
            <h2 id="problem-heading" className="heading">
              The price you agreed to isn&apos;t always the price you pay.
            </h2>
            <p className="lede">
              Supplier prices change. Contracts get revised. Surcharges
              persist. The differences can be difficult to trace—and costly to
              leave unresolved.
            </p>
            </div>
            <ul className="issues">
              {issues.map((issue) => (
                <li key={issue.title}>
                  <h3>{issue.title}</h3>
                  <p>{issue.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="approach"
          className="section section-method"
          aria-labelledby="approach-heading"
          tabIndex={-1}
        >
          <div id="diagnostic" className="alias-anchor" />
          <div className="container">
            <p className="kicker">Method</p>
            <h2 id="approach-heading" className="heading">
              From discrepancy to correction.
            </h2>
            <ol className="stages">
              {stages.map((stage) => (
                <li key={stage.index}>
                  <p className="stage-index">{stage.index}</p>
                  <h3 className="stage-title">{stage.title}</h3>
                  <p className="stage-body">{stage.body}</p>
                </li>
              ))}
            </ol>
            <div className="principle">
              <p className="kicker">Working principle</p>
              <div className="principle-lines">
                <p>Find the cost.</p>
                <p>Recover the value.</p>
                <p>Fix the system.</p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="example"
          className="section"
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

        <section id="fit" className="section" aria-labelledby="fit-heading">
          <div className="container">
            <p className="kicker">Fit</p>
            <h2 id="fit-heading" className="heading">
              Built for complex industrial purchasing.
            </h2>
            <p className="lede">
              For manufacturers managing multiple suppliers, changing prices,
              and purchasing records spread across systems.
            </p>
            <p className="kicker list-kicker">Purchasing environments</p>
            <ul className="env">
              {environments.map((environment) => (
                <li key={environment}>{environment}</li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="engagement"
          className="section"
          aria-labelledby="engagement-heading"
        >
          <div className="container split">
            <div>
              <p className="kicker">Engagement</p>
              <h2 id="engagement-heading" className="heading">
                Start with one supplier.
              </h2>
              <p className="lede">
                Bring a price increase, disputed charge, or purchasing
                discrepancy. We&apos;ll help establish the facts and define the
                next step.
              </p>
            </div>
            <div>
              <p className="kicker">Often enough to begin</p>
              <ul className="input-list">
                {inputs.map((input) => (
                  <li key={input}>{input}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section section-trust" aria-labelledby="trust-heading">
          <div className="container work-split">
            <figure className="work-photo">
              <Image
                src="/photos/inspection.jpg"
                alt="Hands measuring a machined aluminum component with a caliper."
                width={1152}
                height={864}
                sizes="(min-width: 800px) 46vw, 100vw"
                className="work-photo-img"
              />
              <figcaption className="photo-caption">
                Illustrative photograph of inspection work. Not a Kordran
                employee or customer.
              </figcaption>
            </figure>
            <div>
              <p className="kicker">Working model</p>
              <h2 id="trust-heading" className="statement">
                Direct analysis. Hands-on resolution.
              </h2>
              <p className="lede">
                We work alongside procurement and finance teams—from the
                initial finding through an approved corrective action.
              </p>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section section-contact"
          aria-labelledby="contact-heading"
          tabIndex={-1}
        >
          <div className="container contact-grid">
            <div className="contact-aside">
              <p className="kicker">Contact</p>
              <h2 id="contact-heading" className="heading">
                Have a supplier cost issue?
              </h2>
              <p className="lede">
                Tell us what changed. We&apos;ll determine whether Kordran is a
                fit.
              </p>
              <p className="contact-mail">
                <a className="inline-link" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
