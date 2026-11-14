import type { Shop } from "@/lib/content-types";
import { DELIVERY_SCHEDULE } from "@/data/shop";
import { addDays, prettyDate } from "@/lib/format";

/** Day of the week (0 = Sunday) for a YYYY-MM-DD date. */
export function weekday(isoDate: string): number {
  return new Date(`${isoDate}T12:00:00Z`).getUTCDay();
}

/**
 * The first Thursday an order placed today can be delivered: orders close on the Sunday before
 * (11:59pm), so the Thursday must be at least 4 days away, and no sooner than the order's own
 * lead time.
 */
export function firstDeliveryDate(today: string, leadDays: number): string {
  let date = addDays(today, Math.max(leadDays, DELIVERY_SCHEDULE.cutoffDaysBefore));
  while (weekday(date) !== DELIVERY_SCHEDULE.weekday) date = addDays(date, 1);
  return date;
}

/**
 * Why a pickup (or, with `delivery`, a delivery) date can't be chosen, or null if it's fine.
 * Shared by the calendar (to grey out days) and the checkout API (to enforce the rules).
 */
export function pickupProblem(
  isoDate: string,
  shop: Shop,
  leadDays: number,
  today: string,
  delivery = false,
): string | null {
  const closed = shop.blackoutDates.find((b) => b.date === isoDate);
  const closedMessage = closed
    ? `We're closed on ${prettyDate(isoDate)}${closed.note ? ` (${closed.note})` : ""}.`
    : null;
  if (delivery) {
    const earliest = firstDeliveryDate(today, leadDays);
    if (weekday(isoDate) !== DELIVERY_SCHEDULE.weekday) return `We deliver on ${DELIVERY_SCHEDULE.dayName}s only.`;
    if (isoDate < earliest)
      return `Orders placed after ${DELIVERY_SCHEDULE.cutoffName} at ${DELIVERY_SCHEDULE.cutoffTime} are delivered the following week. The earliest delivery for this order is ${prettyDate(earliest)}.`;
    return closedMessage;
  }
  const earliest = addDays(today, leadDays);
  if (isoDate < earliest) return `The earliest pickup for this order is ${prettyDate(earliest)}.`;
  if (closedMessage) return closedMessage;
  if (!shop.pickupDays.includes(weekday(isoDate))) return `Pickup isn't available on ${prettyDate(isoDate)}.`;
  return null;
}

/** First date on or after the lead time that passes every rule (searches up to a year ahead). */
export function firstPickupDate(shop: Shop, leadDays: number, today: string, delivery = false): string | null {
  for (let i = leadDays; i < leadDays + 366; i++) {
    const date = addDays(today, i);
    if (!pickupProblem(date, shop, leadDays, today, delivery)) return date;
  }
  return null;
}
