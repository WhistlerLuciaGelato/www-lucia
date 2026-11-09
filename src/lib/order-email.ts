import "server-only";
import { getShop, getSiteSettings } from "@/lib/content";
import { emailConfigured, inboxAddresses, sendEmail } from "@/lib/email";
import { money, prettyDate } from "@/lib/format";
import { describeCard, receiptUrls, retrieveOrder, type Order, type SquareConfig } from "@/lib/square";

/** One line per item, pre-tax, so the lines plus GST add up to the total. */
function itemLines(order: Order): string[] {
  return (order.line_items ?? []).map((li) => {
    const amount =
      li.gross_sales_money?.amount ?? (li.total_money?.amount ?? 0) - (li.total_tax_money?.amount ?? 0);
    const detail = li.note ? ` (${li.note})` : "";
    return `- ${li.quantity} × ${li.name ?? "Item"}${detail} — ${money(amount)}`;
  });
}

function totals(order: Order): string[] {
  return [
    ...(order.total_tax_money?.amount ? [`GST: ${money(order.total_tax_money.amount)}`] : []),
    `Total paid: ${money(order.total_money?.amount ?? 0)}`,
    ...(order.tenders ?? []).map(
      (t) => `  ${describeCard(t.card_details)}: ${money(t.amount_money?.amount ?? 0)}`,
    ),
  ];
}

/**
 * Emails Lucia's inbox ("new pickup order") and the customer (confirmation with their Square
 * receipt) once an order is paid. Never throws: a failed email mustn't undo a paid order.
 */
export async function sendOrderEmails(square: SquareConfig, orderId: string): Promise<void> {
  if (!emailConfigured()) return;
  try {
    const [order, shop, { contact }] = await Promise.all([
      retrieveOrder(square, orderId),
      getShop(),
      getSiteSettings(),
    ]);
    const receipts = await receiptUrls(square, order, 6_000);

    const recipient = order.fulfillments?.[0]?.pickup_details?.recipient;
    const pickupDate = order.metadata?.pickup_date;
    const pickup = pickupDate ? `${prettyDate(pickupDate)}, ${shop.pickupWindow}` : shop.pickupWindow;
    const notes = order.metadata?.notes;
    const shortId = order.id.slice(-6).toUpperCase();
    const test = square.environment === "sandbox" ? "[TEST] " : "";

    const kitchen = sendEmail(inboxAddresses(contact.email), {
      subject: `${test}New pickup order — ${pickupDate ? prettyDate(pickupDate) : "pickup"} — ${recipient?.display_name ?? "Customer"}`,
      replyTo: recipient?.email_address,
      text: [
        `Pickup: ${pickup}`,
        "",
        `Name: ${recipient?.display_name ?? "—"}`,
        `Email: ${recipient?.email_address ?? "—"}`,
        `Phone: ${recipient?.phone_number ?? "—"}`,
        ...(notes ? ["", `Notes: ${notes}`] : []),
        "",
        "Order:",
        ...itemLines(order),
        "",
        ...totals(order),
        "",
        `Order ${shortId} — also in Square under Orders.`,
      ].join("\n"),
    });

    const customer = recipient?.email_address
      ? sendEmail([recipient.email_address], {
          subject: `${test}Your Lucia Gelato order — pickup ${pickupDate ? prettyDate(pickupDate) : "details"}`,
          replyTo: contact.email,
          text: [
            `Hi ${recipient.display_name ?? "there"},`,
            "",
            "Thanks for your order! Here are the details.",
            "",
            `Pickup: ${pickup}`,
            `Where: ${shop.pickupWhere}`,
            "",
            ...itemLines(order),
            "",
            ...totals(order),
            ...(receipts.length ? ["", `Receipt: ${receipts.join("\n         ")}`] : []),
            "",
            `Questions or need to change something? Reply to this email or call ${contact.phone}.`,
            "",
            "Lucia Gelato",
          ].join("\n"),
        })
      : Promise.resolve(true);

    await Promise.all([kitchen, customer]);
  } catch (err) {
    console.error("Order email error", orderId, err);
  }
}
