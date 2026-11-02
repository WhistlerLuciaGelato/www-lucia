const cad = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

export function money(cents: number): string {
  return cad.format(cents / 100);
}

export const TIMEZONE = "America/Vancouver";

/** Today's date in Whistler as YYYY-MM-DD. */
export function todayInWhistler(now: Date = new Date()): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function prettyDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T12:00:00Z`));
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`));
}

/** "(604) 967-3886" → "+16049673886" (assumes a North American number without a country code). */
export function e164Phone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `+${digits.length === 10 ? `1${digits}` : digits}`;
}

/** "(604) 967-3886" → "tel:+16049673886" */
export function phoneHref(phone: string): string {
  return `tel:${e164Phone(phone)}`;
}

/** An RFC 3339 timestamp for a wall-clock time in Whistler on a date, e.g. "2026-11-10T12:00:00-08:00". */
export function whistlerDateTime(isoDate: string, hour: number): string {
  const probe = new Date(`${isoDate}T${String(hour).padStart(2, "0")}:00:00Z`);
  const zone =
    new Intl.DateTimeFormat("en-US", { timeZone: TIMEZONE, timeZoneName: "longOffset" })
      .formatToParts(probe)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT-08:00";
  const offset = zone === "GMT" ? "+00:00" : zone.replace("GMT", "");
  return `${isoDate}T${String(hour).padStart(2, "0")}:00:00${offset}`;
}
