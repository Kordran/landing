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
          situation: data.get("situation"),
          area: data.get("area"),
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
      <div className="form-success border border-border p-10 md:p-12">
        <p className="label mb-4">Received</p>
        <p className="text-body max-w-xl text-text">
          Your message has been received. Submitted information is reviewed
          confidentially to determine whether the problem fits Kordran&apos;s
          scope.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-border p-10 md:p-12">
      <p className="label mb-10">Request a review</p>
      <div className="grid gap-7 md:grid-cols-2">
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
        <div className="form-field md:col-span-2">
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div className="form-field md:col-span-2">
          <label htmlFor="situation">
            What is happening, and what result do you need?
          </label>
          <textarea id="situation" name="situation" required rows={6} />
        </div>
        <div className="form-field">
          <label htmlFor="area">Area of concern (optional)</label>
          <select id="area" name="area" defaultValue="">
            <option value="" disabled>
              Select if known
            </option>
            <option value="landed-cost">Landed cost / duties / freight</option>
            <option value="supplier-pricing">Supplier pricing</option>
            <option value="trade-customs">Trade and customs operations</option>
            <option value="other">Other / not sure</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="timeline">Approximate timeline (optional)</label>
          <input
            id="timeline"
            name="timeline"
            type="text"
            placeholder="e.g. This quarter"
          />
        </div>
      </div>

      {status === "error" ? (
        <p className="mt-6 text-[15px] text-accent" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8">
        <button
          type="submit"
          className="form-submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Request a review"}
        </button>
      </div>
    </form>
  );
}
