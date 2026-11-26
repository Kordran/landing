import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { extractFaq, getNote, getPublishedNotes } from "@/lib/content";
import { getNoteGraph } from "@/lib/jsonld";
import { Markdown } from "@/lib/markdown";
import { contactEmail, siteName } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getPublishedNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};

  const path = `/notes/${note.slug}`;
  return {
    title: note.title,
    description: note.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: note.title,
      description: note.description,
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const faq = extractFaq(note.body);

  return (
    <article className="mx-auto w-full max-w-3xl px-10 py-16">
      <JsonLd data={getNoteGraph(note, faq)} />
      <nav aria-label="Breadcrumb" className="font-sans text-meta text-ink-muted">
        <Link href="/">{siteName}</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/notes">Notes</Link>
        <span aria-hidden="true"> / </span>
        <span>{note.title}</span>
      </nav>
      <h1 className="mt-8 font-display text-display-sm font-normal tracking-[-0.025em] text-ink-primary">
        {note.title}
      </h1>
      <p className="mt-3 font-sans text-meta text-ink-muted">{note.publishedAt}</p>
      <div className="mt-8 font-sans text-body-sm text-black">
        <Markdown source={note.body} />
      </div>
      <p className="mt-12">
        <a
          className="inline-flex h-11 items-center border border-brand-blue bg-brand-blue px-[18px] font-display text-cta font-medium text-white"
          href={`mailto:${contactEmail}`}
        >
          Get a free sample
        </a>
      </p>
      <p className="mt-6 font-sans text-meta text-ink-muted">
        The client&apos;s licensed broker files with customs.
      </p>
    </article>
  );
}
