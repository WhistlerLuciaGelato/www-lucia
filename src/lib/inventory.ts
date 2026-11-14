import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import type { Order } from "@/lib/square";

/**
 * Counts paid pints off each flavour's "Pints in stock" in the Studio. Flavours with no stock set
 * (no limit) are left alone. Needs a Sanity token with write access in SANITY_INVENTORY_TOKEN;
 * without one this does nothing and stock is only changed by hand in the Studio.
 *
 * Never throws: a failed count mustn't undo a paid order.
 */
export async function countDownStock(order: Order): Promise<void> {
  const token = process.env.SANITY_INVENTORY_TOKEN;
  if (!token) return;

  const sold = new Map<string, number>();
  for (const li of order.line_items ?? []) {
    const flavour = li.metadata?.flavour;
    const qty = Number(li.quantity);
    if (flavour && qty > 0) sold.set(flavour, (sold.get(flavour) ?? 0) + qty);
  }
  if (sold.size === 0) return;

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
  try {
    const docs = await client.fetch<{ _id: string; slug: string; stock?: number | null }[]>(
      `*[_type == "pintFlavour" && slug.current in $slugs && defined(stock)]{ _id, "slug": slug.current, stock }`,
      { slugs: [...sold.keys()] },
    );
    if (docs.length === 0) return;
    const tx = client.transaction();
    for (const doc of docs) {
      const left = Math.max(0, (doc.stock ?? 0) - (sold.get(doc.slug) ?? 0));
      tx.patch(doc._id, (p) => p.set({ stock: left }));
    }
    await tx.commit();
  } catch (err) {
    console.error("Stock count-down failed", order.id, err);
  }
}
