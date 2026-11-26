import { getPublishedNotes } from "../src/lib/content.ts";
import { isIndexingEnabled, SITE_URL } from "../src/lib/site.ts";

const key = process.env.INDEXNOW_KEY?.trim();

if (!isIndexingEnabled) {
  console.log("INDEXING_ENABLED is not true. IndexNow skipped.");
  process.exit(0);
}

if (!key) {
  console.error("INDEXNOW_KEY is not set.");
  process.exit(1);
}

const urlList = [
  `${SITE_URL}/`,
  ...getPublishedNotes().map((note) => `${SITE_URL}/notes/${note.slug}`),
];

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "kordran.com",
    key,
    keyLocation: `${SITE_URL}/${key}.txt`,
    urlList,
  }),
});

console.log(`IndexNow ${response.status} for ${urlList.length} URL(s).`);
if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}
