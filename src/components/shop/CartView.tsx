"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cart, useCart, useToday } from "@/lib/cart-store";
import { itemKey, priceCart } from "@/lib/cart";
import {
  contactSchema,
  fulfillmentSchema,
  type CheckoutResponse,
  type Contact,
  type Fulfillment,
} from "@/lib/checkout";
import type { Catalogue } from "@/lib/content-types";
import { money, prettyDate } from "@/lib/format";
import { pickupProblem } from "@/lib/pickup";
import {
  CAKE_MAX_QTY,
  DELIVERY_ZONES,
  PINT_MAX_PER_FLAVOUR,
  SALES_TAX,
  deliveryFee,
  salesTax,
} from "@/data/shop";
import { PickupCalendar } from "@/components/shop/PickupCalendar";
import { SquarePayment } from "@/components/shop/SquarePayment";
import { Bear } from "@/components/ui";

type Address = { street: string; city: string; postalCode: string };

function emailOrderLink(
  to: string,
  summary: string,
  pickupDate: string,
  notes: string,
  contact: Contact,
  delivery: string | null,
) {
  const body = [
    "Hi Lucia team,",
    "",
    `I'd like to place this order for ${delivery ? "delivery" : "pickup"}:`,
    "",
    summary,
    "",
    `${delivery ? "Delivery" : "Pickup"} date: ${pickupDate ? prettyDate(pickupDate) : "(please suggest)"}`,
    delivery ? `Deliver to: ${delivery}` : "",
    notes ? `Notes: ${notes}` : "",
    "",
    `Name: ${contact.name}`,
    `Phone: ${contact.phone}`,
  ].join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(delivery ? "Delivery order" : "Pickup order")}&body=${encodeURIComponent(body)}`;
}

export function CartView({ catalogue, contactEmail }: { catalogue: Catalogue; contactEmail: string }) {
  const items = useCart();
  const router = useRouter();
  const today = useToday();
  const { shop } = catalogue;
  const { lines, unavailable, subtotal, leadDays } = priceCart(items, catalogue);

  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "" });
  /** "pickup" or a delivery zone id. */
  const [method, setMethod] = useState("pickup");
  const [address, setAddress] = useState<Address>({ street: "", city: "", postalCode: "" });
  const [showContactErrors, setShowContactErrors] = useState(false);
  // Set once the Square order exists; the panel then shows the payment step and the cart is locked.
  const [checkoutOrder, setCheckoutOrder] = useState<CheckoutResponse | null>(null);
  const [status, setStatus] = useState<
    { state: "idle" } | { state: "loading" } | { state: "error"; message: string } | { state: "unavailable" }
  >({ state: "idle" });

  // If the cart changes so the chosen date no longer works (e.g. a cake was added), ask again.
  const dateProblem = pickupDate && today ? pickupProblem(pickupDate, shop, leadDays, today) : null;
  const contactCheck = contactSchema.safeParse(contact);
  const contactErrors: Partial<Record<keyof Contact, string>> = {};
  if (!contactCheck.success) {
    for (const issue of contactCheck.error.issues) {
      const field = issue.path[0] as keyof Contact;
      contactErrors[field] ??= issue.message;
    }
  }
  const zone = DELIVERY_ZONES.find((z) => z.id === method);
  const fee = zone ? (deliveryFee(zone.id, subtotal) ?? 0) : 0;
  const fulfillment: Fulfillment = zone
    ? { method: "delivery", zone: zone.id, ...address }
    : { method: "pickup" };
  const fulfillmentCheck = fulfillmentSchema.safeParse(fulfillment);
  const addressErrors: Partial<Record<keyof Address, string>> = {};
  if (!fulfillmentCheck.success) {
    for (const issue of fulfillmentCheck.error.issues) {
      const field = issue.path[0] as keyof Address;
      addressErrors[field] ??= issue.message;
    }
  }
  const tax = salesTax(subtotal + fee);
  const deliverTo = zone ? `${address.street}, ${address.city} ${address.postalCode} (${zone.label})` : null;
  const locked = checkoutOrder !== null;

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
    if (!contactCheck.success || !fulfillmentCheck.success) {
      setShowContactErrors(true);
      return;
    }
    setStatus({ state: "loading" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          fulfillment: fulfillmentCheck.data,
          pickupDate,
          notes: notes.trim() || undefined,
          contact: contactCheck.data,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<CheckoutResponse> & { error?: string };
      if (res.ok && data.orderId && data.square) {
        setCheckoutOrder(data as CheckoutResponse);
        setStatus({ state: "idle" });
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

  function paid(orderId: string) {
    // The success page empties the cart (ClearCart), so this page doesn't flash "empty" first.
    router.push(`/order/success?order=${encodeURIComponent(orderId)}`);
  }

  const summary = lines.map((l) => `- ${l.qty} × ${l.name} (${l.detail}) — ${money(l.total)}`).join("\n");

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <section aria-label="Items" className="lg:col-span-3">
        <ul className="divide-y divide-alpine overflow-hidden rounded-blob bg-white shadow-soft ring-1 ring-alpine/60">
          {items.map((item) => {
            const line = lines.find((l) => l.key === itemKey(item));
            if (!line) return null;
            const src = line.image;
            const max = item.kind === "pint" ? PINT_MAX_PER_FLAVOUR : CAKE_MAX_QTY;
            return (
              <li key={line.key} className="flex gap-4 p-5 sm:p-6">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-snow sm:h-24 sm:w-24">
                  {src ? (
                    <Image src={src} alt="" width={96} height={96} className="h-full w-full object-contain" />
                  ) : (
                    <span className="display text-3xl text-strawberry" aria-hidden>
                      {line.name.split(" ")[0]}
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
                  {locked ? (
                    <p className="mt-3 font-ui text-sm font-bold text-ink/70">Qty {item.qty}</p>
                  ) : (
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
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {unavailable.length > 0 ? (
          <div role="alert" className="mt-4 rounded-3xl bg-butter p-4 font-ui text-sm text-ink">
            <p className="font-bold">
              {unavailable.length === 1 ? "One item is" : `${unavailable.length} items are`} no longer
              available and won&rsquo;t be included.
            </p>
            <button
              type="button"
              onClick={() => unavailable.forEach((i) => cart.remove(itemKey(i)))}
              className="mt-1 font-bold text-lake-deep underline underline-offset-2"
            >
              Remove from cart
            </button>
          </div>
        ) : null}
        {locked ? null : (
          <div className="mt-4 flex flex-wrap gap-4 font-ui text-sm font-bold">
            <Link href="/order/pints" className="text-lake-deep underline underline-offset-2">
              + Add pints
            </Link>
            <Link href="/order/cakes" className="text-lake-deep underline underline-offset-2">
              + Add a cake
            </Link>
          </div>
        )}
      </section>

      <section aria-label="Pickup or delivery, and payment" className="lg:col-span-2">
        <div className="rounded-blob bg-mist p-6 sm:p-8 lg:sticky lg:top-28">
          {checkoutOrder ? (
            <>
              <h2 className="subhead text-2xl text-lakeside">Payment</h2>
              <p className="mt-2 text-sm text-ink/80">
                {zone
                  ? `Delivery ${prettyDate(pickupDate)} · ${deliverTo}`
                  : `Pickup ${prettyDate(pickupDate)}, ${shop.pickupWindow} · ${shop.pickupWhere}`}
              </p>
              <p className="mt-1 text-sm text-ink/80">
                For {contact.name} · {contact.email}
              </p>
              <div className="mt-5">
                <SquarePayment
                  checkout={checkoutOrder}
                  contact={contact}
                  onPaid={paid}
                  onBack={() => setCheckoutOrder(null)}
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="subhead text-2xl text-lakeside">Pickup or delivery</h2>
              <fieldset className="mt-4">
                <legend className="sr-only">How would you like to get your order?</legend>
                <div className="grid gap-2">
                  {[
                    {
                      id: "pickup",
                      title: "Pickup",
                      detail: `${shop.pickupWhere} · ${shop.pickupWindow}`,
                      price: "Free",
                    },
                    ...DELIVERY_ZONES.map((z) => ({
                      id: z.id,
                      title: `Delivery to ${z.label}`,
                      detail: `${money(z.fee)}, free on orders of ${money(z.freeOver)} or more`,
                      price: subtotal >= z.freeOver ? "Free" : money(z.fee),
                    })),
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-3.5 ring-2 transition ${
                        method === o.id ? "ring-lakeside" : "ring-transparent hover:ring-alpine"
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value={o.id}
                        checked={method === o.id}
                        onChange={() => setMethod(o.id)}
                        className="mt-1 h-4 w-4 accent-[#2f6e7e]"
                      />
                      <span className="flex-1 font-ui">
                        <span className="block font-extrabold text-ink">{o.title}</span>
                        <span className="block text-sm text-ink/70">{o.detail}</span>
                      </span>
                      <span className="font-ui font-extrabold text-ink">{o.price}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {zone
                ? (
                    [
                      { key: "street", label: "Delivery address", autoComplete: "street-address" },
                      { key: "city", label: "Town", autoComplete: "address-level2" },
                      { key: "postalCode", label: "Postal code", autoComplete: "postal-code" },
                    ] as const
                  ).map((f) => {
                    const err = showContactErrors ? addressErrors[f.key] : undefined;
                    return (
                      <div key={f.key}>
                        <label htmlFor={`address-${f.key}`} className="label mt-5">
                          {f.label}
                        </label>
                        <input
                          id={`address-${f.key}`}
                          type="text"
                          autoComplete={f.autoComplete}
                          required
                          className="field"
                          value={address[f.key]}
                          aria-invalid={err ? true : undefined}
                          aria-describedby={err ? `address-${f.key}-error` : undefined}
                          onChange={(e) => setAddress((a) => ({ ...a, [f.key]: e.target.value }))}
                        />
                        {err ? (
                          <p
                            id={`address-${f.key}-error`}
                            className="mt-1 font-ui text-sm font-bold text-berry"
                          >
                            {err}
                          </p>
                        ) : null}
                      </div>
                    );
                  })
                : null}

              <p className="label mt-5" id="pickup-label">
                {zone ? "Delivery date" : "Pickup date"}
              </p>
              {zone ? (
                <p className="-mt-1 mb-2 font-ui text-sm text-ink/70">
                  We&rsquo;ll be in touch to arrange a delivery time on the day.
                </p>
              ) : null}
              <div role="group" aria-labelledby="pickup-label">
                <PickupCalendar
                  shop={shop}
                  leadDays={leadDays}
                  today={today}
                  value={dateProblem ? "" : pickupDate}
                  onChange={setPickupDate}
                  delivery={Boolean(zone)}
                />
              </div>
              {dateProblem ? (
                <p role="alert" className="mt-2 font-ui text-sm font-bold text-berry">
                  {dateProblem} Please choose another day.
                </p>
              ) : null}

              {(
                [
                  { key: "name", label: "Your name", type: "text", autoComplete: "name" },
                  { key: "email", label: "Email", type: "email", autoComplete: "email" },
                  { key: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
                ] as const
              ).map((f) => {
                const err = showContactErrors ? contactErrors[f.key] : undefined;
                return (
                  <div key={f.key}>
                    <label htmlFor={`contact-${f.key}`} className="label mt-5">
                      {f.label}
                    </label>
                    <input
                      id={`contact-${f.key}`}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      required
                      className="field"
                      value={contact[f.key]}
                      aria-invalid={err ? true : undefined}
                      aria-describedby={err ? `contact-${f.key}-error` : undefined}
                      onChange={(e) => setContact((c) => ({ ...c, [f.key]: e.target.value }))}
                    />
                    {err ? (
                      <p id={`contact-${f.key}-error`} className="mt-1 font-ui text-sm font-bold text-berry">
                        {err}
                      </p>
                    ) : null}
                  </div>
                );
              })}

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
                placeholder={
                  zone
                    ? "Allergies, buzzer code, anything we should know"
                    : "Allergies, pickup time, anything we should know"
                }
              />

              <dl className="mt-6 space-y-2 border-t border-alpine pt-5 font-ui">
                <div className="flex justify-between">
                  <dt className="text-ink/80">Subtotal</dt>
                  <dd className="font-extrabold text-ink">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-ink/70">{zone ? `Delivery (${zone.label})` : "Pickup"}</dt>
                  <dd className="text-ink/70">{fee ? money(fee) : "Free"}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-ink/70">
                    {SALES_TAX.name} ({SALES_TAX.percentage}%)
                  </dt>
                  <dd className="text-ink/70">{money(tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-alpine pt-2">
                  <dt className="font-bold text-ink">Total</dt>
                  <dd className="font-extrabold text-ink">{money(subtotal + fee + tax)}</dd>
                </div>
              </dl>

              <button
                type="button"
                className="btn btn-primary mt-6 w-full"
                disabled={
                  !pickupDate || Boolean(dateProblem) || lines.length === 0 || status.state === "loading"
                }
                onClick={checkout}
              >
                {status.state === "loading" ? "One moment…" : "Continue to payment"}
              </button>
              <p className="mt-3 text-center font-ui text-xs text-ink/60">
                Pay by card or Square gift card. Payments are processed securely by Square.
              </p>

              <div aria-live="polite">
                {status.state === "error" ? (
                  <p
                    role="alert"
                    className="mt-4 rounded-2xl bg-blush p-4 font-ui text-sm font-bold text-berry"
                  >
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
                      href={emailOrderLink(
                        contactEmail,
                        summary,
                        pickupDate,
                        notes.trim(),
                        contact,
                        deliverTo,
                      )}
                      className="btn btn-primary mt-3 w-full"
                    >
                      Email my order
                    </a>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
