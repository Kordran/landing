import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <HeroSection />

        {/* 2. Why the problem exists */}
        <section className="section border-b border-border">
          <div className="container">
            <Reveal>
              <div className="grid gap-14 md:grid-cols-2 md:gap-x-16 lg:gap-x-24">
                <div>
                  <h2 className="text-heading max-w-[18ch] text-text">
                    Supply-chain cost rarely arrives with a clean explanation.
                  </h2>
                  <p className="text-body mt-10 text-text-secondary md:mt-12">
                    A supplier price increase may combine materials, freight,
                    duties, volume, and commercial assumptions. Customs treatment
                    may vary across brokers or entries. Potential recoveries may
                    depend on records held separately by finance, supply chain,
                    logistics, trade, and engineering.
                  </p>
                </div>
                <div className="md:pt-1">
                  <br/>
                  <p className="text-statement statement-rule max-w-[22ch] text-text mt-48">
                    Each function holds part of the evidence. No one owns the
                    complete economic problem.
                  </p>
                  <p className="text-body mt-10 text-text-secondary">
                    Kordran connects the records, determines what the evidence
                    supports, and drives the issue through resolution.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3. Diagnostic */}
        <section id="diagnostic" className="section border-b border-border">
          <div className="container">
            <Reveal className="grid gap-14 grid-cols-2 md:gap-x-16 lg:gap-x-24">
              <h2 className="col-span-1 text-heading max-w-[16ch] text-text">
                Landed-Cost Recovery Diagnostic
              </h2>
              <div className="col-span-1 text-body max-w-2xl space-y-6 text-text-secondary">
                <p>
                  A fixed-scope review of purchasing, supplier, import, and
                  logistics activity. It identifies credible recovery
                  opportunities, estimates the exposure, evaluates the
                  supporting evidence, and defines the action required to
                  pursue them.
                </p>
                <p>
                  A typical review covers one legal entity, up to twelve months
                  of activity, and a defined group of suppliers, parts,
                  freight lanes, or import categories. Work generally takes
                  two to four weeks after the required records and stakeholder
                  access are available.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4. Recovery + contact */}
        <section id="contact" className="section">
          <div className="container">
            <Reveal className="editorial-block text-center max-w-4xl mx-auto">
              <h2 className="text-heading text-text text-center">
                Identifying the opportunity is only the beginning.
              </h2>
              <div className="text-body mt-10 space-y-6 text-text-secondary">
                <p>
                  Kordran can remain through validation and recovery: resolving
                  data gaps, coordinating internal stakeholders, working with
                  suppliers and brokers, preparing commercial claims, escalating
                  decisions, and implementing approved corrections.
                </p>
                <p>
                  Where the underlying issue is systemic, we strengthen the
                  controls connecting parts, purchasing, suppliers, brokers,
                  imports, logistics activity, and financial reporting.
                </p>
                <p>
                  Best suited to businesses with meaningful supplier, freight,
                  duty, or import spend and enough transaction complexity that
                  the answer cannot be found in one system.
                </p>
              </div>
            </Reveal>

            <div className="mt-20 grid items-start gap-14 border-t border-border pt-16 md:mt-28 md:grid-cols-12 md:gap-x-16 md:pt-20">
              <Reveal className="md:col-span-5">
                <h2 className="text-heading statement-rule text-text">
                  Bring us the problem.
                </h2>
                <div className="text-body mt-8 space-y-5 text-text-secondary">
                  <p>
                    You do not need to know the exact cause. Tell us what
                    changed, where the cost is appearing, what has already been
                    attempted, and what result the business needs.
                  </p>
                  <p>
                    Submitted information is reviewed confidentially to
                    determine whether the situation fits Kordran&apos;s scope.
                  </p>
                </div>
                <p className="mt-12 font-mono text-[12px] tracking-[0.08em] text-text-secondary uppercase">
                  Confidential initial discussion
                </p>
              </Reveal>

              <div id="contact-form" className="md:col-span-7">
                <Reveal delay={150}>
                  <ContactForm />
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
