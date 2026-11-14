"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  motion = "none",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Only a few compositions move. Everything else stays still. */
  motion?: "none" | "headline" | "statement" | "diagram" | "footer";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || motion === "none") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.dataset.ready = "true";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.classList.add("is-in");
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [motion]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-motion={motion === "none" ? undefined : motion}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
