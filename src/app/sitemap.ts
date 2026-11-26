import type { MetadataRoute } from "next";
import { getPublishedNotes } from "@/lib/content";
import { isIndexingEnabled, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexingEnabled) return [];

  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...getPublishedNotes().map((note) => ({
      url: `${SITE_URL}/notes/${note.slug}`,
      lastModified: note.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
