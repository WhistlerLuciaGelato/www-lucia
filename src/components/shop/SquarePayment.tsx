"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CheckoutResponse, Contact, HeldPayment, PayResponse } from "@/lib/checkout";
import { money } from "@/lib/format";

/* Just the parts of the Square Web Payments SDK this page uses. */
type TokenResult = { status: "OK"; token: string } | { status: string; errors?: { message: string }[] };
type SquarePaymentMethod = {
  attach(selector: string | HTMLElement): Promise<void>;
  tokenize(verificationDetails?: Record<string, unknown>): Promise<TokenResult>;
  destroy(): Promise<boolean>;
};
type SquarePayments = {
  card(options?: Record<string, unknown>): Promise<SquarePaymentMethod>;
  giftCard(options?: Record<string, unknown>): Promise<SquarePaymentMethod>;
};
declare global {
  interface Window {
    Square?: { payments(applicationId: string, locationId: string): SquarePayments };
  }
}

const SDK_URL = {
  sandbox: "https://sandbox.web.squarecdn.com/v1/square.js",
  production: "https://web.squarecdn.com/v1/square.js",
};

let sdkPromise: Promise<void> | null = null;

function loadSdk(environment: "sandbox" | "production"): Promise<void> {
  if (window.Square) return Promise.resolve();
  sdkPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL[environment];
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkPromise = null;
      script.remove();
      reject(new Error("Square SDK failed to load"));
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

/** The Square fields in the site's form style (see .field in globals.css). */
const fieldStyle = {
  ".input-container": { borderColor: "#bce4e7", borderRadius: "16px", borderWidth: "2px" },
  ".input-container.is-focus": { borderColor: "#4e92a3" },
  ".input-container.is-error": { borderColor: "#b8434b" },
  ".message-text": { color: "#2f6e7e" },
  ".message-icon": { color: "#2f6e7e" },
  ".message-text.is-error": { color: "#b8434b" },
  ".message-icon.is-error": { color: "#b8434b" },
  input: { color: "#212121", fontSize: "16px" },
  "input::placeholder": { color: "#8a8a8a" },
};

const MAX_GIFT_CARDS = 5;

function tokenError(result: TokenResult): string {
  return ("errors" in result && result.errors?.[0]?.message) || "Please check the details and try again.";
}

/**
 * Pays a Square order on the page: any number of Square gift cards (each covers what its balance
 * allows), then a card for whatever is left. Nothing is captured until the order is covered.
 */
export function SquarePayment({
  checkout,
  contact,
  onPaid,
  onBack,
}: {
  checkout: CheckoutResponse;
  contact: Contact;
  onPaid: (orderId: string) => void;
  onBack: () => void;
}) {
  const { orderId, total, square } = checkout;
  const [ready, setReady] = useState<"loading" | "ready" | "failed">("loading");
  const [held, setHeld] = useState<HeldPayment[]>([]);
  const [busy, setBusy] = useState<null | "card" | "gift-card" | "back">(null);
  const [error, setError] = useState<string | null>(null);
  const [giftOpen, setGiftOpen] = useState(false);

  const payments = useRef<SquarePayments | null>(null);
  const card = useRef<SquarePaymentMethod | null>(null);
  const giftCard = useRef<SquarePaymentMethod | null>(null);
  const cardEl = useRef<HTMLDivElement>(null);
  const giftEl = useRef<HTMLDivElement>(null);
  const heldRef = useRef(held);
  const finished = useRef(false);

  const remaining = total - held.reduce((sum, p) => sum + p.amount, 0);

  useEffect(() => {
    heldRef.current = held;
  });

  // Load the SDK and the card form.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadSdk(square.environment);
        if (cancelled || !window.Square || !cardEl.current) return;
        payments.current = window.Square.payments(square.applicationId, square.locationId);
        const c = await payments.current.card({ style: fieldStyle });
        if (cancelled) {
          await c.destroy();
          return;
        }
        await c.attach(cardEl.current);
        card.current = c;
        setReady("ready");
      } catch (err) {
        console.error(err);
        if (!cancelled) setReady("failed");
      }
    })();
    return () => {
      cancelled = true;
      card.current?.destroy();
      card.current = null;
      giftCard.current?.destroy();
      giftCard.current = null;
    };
  }, [square.applicationId, square.environment, square.locationId]);

  // The gift card number field, shown on request.
  useEffect(() => {
    if (!giftOpen || ready !== "ready" || !payments.current) return;
    let cancelled = false;
    (async () => {
      try {
        const g = await payments.current!.giftCard({ style: fieldStyle });
        if (cancelled || !giftEl.current) {
          await g.destroy();
          return;
        }
        await g.attach(giftEl.current);
        giftCard.current = g;
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("The gift card field couldn't load. Please refresh and try again.");
      }
    })();
    return () => {
      cancelled = true;
      giftCard.current?.destroy();
      giftCard.current = null;
    };
  }, [giftOpen, ready]);

  // If the buyer leaves with a gift card applied, release the hold so the balance is free again.
  useEffect(() => {
    function release() {
      const ids = heldRef.current.map((p) => p.id);
      if (finished.current || ids.length === 0) return;
      navigator.sendBeacon?.("/api/checkout/release", JSON.stringify({ orderId, paymentIds: ids }));
    }
    window.addEventListener("pagehide", release);
    return () => window.removeEventListener("pagehide", release);
  }, [orderId]);

  const pay = useCallback(
    async (method: "card" | "gift-card") => {
      const source = method === "card" ? card.current : giftCard.current;
      if (!source) return;
      setBusy(method);
      setError(null);
      try {
        const [givenName, ...rest] = contact.name.trim().split(/\s+/);
        const result =
          method === "card"
            ? await source.tokenize({
                amount: (remaining / 100).toFixed(2),
                currencyCode: "CAD",
                intent: "CHARGE",
                customerInitiated: true,
                sellerKeyedIn: false,
                billingContact: {
                  givenName,
                  familyName: rest.join(" ") || undefined,
                  email: contact.email,
                  phone: contact.phone,
                },
              })
            : await source.tokenize();
        if (result.status !== "OK" || !("token" in result)) {
          setError(tokenError(result));
          return;
        }

        const res = await fetch("/api/checkout/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            sourceId: result.token,
            method,
            idempotencyKey: crypto.randomUUID(),
            heldPaymentIds: held.map((p) => p.id),
          }),
        });
        const data = (await res.json().catch(() => ({}))) as Partial<PayResponse> & {
          error?: string;
          restart?: boolean;
        };
        if (!res.ok) {
          if (data.restart) setHeld([]);
          setError(data.error ?? "The payment didn't go through. Please try again.");
          return;
        }
        if (data.status === "paid") {
          finished.current = true;
          onPaid(orderId);
          return;
        }
        if (data.status === "partial" && data.held) {
          setHeld((h) => [...h, data.held!]);
          setGiftOpen(false);
        }
      } catch {
        setError("We couldn't reach the server. Please try again.");
      } finally {
        setBusy(null);
      }
    },
    [contact, held, onPaid, orderId, remaining],
  );

  async function releaseHeld(ids: string[]) {
    if (ids.length === 0) return;
    await fetch("/api/checkout/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentIds: ids }),
    }).catch(() => null);
  }

  async function removeGiftCard(id: string) {
    setError(null);
    await releaseHeld([id]);
    setHeld((h) => h.filter((p) => p.id !== id));
  }

  async function back() {
    setBusy("back");
    await releaseHeld(held.map((p) => p.id));
    finished.current = true;
    onBack();
  }

  const disabled = ready !== "ready" || busy !== null;

  return (
    <div>
      <dl className="space-y-2 font-ui">
        {checkout.tax > 0 ? (
          <div className="flex justify-between text-sm">
            <dt className="text-ink/70">GST</dt>
            <dd className="text-ink/70">{money(checkout.tax)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-ink/80">Order total</dt>
          <dd className="font-extrabold text-ink">{money(total)}</dd>
        </div>
        {held.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-ink/80">
              {p.label}{" "}
              <button
                type="button"
                onClick={() => removeGiftCard(p.id)}
                disabled={busy !== null}
                className="font-bold text-berry underline underline-offset-2"
              >
                Remove
              </button>
            </dt>
            <dd className="font-bold text-lake-deep">−{money(p.amount)}</dd>
          </div>
        ))}
        {held.length > 0 ? (
          <div className="flex justify-between border-t border-alpine pt-2">
            <dt className="font-bold text-ink">Left to pay</dt>
            <dd className="font-extrabold text-ink">{money(remaining)}</dd>
          </div>
        ) : null}
      </dl>

      {ready === "failed" ? (
        <p role="alert" className="mt-5 rounded-2xl bg-blush p-4 font-ui text-sm font-bold text-berry">
          The payment form couldn&rsquo;t load. Please check your connection, turn off any content blockers
          for this page and refresh.
        </p>
      ) : null}

      <div className="mt-6 border-t border-alpine pt-5">
        {giftOpen ? (
          <div>
            <p className="label" id="gift-card-label">
              Square gift card
            </p>
            <div ref={giftEl} aria-labelledby="gift-card-label" />
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                className="btn btn-berry flex-1 !text-base"
                disabled={disabled}
                onClick={() => pay("gift-card")}
              >
                {busy === "gift-card" ? "Applying…" : "Apply gift card"}
              </button>
              <button
                type="button"
                className="font-ui text-sm font-bold text-lake-deep underline underline-offset-2"
                disabled={busy !== null}
                onClick={() => setGiftOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : held.length < MAX_GIFT_CARDS ? (
          <button
            type="button"
            className="font-ui text-sm font-bold text-lake-deep underline underline-offset-2 disabled:opacity-50"
            disabled={disabled}
            onClick={() => {
              setError(null);
              setGiftOpen(true);
            }}
          >
            {held.length > 0 ? "+ Use another gift card" : "Have a gift card? Redeem it here"}
          </button>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="label" id="card-label">
          {held.length > 0 ? "Pay the rest by card" : "Card"}
        </p>
        {ready === "loading" ? (
          <p className="py-3 font-ui text-sm text-ink/60">Loading secure payment form…</p>
        ) : null}
        {/* Square renders its card iframe in here, so React leaves it empty. */}
        <div ref={cardEl} aria-labelledby="card-label" />
      </div>

      <div aria-live="polite">
        {error ? (
          <p role="alert" className="mt-3 rounded-2xl bg-blush p-4 font-ui text-sm font-bold text-berry">
            {error}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        className="btn btn-primary mt-4 w-full"
        disabled={disabled}
        onClick={() => pay("card")}
      >
        {busy === "card" ? "Paying…" : `Pay ${money(remaining)}`}
      </button>
      <p className="mt-3 text-center font-ui text-xs text-ink/60">
        Payments are processed securely by Square. You&rsquo;re only charged once the full amount is covered.
      </p>
      <button
        type="button"
        className="mt-4 block w-full text-center font-ui text-sm font-bold text-lake-deep underline underline-offset-2"
        disabled={busy !== null}
        onClick={back}
      >
        {busy === "back" ? "One moment…" : "← Change order or pickup details"}
      </button>
    </div>
  );
}
