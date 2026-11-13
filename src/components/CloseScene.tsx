import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function CloseScene() {
  return (
    <section
      className="scene scene-close"
      data-header="on-dark"
      aria-labelledby="close-heading"
    >
      <div className="scene-motion">
        {/* The file is already the full painting. Skipping the optimizer avoids a smaller derivative. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="scene-bg"
          src="/scenes/works.jpg"
          alt=""
          width={1672}
          height={941}
          decoding="async"
          loading="lazy"
          aria-hidden="true"
        />
      </div>
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
  );
}
