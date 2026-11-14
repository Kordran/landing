import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExampleSeen from "@/components/ExampleSeen";
import ExposureCalculator from "@/components/ExposureCalculator";
import LineProfile from "@/components/figures/LineProfile";
import { llmAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Supplier pricing illustration",
  description:
    "A hypothetical supplier pricing example. Not a Kordran client result. One part, billed above the agreed price, and what a correction changes afterward.",
  alternates: {
    canonical: "/supplier-pricing",
    types: llmAlternates,
  },
  robots: { index: true, follow: true },
};

export default function SupplierPricingPage() {
  return (
    <>
      <Header />
      <main id="content" className="site-main">
        <section className="section" aria-labelledby="pricing-heading">
          <div className="container">
            <p className="label">
              <span className="mark" aria-hidden="true" />
              One capability
            </p>
            <h1 id="pricing-heading" className="heading">
              Supplier pricing, illustrated.
            </h1>
            <p className="lede">
              Not a client result. One machined part, billed above the agreed
              price, used to show how a historical difference and the cost
              avoided afterward can be read. Change the figures if you want.
              Nothing here is a recovery Kordran has delivered.
            </p>
            <div className="pricing-stage">
              <ExampleSeen>
                <ExposureCalculator />
              </ExampleSeen>
            </div>
          </div>
        </section>
        <section className="section section-deep" aria-labelledby="trail-heading">
          <div className="container">
            <p className="label">
              <span className="label-index">02</span>
              The same example, over time
            </p>
            <h2 id="trail-heading" className="heading">
              Extra cost, then the recovery, then the savings.
            </h2>
            <LineProfile />
          </div>
        </section>
      </main>
      <Footer plain />
    </>
  );
}
