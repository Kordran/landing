import type { Metadata, Viewport } from "next";
import { Alexandria, SUSE } from "next/font/google";
import Script from "next/script";
import {
  defaultTitle,
  legalName,
  ogDescription,
  siteDescription,
  siteName,
  llmAlternates,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin"],
  display: "swap",
});

const suse = SUSE({
  variable: "--font-suse",
  subsets: ["latin"],
  display: "swap",
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const viewport: Viewport = {
  themeColor: "#F4F2ED",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: legalName, url: siteUrl }],
  creator: legalName,
  publisher: legalName,
  keywords: [
    "purchase order reconciliation",
    "customs entry reconciliation",
    "mill invoice audit",
    "alloy surcharge review",
    "scrap settlement audit",
    "precision manufacturing costs",
    "Baja California manufacturers",
    "Southern California machine shops",
  ],
  category: "business",
  alternates: {
    canonical: "/",
    types: llmAlternates,
  },
  openGraph: {
    title: defaultTitle,
    description: ogDescription,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kordran_",
    creator: "@kordran_",
    title: defaultTitle,
    description: ogDescription,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${alexandria.variable} ${suse.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        {children}
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
