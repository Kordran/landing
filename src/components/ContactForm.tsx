"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { contactEmail } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const supplier = String(data.get("supplier") || "").trim();
    const details = String(data.get("situation") || "").trim();
    const context = [supplier ? `Supplier: ${supplier}` : ""].filter(Boolean);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          situation: [...context, ...(context.length ? [""] : []), details].join(
            "\n"
          ),
          area: "",
          timeline: "",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const raw =
          typeof payload?.error === "string"
            ? payload.error
            : "Unable to send. Please try again.";
        const message = /environment variable|supabase/i.test(raw)
          ? "We couldn't send that just now. Please try again in a moment."
          : raw;
        throw new Error(message);
      }

      track("contact_submit", { status: "success" });
      setStatus("success");
      form.reset();
    } catch (err) {
      track("contact_submit", { status: "error" });
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to send.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <p className="label">
          <span className="mark" aria-hidden="true" />
          Received
        </p>
        <h3 ref={successRef} tabIndex={-1}>
          Thanks. We have it.
        </h3>
        <p>
          We&apos;ll go through what you sent and get back to you directly with
          what we&apos;d look at first.
        </p>
        <p>
          Anything to add? Write to{" "}
          <a className="inline-link" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  const showEmailHint = !error.includes(contactEmail);

  return (
    <form
      className="form-sheet"
      onSubmit={onSubmit}
      onFocus={() => {
        if (started.current) return;
        started.current = true;
        track("contact_start");
      }}
    >
      <p className="sheet-head">
        <span>Supplier issue</span>
        <span>We reply directly</span>
      </p>
      <div className="form-body">
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required autoComplete="name" />
          </div>
          <div className="form-field">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              required
              autoComplete="organization"
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <div className="form-field">
            <label htmlFor="supplier">Supplier (optional)</label>
            <input id="supplier" name="supplier" type="text" autoComplete="off" />
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="situation">What&apos;s happening?</label>
            <textarea
              id="situation"
              name="situation"
              required
              rows={4}
              aria-describedby="situation-hint"
              placeholder="A sentence is enough. For example: a machined part went up 6% in March, and the agreement caps increases at 3%."
            />
            <p id="situation-hint" className="form-hint">
              We&apos;ll reply, then ask for the records that would help.
            </p>
          </div>
        </div>

        {status === "error" ? (
          <p className="form-error" role="alert">
            <strong>Not sent.</strong> {error}
            {showEmailHint ? (
              <>
                {" "}
                You can also email{" "}
                <a className="inline-link" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
                .
              </>
            ) : null}
          </p>
        ) : null}

        <div className="form-actions">
          <button
            type="submit"
            className="btn"
            aria-disabled={status === "submitting"}
            aria-busy={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Send it to us"}
            <span className="btn-glyph" aria-hidden="true" />
          </button>
          <p className="form-required">A short note is enough.</p>
        </div>
      </div>
    </form>
  );
}
