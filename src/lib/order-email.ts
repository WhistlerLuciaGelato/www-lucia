import "server-only";
import { getShop, getSiteSettings } from "@/lib/content";
import { emailConfigured, inboxAddresses, sendEmail } from "@/lib/email";
import { money, prettyDate } from "@/lib/format";
import {
  describeCard,
  isDelivery,
  orderRecipient,
  receiptUrls,
  retrieveOrder,
  type Order,
  type SquareConfig,
} from "@/lib/square";

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
    ...(order.service_charges ?? []).map(
      (c) => `${c.name ?? "Delivery"}: ${money(c.amount_money?.amount ?? 0)}`,
    ),
    ...(order.total_tax_money?.amount ? [`GST: ${money(order.total_tax_money.amount)}`] : []),
    `Total paid: ${money(order.total_money?.amount ?? 0)}`,
    ...(order.tenders ?? []).map(
      (t) => `  ${describeCard(t.card_details)}: ${money(t.amount_money?.amount ?? 0)}`,
    ),
  ];
}

/**
 * Emails Lucia's inbox ("new pickup order" or "new delivery order") and the customer (confirmation with their Square
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

    const recipient = orderRecipient(order);
    const delivery = isDelivery(order);
    const kind = delivery ? "delivery" : "pickup";
    const pickupDate = order.metadata?.pickup_date;
    const pickup = delivery
      ? `${pickupDate ? prettyDate(pickupDate) : "date to confirm"} (${order.metadata?.delivery_zone ?? "delivery"})`
      : pickupDate
        ? `${prettyDate(pickupDate)}, ${shop.pickupWindow}`
        : shop.pickupWindow;
    const where = delivery ? (order.metadata?.delivery_address ?? "—") : shop.pickupWhere;
    const notes = order.metadata?.notes;
    const shortId = order.id.slice(-6).toUpperCase();
    const test = square.environment === "sandbox" ? "[TEST] " : "";

    const kitchen = sendEmail(inboxAddresses(contact.email), {
      subject: `${test}New ${kind} order — ${pickupDate ? prettyDate(pickupDate) : kind} — ${recipient?.display_name ?? "Customer"}`,
      replyTo: recipient?.email_address,
      text: [
        `${delivery ? "Delivery" : "Pickup"}: ${pickup}`,
        ...(delivery ? [`Address: ${where}`] : []),
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
          subject: `${test}Your Lucia Gelato order — ${kind} ${pickupDate ? prettyDate(pickupDate) : "details"}`,
          replyTo: contact.email,
          text: [
            `Hi ${recipient.display_name ?? "there"},`,
            "",
            "Thanks for your order! Here are the details.",
            "",
            `${delivery ? "Delivery" : "Pickup"}: ${pickup}`,
            `${delivery ? "Delivering to" : "Where"}: ${where}`,
            ...(delivery ? ["We'll be in touch to arrange a delivery time."] : []),
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
