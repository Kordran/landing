"use client";

import type { CSSProperties } from "react";

const thesisLines = [
  "Find the cost.",
  "Recover the value.",
  "Fix the system.",
];

export default function HeroSection() {
  return (
    <section className="hero-thesis border-b border-border">
      <div className="container grid min-h-[calc(100vh-5rem)] grid-rows-[1fr_auto] py-14 md:py-16 lg:py-20">
        <h1 className="text-display max-w-[14ch] self-start pt-4 text-text md:pt-8">
          {thesisLines.map((line, index) => (
            <span
              key={line}
              className="hero-line"
              style={
                {
                  "--hero-delay": `${90 + index * 110}ms`,
                } as CSSProperties
              }
            >
              {line}
            </span>
          ))}
        </h1>

        <div
          className="hero-reveal mt-20 flex max-w-md flex-col gap-8 justify-self-start md:mt-0 md:max-w-sm md:justify-self-end lg:max-w-md"
          style={{ "--hero-delay": "480ms" } as CSSProperties}
        >
          <p className="text-body text-text-secondary">
            Kordran identifies and pursues avoidable cost across supplier
            pricing, freight, duties, tariffs, and import operations for
            companies with complex hardware supply chains.
          </p>
          <a href="#contact" className="nav-cta">
            Request a review <span className="nav-cta-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
