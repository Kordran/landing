import type { MetadataRoute } from "next";
import { isIndexingEnabled, SITE_URL } from "@/lib/site";

const aiCrawlers = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingEnabled) {
    return {
      rules: {
        userAgent: "*",
        allow: "/$",
        disallow: "/",
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
      host: SITE_URL,
    };
  }

  const publicRule = { allow: "/", disallow: "/api/" };

  return {
    rules: [
      { userAgent: "*", ...publicRule },
      ...aiCrawlers.map((userAgent) => ({ userAgent, ...publicRule })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
