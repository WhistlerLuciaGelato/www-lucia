import { after, NextResponse } from "next/server";
import { paySchema, type PayResponse } from "@/lib/checkout";
import { prettyDate } from "@/lib/format";
import { sendOrderEmails } from "@/lib/order-email";
import {
  cancelPayment,
  createPayment,
  describeCard,
  getPayment,
  getSquareConfig,
  isPaid,
  payOrder,
  paymentErrorMessage,
  retrieveOrder,
  type Payment,
} from "@/lib/square";

/**
 * Step 2 of checkout: charge a gift card or card token (from the Web Payments SDK) against the
 * Square order.
 *
 * Every payment is authorized with delayed capture. A gift card is charged with partial
 * authorization, so a gift card worth less than the order covers what it can and the rest is
 * paid with another gift card or a card. Once the payments add up to the order total, PayOrder
 * captures them all together; until then nothing is taken, and abandoned holds release
 * themselves after an hour.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = paySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { orderId, sourceId, method, idempotencyKey, heldPaymentIds } = parsed.data;

  const square = getSquareConfig();
  if (!square) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const order = await retrieveOrder(square, orderId).catch(() => null);
  if (!order || order.location_id !== square.locationId) {
    return NextResponse.json(
      { error: "We couldn't find this order. Please start checkout again." },
      { status: 404 },
    );
  }
  if (isPaid(order)) {
    const done: PayResponse = { status: "paid", orderId };
    return NextResponse.json(done);
  }
  if (order.state !== "OPEN") {
    return NextResponse.json(
      { error: "This order has expired. Please start checkout again." },
      { status: 409 },
    );
  }

  // Gift card balances already held for this order.
  let held: Payment[];
  try {
    held = await Promise.all(heldPaymentIds.map((id) => getPayment(square, id)));
  } catch {
    return NextResponse.json({ error: "Please start checkout again.", restart: true }, { status: 409 });
  }
  if (held.some((p) => p.order_id !== orderId || p.status !== "APPROVED")) {
    return NextResponse.json(
      { error: "Your gift card hold has expired. Please apply the gift card again.", restart: true },
      { status: 409 },
    );
  }

  const total = order.total_money?.amount ?? 0;
  const due = total - held.reduce((sum, p) => sum + p.amount_money.amount, 0);
  if (due <= 0) {
    return NextResponse.json({ error: "This order is already covered." }, { status: 409 });
  }

  const recipient = order.fulfillments?.[0]?.pickup_details?.recipient;
  const pickupDate = order.metadata?.pickup_date;

  let payment: Payment;
  try {
    payment = await createPayment(square, {
      source_id: sourceId,
      idempotency_key: idempotencyKey,
      amount_money: { amount: due, currency: order.total_money?.currency ?? "CAD" },
      order_id: orderId,
      autocomplete: false,
      delay_duration: "PT1H",
      delay_action: "CANCEL",
      ...(method === "gift-card" ? { accept_partial_authorization: true } : {}),
      ...(recipient?.email_address ? { buyer_email_address: recipient.email_address } : {}),
      note: pickupDate ? `Lucia Gelato pickup ${prettyDate(pickupDate)}` : "Lucia Gelato pickup",
    });
  } catch (err) {
    console.error("Square payment error", err);
    return NextResponse.json({ error: paymentErrorMessage(err, method) }, { status: 402 });
  }

  if (payment.status !== "APPROVED") {
    return NextResponse.json({ error: paymentErrorMessage(null, method) }, { status: 402 });
  }

  const remaining = due - payment.amount_money.amount;
  if (remaining > 0) {
    const partial: PayResponse = {
      status: "partial",
      held: {
        id: payment.id,
        label: describeCard(payment.card_details, method === "gift-card" ? "Gift card" : "Card"),
        amount: payment.amount_money.amount,
      },
      remaining,
    };
    return NextResponse.json(partial);
  }

  try {
    await payOrder(square, orderId, [...heldPaymentIds, payment.id], `${idempotencyKey}:pay`);
  } catch (err) {
    console.error("Square pay order error", err);
    await cancelPayment(square, payment.id).catch(() => null);
    return NextResponse.json(
      { error: "We couldn't complete the payment. You haven't been charged — please try again." },
      { status: 502 },
    );
  }

  // Only this request flips the order to paid (a retry hits the isPaid early return above),
  // so each order is emailed once. Sent after the response so checkout isn't held up.
  after(() => sendOrderEmails(square, orderId));

  const paid: PayResponse = { status: "paid", orderId };
  return NextResponse.json(paid);
}
