"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import TrackLink from "@/components/TrackLink";

const links = [
  { href: "/", label: "Home" },
  { href: "/approach", label: "Approach" },
  { href: "/#questions", label: "Questions" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(false);

  function isCurrent(href: string) {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href;
  }

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px)");
    const onChange = () => {
      if (media.matches) setMenuOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const main = document.getElementById("content");
    const footer = document.querySelector("footer");

    if (menuOpen) {
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
      menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    } else {
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      if (returnFocus.current) {
        returnFocus.current = false;
        buttonRef.current?.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        returnFocus.current = true;
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className="site-header"
      data-scrolled={scrolled ? "true" : undefined}
      data-open={menuOpen ? "true" : undefined}
    >
      <div className="container header-inner">
        <Link
          href="/"
          className="logo-link"
          aria-label="Kordran home"
          onClick={closeMenu}
        >
          <Logo variant="full" surface="light" priority className="logo" />
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {links.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={isCurrent(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <TrackLink
            href="/#contact"
            className="btn btn-small"
            event="cta_click"
            eventParams={{ location: "header", target: "contact" }}
          >
            Send us an issue
          </TrackLink>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="menu-button"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => {
            if (menuOpen) returnFocus.current = true;
            setMenuOpen((open) => !open);
          }}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div ref={menuRef} id={menuId} className="mobile-menu" hidden={!menuOpen}>
        <nav className="container" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="menu-link"
              aria-current={isCurrent(link.href) ? "page" : undefined}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <TrackLink
            href="/#contact"
            className="btn menu-cta"
            event="cta_click"
            eventParams={{ location: "menu", target: "contact" }}
            onClick={closeMenu}
          >
            Send us an issue
            <span className="btn-glyph" aria-hidden="true" />
          </TrackLink>
        </nav>
      </div>
    </header>
  );
}
