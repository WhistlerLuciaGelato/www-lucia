import { NextResponse } from "next/server";
import { priceCart } from "@/lib/cart";
import { checkoutSchema, type CheckoutResponse } from "@/lib/checkout";
import { getCatalogue } from "@/lib/content";
import { DELIVERY_ZONES, SALES_TAX, deliveryFee } from "@/data/shop";
import { e164Phone, prettyDate, todayInWhistler, whistlerDateTime } from "@/lib/format";
import { pickupProblem } from "@/lib/pickup";
import { createOrder, getSquareConfig } from "@/lib/square";

/**
 * Step 1 of checkout: re-price the cart from the live catalogue, check the date and create the
 * Square order (a pickup at the kitchen, or a delivery with its fee as a service charge). The browser then pays it with
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

  const { items, fulfillment, pickupDate, notes, contact, idempotencyKey } = parsed.data;
  const catalogue = await getCatalogue();
  const { shop } = catalogue;
  const { lines, unavailable, leadDays, subtotal } = priceCart(items, catalogue);
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

  const zone =
    fulfillment.method === "delivery" ? DELIVERY_ZONES.find((z) => z.id === fulfillment.zone) : undefined;
  if (fulfillment.method === "delivery" && !zone) {
    return NextResponse.json({ error: "Please choose a delivery area." }, { status: 422 });
  }
  const fee = zone ? (deliveryFee(zone.id, subtotal) ?? 0) : 0;

  const square = getSquareConfig();
  if (!square) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const pickupNote = [
    zone
      ? `Delivery ${prettyDate(pickupDate)} (${zone.label}).`
      : `Pickup ${prettyDate(pickupDate)}, ${shop.pickupWindow}.`,
    notes,
  ]
    .filter(Boolean)
    .join(" ");
  const recipient = {
    display_name: contact.name,
    email_address: contact.email,
    phone_number: e164Phone(contact.phone),
  };

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
      taxes: [{ uid: "gst", name: SALES_TAX.name, percentage: String(SALES_TAX.percentage), scope: "ORDER" }],
      // Taxable, so GST applies to the delivery fee as it does to the order.
      ...(fee > 0 && zone
        ? {
            service_charges: [
              {
                name: `Delivery (${zone.label})`,
                amount_money: { amount: fee, currency: "CAD" },
                calculation_phase: "SUBTOTAL_PHASE",
                taxable: true,
              },
            ],
          }
        : {}),
      fulfillments: [
        fulfillment.method === "delivery"
          ? {
              type: "DELIVERY",
              state: "PROPOSED",
              delivery_details: {
                recipient: {
                  ...recipient,
                  address: {
                    address_line_1: fulfillment.street,
                    locality: fulfillment.city,
                    administrative_district_level_1: "BC",
                    postal_code: fulfillment.postalCode.toUpperCase(),
                    country: "CA",
                  },
                },
                schedule_type: "SCHEDULED",
                // The delivery time is arranged with the customer; the order shows noon on the day.
                deliver_at: whistlerDateTime(pickupDate, 12),
                note: pickupNote.slice(0, 550),
              },
            }
          : {
              type: "PICKUP",
              state: "PROPOSED",
              pickup_details: {
                recipient,
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
        fulfillment: fulfillment.method,
        ...(fulfillment.method === "delivery"
          ? {
              delivery_zone: zone?.label ?? fulfillment.zone,
              delivery_address:
                `${fulfillment.street}, ${fulfillment.city} ${fulfillment.postalCode.toUpperCase()}`.slice(
                  0,
                  255,
                ),
            }
          : {}),
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
