import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

const calledWhen = [
  "A critical supplier is missing commitments.",
  "A production or sourcing transition has stalled.",
  "Costs have increased without a credible explanation.",
  "The issue crosses procurement, engineering, quality, logistics, trade, and finance.",
  "The normal organization cannot close the problem.",
  "The cost of delay is increasing.",
];

const mandates = [
  {
    number: "01",
    title: "Supplier Recovery",
    lead: "Restore delivery, quality, capacity, and commercial control at critical suppliers.",
    detail:
      "Kordran works directly with the supplier, identifies the true constraint, establishes a recovery plan, and develops alternate capacity where required.",
  },
  {
    number: "02",
    title: "Production Relocation",
    lead: "Move production across suppliers, regions, and borders.",
    detail:
      "Kordran identifies alternatives, assesses facilities, negotiates terms, manages qualification, and stabilizes initial production.",
  },
  {
    number: "03",
    title: "Landed-Cost Recovery",
    lead: "Resolve leakage across supplier pricing, materials, freight, duties, and transaction data.",
    detail:
      "Kordran reconstructs the economics, challenges unsupported costs, coordinates recoveries, and installs lasting controls.",
  },
  {
    number: "04",
    title: "Operational Stabilization",
    lead: "Restore control in failed ramps, plant transfers, acquisitions, inventory crises, and other industrial special situations.",
    detail: null,
  },
];

const stages = [
  {
    number: "01",
    title: "Establish the facts",
    copy: "We reconstruct the actual technical, operational, and commercial situation—not merely what existing systems report.",
  },
  {
    number: "02",
    title: "Go to the source",
    copy: "We work directly with the supplier, facility, warehouse, logistics operation, or border where the issue originates.",
  },
  {
    number: "03",
    title: "Execute the solution",
    copy: "We negotiate, source, qualify, coordinate, and implement. Recommendations are incomplete until the operation changes.",
  },
  {
    number: "04",
    title: "Build lasting control",
    copy: "We install the ownership, systems, and operating cadence required to prevent recurrence.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* 1. HERO */}
        <section className="border-b border-border">
          <div className="container py-24 md:py-32 lg:py-40">
            <p className="label mb-8">Industrial special situations</p>
            <h1 className="max-w-[14ch] text-[48px] font-medium leading-[0.98] tracking-[-0.04em] text-text sm:text-[64px] lg:text-[84px]">
              Critical industrial problems, solved at the source.
            </h1>
            <div className="mt-10 max-w-2xl space-y-5 text-[18px] leading-[1.55] text-text-secondary md:text-[19px]">
              <p>
                Kordran deploys hands-on operating teams to resolve critical
                supplier failures, production transitions, landed-cost problems,
                and industrial disruptions.
              </p>
              <p>
                We establish the facts, go directly to the source, and remain
                accountable through execution.
              </p>
            </div>
            <a href="#discuss" className="cta-link mt-10 text-[16px]">
              Discuss a situation →
            </a>
          </div>
        </section>

        {/* 2. WHEN TO CALL */}
        <section className="section border-b border-border">
          <div className="container">
            <Reveal>
              <div className="grid gap-10 md:grid-cols-12">
                <div className="md:col-span-4">
                  <p className="section-label !mb-0">Kordran is called when</p>
                </div>
                <ul className="md:col-span-8">
                  {calledWhen.map((item) => (
                    <li
                      key={item}
                      className="border-t border-border py-5 text-[18px] leading-snug text-text md:text-[20px] last:border-b"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3. MANDATES */}
        <section id="mandates" className="section border-b border-border">
          <div className="container">
            <Reveal>
              <p className="section-label">Mandates</p>
            </Reveal>

            <div className="mt-4 border-t border-border">
              {mandates.map((mandate) => (
                <Reveal
                  key={mandate.number}
                  as="article"
                  className="grid gap-6 border-b border-border py-10 transition-colors duration-200 hover:bg-hover-gray md:grid-cols-12 md:gap-10 md:py-12"
                >
                  <div className="md:col-span-4">
                    <p className="font-mono text-[12px] tracking-[0.08em] text-accent">
                      {mandate.number}
                    </p>
                    <h2 className="mt-4 text-[24px] font-medium tracking-[-0.02em] uppercase sm:text-[28px]">
                      {mandate.title}
                    </h2>
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <p className="text-[18px] leading-[1.5] text-text md:text-[20px]">
                      {mandate.lead}
                    </p>
                    {mandate.detail ? (
                      <p className="text-[17px] leading-[1.55] text-text-secondary md:text-[18px]">
                        {mandate.detail}
                      </p>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. HOW KORDRAN WORKS */}
        <section id="approach" className="dark-section bg-dark text-white">
          <div className="container section">
            <Reveal>
              <p className="section-label">How Kordran works</p>
            </Reveal>

            <div className="mt-6 border-t border-[#2c3236]">
              {stages.map((stage) => (
                <Reveal
                  key={stage.number}
                  className="grid gap-4 border-b border-[#2c3236] py-8 md:grid-cols-12 md:gap-10 md:py-10"
                >
                  <div className="md:col-span-4">
                    <p className="font-mono text-[13px] tracking-[0.06em] text-[#9bb0c0]">
                      {stage.number} — {stage.title}
                    </p>
                  </div>
                  <p className="md:col-span-8 text-[17px] leading-[1.55] text-[#c8ccd0] md:text-[18px]">
                    {stage.copy}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CLOSING CTA */}
        <section id="discuss" className="section">
          <div className="container">
            <Reveal>
              <div className="mb-20 max-w-3xl border-b border-border pb-16 md:mb-24 md:pb-20">
                <h2 className="text-[36px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
                  One team owns the complete problem.
                </h2>
                <div className="mt-10 space-y-4 text-[18px] leading-[1.55] text-text-secondary md:text-[19px]">
                  <p>Software identifies exceptions.</p>
                  <p>Specialists handle individual functions.</p>
                  <p>Internal teams own separate pieces.</p>
                  <p className="pt-2 text-text">
                    Kordran connects the full operating chain and remains
                    accountable for the defined outcome.
                  </p>
                </div>
                <p className="mt-10 text-[18px] font-medium tracking-[-0.01em] text-text md:text-[20px]">
                  One team. One mandate. One accountable outcome.
                </p>
              </div>

              <div className="grid gap-12 md:grid-cols-12 md:gap-14">
                <div className="md:col-span-5">
                  <h2 className="max-w-[14ch] text-[36px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[48px]">
                    When the cost of delay is increasing, the problem needs an
                    owner.
                  </h2>
                  <p className="mt-8 max-w-md text-[18px] leading-[1.55] text-text-secondary">
                    Tell us what is happening, what has already been tried, and
                    what happens if the situation remains unresolved.
                  </p>
                  <a href="#contact-form" className="cta-link mt-8 text-[16px]">
                    Discuss a situation →
                  </a>
                  <div className="mt-10 space-y-3">
                    <p className="font-mono text-[12px] tracking-[0.08em] text-text-secondary uppercase">
                      Confidential initial discussion
                    </p>
                    <p className="font-mono text-[12px] tracking-[0.06em] text-text-secondary uppercase">
                      Southern California · Baja California · North America
                    </p>
                  </div>
                </div>

                <div id="contact-form" className="md:col-span-7">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
