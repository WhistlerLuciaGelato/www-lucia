/**
 * Copy for the Order page, the Gelato cakes page, the thank-you page after paying, and the cart,
 * as designed. Lucia edits it in the Studio (Pages › Order, cakes & cart); any field left empty
 * there shows the value here. Prices, lead days and pickup times come from the Shop settings, so
 * sentences that show them stay in the code, as do links, colours and the checkout's form labels
 * and messages.
 */
export const orderPage = {
  /** Order page. */
  metaDescription:
    "Order Lucia Gelato pints and made-to-order gelato cakes for pickup or delivery in the Sea to Sky.",
  cakesMetaDescription:
    "Custom gelato cakes for birthdays, weddings and special moments. Choose your size, base and flavours — made to order in Whistler.",
  hero: {
    eyebrow: "Order online",
    title: "Take Lucia home",
    intro:
      "Order ahead, then pick up from our kitchen at Base II or have us deliver around Whistler, Squamish and Pemberton. Pay online, skip the wait.",
  },
  /** The two big cards; their price line and lead-time point come from the Shop settings. */
  pintsCard: {
    title: "Pints",
    points: {
      flavours: "Our evolving cast of locally crafted flavours",
      options: "Gelato, sorbet & dairy-free options",
    },
    button: "Shop pints",
  },
  cakesCard: {
    title: "Gelato cakes",
    points: {
      choices: "Choose your size, base and flavours",
      options: "Gluten-free & dairy-free options",
    },
    button: "Build a cake",
  },
  howItWorks: {
    title: "How it works",
    steps: {
      order: {
        title: "Order & pay online",
        text: "Choose your gelato, then pickup or delivery and a date at checkout.",
      },
      make: {
        title: "We make it",
        text: "Every cake is made fresh; pints are packed from our freezer.",
      },
      collect: {
        title: "Pick up or delivery",
        text: "Free pickup at Lucia kitchen. Some orders eligible for delivery (fees may apply).",
      },
    },
  },
  /** Gelato cakes page. */
  cakesHero: {
    eyebrow: "Order · Gelato cakes",
    title: "Make it a cake",
    /** Followed by " — made to order with {cake lead days} days’ notice." */
    intro:
      "Custom-made for birthdays, weddings and special moments. Two layers of gelato or sorbet on your choice of base",
  },
  cakeBuilder: {
    steps: {
      size: "Choose your size",
      base: "Pick your base",
      flavours: "Choose your flavours",
      dietary: "Allergies or dietary needs?",
    },
    customQuestion: "Want a different size or flavour?",
    customLinkLabel: "Ask us about a custom cake",
    summaryEyebrow: "Your cake",
  },
  /** Thank-you page after paying. */
  success: {
    title: "Thank you!",
    intro: "Your order is in and Lucia is on it.",
    homeButton: "Back home",
  },
  cart: {
    title: "Your cart",
    empty: {
      title: "Your cart is empty",
      text: "Lucia’s out exploring. Pick a pint or build a cake to get started.",
      pintsButton: "Shop pints",
      cakeButton: "Build a cake",
    },
    pickupHeading: "Pickup or delivery",
    paymentHeading: "Payment",
  },
};

export type OrderPage = typeof orderPage;
