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

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          situation: data.get("situation"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const raw =
          typeof payload?.error === "string"
            ? payload.error
            : "Unable to submit. Please try again.";
        const message = /environment variable|supabase/i.test(raw)
          ? "Unable to submit your request. Please try again later."
          : raw;
        throw new Error(message);
      }

      track("contact_submit", { status: "success" });
      setStatus("success");
      form.reset();
    } catch (err) {
      track("contact_submit", { status: "error" });
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to submit.");
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
          Inquiry received.
        </h3>
        <p>We&apos;ll review it and reply if Kordran is a fit.</p>
        <p>
          You can also write to{" "}
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
        <span>Inquiry</span>
        <span>Reviewed for fit</span>
      </p>
      <div className="form-body">
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
            />
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
          <div className="form-field form-field-wide">
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
          <div className="form-field form-field-wide">
            <label htmlFor="situation">Brief description of the issue</label>
            <textarea
              id="situation"
              name="situation"
              required
              rows={5}
              aria-describedby="situation-hint"
            />
            <p id="situation-hint" className="form-hint">
              Describe the issue in general terms. Please don&apos;t include
              contracts, invoices, or pricing files.
            </p>
          </div>
        </div>

        {status === "error" ? (
          <p className="form-error" role="alert">
            <strong>Error.</strong> {error}
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
            {status === "submitting" ? "Sending…" : "Send inquiry"}
            <span className="btn-glyph" aria-hidden="true" />
          </button>
          <p className="form-required">All fields are required.</p>
        </div>
      </div>
    </form>
  );
}
