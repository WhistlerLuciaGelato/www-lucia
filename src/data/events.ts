import type { EventPackage } from "@/lib/content-types";

// Default events content, used until the Sanity Studio has its own.
export const eventPackages: EventPackage[] = [
  {
    id: "classic",
    name: "The Classic",
    basePrice: 500,
    baseGuests: 50,
    perGuest: 7,
    features: ["5 flavours", "Simple table setup", "Gelato & sorbet options", "Up to 1.5 hours of service"],
    accent: "lakeside",
  },
  {
    id: "signature",
    name: "The Signature",
    basePrice: 825,
    baseGuests: 75,
    perGuest: 8,
    features: [
      "Full gelato trailer setup",
      "7 flavours",
      "Gelato & sorbet options",
      "Up to 2.5 hours of service",
    ],
    accent: "strawberry",
  },
  {
    id: "experience",
    name: "The Experience",
    basePrice: 900,
    baseGuests: 75,
    perGuest: 9,
    features: [
      "Full gelato trailer",
      "7 flavours + toppings & sauces",
      "Interactive sundae bar",
      "Up to 3 hours of service",
    ],
    accent: "heatwave",
  },
];

export const travelFees: { area: string; fee: number }[] = [
  { area: "Whistler", fee: 0 },
  { area: "Squamish / Pemberton", fee: 100 },
  { area: "Vancouver", fee: 200 },
];

export const eventTerms = [
  "No travel fee within Whistler",
  "+$100 Squamish / Pemberton",
  "+$200 Vancouver",
  "Minimum $500 booking deposit",
  "Taxes & gratuity not included",
];

export function estimateEvent(pkg: EventPackage, guests: number, travelFee: number) {
  const extra = Math.max(0, guests - pkg.baseGuests);
  return pkg.basePrice + extra * pkg.perGuest + travelFee;
}

export const eventFaq: { q: string; a: string }[] = [
  {
    q: "How far in advance should we book?",
    a: "Summer weekends — especially wedding season — fill up early, so reach out as soon as you have a date. We'll always do our best for last-minute requests.",
  },
  {
    q: "Can we mix and match packages?",
    a: "Absolutely. Tell us about your event and we'll find the perfect fit — more flavours, longer service, toppings, whatever you need.",
  },
  {
    q: "Do you have dairy-free and vegan options?",
    a: "Yes. Our sorbets are dairy-free and vegan, and we make dairy-free gelatos with coconut milk. Every package can include them.",
  },
  {
    q: "Where do you travel?",
    a: "Anywhere in the Sea to Sky and down to Vancouver. There's no travel fee within Whistler, +$100 for Squamish or Pemberton, and +$200 for Vancouver.",
  },
  {
    q: "What do you need from us on the day?",
    a: "A flat, accessible spot for the table or trailer. We'll confirm space, power and access details with you before the event.",
  },
  {
    q: "How do deposits work?",
    a: "A minimum $500 deposit secures your date. Taxes and gratuity are not included in package prices.",
  },
  {
    q: "What's included?",
    // TODO(client): confirm against the copy doc.
    a: "Every package includes our team, your choice of flavours (gelato, sorbet and dairy-free), and everything needed to serve them. See each package above for the setup and length of service.",
  },
  {
    q: "How much space is required for the gelato trailer?",
    // TODO(client): add the trailer's footprint from the copy doc.
    a: "The trailer needs a flat, level spot it can be towed into, with room around it for a line of guests. Send us your venue details and we'll confirm it fits.",
  },
  {
    q: "What are the electricity requirements for the trailer?",
    // TODO(client): add the trailer's power needs from the copy doc.
    a: "Let us know what power is available at your venue when you book, and we'll confirm what the trailer needs before your event.",
  },
  {
    q: "What is your cancellation and refund policy?",
    // TODO(client): add the cancellation and refund terms from the copy doc.
    a: "Plans change, so please let us know as soon as you can. We'll confirm our cancellation and refund terms with your booking.",
  },
  {
    q: "Can we pick our flavours?",
    a: "Of course — choose from our seasonal lineup, or ask about a custom flavour to match your theme or colours.",
  },
];
