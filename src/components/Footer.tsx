import Link from "next/link";
import Logo from "@/components/Logo";
import { contactEmail, linkedInUrl, xUrl } from "@/lib/site";

/**
 * Footer content. Over the painting it is transparent; on the legal pages it
 * stands alone on the deep ground.
 */
export default function Footer({ plain = false }: { plain?: boolean }) {
  return (
    <footer className={`site-footer${plain ? " is-plain" : ""}`}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo variant="full" surface="dark" className="logo" />
            <p>
              Finding supplier overbilling, and helping pursue the correction,
              for industrial manufacturers.
            </p>
          </div>

          <nav className="footer-col footer-site" aria-label="Footer">
            <p className="micro">Site</p>
            <Link href="/">Home</Link>
            <Link href="/approach">Approach</Link>
            <Link href="/#questions">Questions</Link>
            <Link href="/#contact">Contact</Link>
          </nav>

          <div className="footer-col footer-reach">
            <p className="micro">Reach us</p>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={xUrl} target="_blank" rel="noopener noreferrer">
              X
            </a>
          </div>
        </div>

        <div className="footer-legal">
          <p>
            © 2026 Kordran Inc. Not a law firm, customs broker, lender, or
            regulated financial institution.
          </p>
          <p>
            <Link href="/privacy">Privacy</Link>
            <span aria-hidden="true"> · </span>
            <Link href="/terms">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
