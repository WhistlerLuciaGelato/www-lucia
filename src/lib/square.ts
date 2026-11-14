import "server-only";

/**
 * A small client for the Square REST API (Orders + Payments), using fetch so it runs on any
 * server runtime without the SDK. Only the fields the checkout reads are typed.
 */

const SQUARE_VERSION = "2026-09-16";

export type Money = { amount: number; currency: string };

export type SquareConfig = {
  accessToken: string;
  locationId: string;
  applicationId: string;
  environment: "sandbox" | "production";
};

/** What the browser needs to load the Web Payments SDK. None of it is secret. */
export type SquareClientConfig = Pick<SquareConfig, "applicationId" | "locationId" | "environment">;

/**
 * Square settings from the environment, or null when online checkout isn't set up (the cart
 * then offers "email my order"). Sandbox application ids start with "sandbox-", so the
 * environment follows from the id and can't be mismatched.
 */
export function getSquareConfig(): SquareConfig | null {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  const applicationId = process.env.SQUARE_APPLICATION_ID;
  if (!accessToken || !locationId || !applicationId) return null;
  return {
    accessToken,
    locationId,
    applicationId,
    environment: applicationId.startsWith("sandbox-") ? "sandbox" : "production",
  };
}

export type SquareErrorDetail = { category: string; code: string; detail?: string; field?: string };

export class SquareApiError extends Error {
  constructor(
    readonly status: number,
    readonly errors: SquareErrorDetail[],
  ) {
    super(
      errors.map((e) => `${e.code}${e.detail ? `: ${e.detail}` : ""}`).join("; ") || `Square HTTP ${status}`,
    );
    this.name = "SquareApiError";
  }

  get code(): string | undefined {
    return this.errors[0]?.code;
  }
}

async function call<T>(
  config: SquareConfig,
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<T> {
  const host =
    config.environment === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";
  const res = await fetch(`${host}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T & { errors?: SquareErrorDetail[] };
  if (!res.ok || (data.errors && data.errors.length > 0)) {
    throw new SquareApiError(res.status, data.errors ?? []);
  }
  return data;
}

export type OrderLineItem = {
  uid?: string;
  name?: string;
  quantity: string;
  note?: string;
  base_price_money?: Money;
  /** Price × quantity before tax and discounts. */
  gross_sales_money?: Money;
  total_tax_money?: Money;
  metadata?: Record<string, string>;
  /** After tax and discounts, so it includes the line's share of GST. */
  total_money?: Money;
};

export type OrderTender = {
  id?: string;
  type: string;
  amount_money?: Money;
  card_details?: { card?: { card_brand?: string; last_4?: string } };
};

export type Order = {
  id: string;
  location_id: string;
  state: "OPEN" | "COMPLETED" | "CANCELED" | "DRAFT";
  version?: number;
  line_items?: OrderLineItem[];
  total_money?: Money;
  total_tax_money?: Money;
  net_amount_due_money?: Money;
  tenders?: OrderTender[];
  metadata?: Record<string, string>;
  service_charges?: { name?: string; amount_money?: Money; total_money?: Money }[];
  fulfillments?: {
    type: string;
    pickup_details?: {
      recipient?: Recipient;
      pickup_at?: string;
      note?: string;
    };
    delivery_details?: {
      recipient?: Recipient & {
        address?: { address_line_1?: string; locality?: string; postal_code?: string };
      };
      deliver_at?: string;
      note?: string;
    };
  }[];
};

type Recipient = { display_name?: string; email_address?: string; phone_number?: string };

/** Who the order is for, whether it's a pickup or a delivery. */
export function orderRecipient(order: Order): Recipient | undefined {
  const f = order.fulfillments?.[0];
  return f?.pickup_details?.recipient ?? f?.delivery_details?.recipient;
}

/** True when the order is delivered rather than picked up. */
export function isDelivery(order: Order): boolean {
  return order.fulfillments?.[0]?.type === "DELIVERY";
}

export type Payment = {
  id: string;
  status: "APPROVED" | "PENDING" | "COMPLETED" | "CANCELED" | "FAILED";
  amount_money: Money;
  order_id?: string;
  location_id?: string;
  source_type?: string;
  card_details?: { card?: { card_brand?: string; last_4?: string } };
  /** Square's hosted receipt page; only set once the payment is COMPLETED. */
  receipt_url?: string;
};

/**
 * Square's receipt page for each payment on a paid order (skips any it can't fetch).
 * Square adds receipt URLs a few seconds after PayOrder, so this retries for up to `waitMs`
 * until every payment has one.
 */
export async function receiptUrls(config: SquareConfig, order: Order, waitMs = 0): Promise<string[]> {
  const ids = (order.tenders ?? []).map((t) => t.id).filter((id): id is string => Boolean(id));
  const deadline = Date.now() + waitMs;
  for (;;) {
    const payments = await Promise.all(ids.map((id) => getPayment(config, id).catch(() => null)));
    const urls = payments.map((p) => p?.receipt_url).filter((url): url is string => Boolean(url));
    if (urls.length === ids.length || Date.now() >= deadline) return urls;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export async function createOrder(
  config: SquareConfig,
  idempotencyKey: string,
  order: Record<string, unknown>,
) {
  const data = await call<{ order: Order }>(config, "POST", "/v2/orders", {
    idempotency_key: idempotencyKey,
    order: { ...order, location_id: config.locationId },
  });
  return data.order;
}

export async function retrieveOrder(config: SquareConfig, orderId: string) {
  const data = await call<{ order: Order }>(config, "GET", `/v2/orders/${encodeURIComponent(orderId)}`);
  return data.order;
}

export async function createPayment(config: SquareConfig, payment: Record<string, unknown>) {
  const data = await call<{ payment: Payment }>(config, "POST", "/v2/payments", {
    ...payment,
    location_id: config.locationId,
  });
  return data.payment;
}

export async function getPayment(config: SquareConfig, paymentId: string) {
  const data = await call<{ payment: Payment }>(
    config,
    "GET",
    `/v2/payments/${encodeURIComponent(paymentId)}`,
  );
  return data.payment;
}

export async function cancelPayment(config: SquareConfig, paymentId: string) {
  const data = await call<{ payment: Payment }>(
    config,
    "POST",
    `/v2/payments/${encodeURIComponent(paymentId)}/cancel`,
    {},
  );
  return data.payment;
}

/** Collects approved (delayed-capture) payments against an order; their total must equal the order's. */
export async function payOrder(
  config: SquareConfig,
  orderId: string,
  paymentIds: string[],
  idempotencyKey: string,
) {
  const data = await call<{ order: Order }>(config, "POST", `/v2/orders/${encodeURIComponent(orderId)}/pay`, {
    idempotency_key: idempotencyKey,
    payment_ids: paymentIds,
  });
  return data.order;
}

/** True once an order has been paid in full (pickup orders stay OPEN until they're picked up). */
export function isPaid(order: Order): boolean {
  return (order.tenders?.length ?? 0) > 0 && (order.net_amount_due_money?.amount ?? 0) === 0;
}

/** "Square gift card ····1234" / "Visa ····4242" for a payment or tender. */
export function describeCard(
  details: { card?: { card_brand?: string; last_4?: string } } | undefined,
  fallback = "Card",
): string {
  const brand = details?.card?.card_brand;
  const last4 = details?.card?.last_4;
  const name =
    brand === "SQUARE_GIFT_CARD"
      ? "Square gift card"
      : brand
        ? brand
            .toLowerCase()
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : fallback;
  return last4 ? `${name} ····${last4}` : name;
}

/** A buyer-friendly message for a failed payment. */
export function paymentErrorMessage(err: unknown, method: "card" | "gift-card"): string {
  const code = err instanceof SquareApiError ? err.code : undefined;
  switch (code) {
    case "INSUFFICIENT_FUNDS":
      return method === "gift-card"
        ? "This gift card has no balance left."
        : "The card was declined for insufficient funds. Please try another card.";
    case "GIFT_CARD_AVAILABLE_AMOUNT":
      return "This gift card has no balance left.";
    case "CARD_EXPIRED":
      return "This card has expired. Please use another card.";
    case "INVALID_EXPIRATION":
      return "The expiry date doesn't match this card. Please check it and try again.";
    case "CVV_FAILURE":
      return "The security code doesn't match this card. Please check it and try again.";
    case "ADDRESS_VERIFICATION_FAILURE":
    case "INVALID_POSTAL_CODE":
      return "The postal code doesn't match this card. Please check it and try again.";
    case "INVALID_ACCOUNT":
    case "INVALID_CARD":
    case "CARD_NOT_SUPPORTED":
      return method === "gift-card"
        ? "We couldn't use this gift card. Please check the number and try again."
        : "This card can't be used here. Please try another card.";
    case "VOICE_FAILURE":
    case "TEMPORARY_ERROR":
      return "The payment didn't go through. Please try again in a moment.";
    case "GENERIC_DECLINE":
    case "CARD_DECLINED":
    case "TRANSACTION_LIMIT":
    case "PAN_FAILURE":
    case "CARD_DECLINED_VERIFICATION_REQUIRED":
      return method === "gift-card"
        ? "This gift card was declined. Please check the number or use another card."
        : "The card was declined. Please try another card or contact your bank.";
    default:
      return method === "gift-card"
        ? "We couldn't apply this gift card. Please try again."
        : "The payment didn't go through. Please try again.";
  }
}
