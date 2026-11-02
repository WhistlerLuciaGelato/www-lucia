import { NextResponse } from "next/server";
import { releaseSchema } from "@/lib/checkout";
import { cancelPayment, getPayment, getSquareConfig } from "@/lib/square";

/**
 * Releases gift card holds on an unpaid order: when the buyer removes a gift card, goes back to
 * change the order or leaves the page. Only approved, uncaptured payments on that order are
 * cancelled, so this can't touch a completed sale.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    // sendBeacon posts text/plain, so read the text and parse it ourselves.
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = releaseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const square = getSquareConfig();
  if (!square) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const { orderId, paymentIds } = parsed.data;
  await Promise.all(
    paymentIds.map(async (id) => {
      const payment = await getPayment(square, id).catch(() => null);
      if (payment?.order_id === orderId && payment.status === "APPROVED") {
        await cancelPayment(square, id).catch((err) => console.error("Square cancel error", err));
      }
    }),
  );
  return NextResponse.json({ ok: true });
}
