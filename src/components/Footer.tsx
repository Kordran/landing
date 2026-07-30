import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="container grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="mb-4 text-[15px] font-medium tracking-[0.14em]">
            KORDRAN
          </p>
          <p className="max-w-sm text-[16px] leading-relaxed text-text-secondary">
            Industrial special situations and field execution.
          </p>
        </div>

        <div className="md:col-span-4 space-y-3 text-[15px]">
          <p className="font-mono text-[12px] tracking-[0.06em] uppercase text-text-secondary">
            Southern California · Baja California · North America
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:contact@kordran.com"
              className="text-accent hover:underline"
            >
              Email
            </a>
            <span className="text-border">·</span>
            <a
              href="https://www.linkedin.com/company/kordran"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="md:col-span-3 md:text-right space-y-3 text-[14px] text-text-secondary">
          <p>© 2026 Kordran Group, Inc.</p>
          <p className="space-x-3">
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-accent">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
