import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Kordran Group, Inc.",
  alternates: {
    canonical: "/privacy",
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
      <main className="flex-1 pt-20">
        <div className="container legal-content section max-w-[900px]">
          <p className="label mb-6">
            <Link href="/" className="hover:underline">
              ← Kordran
            </Link>
          </p>
          <h1>Privacy</h1>
          <p>Last updated: July 30, 2026</p>
          <p>
            Kordran Group, Inc. (“Kordran,” “we,” “us”) respects the
            confidentiality of information shared through this website,
            particularly information concerning supply-chain cost, trade, and
            operating matters.
          </p>

          <h2>Information we collect</h2>
          <p>
            When you submit the contact form, we collect the details you
            provide, which may include your name, company, work email, a
            description of what is happening and the result you need, and
            optional context such as area of concern and timeline.
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
            <a href="mailto:contact@kordran.com" className="text-accent hover:underline">
              contact@kordran.com
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
