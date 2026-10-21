"use client";

import { useToday } from "@/lib/cart-store";

/**
 * "Closed today" / "Closed for the season" badge. Pages are cached, so whether
 * today is the closed day is worked out in the browser.
 */
export function LocationStatus({
  closedOn,
  closureNote,
  seasonClosed,
  inverted = false,
}: {
  closedOn?: string;
  closureNote?: string;
  seasonClosed: boolean;
  /** Light text for dark backgrounds. */
  inverted?: boolean;
}) {
  const today = useToday();
  const closedToday = Boolean(today && closedOn === today);
  if (!seasonClosed && !closedToday) return null;

  return (
    <span className="mt-2 flex flex-wrap items-center gap-2 font-ui text-sm">
      <span
        className={`rounded-full px-2.5 py-0.5 font-extrabold ${
          inverted ? "bg-snow text-berry" : "bg-berry text-white"
        }`}
      >
        {seasonClosed ? "Closed for the season" : "Closed today"}
      </span>
      {closedToday && closureNote ? (
        <span className={inverted ? "text-snow/90" : "text-ink/80"}>{closureNote}</span>
      ) : null}
    </span>
  );
}
