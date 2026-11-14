import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import { llmAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Kordran Inc.",
  alternates: {
    canonical: "/privacy",
    types: llmAlternates,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="content" className="site-main">
        <div className="container legal-content">
          <nav className="label legal-back" aria-label="Site">
            <Link href="/">Home</Link>
            <Link href="/approach">Approach</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
          <h1>Privacy</h1>
          <p>Last updated: November 13, 2026</p>
          <p>
            Kordran Inc. (“Kordran,” “we,” “us”) investigates supplier
            invoices against agreements for industrial manufacturers. This
            policy describes information shared through this website, including
            notes about supplier pricing.
          </p>

          <h2>Information we collect</h2>
          <p>
            The inquiry form asks for your name, company, and work email, plus
            a short description of what you are seeing. A supplier name is
            optional. We ask for agreements, invoices, and other records only
            after we reply, and only if you choose to continue.
          </p>
          <p>
            We may also collect basic technical data such as browser type,
            device information, and pages visited if analytics are enabled.
          </p>

          <h2>How we use information</h2>
          <ul>
            <li>To review and respond to inquiries</li>
            <li>To communicate directly regarding potential engagements</li>
            <li>To operate, secure, and improve this website</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>Confidentiality</h2>
          <p>
            Information submitted through the contact form is treated as
            confidential business information and is reviewed only by Kordran
            personnel involved in evaluating or responding to the inquiry.
          </p>

          <h2>Sharing</h2>
          <p>
            We do not sell personal information. We may share information with
            service providers who assist in operating our website or
            communications systems, subject to appropriate confidentiality
            obligations, or when required by law.
          </p>

          <h2>Retention</h2>
          <p>
            We retain inquiry information for as long as needed to evaluate and
            respond to the matter, maintain professional records, or meet legal
            requirements.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy questions, contact{" "}
            <a href="mailto:contact@kordran.com" className="inline-link">
              contact@kordran.com
            </a>
            .
          </p>
        </div>
      </main>
      <Footer plain />
    </>
  );
}
