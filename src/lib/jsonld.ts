import { questions } from "@/lib/faq";
import { logos } from "@/lib/logos";
import {
  approachDescription,
  approachTitle,
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

const knowsAbout = [
  "Supplier overbilling",
  "Invoice and contract price reconciliation",
  "Purchase price variance",
  "Supplier price increases",
  "Contractual surcharge review",
  "Industrial procurement cost recovery",
];

function organization() {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: siteName,
    legalName,
    url: siteUrl,
    email: contactEmail,
    description: siteDescription,
    logo: `${siteUrl}${logos.fullColorLight}`,
    image: `${siteUrl}/opengraph-image`,
    sameAs: [linkedInUrl, xUrl],
    knowsAbout,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: contactEmail,
      url: `${siteUrl}/#contact`,
      availableLanguage: ["English"],
    },
  };
}

function website() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    publisher: { "@id": organizationId },
    inLanguage: "en-US",
  };
}

export function getApproachJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(),
      website(),
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/approach#webpage`,
        url: `${siteUrl}/approach`,
        name: `${approachTitle} | ${siteName}`,
        description: approachDescription,
        isPartOf: { "@id": websiteId },
        about: { "@id": serviceId },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Approach",
            item: `${siteUrl}/approach`,
          },
        ],
      },
    ],
  };
}

export function getHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(),
      website(),
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: siteUrl,
        name: defaultTitle,
        description: siteDescription,
        isPartOf: { "@id": websiteId },
        about: { "@id": serviceId },
        primaryImageOfPage: `${siteUrl}/opengraph-image`,
        inLanguage: "en-US",
      },
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: "Supplier overbilling investigation",
        url: siteUrl,
        description: siteDescription,
        provider: { "@id": organizationId },
        serviceType: [
          "Supplier overbilling investigation",
          "Contract and invoice reconciliation",
          "Supplier price increase review",
          "Contractual surcharge review",
        ],
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Industrial manufacturers",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        url: `${siteUrl}/#questions`,
        isPartOf: { "@id": webpageId },
        mainEntity: questions.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };
}
