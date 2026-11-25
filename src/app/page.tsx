import Link from "next/link";
import Logo from "@/components/Logo";
import { contactEmail } from "@/lib/site";

const cta =
  "h-11 items-center justify-center border border-solid px-[18px] font-display text-cta font-medium tracking-[0.005em] whitespace-nowrap rounded-none shadow-none lg:h-10";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas">
      <main className="relative isolate flex-1">
        <div
          className="pointer-events-none absolute inset-0 -z-10 hairline-fade"
          aria-hidden="true"
        >
          <div className="mx-auto h-full w-full max-w-[1600px] px-8 lg:px-10">
            <div className="relative h-full border-x border-hairline">
              <span className="absolute top-0 -left-px h-2 w-px bg-tick lg:h-[10px]" />
              <span className="absolute top-0 -right-px h-2 w-px bg-tick lg:h-[10px]" />
            </div>
          </div>
        </div>

        <div className="hero-pad mx-auto w-full max-w-[1600px] px-10 pt-12 pb-14 lg:px-16 lg:pt-[clamp(6rem,18vh,11rem)] lg:pb-16">
          {/* Rail is parked until we use it. Hidden so it does not take a column. */}
          <nav className="hidden" aria-label="Primary">
            <Link
              href="/"
              className="relative font-display text-nav font-medium tracking-[-0.01em] text-brand-blue"
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

          <p className="mb-4 font-sans text-index font-medium tracking-[0.06em] text-ink-muted tabular-nums">
            01
          </p>

          <h1 className="text-balance font-display text-display-sm font-normal tracking-[-0.025em] text-ink-primary lg:text-display-lg">
            Kordran recovers{" "}
            <span className="underline decoration-ink-primary/25 decoration-1 underline-offset-[6px]">
              leaked metal and landed-cost margin
            </span>{" "}
            for precision manufacturers.
          </h1>

          <p className="mt-7 text-pretty font-sans text-body-sm font-normal tracking-[-0.005em] text-ink-body lg:text-body">
            Mid-market aerospace, defense, and industrial manufacturers across
            Southern California and Baja lose six figures a year in the blind
            spots between purchasing, customs records, and supplier billing.{" "}
            <span className="bg-highlight px-[4px] py-[1px] underline decoration-ink-primary/25 decoration-1 underline-offset-[4px] box-decoration-clone">
              Kordran reconciles ERP purchase orders, trade data, and mill
              invoices into one forensic audit:
            </span>{" "}
            surfacing supplier tariff overbilling, alloy-surcharge drift,
            freight waste, and undervalued titanium or superalloy scrap.
          </p>

          <p className="mt-5 text-pretty font-sans text-body-sm font-normal tracking-[-0.005em] text-ink-body lg:text-body">
            We work strictly upstream of your customs broker and finance
            team—auditing past records, flagging billing discrepancies with
            source-page evidence, and monitoring ongoing AP leakage without
            filing entries or taking title to metal. Built for $30M–$300M
            metal-heavy manufacturers.
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
      </main>

      <footer className="bg-canvas">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start gap-4 px-10 py-8 md:flex-row md:items-center md:justify-between lg:px-16 lg:py-10">
          <Logo className="h-5 w-auto lg:h-[24px]" priority />
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
