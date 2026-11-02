import { NextResponse } from "next/server";
import { priceCart } from "@/lib/cart";
import { checkoutSchema, type CheckoutResponse } from "@/lib/checkout";
import { getCatalogue } from "@/lib/content";
import { e164Phone, prettyDate, todayInWhistler, whistlerDateTime } from "@/lib/format";
import { pickupProblem } from "@/lib/pickup";
import { createOrder, getSquareConfig } from "@/lib/square";

/** Optional flat tax on every order, e.g. SQUARE_TAX_PERCENTAGE=5 and SQUARE_TAX_NAME=GST. */
function orderTaxes() {
  const percentage = process.env.SQUARE_TAX_PERCENTAGE?.trim();
  if (!percentage || !(Number(percentage) > 0)) return undefined;
  return [{ uid: "tax", name: process.env.SQUARE_TAX_NAME?.trim() || "Tax", percentage, scope: "ORDER" }];
}

/**
 * Step 1 of checkout: re-price the cart from the live catalogue, check the pickup date and
 * create the Square order (a pickup for the kitchen). The browser then pays it with
 * /api/checkout/pay using the Web Payments SDK, which is how gift cards are redeemed.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const contactIssue = parsed.error.issues.find((i) => i.path[0] === "contact");
    return NextResponse.json(
      { error: contactIssue?.message ?? "Your cart looks out of date — please refresh." },
      { status: 422 },
    );
  }

  const { items, pickupDate, notes, contact, idempotencyKey } = parsed.data;
  const catalogue = await getCatalogue();
  const { shop } = catalogue;
  const { lines, unavailable, leadDays } = priceCart(items, catalogue);
  if (unavailable.length > 0) {
    return NextResponse.json(
      { error: "Something in your cart is no longer available. Please review your cart and try again." },
      { status: 409 },
    );
  }
  if (lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 422 });
  }

  const problem = pickupProblem(pickupDate, shop, leadDays, todayInWhistler());
  if (problem) {
    return NextResponse.json({ error: problem }, { status: 422 });
  }

  const square = getSquareConfig();
  if (!square) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const pickupNote = [`Pickup ${prettyDate(pickupDate)}, ${shop.pickupWindow}.`, notes]
    .filter(Boolean)
    .join(" ");

  let order;
  try {
    order = await createOrder(square, idempotencyKey, {
      source: { name: "Lucia Gelato website" },
      line_items: lines.map((line) => ({
        name: line.name,
        quantity: String(line.qty),
        note: line.detail,
        base_price_money: { amount: line.unitPrice, currency: "CAD" },
      })),
      taxes: orderTaxes(),
      fulfillments: [
        {
          type: "PICKUP",
          state: "PROPOSED",
          pickup_details: {
            recipient: {
              display_name: contact.name,
              email_address: contact.email,
              phone_number: e164Phone(contact.phone),
            },
            schedule_type: "SCHEDULED",
            // The kitchen's pickup window is free text; the order shows its start as noon and the
            // full window in the note.
            pickup_at: whistlerDateTime(pickupDate, 12),
            note: pickupNote.slice(0, 500),
          },
        },
      ],
      metadata: {
        pickup_date: pickupDate,
        ...(notes ? { notes: notes.slice(0, 255) } : {}),
      },
    });
  } catch (err) {
    console.error("Square order error", err);
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again in a moment." },
      { status: 502 },
    );
  }

  const response: CheckoutResponse = {
    orderId: order.id,
    total: order.total_money?.amount ?? 0,
    tax: order.total_tax_money?.amount ?? 0,
    square: {
      applicationId: square.applicationId,
      locationId: square.locationId,
      environment: square.environment,
    },
  };
  return NextResponse.json(response);
}
