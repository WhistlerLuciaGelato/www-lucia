"use client";

import { useState } from "react";
import type { Location } from "@/lib/content-types";
import { useToday } from "@/lib/cart-store";
import { calendarColors, isOpenOn, nextOpenDate, weekdayOf, ymd } from "@/components/find-us/schedule";

const weekdays = [
  { short: "M", long: "Monday" },
  { short: "T", long: "Tuesday" },
  { short: "W", long: "Wednesday" },
  { short: "T", long: "Thursday" },
  { short: "F", long: "Friday" },
  { short: "S", long: "Saturday" },
  { short: "S", long: "Sunday" },
];
const mondayFirst = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 } as const;

type Month = { year: number; month: number };

const monthLabel = ({ year, month }: Month) =>
  new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const shift = ({ year, month }: Month, by: number): Month => {
  const i = year * 12 + (month - 1) + by;
  return { year: Math.floor(i / 12), month: (i % 12) + 1 };
};

const parseMonth = (date: string): Month => {
  const [year, month] = date.split("-").map(Number);
  return { year, month };
};

/** The month's days as weeks (Monday first), with nulls before the 1st and after the last day. */
function weeksOf({ year, month }: Month): (string | null)[][] {
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (string | null)[] = Array(mondayFirst[weekdayOf(ymd(year, month, 1))]).fill(null);
  for (let d = 1; d <= days; d++) cells.push(ymd(year, month, d));
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

/**
 * The Schedule & hours calendar: a month at a time, with a coloured code on each day for
 * every spot that's open, and the key underneath. Dates come from each location's
 * "Open dates" in the Studio. Today is worked out in the browser because pages are cached.
 */
export function ScheduleCalendar({ spots, instagramUrl }: { spots: Location[]; instagramUrl: string }) {
  const today = useToday();
  const [picked, setPicked] = useState<Month | null>(null);

  const onCalendar = spots.filter((s) => s.calendarCode && !s.seasonClosed);
  // Before the browser knows today's date, go by whether any dates are set at all.
  const next = today ? nextOpenDate(onCalendar, today) : undefined;
  const upcoming = today ? Boolean(next) : onCalendar.some((s) => s.openDates.length);
  // Start on this month, or on the month of the next open day when that's later.
  const start = today ? parseMonth(next ?? today) : null;
  const shown = picked ?? start;

  return (
    <div>
      {upcoming ? (
        <p className="text-base font-bold text-heatwave">
          Check{" "}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Instagram
          </a>{" "}
          to confirm we&rsquo;re open before heading out!
        </p>
      ) : (
        <p className="text-base text-heatwave">
          <strong className="font-bold">
            Our retail scooping locations are currently closed for the season.
          </strong>{" "}
          Stay tuned for updates here or on{" "}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline-offset-2 hover:underline"
          >
            Instagram
          </a>{" "}
          in late May / early June.
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-[1.25rem] border-2 border-heatwave bg-white">
        <div className="flex items-center justify-between gap-2 px-2 pt-3 pb-2 sm:px-3">
          <MonthButton
            label="Previous month"
            disabled={!shown}
            onClick={() => shown && setPicked(shift(shown, -1))}
          >
            <path d="M15 5l-7 7 7 7" />
          </MonthButton>
          <h3 aria-live="polite" className="subhead text-[1.375rem] leading-none text-heatwave sm:text-2xl">
            {shown ? monthLabel(shown) : " "}
          </h3>
          <MonthButton
            label="Next month"
            disabled={!shown}
            onClick={() => shown && setPicked(shift(shown, 1))}
          >
            <path d="M9 5l7 7-7 7" />
          </MonthButton>
        </div>
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">
            {shown ? `Where to find us in ${monthLabel(shown)}` : "Where to find us"}
          </caption>
          <thead>
            <tr>
              {weekdays.map((d) => (
                <th
                  key={d.long}
                  scope="col"
                  className="eyebrow pb-1.5 text-center !text-[0.8125rem] text-heatwave/80"
                >
                  <abbr title={d.long} className="no-underline">
                    {d.short}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(shown ? weeksOf(shown) : Array.from({ length: 5 }, () => Array(7).fill(null))).map(
              (week, w) => (
                <tr key={w}>
                  {week.map((date: string | null, i: number) => {
                    if (!date) {
                      return <td key={i} className="h-[3.5rem] border-t border-heatwave/15 sm:h-[3.75rem]" />;
                    }
                    const open = onCalendar.filter((s) => isOpenOn(s, date));
                    const isToday = date === today;
                    const past = Boolean(today && date < today);
                    return (
                      <td
                        key={date}
                        aria-current={isToday ? "date" : undefined}
                        className={`h-[3.5rem] border-t border-heatwave/15 p-0.5 align-top sm:h-[3.75rem] sm:p-1 ${
                          isToday ? "bg-peach/60" : ""
                        } ${past ? "opacity-45" : ""}`}
                      >
                        <span
                          className={`grid size-6 place-items-center rounded-full font-ui text-[0.8125rem] font-bold ${
                            isToday ? "bg-heatwave text-snow" : "text-ink/75"
                          }`}
                        >
                          {Number(date.slice(8))}
                          {isToday ? <span className="sr-only"> (today)</span> : null}
                        </span>
                        {open.length ? (
                          <span className="mt-0.5 flex flex-wrap gap-0.5">
                            {open.map((s) => (
                              <span
                                key={s.id}
                                title={s.calendarLabel || s.name}
                                className={`rounded-full px-1 font-ui text-[0.625rem] leading-[1.1rem] font-extrabold sm:px-1.5 sm:text-[0.6875rem] ${calendarColors[s.calendarColor].chip}`}
                              >
                                <span aria-hidden>{s.calendarCode}</span>
                                <span className="sr-only">{s.calendarLabel || s.name}</span>
                              </span>
                            ))}
                          </span>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {onCalendar.length ? (
        <ul className="eyebrow mt-4 !text-xl !leading-[1.3]" aria-label="Calendar key">
          {onCalendar.map((s) => (
            <li key={s.id} className={calendarColors[s.calendarColor].text}>
              {s.calendarCode} = {s.calendarLabel || s.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function MonthButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full text-heatwave transition hover:bg-peach disabled:opacity-40"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </button>
  );
}
