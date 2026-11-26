import { getPublishedNotes } from "@/lib/content";
import {
  contactEmail,
  isIndexingEnabled,
  SITE_URL,
  siteDescription,
  siteName,
} from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function GET() {
  if (!isIndexingEnabled) {
    return new Response("Not found", { status: 404 });
  }

  const items = getPublishedNotes()
    .map((note) => {
      const url = `${SITE_URL}/notes/${note.slug}`;
      return `<item><title>${escapeXml(note.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(note.publishedAt).toUTCString()}</pubDate><description>${escapeXml(note.description)}</description></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteName)}</title><link>${SITE_URL}</link><description>${escapeXml(siteDescription)}</description><managingEditor>${escapeXml(contactEmail)}</managingEditor>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
