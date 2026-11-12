import { logos } from "@/lib/logos";
import {
  contactEmail,
  defaultTitle,
  legalName,
  linkedInUrl,
  siteDescription,
  siteName,
  siteUrl,
  xUrl,
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
        sameAs: [linkedInUrl, xUrl],
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
        name: defaultTitle,
        description: siteDescription,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        primaryEntityOfPage: { "@id": serviceId },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: "Supplier cost verification and resolution",
        url: siteUrl,
        description: siteDescription,
        provider: { "@id": organizationId },
        serviceType: "Supplier pricing integrity",
      },
    ],
  };
}
