import { NextResponse } from "next/server";
import { z } from "zod";
import { cartSchema, priceCart } from "@/lib/cart";
import { addDays, isIsoDate, prettyDate, todayInWhistler } from "@/lib/format";
import { getStripe } from "@/lib/stripe";
import { pickup } from "@/data/shop";
import { site } from "@/data/site";

const checkoutSchema = z.object({
  items: cartSchema,
  pickupDate: z.string().refine(isIsoDate, "Choose a pickup date"),
  notes: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Your cart looks out of date — please refresh." }, { status: 422 });
  }

  const { items, pickupDate, notes } = parsed.data;
  const { lines, leadDays } = priceCart(items);
  if (lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 422 });
  }

  const earliest = addDays(todayInWhistler(), leadDays);
  if (pickupDate < earliest) {
    return NextResponse.json(
      {
        error: `The earliest pickup for this order is ${prettyDate(earliest)}.`,
      },
      { status: 422 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ? site.url : new URL(request.url).origin;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "cad",
      line_items: lines.map((line) => ({
        quantity: line.qty,
        price_data: {
          currency: "cad",
          unit_amount: line.unitPrice,
          product_data: { name: line.name, description: line.detail },
        },
      })),
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
      custom_text: {
        submit: {
          message: `Pickup on ${prettyDate(pickupDate)}, ${pickup.window}, at ${pickup.where}.`,
        },
      },
      metadata: {
        pickup_date: pickupDate,
        notes: notes ?? "",
        // Compact copy of the order for the kitchen, visible in the Stripe dashboard.
        order: lines
          .map((l) => `${l.qty}× ${l.name} (${l.detail})`)
          .join(" | ")
          .slice(0, 500),
      },
      payment_intent_data: {
        description: `Lucia Gelato pickup ${pickupDate}`,
      },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: session.url });
}
