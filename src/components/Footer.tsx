import Link from "next/link";
import Logo from "@/components/Logo";
import { contactEmail, linkedInUrl, xUrl } from "@/lib/site";

export default function Footer({
  overlay = false,
}: {
  overlay?: boolean;
}) {
  return (
    <footer className={`site-footer${overlay ? " is-overlay" : ""}`}>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo
            variant="full"
            surface={overlay ? "dark" : "light"}
            className="logo"
          />
          <p>
            Supplier cost verification and resolution for industrial
            manufacturers.
          </p>
          <p>
            Kordran Inc. is not a law firm, customs broker, lender, or
            regulated financial institution.
          </p>
        </div>

        <div className="footer-contact">
          <a className="inline-link" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={xUrl} target="_blank" rel="noopener noreferrer">
            X
          </a>
        </div>

        <div className="footer-legal">
          <p>© 2026 Kordran Inc.</p>
          <p className="footer-nav">
            <Link href="/approach">Approach</Link>
            <span aria-hidden="true"> · </span>
            <Link href="/#contact">Contact</Link>
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
