import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedNotes } from "@/lib/content";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Notes",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  const notes = getPublishedNotes();

  return (
    <main className="mx-auto w-full max-w-3xl px-10 py-16">
      <h1 className="font-display text-display-sm font-normal tracking-[-0.025em] text-ink-primary">
        Notes
      </h1>
      {notes.length === 0 ? (
        <p className="mt-6 font-sans text-body-sm text-black">No notes yet.</p>
      ) : (
        <ul className="mt-8 font-sans text-body-sm text-black">
          {notes.map((note) => (
            <li key={note.slug} className="mt-4">
              <Link href={`/notes/${note.slug}`}>{note.title}</Link>
              <p className="text-ink-muted">{note.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
