import type { Metadata, Viewport } from "next";
import { Alexandria, SUSE } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import PortAscii from "@/components/PortAscii";
import { getHomeGraph } from "@/lib/jsonld";
import {
  defaultTitle,
  isIndexingEnabled,
  siteDescription,
  siteName,
  SITE_URL,
  titleTemplate,
} from "@/lib/site";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const suse = SUSE({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: titleTemplate,
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    url: "/",
    title: defaultTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteDescription,
  },
  robots: isIndexingEnabled
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  // verification: {
  //   google: "",
  //   other: { "msvalidate.01": "" },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${alexandria.variable} ${suse.variable} h-full`}
    >
      <body className="min-h-full bg-canvas font-sans text-ink-body antialiased">
        <PortAscii />
        <JsonLd data={getHomeGraph()} />
        {children}
      </body>
    </html>
  );
}
