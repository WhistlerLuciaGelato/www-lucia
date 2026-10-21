import "server-only";
import { site } from "@/data/site";

export type EmailMessage = {
  subject: string;
  text: string;
  replyTo?: string;
};

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Sends a notification to the Lucia inbox through Resend's HTTP API.
 * Returns false when email isn't configured so callers can tell the visitor to email directly.
 */
export async function sendToInbox(message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FORMS_FROM_EMAIL ?? "Lucia Gelato website <onboarding@resend.dev>",
      to: (process.env.FORMS_TO_EMAIL ?? site.email).split(",").map((s) => s.trim()),
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}
