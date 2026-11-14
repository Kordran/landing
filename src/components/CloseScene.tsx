import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

/**
 * The page ends on the Industrial Wash painting. It is the one expressive
 * illustration on the site: it rises out of the paper, carries the working
 * principle, and deepens into the footer.
 */
export default function CloseScene() {
  return (
    <section className="close" aria-labelledby="close-heading">
      <Reveal className="container close-statement">
        <p className="label">
          <span className="mark" aria-hidden="true" />
          Working principle
        </p>
        <h2 id="close-heading" className="display">
          Find the cost.
          <br />
          Recover the value.
          <br />
          Fix the system.
        </h2>
      </Reveal>
      <div className="close-art" aria-hidden="true">
        <picture>
          <source
            type="image/webp"
            srcSet="/scenes/works-768.webp 768w, /scenes/works-1280.webp 1280w, /scenes/works-1672.webp 1672w"
            sizes="(max-width: 639px) 230vw, (max-width: 899px) 135vw, 100vw"
          />
          <img
            src="/scenes/works.jpg"
            alt=""
            width={1672}
            height={941}
            decoding="async"
            loading="lazy"
          />
        </picture>
      </div>
      <Footer />
    </section>
  );
}
