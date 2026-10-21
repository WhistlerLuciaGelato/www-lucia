import { NextResponse } from "next/server";
import { formSchema, type FormPayload } from "@/lib/forms";
import { sendToInbox } from "@/lib/email";
import { eventPackages } from "@/data/events";
import { wholesaleFormats } from "@/data/wholesale";
import { money } from "@/lib/format";

function render(payload: FormPayload): { subject: string; text: string; replyTo: string } {
  switch (payload.type) {
    case "contact":
      return {
        subject: `Website enquiry (${payload.topic}) — ${payload.name}`,
        replyTo: payload.email,
        text: [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Phone: ${payload.phone || "—"}`,
          `Topic: ${payload.topic}`,
          "",
          payload.message,
        ].join("\n"),
      };
    case "newsletter":
      return {
        subject: `Newsletter sign-up — ${payload.email}`,
        replyTo: payload.email,
        text: `Please add ${payload.email} to the newsletter list.`,
      };
    case "event": {
      const pkg = eventPackages.find((p) => p.id === payload.package);
      return {
        subject: `Event booking request — ${payload.eventDate} — ${payload.name}`,
        replyTo: payload.email,
        text: [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Phone: ${payload.phone}`,
          `Event date: ${payload.eventDate}`,
          `Event type: ${payload.eventType}`,
          `Location: ${payload.location} (${payload.travel})`,
          `Guests: ${payload.guests}`,
          `Package: ${pkg?.name ?? "Not sure yet"}`,
          "",
          payload.message || "",
        ].join("\n"),
      };
    }
    case "wholesale": {
      const lines = payload.lines.map((l) => {
        const format = wholesaleFormats.find((f) => f.id === l.format);
        const total = format ? money(format.price * l.qty) : "";
        return `- ${l.qty} × ${format?.label ?? l.format} — ${l.flavour} ${total && `(${total})`}`;
      });
      const subtotal = payload.lines.reduce((sum, l) => {
        const format = wholesaleFormats.find((f) => f.id === l.format);
        return sum + (format ? format.price * l.qty : 0);
      }, 0);
      return {
        subject: `Wholesale order — ${payload.business} (${payload.area})`,
        replyTo: payload.email,
        text: [
          `Business: ${payload.business}${payload.newAccount ? " (new account)" : ""}`,
          `Contact: ${payload.name}`,
          `Email: ${payload.email}`,
          `Phone: ${payload.phone}`,
          `Delivery area: ${payload.area}`,
          `Delivery address: ${payload.address}`,
          `Preferred delivery date: ${payload.deliveryDate || "Next scheduled delivery"}`,
          "",
          "Order:",
          ...lines,
          "",
          `Estimated subtotal: ${money(subtotal)} (before delivery fees & tax)`,
          "",
          payload.message || "",
        ].join("\n"),
      };
    }
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real visitors never fill the hidden "website" field.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = formSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const delivered = await sendToInbox(render(parsed.data));
  if (!delivered) {
    return NextResponse.json(
      { ok: false, error: "unavailable", fallback: render(parsed.data) },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true });
}
