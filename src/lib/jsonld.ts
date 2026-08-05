import { logos } from "@/lib/logos";
import {
  contactEmail,
  legalName,
  linkedInUrl,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site";

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const webpageId = `${siteUrl}/#webpage`;
const serviceId = `${siteUrl}/#service`;

export function getHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        legalName,
        url: siteUrl,
        email: contactEmail,
        description: siteDescription,
        logo: `${siteUrl}${logos.fullColorLight}`,
        image: `${siteUrl}${logos.fullColorLight}`,
        sameAs: [linkedInUrl],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        publisher: { "@id": organizationId },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: siteUrl,
        name: "Kordran | Supply-Chain Value Recovery",
        description: siteDescription,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        primaryEntityOfPage: { "@id": serviceId },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: "Landed-Cost Recovery Diagnostic",
        url: `${siteUrl}/#diagnostic`,
        description:
          "A fixed-scope review that identifies credible recovery opportunities across supplier pricing, freight, duties, tariffs, and import operations, estimates exposure, evaluates supporting evidence, and defines the action required to pursue them.",
        provider: { "@id": organizationId },
        areaServed: "Worldwide",
        serviceType: "Supply-chain value recovery",
      },
    ],
  };
}
