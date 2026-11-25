import Link from "next/link";
import CopyEmailButton from "@/components/CopyEmailButton";
import Logo from "@/components/Logo";
import { contactEmail } from "@/lib/site";

const cta =
  "h-11 items-center justify-center border border-solid px-[18px] font-display text-cta font-medium tracking-[0.005em] whitespace-nowrap rounded-none shadow-none lg:h-10";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas">
      <main className="relative isolate flex-1">
        <div
          className="pointer-events-none absolute inset-0 -z-10 hidden hairline-fade lg:block"
          aria-hidden="true"
        >
          <div className="mx-auto h-full w-full max-w-kordran px-6 lg:px-12">
            <div className="kordran-grid h-full">
              <div className="relative border-l border-hairline">
                <span className="absolute top-0 -left-[1px] h-[10px] w-[1px] bg-tick" />
              </div>
              <div className="relative border-l border-hairline">
                <span className="absolute top-0 -left-[1px] h-[10px] w-[1px] bg-tick" />
              </div>
              <div className="relative border-l border-hairline">
                <span className="absolute top-0 -left-[1px] h-[10px] w-[1px] bg-tick" />
              </div>
              <div className="relative border-l border-r border-hairline">
                <span className="absolute top-0 -left-[1px] h-[10px] w-[1px] bg-tick" />
                <span className="absolute top-0 -right-[1px] h-[10px] w-[1px] bg-tick" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 -z-10 hairline-fade lg:hidden"
          aria-hidden="true"
        >
          <div className="mx-auto h-full px-5 md:max-w-[680px] md:px-0">
            <div className="relative h-full border-x border-hairline">
              <span className="absolute top-0 -left-[1px] h-[8px] w-[1px] bg-tick" />
              <span className="absolute top-0 -right-[1px] h-[8px] w-[1px] bg-tick" />
            </div>
          </div>
        </div>

        <div className="hero-pad mx-auto w-full px-10 pt-4 pb-14 md:max-w-[680px] md:px-8 md:pt-12 md:pb-16 lg:max-w-kordran lg:px-12 lg:pt-[clamp(6rem,18vh,11rem)] lg:pb-16">
          <div className="kordran-grid items-start">
            <nav
              className="flex flex-row gap-6 pt-6 pb-8 md:pt-0 lg:flex-col lg:items-start lg:gap-3 lg:pt-[6px] lg:pr-4 lg:pb-0 lg:pl-4"
              aria-label="Primary"
            >
              <Link
                href="/"
                className="relative font-display text-nav font-medium tracking-[-0.01em] text-brand-blue underline decoration-brand-blue decoration-2 underline-offset-4 lg:no-underline lg:before:absolute lg:before:top-[2px] lg:before:-left-[17px] lg:before:h-[18px] lg:before:w-[2px] lg:before:bg-brand-blue lg:before:content-['']"
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

            <p className="mb-3 font-sans text-index font-medium tracking-[0.06em] text-ink-muted tabular-nums lg:mb-0 lg:pt-[8px] lg:pl-4">
              01
            </p>

            <div className="min-w-0 lg:px-8 xl:px-10">
              <h1 className="max-w-[22ch] text-balance font-display text-display-sm font-normal tracking-[-0.025em] text-ink-primary lg:text-display-lg">
                Kordran recovers{" "}
                <span className="underline decoration-ink-primary/25 decoration-1 underline-offset-[6px]">
                  leaked metal and landed-cost margin
                </span>{" "}
                for precision manufacturers.
              </h1>

              <p className="mt-7 max-w-[58ch] text-pretty font-sans text-body-sm font-normal tracking-[-0.005em] text-ink-body lg:text-body">
                Mid-market aerospace, defense, and industrial manufacturers
                across Southern California and Baja lose six figures a year in
                the blind spots between purchasing, customs records, and
                supplier billing.{" "}
                <span className="bg-highlight px-[4px] py-[1px] underline decoration-ink-primary/25 decoration-1 underline-offset-[4px] box-decoration-clone">
                  Kordran reconciles ERP purchase orders, trade data, and mill
                  invoices into one forensic audit:
                </span>{" "}
                surfacing supplier tariff overbilling, alloy-surcharge drift,
                freight waste, and undervalued titanium or superalloy scrap.
              </p>

              <p className="mt-5 max-w-[58ch] text-pretty font-sans text-body-sm font-normal tracking-[-0.005em] text-ink-body lg:text-body">
                We work strictly upstream of your customs broker and finance
                team—auditing past records, flagging billing discrepancies with
                source-page evidence, and monitoring ongoing AP leakage without
                filing entries or taking title to metal. Built for $30M–$300M
                metal-heavy manufacturers.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className={`${cta} inline-flex border-ink-primary bg-ink-primary text-white`}
                  href={`mailto:${contactEmail}`}
                >
                  Contact
                </a>
                <CopyEmailButton className={`${cta} border-border-subtle bg-canvas text-ink-primary hover:border-ink-primary`} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-canvas">
        <div className="mx-auto flex w-full flex-col items-start gap-4 px-5 py-8 md:max-w-[680px] md:flex-row md:items-center md:justify-between md:px-8 md:py-9 lg:max-w-kordran lg:px-12 lg:py-10">
          <Logo className="h-5 w-auto lg:ml-4 lg:h-[24px]" priority />
          <p className="font-sans text-meta font-normal tracking-[0.01em] text-ink-muted md:text-right">
            <span>Southern California · Baja</span>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
