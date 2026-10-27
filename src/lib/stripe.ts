import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // Use fetch rather than Stripe's default node:http client so checkout runs on any server runtime.
  client ??= new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
  return client;
}
