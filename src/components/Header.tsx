"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import TrackLink from "@/components/TrackLink";

const links = [
  { href: "/#approach", label: "Approach" },
  { href: "/#example", label: "Example" },
  { href: "/#contact", label: "Contact" },
];

export default function Header({
  initialTone = "on-light",
}: {
  initialTone?: "on-dark" | "on-light";
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tone, setTone] = useState(initialTone);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (window.location.hash !== "#diagnostic") return;
    document.getElementById("approach")?.scrollIntoView();
  }, []);

  useEffect(() => {
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-header]")
    );
    if (!scenes.length) return;

    const update = () => {
      const marker = 48;
      let next: "on-dark" | "on-light" = initialTone;
      for (const scene of scenes) {
        const box = scene.getBoundingClientRect();
        if (box.top <= marker && box.bottom > marker) {
          next = scene.dataset.header === "on-light" ? "on-light" : "on-dark";
        }
      }
      setTone(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [initialTone]);

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
    <header className={`site-header${tone === "on-dark" ? " is-on-dark" : ""}`}>
      <div className="container header-inner">
        <Link
          href="/"
          className="logo-link"
          aria-label="Kordran home"
          onClick={closeMenu}
        >
          <Logo
            variant="full"
            surface={tone === "on-dark" ? "dark" : "light"}
            priority
            className="logo"
          />
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
          <TrackLink
            href="/#contact"
            className="btn btn-small"
            event="cta_click"
            eventParams={{ location: "header", target: "contact" }}
          >
            Discuss a supplier issue
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

      <div
        ref={menuRef}
        id={menuId}
        className={`mobile-menu${menuOpen ? " is-open" : ""}`}
        hidden={!menuOpen}
      >
        <nav className="container" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="menu-link"
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
            Discuss a supplier issue
          </TrackLink>
        </nav>
      </div>
    </header>
  );
}
