/**
 * The words around every page (menu, footer, newsletter sign-up) and the "page not found" page, as
 * designed. Lucia edits them in the Studio (Header, footer & newsletter); any field left empty
 * there shows the value here. Where each menu item links to stays in the code (siteNav in
 * src/components/Header.tsx).
 */
export const siteText = {
  /** Menu labels, used in the header, the mobile menu and the footer. */
  menu: {
    findUs: {
      label: "Find us",
      seasonal: "Seasonal locations",
      schedule: "Schedule & hours",
      grocery: "Grocery stores",
      scoops: "Scoop locations",
    },
    order: {
      label: "Order",
      pints: "Pints",
      cakes: "Gelato cakes",
    },
    ourGelato: {
      label: "Our gelato",
    },
    events: {
      label: "Events",
      packages: "Packages & pricing",
      faq: "FAQ",
      book: "Booking request",
    },
    wholesale: {
      label: "Wholesale",
      info: "Wholesale info",
      flavours: "Flavours list",
      order: "Order form",
    },
    about: {
      label: "About",
      story: "Our story",
      contact: "Contact us",
    },
    cartLabel: "Cart",
  },
  footer: {
    kitchenHeading: "Our kitchen at Base II",
    instagramLabel: "Instagram",
  },
  newsletter: {
    heading: "New flavours, trailer sightings & Lucia’s latest adventures.",
    intro: "A few emails a season. No spam, just gelato.",
    buttonLabel: "Sign up",
    success: "You’re in! Watch your inbox for Lucia’s next adventure.",
  },
  notFound: {
    title: "Off-piste!",
    text: "Lucia went looking, but this page has melted away.",
    homeLabel: "Back home",
    findUsLabel: "Find gelato",
  },
};

export type SiteText = typeof siteText;
