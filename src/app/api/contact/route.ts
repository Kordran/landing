import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

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

  let supabase: ReturnType<typeof getSupabaseAdmin>;

  try {
    supabase = getSupabaseAdmin();
  } catch (error) {
    console.error("Supabase contact storage is not configured", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Unable to submit your request. Please try again later." },
      { status: 503 }
    );
  }

  const { data: submission, error: insertError } = await supabase
    .from("contact_submissions")
    .insert({
      name,
      company,
      email,
      situation,
      area: area || null,
      timeline: timeline || null,
      notification_status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !submission) {
    console.error("Supabase contact insert failed", {
      code: insertError?.code,
      message: insertError?.message,
    });
    return NextResponse.json(
      { error: "Unable to submit your request. Please try again later." },
      { status: 503 }
    );
  }

  const submissionId = submission.id as string;

  async function updateNotificationStatus(
    status: "sent" | "failed" | "not_configured",
    notificationError: string | null = null
  ) {
    const { error } = await supabase
      .from("contact_submissions")
      .update({
        notification_status: status,
        notification_error: notificationError,
      })
      .eq("id", submissionId);

    if (error) {
      console.error("Supabase notification status update failed", {
        submissionId,
        status,
        code: error.code,
        message: error.message,
      });
    }
  }

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
        await updateNotificationStatus(
          "failed",
          `Resend returned HTTP ${response.status}.`
        );
        console.error("Resend contact notification failed", {
          submissionId,
          status: response.status,
        });
        return NextResponse.json(
          { error: "Unable to deliver message. Please email contact@kordran.com." },
          { status: 502 }
        );
      }

      await updateNotificationStatus("sent");
    } catch (error) {
      await updateNotificationStatus(
        "failed",
        "The notification request could not be completed."
      );
      console.error("Contact notification request failed", {
        submissionId,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      return NextResponse.json(
        { error: "Unable to deliver message. Please email contact@kordran.com." },
        { status: 502 }
      );
    }
  } else {
    await updateNotificationStatus("not_configured");
  }

  return NextResponse.json({ ok: true });
}
