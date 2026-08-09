"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/#mandates", label: "Mandates" },
  { href: "/#approach", label: "Approach" },
];

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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-border bg-bg transition-[height] duration-200 ${
          scrolled ? "h-[72px]" : "h-20"
        }`}
      >
        <div className="container flex h-full items-center justify-between">
          <Link
            href="/"
            className="font-sans text-[15px] font-medium tracking-[0.14em] text-text"
            onClick={() => setMenuOpen(false)}
          >
            KORDRAN
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] text-text-secondary transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            <a href="/#discuss" className="cta-link text-[14px]">
              Discuss a situation >
            </a>
          </nav>

          <button
            type="button"
            className="font-mono text-[12px] tracking-[0.1em] text-text uppercase md:hidden"
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
        className={`fixed inset-0 z-40 bg-bg pt-20 transition-opacity duration-200 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="container flex flex-col border-t border-border">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-b border-border py-6 text-[18px] text-text"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#discuss"
            className="border-b border-border py-6 text-[18px] text-text"
            onClick={() => setMenuOpen(false)}
          >
            Discuss a situation >
          </a>
        </nav>
      </div>
    </>
  );
}
