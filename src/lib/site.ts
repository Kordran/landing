export const SITE_URL = "https://kordran.com";

export const siteUrl = SITE_URL;

export const siteName = "Kordran";

export const contactEmail = "contact@kordran.com";

export const defaultTitle =
  "Kordran | Supplier Billing, Tariff & Scrap Cash Recovery";

export const titleTemplate = "%s | Kordran";

export const siteDescription =
  "Kordran finds where manufacturers lose cash on suppliers, tariffs, freight, and scrap, recovers it, and monitors monthly billing so leaks stay closed.";

export const headline =
  "Kordran finds where you're losing cash on suppliers, tariffs, and scrap. Then we go get it back.";

export const organizationDescription =
  "Kordran finds and recovers cash manufacturers lose on supplier surcharges, tariffs, freight and scrap, then monitors monthly billing. Kordran is not a customs broker and does not file customs entries.";

export const shareImagePlaces = "Based in California";

export const areasServed = ["California"] as const;

export const languages = ["English", "Spanish"] as const;

export const knowsAbout = [
  "supplier billing audits",
  "alloy surcharge verification",
  "tariff surcharge recovery",
  "freight audits",
  "aerospace scrap settlement audits",
  "cross-border manufacturing cost recovery",
] as const;

/** Names are phrases that appear on the homepage. */
export const services = [
  {
    name: "Kordran finds where you're losing cash on suppliers, tariffs, and scrap.",
    description:
      "Most manufacturers overpay in the gap between purchasing, customs, and accounts payable.",
  },
  {
    name: "Kordran owns the fix.",
    description:
      "We go through your data, walk your floor, and work with your suppliers, haulers, and processors, on your terms, to recover the money.",
  },
  {
    name: "Then we stay on it.",
    description:
      "Every month we check new bills before they're paid, so the same problems don't come back.",
  },
] as const;

export const audience =
  "Manufacturers about $30M to $300M buying metal, components or imported parts: aerospace, defense, space, energy, medical, industrial.";

export const scope =
  "Kordran is not a customs broker and does not file customs entries. The client's broker files. Kordran handles suppliers, freight, contracts and scrap.";

export const isIndexingEnabled = process.env.INDEXING_ENABLED === "true";

export const organizationId = `${SITE_URL}/#organization`;

export const websiteId = `${SITE_URL}/#website`;

export const webpageId = `${SITE_URL}/#webpage`;
