import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

const mandates = [
  {
    number: "01",
    title: "Supplier Recovery",
    description:
      "Restore delivery, quality, capacity, and commercial control at critical suppliers. Develop alternate capacity where required.",
    outcome: "Stable production and accountable supply.",
  },
  {
    number: "02",
    title: "Production Relocation",
    description:
      "Identify, qualify, and stabilize alternate production across suppliers, regions, and borders.",
    outcome: "Qualified capacity that can hold the line.",
  },
  {
    number: "03",
    title: "Landed-Cost Recovery",
    description:
      "Resolve leakage across supplier pricing, materials, freight, duties, and transaction data.",
    outcome: "Recovered cost with a defensible commercial base.",
  },
  {
    number: "04",
    title: "Operational Stabilization",
    description:
      "Restore control in failed ramps, plant transfers, acquisitions, inventory crises, and other industrial special situations.",
    outcome: "One accountable operating rhythm restored.",
  },
];

const stages = [
  {
    number: "01",
    title: "Establish the facts",
    copy: "Reconstruct the actual technical, operational, and commercial situation—not merely what existing systems report.",
  },
  {
    number: "02",
    title: "Go to the source",
    copy: "Work directly with the supplier, facility, warehouse, border operation, or logistics node where the issue originates.",
  },
  {
    number: "03",
    title: "Execute",
    copy: "Negotiate, source, qualify, coordinate, and implement. Recommendations are incomplete until the operation changes.",
  },
  {
    number: "04",
    title: "Build control",
    copy: "Install the systems, ownership, and operating cadence required to prevent recurrence.",
  },
];

const comparisons = [
  {
    alternative: "Software identifies the issue",
    kordran: "Kordran executes the response",
  },
  {
    alternative: "Consultants recommend action",
    kordran: "Kordran remains through implementation",
  },
  {
    alternative: "Brokers manage one transaction",
    kordran: "Kordran connects the full operating chain",
  },
  {
    alternative: "Internal teams own separate functions",
    kordran: "Kordran owns the defined cross-functional outcome",
  },
  {
    alternative: "Large firms deploy large teams",
    kordran: "Kordran deploys a concentrated senior team",
  },
];

const calledWhen = [
  "A critical supplier is failing.",
  "A production transfer has stalled.",
  "Costs have increased without a credible explanation.",
  "The problem crosses procurement, engineering, quality, logistics, trade, and finance.",
  "The cost of delay is increasing.",
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* HERO */}
        <section className="border-b border-border">
          <div className="container grid gap-12 py-20 md:grid-cols-12 md:gap-10 md:py-28 lg:py-32">
            <div className="md:col-span-7">
              <p className="label mb-8">Industrial special situations</p>
              <h1 className="max-w-[11ch] text-[48px] font-medium leading-[0.98] tracking-[-0.04em] text-text sm:text-[64px] lg:text-[84px]">
                Critical industrial problems, solved at the source.
              </h1>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <a href="#discuss" className="cta-link text-[16px]">
                  Discuss a situation →
                </a>
                <a
                  href="#mandates"
                  className="text-[15px] text-text-secondary transition-colors hover:text-accent"
                >
                  View our mandates
                </a>
              </div>
            </div>

            <div className="md:col-span-5 md:border-l md:border-border md:pl-10 lg:pl-14">
              <p className="mb-10 max-w-md text-[18px] leading-[1.55] text-text-secondary md:text-[19px]">
                Kordran deploys hands-on operating teams to resolve critical
                supplier failures, production transitions, landed-cost problems,
                and industrial disruptions—from diagnosis through execution.
              </p>
              <p className="label mb-6">Kordran is called when</p>
              <ul className="space-y-4">
                {calledWhen.map((item) => (
                  <li
                    key={item}
                    className="border-t border-border pt-4 text-[16px] leading-snug text-text"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PROOF BAR */}
        <section className="border-b border-border">
          <div className="container">
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
              {[
                "Supplier Recovery",
                "Production Relocation",
                "Landed-Cost Recovery",
                "Operational Stabilization",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-center px-4 py-5 text-center font-mono text-[11px] tracking-[0.08em] text-text-secondary uppercase sm:text-[12px]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="section">
          <div className="container">
            <Reveal>
              <p className="section-label">01 — The problem</p>
              <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-5">
                  <h2 className="max-w-[14ch] text-[36px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
                    The most expensive industrial failures live between
                    functions.
                  </h2>
                </div>
                <div className="md:col-span-7 space-y-6 text-[18px] leading-[1.55] text-text-secondary md:text-[19px]">
                  <p>
                    Procurement owns the supplier. Engineering owns the
                    specification. Quality owns qualification. Logistics owns
                    movement. Finance sees the cost. Trade manages the border.
                  </p>
                  <p>
                    When the problem crosses all of them, responsibility
                    fragments and the issue remains unresolved.
                  </p>
                  <p className="text-text">
                    Kordran provides one operating team with one mandate and one
                    accountable outcome.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-16 border border-border p-8 md:mt-20 md:p-12">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 font-mono text-[11px] tracking-[0.06em] text-text uppercase sm:text-[12px] md:gap-x-4">
                {[
                  "Supplier",
                  "Engineering",
                  "Quality",
                  "Logistics",
                  "Trade",
                  "Finance",
                ].map((item, index, arr) => (
                  <span key={item} className="inline-flex items-center gap-3 md:gap-4">
                    <span>{item}</span>
                    {index < arr.length - 1 ? (
                      <span className="text-border" aria-hidden>
                        →
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col items-center gap-3 text-center">
                <span className="text-border" aria-hidden>
                  ↓
                </span>
                <p className="font-mono text-[12px] tracking-[0.08em] text-text-secondary uppercase">
                  No single owner
                </p>
                <span className="text-border" aria-hidden>
                  ↓
                </span>
                <p className="font-mono text-[13px] tracking-[0.12em] text-accent uppercase">
                  Kordran
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* MANDATES */}
        <section id="mandates" className="section border-t border-border">
          <div className="container">
            <Reveal>
              <p className="section-label">02 — Mandates</p>
              <h2 className="max-w-4xl text-[36px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
                We enter when the problem is material, cross-functional, and
                difficult to close internally.
              </h2>
            </Reveal>

            <div className="mt-14 grid border border-border md:mt-16 md:grid-cols-2">
              {mandates.map((mandate, index) => {
                const borderClasses = [
                  index === 0 ? "border-b md:border-r" : "",
                  index === 1 ? "border-b" : "",
                  index === 2 ? "border-b md:border-b-0 md:border-r" : "",
                  index === 3 ? "" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                <Reveal
                  key={mandate.number}
                  as="article"
                  className={`group border-border p-8 transition-colors duration-200 hover:bg-hover-gray md:p-9 ${borderClasses}`}
                >
                  <p className="font-mono text-[12px] tracking-[0.08em] text-accent">
                    {mandate.number}
                  </p>
                  <h3 className="mt-5 text-[24px] font-medium tracking-[-0.02em] uppercase sm:text-[26px]">
                    {mandate.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[17px] leading-[1.5] text-text-secondary">
                    {mandate.description}
                  </p>
                  <div className="mt-8 border-t border-border pt-5">
                    <p className="font-mono text-[11px] tracking-[0.08em] text-text-secondary uppercase">
                      Outcome
                    </p>
                    <p className="mt-2 text-[16px] text-text">{mandate.outcome}</p>
                  </div>
                </Reveal>
              );
              })}
            </div>
          </div>
        </section>

        {/* APPROACH */}
        <section id="approach" className="dark-section bg-dark text-white">
          <div className="container section">
            <Reveal>
              <p className="section-label">03 — How Kordran works</p>
              <h2 className="max-w-4xl text-[36px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
                Establish the facts. Go to the source. Execute the solution.
                Build lasting control.
              </h2>
            </Reveal>

            <div className="mt-14 border border-[#2c3236] md:mt-16">
              {stages.map((stage, index) => (
                <Reveal
                  key={stage.number}
                  className={`grid gap-4 px-6 py-8 md:grid-cols-12 md:gap-8 md:px-10 md:py-10 ${
                    index < stages.length - 1 ? "border-b border-[#2c3236]" : ""
                  }`}
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

        {/* WHY KORDRAN */}
        <section id="why" className="section">
          <div className="container">
            <Reveal>
              <p className="section-label">04 — Why Kordran</p>
              <h2 className="max-w-3xl text-[36px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
                One team owns the complete problem.
              </h2>
            </Reveal>

            <Reveal className="mt-14 overflow-hidden border border-border md:mt-16">
              <div className="hidden grid-cols-2 border-b border-border bg-hover-gray md:grid">
                <div className="border-r border-border px-8 py-4 font-mono text-[12px] tracking-[0.06em] text-text-secondary uppercase">
                  Typical alternative
                </div>
                <div className="px-8 py-4 font-mono text-[12px] tracking-[0.06em] text-accent uppercase">
                  Kordran
                </div>
              </div>
              {comparisons.map((row, index) => (
                <div
                  key={row.alternative}
                  className={`grid md:grid-cols-2 ${
                    index < comparisons.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="border-b border-border px-6 py-6 md:border-b-0 md:border-r md:px-8 md:py-7">
                    <p className="mb-2 font-mono text-[11px] tracking-[0.06em] text-text-secondary uppercase md:hidden">
                      Typical alternative
                    </p>
                    <p className="text-[17px] leading-snug text-text-secondary md:text-[18px]">
                      {row.alternative}
                    </p>
                  </div>
                  <div className="px-6 py-6 md:px-8 md:py-7">
                    <p className="mb-2 font-mono text-[11px] tracking-[0.06em] text-accent uppercase md:hidden">
                      Kordran
                    </p>
                    <p className="text-[17px] leading-snug text-text md:text-[18px]">
                      {row.kordran}
                    </p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* FINAL CTA + FORM */}
        <section id="discuss" className="section border-t border-border">
          <div className="container">
            <Reveal>
              <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-6">
                  <h2 className="max-w-[16ch] text-[36px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
                    When the cost of delay is increasing, the problem needs an
                    owner.
                  </h2>
                  <p className="mt-8 max-w-lg text-[18px] leading-[1.55] text-text-secondary md:text-[19px]">
                    Tell us what is failing, what has already been tried, and
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

                <div id="contact-form" className="md:col-span-6">
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
