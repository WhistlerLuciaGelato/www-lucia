/**
 * Calendar helpers for the Schedule & hours section. Plain functions, so the page (server)
 * and the calendar (browser) read the same location data the same way.
 */
import type { CalendarColor, Location, Weekday } from "@/lib/content-types";

const weekdayKeys: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Weekday of a YYYY-MM-DD date, independent of the browser's time zone. */
export function weekdayOf(ymd: string): Weekday {
  const [y, m, d] = ymd.split("-").map(Number);
  return weekdayKeys[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/** YYYY-MM-DD for a year, month (1–12) and day. */
export function ymd(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Whether a spot is on the calendar for a YYYY-MM-DD date. */
export function isOpenOn(spot: Location, date: string): boolean {
  if (spot.seasonClosed || !spot.calendarCode || spot.closedOn === date) return false;
  return spot.openDates.some((o) => {
    const to = o.to && o.to > o.from ? o.to : o.from;
    if (date < o.from || date > to) return false;
    return o.days.length === 0 || o.days.includes(weekdayOf(date));
  });
}

/** The first open date on or after `from` across all spots, if any. */
export function nextOpenDate(spots: Location[], from: string): string | undefined {
  let best: string | undefined;
  for (const spot of spots) {
    if (spot.seasonClosed || !spot.calendarCode) continue;
    for (const o of spot.openDates) {
      const to = o.to && o.to > o.from ? o.to : o.from;
      if (to < from) continue;
      // Walk the run until a day matches (at most two weeks past its start).
      const [y, m, d] = (o.from < from ? from : o.from).split("-").map(Number);
      for (let i = 0; i < 14; i++) {
        const day = new Date(Date.UTC(y, m - 1, d + i));
        const date = ymd(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate());
        if (date > to) break;
        if (isOpenOn(spot, date)) {
          if (!best || date < best) best = date;
          break;
        }
      }
    }
  }
  return best;
}

/** Text and chip colours for each calendar colour (literal class names so Tailwind sees them). */
export const calendarColors: Record<CalendarColor, { text: string; chip: string }> = {
  heatwave: { text: "text-heatwave", chip: "bg-heatwave text-snow" },
  lakeside: { text: "text-lakeside", chip: "bg-lakeside text-snow" },
  grass: { text: "text-grass", chip: "bg-grass text-snow" },
  alpenglow: { text: "text-alpenglow", chip: "bg-alpenglow text-ink" },
  sunflower: { text: "text-sunflower", chip: "bg-sunflower text-ink" },
  strawberry: { text: "text-strawberry", chip: "bg-strawberry text-snow" },
};
