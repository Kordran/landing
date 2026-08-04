"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealVariant = "up" | "fade";

export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  variant = "up",
  rule = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "ul";
  delay?: number;
  variant?: RevealVariant;
  rule?: boolean;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variantClass = variant === "fade" ? "reveal-fade" : "";
  const visibleClass = visible ? "is-visible" : "";
  const ruleClass = rule ? "rule-reveal" : "";

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`reveal ${variantClass} ${ruleClass} ${visibleClass} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
