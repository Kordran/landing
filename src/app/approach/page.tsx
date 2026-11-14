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
  approachDescription,
  approachTitle,
  llmAlternates,
} from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${approachTitle} | Kordran` },
  description: approachDescription,
  alternates: {
    canonical: "/approach",
    types: llmAlternates,
  },
  openGraph: {
    title: approachTitle,
    description: approachDescription,
    url: "/approach",
  },
};

const figures = [
  {
    title: "The records",
    body: "Agreements, orders, invoices, and the operational facts, still in separate piles.",
    scene: recordsScene,
  },
  {
    title: "The difference",
    body: "Brought onto one surface, so the commercial gap can be measured.",
    scene: reconcileScene,
  },
  {
    title: "The correction",
    body: "The approved change, carried through until the next transaction shows it.",
    scene: resolveScene,
  },
];

const stages = [
  {
    index: "01",
    title: "Mandate",
    body: "What Kordran is responsible for, what is out of scope, who can approve a commercial action, and what done looks like.",
  },
  {
    index: "02",
    title: "Fact base",
    body: "The agreements, transactions, operational constraints, and financial exposure that actually govern the decision.",
  },
  {
    index: "03",
    title: "Decision",
    body: "The alternatives, what each one costs, the risks, and a recommendation the person with authority can act on. Sometimes the evidence supports doing nothing.",
  },
  {
    index: "04",
    title: "Execution",
    body: "Who has to act, which dependencies matter, and where the work escalates. Kordran tracks it and prepares the commercial response.",
  },
  {
    index: "05",
    title: "Implementation",
    body: "The change has to land in the supplier arrangement, the purchasing record, the operating process, or the financial result. A signed note is not the finish.",
  },
  {
    index: "06",
    title: "Verification",
    body: "What value was realized, what remains open, and which control has to stay in place so the same issue does not return unnoticed.",
  },
];

export default function ApproachPage() {
  return (
    <>
      <JsonLd data={getApproachJsonLd()} />
      <Header />
      <main id="content" className="site-main">
        <section className="section approach-hero" aria-labelledby="approach-heading">
          <div className="container">
            <p className="label">
              <span className="mark" aria-hidden="true" />
              How we work
            </p>
            <h1 id="approach-heading" className="display">
              From commercial problem to executed result.
            </h1>
            <p className="lede approach-lede">
              Kordran is engaged to move a defined commercial issue from
              uncertainty to a controlled outcome. The deliverable is not a
              presentation. It is a documented result, or a clear decision that
              stops further waste.
            </p>
            <div className="cta-row">
              <TrackLink
                href="/#contact"
                className="btn"
                event="cta_click"
                eventParams={{ location: "approach-hero", target: "contact" }}
              >
                Discuss a commercial issue
                <span className="btn-glyph" aria-hidden="true" />
              </TrackLink>
            </div>
          </div>
        </section>

        <section className="section section-sheet" aria-labelledby="path-heading">
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">01</span>
                  The path
                </p>
                <h2 id="path-heading" className="heading">
                  Six things every engagement has to make clear.
                </h2>
              </div>
              <p className="lede">
                Your team keeps supplier relationships and final commercial
                authority. Kordran is accountable for the contracted work, the
                coordination, and the follow-through.
              </p>
            </Reveal>
            <ol className="work-grid">
              {stages.map((stage) => (
                <li className="work-item" key={stage.title}>
                  <p className="label">
                    <span className="label-index">{stage.index}</span>
                  </p>
                  <h3 className="title">{stage.title}</h3>
                  <p className="body">{stage.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" aria-labelledby="scenario-heading">
          <div className="container">
            <Reveal className="head-split">
              <div>
                <p className="label">
                  <span className="label-index">02</span>
                  An illustration
                </p>
                <h2 id="scenario-heading" className="heading">
                  A supplier proposes a 12% price increase.
                </h2>
              </div>
              <p className="lede">
                Not a Kordran client result. One way a commercial issue is
                sized before anyone agrees to act.
              </p>
            </Reveal>
            <div className="scenario">
              <dl className="scenario-figures">
                <div>
                  <dt className="micro">Annual supplier spend</dt>
                  <dd className="num">$4.0M</dd>
                </div>
                <div>
                  <dt className="micro">Proposed increase</dt>
                  <dd className="num is-over">12%</dd>
                </div>
                <div>
                  <dt className="micro">Proposed annual impact</dt>
                  <dd className="num is-over">$480k</dd>
                </div>
              </dl>
              <p className="body">
                Kordran reviews the supplier&apos;s justification, the agreed
                pricing mechanism, the parts affected, the production
                requirement, and the alternatives. Working with the people
                authorized to decide, it supports a negotiated response.
              </p>
              <p className="body">
                If the implemented increase is held to 5% on unchanged volume,
                the illustrative annual cost avoided is $280,000. That figure
                holds only if the 5% agreement is implemented, volume and scope
                stay comparable, and later transactions confirm the price.
                It is not a historical refund, and it is not a guaranteed
                outcome.
              </p>
            </div>
            <figure className="stages-figure">
              <ol>
                {figures.map((figure) => (
                  <li key={figure.title}>
                    <div className="stages-art">
                      <Axo scene={figure.scene} />
                    </div>
                    <div>
                      <h3 className="title">{figure.title}</h3>
                      <p className="body">{figure.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </figure>
            <div className="evidence-block">
              <Reveal className="head-split">
                <div>
                  <p className="label">
                    <span className="label-index">03</span>
                    Evidence
                  </p>
                  <h2 className="heading">The records behind a pricing question.</h2>
                </div>
                <p className="lede">
                  Point at a record. Each one establishes a different fact.
                </p>
              </Reveal>
              <EvidenceStack scene={evidenceScene} records={evidenceRecords} />
            </div>
            <p className="section-link">
              <TrackLink
                href="/supplier-pricing"
                className="text-action"
                event="cta_click"
                eventParams={{ location: "approach", target: "supplier-pricing" }}
              >
                See the invoice illustration
              </TrackLink>
            </p>
          </div>
        </section>

        <CloseScene />
      </main>
    </>
  );
}
