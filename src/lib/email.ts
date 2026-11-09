import "server-only";

export type EmailMessage = {
  subject: string;
  text: string;
  replyTo?: string;
};

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Lucia's inbox for website notifications (FORMS_TO_EMAIL, comma-separated, or the given fallback). */
export function inboxAddresses(fallback: string): string[] {
  return (process.env.FORMS_TO_EMAIL || fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Sends a plain-text email through Resend's HTTP API.
 * Returns false when email isn't configured or Resend refuses it, so callers can fall back.
 */
export async function sendEmail(to: string[], message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || to.length === 0) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FORMS_FROM_EMAIL ?? "Lucia Gelato website <onboarding@resend.dev>",
      to,
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

/** Sends a notification to the Lucia inbox. */
export function sendToInbox(message: EmailMessage, inbox: string): Promise<boolean> {
  return sendEmail(inboxAddresses(inbox), message);
}
