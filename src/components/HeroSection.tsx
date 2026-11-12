import Image from "next/image";
import TrackLink from "@/components/TrackLink";
import {
  example,
  formatUsd,
  illustrativeLabel,
  unitDelta,
} from "@/lib/example";

export default function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="kicker">Supplier cost intelligence + execution</p>
          <h1 id="hero-heading" className="display">
            Supplier costs.
            <br />
            Verified and resolved.
          </h1>
          <p className="lede">
            Kordran helps industrial manufacturers identify pricing
            discrepancies, resolve supplier issues, and prevent repeat charges.
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

        <div className="hero-panel">
          <figure className="hero-photo">
            <Image
              src="/photos/machined-housing.jpg"
              alt="Precision-machined aluminum block with a countersunk bore. Illustrative material photograph, not a customer part."
              width={864}
              height={1152}
              priority
              sizes="(min-width: 900px) 46vw, 100vw"
              className="hero-photo-img"
            />
          </figure>
        <figure className="sheet specimen specimen-joined">
          <figcaption className="specimen-mast">
            <span className="mark" aria-hidden="true" />
            {illustrativeLabel}
          </figcaption>
          <div className="specimen-grid">
            <div className="specimen-col">
              <p className="specimen-k">Agreement</p>
              <p className="specimen-ref">{example.agreementRef}</p>
              <p className="specimen-label">Unit price</p>
              <p className="num specimen-price">
                {formatUsd(example.agreedUnit, 2)}
              </p>
            </div>
            <div className="specimen-col">
              <p className="specimen-k">Invoice</p>
              <p className="specimen-ref">{example.invoiceRef}</p>
              <p className="specimen-label">Unit price</p>
              <p className="num specimen-price specimen-price-exception">
                {formatUsd(example.billedUnit, 2)}
              </p>
            </div>
          </div>
          <div className="specimen-delta">
            <span>Difference</span>
            <span className="num">
              {formatUsd(unitDelta, 2)}
              <span className="per">per unit</span>
            </span>
          </div>
        </figure>
        </div>
      </div>
    </section>
  );
}
