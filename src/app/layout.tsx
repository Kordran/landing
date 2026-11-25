import type { Metadata, Viewport } from "next";
import { Alexandria, SUSE } from "next/font/google";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const suse = SUSE({
  variable: "--font-suse",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
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
        {children}
      </body>
    </html>
  );
}
