import { NextResponse } from "next/server";
import { z } from "zod";
import { promoCodeSchema } from "@/lib/promo";
import { findPromo } from "@/lib/promo-codes";

/** Checks a promo code from the cart and returns its terms, so the cart can show the discount. */
export async function POST(request: Request) {
  const parsed = z.object({ code: promoCodeSchema }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "That code isn't valid." }, { status: 422 });
  }
  const terms = await findPromo(parsed.data.code);
  if (!terms) {
    return NextResponse.json({ error: "That code isn't valid or has expired." }, { status: 404 });
  }
  return NextResponse.json(terms);
}
