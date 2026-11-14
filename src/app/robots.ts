import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const allow = ["/"];
const disallow = ["/api/"];

/** Crawlers that should read the site, including AI answer engines. */
const agents = [
  "*",
  "Googlebot",
  "Bingbot",
  "Applebot",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: agents.map((userAgent) => ({
      userAgent,
      allow,
      disallow,
    })),
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
