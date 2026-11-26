import {
  areasServed,
  contactEmail,
  defaultTitle,
  knowsAbout,
  languages,
  organizationDescription,
  organizationId,
  services,
  SITE_URL,
  siteName,
  webpageId,
  websiteId,
} from "@/lib/site";
import type { Note } from "@/lib/content";

export function getHomeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": organizationId,
        name: siteName,
        url: SITE_URL,
        email: contactEmail,
        logo: `${SITE_URL}/logos/Full_Color_Light.svg`,
        description: organizationDescription,
        areaServed: areasServed.map((name) => ({
          "@type": "AdministrativeArea",
          name,
        })),
        availableLanguage: [...languages],
        knowsAbout: [...knowsAbout],
        sameAs: [] as string[],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "How Kordran works",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.description,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: siteName,
        inLanguage: "en-US",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: SITE_URL,
        name: defaultTitle,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
      },
    ],
  };
}

export function getNoteGraph(
  note: Note,
  faq: { question: string; answer: string }[],
) {
  const url = `${SITE_URL}/notes/${note.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: note.title,
      description: note.description,
      datePublished: note.publishedAt,
      dateModified: note.updatedAt,
      inLanguage: "en-US",
      mainEntityOfPage: url,
      author: { "@id": organizationId },
      publisher: { "@id": organizationId },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteName,
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Notes",
          item: `${SITE_URL}/notes`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: note.title,
          item: url,
        },
      ],
    },
  ];

  if (faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
