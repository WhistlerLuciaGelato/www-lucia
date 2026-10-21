import type { Shop } from "@/lib/content-types";
import { addDays, prettyDate } from "@/lib/format";

/** Day of the week (0 = Sunday) for a YYYY-MM-DD date. */
export function weekday(isoDate: string): number {
  return new Date(`${isoDate}T12:00:00Z`).getUTCDay();
}

/**
 * Why a pickup date can't be chosen, or null if it's fine.
 * Shared by the calendar (to grey out days) and the checkout API (to enforce the rules).
 */
export function pickupProblem(isoDate: string, shop: Shop, leadDays: number, today: string): string | null {
  const earliest = addDays(today, leadDays);
  if (isoDate < earliest) return `The earliest pickup for this order is ${prettyDate(earliest)}.`;
  const closed = shop.blackoutDates.find((b) => b.date === isoDate);
  if (closed) return `We're closed on ${prettyDate(isoDate)}${closed.note ? ` (${closed.note})` : ""}.`;
  if (!shop.pickupDays.includes(weekday(isoDate))) return `Pickup isn't available on ${prettyDate(isoDate)}.`;
  return null;
}

/** First date on or after the lead time that passes every rule (searches up to a year ahead). */
export function firstPickupDate(shop: Shop, leadDays: number, today: string): string | null {
  for (let i = leadDays; i < leadDays + 366; i++) {
    const date = addDays(today, i);
    if (!pickupProblem(date, shop, leadDays, today)) return date;
  }
  return null;
}
