import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { PROMO_CODES_ID } from "@/sanity/promo-codes-id";
import { todayInWhistler } from "@/lib/format";
import type { PromoTerms } from "@/lib/promo";

type PromoDoc = {
  code?: string;
  active?: boolean;
  kind?: "percent" | "amount";
  percentOff?: number;
  amountOff?: number;
  appliesTo?: "all" | "pints" | "cakes";
  minOrder?: number;
  startsOn?: string;
  endsOn?: string;
};

/**
 * Looks up a promo code in the Studio's private "Promo codes" document. Reading it needs a token:
 * SANITY_INVENTORY_TOKEN (already set for stock counts) or SANITY_API_READ_TOKEN. Returns null for
 * an unknown, switched-off or out-of-date code, or when no token is set.
 */
export async function findPromo(code: string): Promise<PromoTerms | null> {
  const token = process.env.SANITY_INVENTORY_TOKEN || process.env.SANITY_API_READ_TOKEN;
  if (!token) return null;
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published",
  });
  let codes: PromoDoc[] | null;
  try {
    codes = await client.fetch<PromoDoc[] | null>(`*[_id == $id][0].codes`, { id: PROMO_CODES_ID });
  } catch (err) {
    console.error("Promo code lookup failed", err);
    return null;
  }

  const wanted = code.trim().toUpperCase();
  const doc = codes?.find((c) => c.code?.trim().toUpperCase() === wanted);
  if (!doc || doc.active === false) return null;
  const today = todayInWhistler();
  if ((doc.startsOn && today < doc.startsOn) || (doc.endsOn && today > doc.endsOn)) return null;

  const cents = (dollars: number) => Math.round(dollars * 100);
  const kind = doc.kind === "amount" ? "amount" : "percent";
  const value =
    kind === "amount"
      ? cents(doc.amountOff ?? 0)
      : Math.min(100, Math.max(0, Math.round(doc.percentOff ?? 0)));
  if (value <= 0) return null;
  return {
    code: wanted,
    kind,
    value,
    appliesTo: doc.appliesTo === "pints" || doc.appliesTo === "cakes" ? doc.appliesTo : "all",
    minOrder: cents(doc.minOrder ?? 0),
  };
}
