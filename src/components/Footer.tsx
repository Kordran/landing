import Link from "next/link";
import Logo from "@/components/Logo";
import { contactEmail, linkedInUrl, xUrl } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-border py-14 md:py-16">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Logo variant="full" className="mb-5 h-8 w-auto" />
            <p className="max-w-sm text-[15px] leading-relaxed text-text-secondary">
              Supply-chain value recovery and execution for companies with
              complex hardware supply chains.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-text-secondary">
              Kordran Inc. is not a law firm or customs broker. Formal
              customs advice, legal interpretation, and regulated filings are
              handled or reviewed by appropriately qualified specialists.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3 text-[15px]">
            <a
              href={`mailto:${contactEmail}`}
              className="text-accent transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {contactEmail}
            </a>
            <div>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                LinkedIn
              </a>
            </div>
            <div>
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                X
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:text-right space-y-3 text-[14px] text-text-secondary">
            <p>© 2026 Kordran Inc.</p>
            <p className="space-x-3">
              <Link
                href="/privacy"
                className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Privacy
              </Link>
              <span>·</span>
              <Link
                href="/terms"
                className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Terms
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
