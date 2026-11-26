import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Content rule for notes: general education only. Never recommend 8- or
// 10-digit HTS codes for specific goods, never describe preparing entries,
// protests or Form 5106, and always state that the client's licensed broker
// files with customs.

export type Note = {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  draft: boolean;
  body: string;
};

const notesDir = join(process.cwd(), "content", "notes");

function parseValue(raw: string): string | boolean | string[] {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return value.replace(/^["']|["']$/g, "");
}

function parseNote(raw: string): Note | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;

  const fields: Record<string, string | boolean | string[]> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const splitAt = line.indexOf(":");
    if (splitAt === -1) continue;
    const key = line.slice(0, splitAt).trim();
    fields[key] = parseValue(line.slice(splitAt + 1));
  }

  const title = String(fields.title ?? "");
  const slug = String(fields.slug ?? "");
  if (!title || !slug) return null;

  const tags = Array.isArray(fields.tags) ? fields.tags.map(String) : [];

  return {
    title,
    slug,
    description: String(fields.description ?? ""),
    publishedAt: String(fields.publishedAt ?? ""),
    updatedAt: String(fields.updatedAt ?? fields.publishedAt ?? ""),
    tags,
    draft: fields.draft === true,
    body: match[2].trim(),
  };
}

export function getNotes(): Note[] {
  let files: string[] = [];
  try {
    files = readdirSync(notesDir);
  } catch {
    return [];
  }

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => parseNote(readFileSync(join(notesDir, file), "utf8")))
    .filter((note): note is Note => note !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPublishedNotes(): Note[] {
  return getNotes().filter((note) => !note.draft);
}

export function getNote(slug: string): Note | undefined {
  return getPublishedNotes().find((note) => note.slug === slug);
}

export function extractFaq(body: string): { question: string; answer: string }[] {
  const lines = body.split(/\r?\n/);
  let inQuestions = false;
  const faq: { question: string; answer: string }[] = [];
  let question = "";
  let answer: string[] = [];

  const flush = () => {
    if (question && answer.join(" ").trim()) {
      faq.push({ question, answer: answer.join(" ").trim() });
    }
    question = "";
    answer = [];
  };

  for (const line of lines) {
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const text = heading[2].trim();
      if (/^(questions|q&a)$/i.test(text)) {
        flush();
        inQuestions = true;
        continue;
      }
      if (!inQuestions) continue;
      flush();
      question = text;
      continue;
    }
    if (inQuestions && question && line.trim()) answer.push(line.trim());
  }
  flush();
  return faq;
}
