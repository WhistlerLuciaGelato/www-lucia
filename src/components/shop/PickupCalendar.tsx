"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { Shop } from "@/lib/content-types";
import { addDays, prettyDate } from "@/lib/format";
import { pickupProblem } from "@/lib/pickup";

// The calendar works with local Date objects; the rest of the app uses YYYY-MM-DD strings.
const toDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function PickupCalendar({
  shop,
  leadDays,
  today,
  value,
  onChange,
}: {
  shop: Shop;
  leadDays: number;
  /** Today in Whistler, or null while prerendering. */
  today: string | null;
  value: string;
  onChange: (isoDate: string) => void;
}) {
  if (!today) {
    return <div className="h-[22rem] animate-pulse rounded-3xl bg-white/70" aria-hidden />;
  }

  const earliest = addDays(today, leadDays);
  const latest = addDays(today, 120);
  const closedDates = new Set(shop.blackoutDates.map((b) => b.date));
  const isUnavailable = (date: Date) => {
    const iso = toIso(date);
    return iso > latest || pickupProblem(iso, shop, leadDays, today) !== null;
  };

  return (
    <div className="lucia-calendar rounded-3xl bg-white p-3 ring-1 ring-alpine">
      <DayPicker
        mode="single"
        required={false}
        selected={value ? toDate(value) : undefined}
        onSelect={(date) => onChange(date ? toIso(date) : "")}
        defaultMonth={toDate(value || earliest)}
        startMonth={toDate(today)}
        endMonth={toDate(latest)}
        disabled={isUnavailable}
        modifiers={{ closed: (date) => closedDates.has(toIso(date)) }}
        modifiersClassNames={{ closed: "lucia-closed" }}
        weekStartsOn={1}
        showOutsideDays={false}
        footer={
          <p className="mt-2 px-1 font-ui text-sm text-ink/75" aria-live="polite">
            {value ? (
              <>
                Pickup <strong className="text-ink">{prettyDate(value)}</strong>, {shop.pickupWindow}
              </>
            ) : (
              "Choose a pickup day. Greyed-out days aren't available."
            )}
          </p>
        }
      />
    </div>
  );
}
