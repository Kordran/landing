import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  company?: string;
  email?: string;
  situation?: string;
  area?: string;
  timeline?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() || "";
  const company = body.company?.trim() || "";
  const email = body.email?.trim() || "";
  const situation = body.situation?.trim() || "";
  const area = body.area?.trim() || "";
  const timeline = body.timeline?.trim() || "";

  if (!name || !company || !email || !situation) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid work email." },
      { status: 400 }
    );
  }

  const submission = {
    name,
    company,
    email,
    situation,
    area,
    timeline,
    receivedAt: new Date().toISOString(),
  };

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "contact@kordran.com";
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "Kordran Website <onboarding@resend.dev>";

  if (resendKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `Contact inquiry - ${company}`,
          text: [
            `Name: ${name}`,
            `Company: ${company}`,
            `Email: ${email}`,
            `Area: ${area || "Not specified"}`,
            `Timeline: ${timeline || "Not specified"}`,
            "",
            "What is happening, and what result do you need?",
            situation,
          ].join("\n"),
        }),
      });

      if (!response.ok) {
        console.error("Resend error", await response.text());
        return NextResponse.json(
          { error: "Unable to deliver message. Please email contact@kordran.com." },
          { status: 502 }
        );
      }
    } catch (error) {
      console.error("Contact delivery failed", error);
      return NextResponse.json(
        { error: "Unable to deliver message. Please email contact@kordran.com." },
        { status: 502 }
      );
    }
  } else {
    console.info("Contact submission received", submission);
  }

  return NextResponse.json({ ok: true });
}
