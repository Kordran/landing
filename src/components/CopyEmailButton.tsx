"use client";

import { useEffect, useRef, useState } from "react";
import { contactEmail } from "@/lib/site";

export default function CopyEmailButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(contactEmail);
    } catch {
      const field = document.createElement("textarea");
      field.value = contactEmail;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }

    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      className={`inline-grid ${className}`}
      onClick={handleCopy}
      aria-live="polite"
    >
      <span className={`col-start-1 row-start-1 ${copied ? "invisible" : ""}`}>
        {contactEmail}
      </span>
      <span className={`col-start-1 row-start-1 ${copied ? "" : "invisible"}`}>
        Copied
      </span>
    </button>
  );
}
