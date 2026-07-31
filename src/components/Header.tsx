"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const menuLinks = [
    { href: "/#diagnostic", label: "Diagnostic" },
    { href: "/#contact", label: "Request a review ↗" },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[height,background-color,backdrop-filter] duration-300 ${
          scrolled
            ? "h-[72px] border-b border-border bg-bg/95 backdrop-blur-sm"
            : "h-20 border-b border-transparent bg-bg"
        }`}
      >
        <div className="container flex h-full items-center justify-between gap-6">
          <Link
            href="/"
            className="font-sans text-[15px] font-medium tracking-[0.2em] text-text"
            onClick={() => setMenuOpen(false)}
          >
            KORDRAN
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="/#diagnostic"
              className="text-[13px] text-text-secondary transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Diagnostic
            </a>
            <a href="/#contact" className="nav-cta">
              Request a review ↗
            </a>
          </nav>

          <button
            type="button"
            className="min-h-11 font-mono text-[12px] tracking-[0.1em] text-text uppercase md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-bg pt-20 transition-[opacity,transform] duration-300 ease-out md:hidden ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="container flex flex-col border-t border-border">
          {menuLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className="border-b border-border py-7 text-[16px] text-text transition-[opacity,transform] duration-300 ease-out"
              style={{
                transitionDelay: menuOpen ? `${index * 50}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
