"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
          phone: data.get("phone"),
          situation: data.get("situation"),
          unresolved: data.get("unresolved"),
          timeline: data.get("timeline"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Unable to submit. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to submit.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-border p-8 md:p-10">
        <p className="label mb-4">Received</p>
        <p className="max-w-xl text-[20px] leading-relaxed text-text">
          Your message has been received. Kordran will review the situation and
          respond directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-border p-8 md:p-10">
      <div className="grid gap-6 md:grid-cols-2">
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
          />
        </div>
        <div className="form-field">
          <label htmlFor="phone">
            Phone <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="form-field md:col-span-2">
          <label htmlFor="situation">What is happening?</label>
          <textarea id="situation" name="situation" required />
        </div>
        <div className="form-field md:col-span-2">
          <label htmlFor="unresolved">
            What happens if the situation remains unresolved?
          </label>
          <textarea id="unresolved" name="unresolved" required />
        </div>
        <div className="form-field md:col-span-2">
          <label htmlFor="timeline">Required timeline</label>
          <input id="timeline" name="timeline" type="text" required />
        </div>
      </div>

      {status === "error" ? (
        <p className="mt-6 text-[15px] text-accent">{error}</p>
      ) : null}

      <div className="mt-8">
        <button
          type="submit"
          className="form-submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Submit situation >"}
        </button>
      </div>
    </form>
  );
}
