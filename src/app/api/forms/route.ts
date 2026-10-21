import { NextResponse } from "next/server";
import { formSchema, wholesaleLineIssues, type FormPayload } from "@/lib/forms";
import { sendToInbox } from "@/lib/email";
import { getEvents, getSiteSettings, getWholesale } from "@/lib/content";
import type { EventsContent, WholesaleContent, WholesaleFormat } from "@/lib/content-types";
import { money } from "@/lib/format";

type Rendered = { subject: string; text: string; replyTo: string };

function render(payload: FormPayload, events: EventsContent, wholesale: WholesaleContent): Rendered {
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
      const pkg = events.packages.find((p) => p.id === payload.package);
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
      const formatOf = (id: string) => wholesale.formats.find((f) => f.id === id);
      const lines = payload.lines.map((l) => {
        const format = formatOf(l.format);
        const total = format ? ` (${money(format.price * l.qty)})` : "";
        return `- ${l.qty} × ${format?.label ?? l.format} — ${l.flavour}${total}`;
      });
      const subtotal = payload.lines.reduce((sum, l) => sum + (formatOf(l.format)?.price ?? 0) * l.qty, 0);
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
    const issues: { path: PropertyKey[]; message: string }[] = [...parsed.error.issues];
    // Also report quantity problems on wholesale lines, so every error shows in one round trip.
    const raw = body as { type?: unknown; lines?: unknown };
    if (raw?.type === "wholesale" && Array.isArray(raw.lines)) {
      const { formats } = await getWholesale();
      raw.lines.forEach((line: { format?: unknown; qty?: unknown }, i) => {
        const format = formats.find((f) => f.id === line?.format);
        const qty = Number(line?.qty);
        if (format && qty > 0 && qty % format.multiple !== 0) {
          issues.push({
            path: ["lines", i, "qty"],
            message: `${format.label} are ordered in multiples of ${format.multiple}`,
          });
        }
      });
    }
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields", issues },
      { status: 422 },
    );
  }
  const payload = parsed.data;

  const [settings, events, wholesale] = await Promise.all([getSiteSettings(), getEvents(), getWholesale()]);

  if (payload.type === "wholesale") {
    const flavoursFor = (format: WholesaleFormat) =>
      wholesale.flavourGroups.filter((g) => g.availableIn.includes(format.kind)).flatMap((g) => g.flavours);
    const issues = wholesaleLineIssues(payload.lines, wholesale.formats, flavoursFor);
    if (issues.length) {
      return NextResponse.json(
        { ok: false, error: "Please check the highlighted fields", issues },
        { status: 422 },
      );
    }
  }

  const message = render(payload, events, wholesale);
  const delivered = await sendToInbox(message, settings.contact.email);
  if (!delivered) {
    return NextResponse.json(
      { ok: false, error: "unavailable", fallback: { ...message, to: settings.contact.email } },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true });
}
