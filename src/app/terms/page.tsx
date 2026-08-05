import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the Kordran website.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
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
          <h1>Terms</h1>
          <p>Last updated: July 30, 2026</p>
          <p>
            By using this website, you agree to these terms of use. This site is
            operated by Kordran Inc. (“Kordran”).
          </p>

          <h2>Purpose of the site</h2>
          <p>
            This website provides general information about Kordran’s
            supply-chain value recovery and execution work. Nothing on this site
            constitutes an offer of services, a commitment to engage, legal
            advice, or a guarantee of outcomes.
          </p>

          <h2>No customer relationship</h2>
          <p>
            Submitting a form or contacting Kordran does not establish a
            customer, advisory, or fiduciary relationship. Any engagement is
            established only through a separate written agreement.
          </p>

          <h2>Confidential discussions</h2>
          <p>
            Initial situation discussions are intended to be confidential.
            However, do not submit information you are not authorized to share,
            including third-party trade secrets or materials restricted by
            contract or law.
          </p>

          <h2>Intellectual property</h2>
          <p>
            Site content, branding, and materials are owned by Kordran or its
            licensors and may not be copied or used for commercial purposes
            without prior written consent.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Kordran is not liable for
            damages arising from use of this website or reliance on its
            contents. The site is provided on an “as is” basis.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the State of California,
            without regard to conflict-of-law principles.
          </p>

          <h2>Contact</h2>
          <p>
            Questions regarding these terms may be sent to{" "}
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
