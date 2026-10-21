"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cart, useCart, useToday } from "@/lib/cart-store";
import { itemKey, priceCart, type CartItem } from "@/lib/cart";
import { addDays, money, prettyDate } from "@/lib/format";
import { CAKE_MAX_QTY, PINT_MAX_PER_FLAVOUR, pickup } from "@/data/shop";
import { site } from "@/data/site";
import { Bear } from "@/components/ui";

function thumb(item: CartItem) {
  return item.kind === "pint" ? `/pints/${item.flavour}.webp` : null;
}

function emailOrderLink(summary: string, pickupDate: string, notes: string) {
  const body = [
    "Hi Lucia team,",
    "",
    "I'd like to place this order for pickup:",
    "",
    summary,
    "",
    `Pickup date: ${pickupDate ? prettyDate(pickupDate) : "(please suggest)"}`,
    notes ? `Notes: ${notes}` : "",
    "",
    "Name:",
    "Phone:",
  ].join("\n");
  return `mailto:${site.email}?subject=${encodeURIComponent("Pickup order")}&body=${encodeURIComponent(body)}`;
}

export function CartView() {
  const items = useCart();
  const today = useToday();
  const { lines, subtotal, leadDays } = priceCart(items);
  const earliest = today ? addDays(today, leadDays) : null;

  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<
    { state: "idle" } | { state: "loading" } | { state: "error"; message: string } | { state: "unavailable" }
  >({ state: "idle" });

  // If the cart changes so the chosen date is now too early, make the visitor choose again.
  const dateTooEarly = Boolean(pickupDate && earliest && pickupDate < earliest);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-blob bg-mist p-10 text-center">
        <Bear name="hiker" className="mx-auto w-28" />
        <p className="subhead mt-6 text-3xl text-lakeside">Your cart is empty</p>
        <p className="mt-3 text-ink/80">
          Lucia&rsquo;s out exploring. Pick a pint or build a cake to get started.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/order/pints" className="btn btn-primary">
            Shop pints
          </Link>
          <Link href="/order/cakes" className="btn btn-berry">
            Build a cake
          </Link>
        </div>
      </div>
    );
  }

  async function checkout() {
    setStatus({ state: "loading" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, pickupDate, notes: notes.trim() || undefined }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (res.status === 503) {
        setStatus({ state: "unavailable" });
        return;
      }
      setStatus({ state: "error", message: data.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({ state: "error", message: "We couldn't reach the server. Please try again." });
    }
  }

  const summary = lines.map((l) => `- ${l.qty} × ${l.name} (${l.detail}) — ${money(l.total)}`).join("\n");

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <section aria-label="Items" className="lg:col-span-3">
        <ul className="divide-y divide-alpine overflow-hidden rounded-blob bg-white shadow-soft ring-1 ring-alpine/60">
          {items.map((item) => {
            const line = lines.find((l) => l.key === itemKey(item));
            if (!line) return null;
            const src = thumb(item);
            const max = item.kind === "pint" ? PINT_MAX_PER_FLAVOUR : CAKE_MAX_QTY;
            return (
              <li key={line.key} className="flex gap-4 p-5 sm:p-6">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-snow sm:h-24 sm:w-24">
                  {src ? (
                    <Image src={src} alt="" width={96} height={96} className="h-full w-full object-contain" />
                  ) : (
                    <span className="display text-3xl text-strawberry" aria-hidden>
                      {item.kind === "cake" && item.size === "9in" ? '9"' : '7"'}
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-ui font-extrabold text-ink">{line.name}</p>
                      <p className="mt-0.5 text-sm text-ink/70">{line.detail}</p>
                    </div>
                    <p className="font-ui font-extrabold text-ink">{money(line.total)}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="sr-only" htmlFor={`qty-${line.key}`}>
                      Quantity for {line.name}
                    </label>
                    <select
                      id={`qty-${line.key}`}
                      value={item.qty}
                      onChange={(e) => cart.setQty(line.key, Number(e.target.value))}
                      className="rounded-full bg-mist px-3 py-1.5 font-ui text-sm font-bold text-ink"
                    >
                      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          Qty {n}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => cart.remove(line.key)}
                      className="font-ui text-sm font-bold text-berry underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-wrap gap-4 font-ui text-sm font-bold">
          <Link href="/order/pints" className="text-lake-deep underline underline-offset-2">
            + Add pints
          </Link>
          <Link href="/order/cakes" className="text-lake-deep underline underline-offset-2">
            + Add a cake
          </Link>
        </div>
      </section>

      <section aria-label="Pickup & payment" className="lg:col-span-2">
        <div className="rounded-blob bg-mist p-6 sm:p-8 lg:sticky lg:top-28">
          <h2 className="subhead text-2xl text-lakeside">Pickup details</h2>
          <p className="mt-2 text-sm text-ink/80">
            {pickup.where} · {pickup.window}
          </p>

          <label htmlFor="pickup-date" className="label mt-5">
            Pickup date
          </label>
          <input
            id="pickup-date"
            type="date"
            className="field"
            min={earliest ?? undefined}
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            aria-describedby="pickup-hint"
            required
          />
          <p
            id="pickup-hint"
            className={`mt-1.5 font-ui text-sm ${dateTooEarly ? "font-bold text-berry" : "text-ink/70"}`}
          >
            {earliest
              ? `${dateTooEarly ? "Too soon — the" : "The"} earliest pickup for this order is ${prettyDate(earliest)}.`
              : `We need ${leadDays} days' notice for this order.`}
          </p>

          <label htmlFor="order-notes" className="label mt-5">
            Notes <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <textarea
            id="order-notes"
            rows={2}
            maxLength={500}
            className="field"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Allergies, pickup time, anything we should know"
          />

          <dl className="mt-6 space-y-2 border-t border-alpine pt-5 font-ui">
            <div className="flex justify-between">
              <dt className="text-ink/80">Subtotal</dt>
              <dd className="font-extrabold text-ink">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-ink/70">Pickup</dt>
              <dd className="text-ink/70">Free</dd>
            </div>
          </dl>

          <button
            type="button"
            className="btn btn-primary mt-6 w-full"
            disabled={!pickupDate || dateTooEarly || status.state === "loading"}
            onClick={checkout}
          >
            {status.state === "loading" ? "Heading to checkout…" : "Checkout securely"}
          </button>
          <p className="mt-3 text-center font-ui text-xs text-ink/60">
            Payments are processed by Stripe. Taxes calculated at checkout where applicable.
          </p>

          <div aria-live="polite">
            {status.state === "error" ? (
              <p role="alert" className="mt-4 rounded-2xl bg-blush p-4 font-ui text-sm font-bold text-berry">
                {status.message}
              </p>
            ) : null}
            {status.state === "unavailable" ? (
              <div role="alert" className="mt-4 rounded-2xl bg-butter p-4 font-ui text-sm text-ink">
                <p className="font-bold">Online payment isn&rsquo;t switched on yet.</p>
                <p className="mt-1">
                  Send us your order by email and we&rsquo;ll confirm pickup and payment.
                </p>
                <a
                  href={emailOrderLink(summary, pickupDate, notes.trim())}
                  className="btn btn-primary mt-3 w-full"
                >
                  Email my order
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
