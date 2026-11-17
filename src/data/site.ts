export const site = {
  name: "Whistler Lucia Gelato",
  shortName: "Lucia Gelato",
  tagline: "Made on the Mountain",
  description:
    "Small-batch gelato and sorbetto handcrafted in Whistler since 2007. Find our trailer, order pints and gelato cakes, book us for your event, or stock Lucia in your café.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://luciagelato.com",
  email: "luciagelato@gmail.com",
  phone: "(604) 967-3886",
  phoneHref: "tel:+16049673886",
  instagram: "https://www.instagram.com/whistlerluciagelato/",
  instagramHandle: "@whistlerluciagelato",
  kitchen: {
    label: "Our kitchen at Base II",
    street: "4900 Glacier Drive",
    city: "Whistler, BC V0N 1B4",
    // Approximate pin for the map embed.
    lat: 50.1091,
    lng: -122.9395,
  },
  mailing: {
    street: "PO Box 755",
    city: "Whistler, BC V0N 1B0",
  },
} as const;

export type NavItem = { label: string; href: string; children?: NavItem[] };
