import type { Metadata } from "next";
import { Inter_Tight, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});



export const metadata: Metadata = {
  title: "Kordran - Supply-Chain Value Recovery",
  description:
    "Kordran identifies and pursues avoidable cost across supplier pricing, freight, duties, tariffs, and import operations for companies with complex hardware supply chains.",
  metadataBase: new URL("https://kordran.com"),
  openGraph: {
    title: "Kordran - Supply-Chain Value Recovery",
    description:
      "Find the cost. Recover the value. Fix the system. Landed-cost recovery for complex hardware supply chains.",
    type: "website",
    locale: "en_US",
    siteName: "Kordran",
  },
  robots: {
    index: true,
    follow: true,
  },
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
      className={`${interTight.variable} ${ibmPlexMono.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text antialiased">
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
