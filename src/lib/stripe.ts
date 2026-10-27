import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // fetch works on both Node and Cloudflare Workers (Stripe's default client needs node:http).
  client ??= new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
  return client;
}
