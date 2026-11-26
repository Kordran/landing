import Link from "next/link";
import Logo from "@/components/Logo";
import { getPublishedNotes } from "@/lib/content";
import { contactEmail } from "@/lib/site";

export const dynamic = "force-static";

const cta =
  "h-11 items-center justify-center border border-solid px-[18px] font-display text-cta font-medium tracking-[0.005em] whitespace-nowrap rounded-none shadow-none lg:h-10";

const frame = "mx-auto w-full max-w-[72rem]";

export default function Home() {
  const notes = getPublishedNotes();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas">
      <main className="relative isolate flex-1">
        <div
          className="pointer-events-none absolute inset-0 -z-10 hidden hairline-fade lg:block"
          aria-hidden="true"
        >
          <div className={`${frame} h-full px-6`}>
            <div className="kordran-grid h-full">
              <div className="relative border-l border-hairline">
                <span className="absolute top-0 -left-px h-[10px] w-px bg-tick" />
              </div>
              <div className="relative border-l border-hairline">
                <span className="absolute top-0 -left-px h-[10px] w-px bg-tick" />
              </div>
              <div className="relative border-l border-hairline">
                <span className="absolute top-0 -left-px h-[10px] w-px bg-tick" />
              </div>
              <div className="relative border-l border-r border-hairline">
                <span className="absolute top-0 -left-px h-[10px] w-px bg-tick" />
                <span className="absolute top-0 -right-px h-[10px] w-px bg-tick" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 -z-10 hairline-fade lg:hidden"
          aria-hidden="true"
        >
          <div className="mx-auto h-full px-8">
            <div className="relative h-full border-x border-hairline">
              <span className="absolute top-0 -left-px h-2 w-px bg-tick" />
              <span className="absolute top-0 -right-px h-2 w-px bg-tick" />
            </div>
          </div>
        </div>

        <div className={`${frame} hero-pad px-10 pt-12 pb-14 lg:px-6 lg:pt-[clamp(6rem,18vh,11rem)] lg:pb-16`}>
          <div className="kordran-grid items-start">
            <div className="hidden lg:block">
              <nav className="hidden" aria-label="Primary">
                <Link
                  href="/"
                  className="font-display text-nav font-medium tracking-[-0.01em] text-brand-blue"
                  aria-current="page"
                >
                  Home
                </Link>
                <a
                  className="font-display text-nav font-normal tracking-[-0.01em] text-ink-muted"
                  href={`mailto:${contactEmail}`}
                >
                  Contact
                </a>
              </nav>
            </div>

            <p className="mb-4 font-sans text-index font-medium tracking-[0.06em] text-ink-muted tabular-nums lg:mb-0 lg:pt-2 lg:pl-2">
              01
            </p>

            <div className="min-w-0 lg:px-8">
              <div className="w-full lg:mx-auto lg:max-w-[min(50vw,41.8rem)]">
                <h1 className="text-balance font-display text-display-sm font-normal tracking-[-0.025em] text-ink-primary lg:text-display-md">
                  Kordran finds where you&apos;re losing cash on suppliers,
                  tariffs, and scrap. Then we go get it back.
                </h1>

                <p className="mt-7 text-pretty font-sans text-body-sm font-normal tracking-[-0.005em] text-black">
                  Most manufacturers overpay in the gap between purchasing,
                  customs, and accounts payable. Suppliers bill surcharges that
                  don&apos;t match the contract. Supplier tariff charges never
                  get refunded. Freight gets rushed. Scrap leaves the building
                  for pennies.
                </p>

                <p className="mt-5 text-pretty font-sans text-body-sm font-normal tracking-[-0.005em] text-black">
                  <span className="font-medium">Kordran owns the fix.</span> We
                  go through your data, walk your floor, and work with your
                  suppliers, haulers, and processors, on your terms, to recover
                  the money. Your broker files with customs. We handle
                  everything else.
                </p>

                <p className="mt-5 text-pretty font-sans text-body-sm font-normal tracking-[-0.005em] text-black">
                  Then we stay on it. Every month we check new bills before
                  they&apos;re paid, so the same problems don&apos;t come back.
                </p>

                <div className="mt-8">
                  <a
                    className={`${cta} inline-flex border-brand-blue bg-brand-blue text-white`}
                    href={`mailto:${contactEmail}`}
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>

            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </div>
      </main>

      <footer className="bg-canvas">
        <div className={`${frame} flex flex-col items-start gap-4 px-10 py-8 md:flex-row md:items-center md:justify-between lg:px-6 lg:py-10`}>
          <Logo className="h-5 w-auto lg:h-[24px]" priority />
          {notes.length > 0 ? (
            <Link
              href="/notes"
              className="font-sans text-meta font-normal tracking-[0.01em] text-ink-muted"
            >
              Notes
            </Link>
          ) : null}
          <p className="font-sans text-meta font-normal tracking-[0.01em] text-ink-muted md:text-right">
            <span>Based in California</span>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
