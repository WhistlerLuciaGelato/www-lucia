import { orderCutoff } from "@/data/wholesale";

/**
 * Wholesale page copy as designed. Lucia edits it in the Studio (Wholesale › Page text & photos);
 * any field left empty there shows the value here. Sizes, delivery days, flavour lists and
 * suppliers live in the same document but are read by getWholesale (src/lib/content.ts).
 * Links, anchors and colours stay in the code.
 */
export const wholesalePageText = {
  metaDescription:
    "Premium small-batch gelato for cafés, restaurants and retailers across Whistler, Squamish and Pemberton. Sizes, delivery schedule and quote requests.",
  hero: {
    eyebrow: "Wholesale",
    title: "Put Lucia on your menu",
    orderButton: "Place an order",
    flavoursButton: "Browse flavours",
  },
  pricing: {
    title: "Wholesale Pricing",
    intro: "Sizes we make for wholesale. Request a quote below and we’ll send you our pricing.",
    customSize: "Other custom size",
    customSizeNote: "Choose “Other custom size” in the form and tell us what you need in the notes.",
  },
  delivery: {
    title: "Delivery Schedule",
    /** Also shown above the quote form's button. */
    cutoff: orderCutoff,
  },
  flavoursText: {
    eyebrow: "Wholesale flavours list",
    intro:
      "Gelato, sorbetto, vegan, boozy and cookie sandwiches. Don't see what you're after? Ask about custom flavours.",
  },
  suppliersText: {
    eyebrow: "Our suppliers",
    title: "Where our ingredients come from",
    intro: "We buy from farms and producers close to home wherever we can. Here's who goes into your gelato.",
  },
  order: {
    eyebrow: "Quote request",
    title: "Place a wholesale order",
    intro:
      "Tell us what you'd like and where to deliver it. We'll reply with a quote and your delivery day. New partners welcome!",
    replyNote: "We’ll reply by email with your quote and delivery day.",
    successTitle: "Quote request received — thank you!",
    successMessage: "We’ll be in touch by email with your quote and delivery day.",
  },
};

export type WholesalePageText = typeof wholesalePageText;
