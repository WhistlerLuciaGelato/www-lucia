/**
 * Weddings & events page copy as designed. Lucia edits it in the Studio (Weddings & events ›
 * Page text & photos); any field left empty there shows the value here. The packages, travel
 * fees, FAQ and gallery live in the same document but are read by getEvents (src/lib/content.ts).
 * Links, anchors and colours stay in the code.
 */
export const eventsPageText = {
  metaDescription:
    "Bring the Lucia Gelato trailer or our wooden gelato display to your wedding, party or corporate event. Serving Whistler, Squamish, Pemberton and Vancouver.",
  hero: {
    eyebrow: "Packages & pricing",
    /** A new line in the text breaks the heading there. */
    title: "Bring gelato\nto your party",
  },
  /** Words on every package card; names, prices and what's included come from the packages. */
  packageCards: {
    startingAt: "Starting at",
    moreInfo: "More info",
    /** Followed by the package name, without a leading "The": "Request Classic". */
    request: "Request",
  },
  travelInfo: {
    title: "Travel & Booking Info",
    /** "More questions? See FAQ below or contact us", in pieces around its two links. */
    questionsBefore: "More questions? See",
    faqLink: "FAQ",
    questionsBetween: "below or",
    contactLink: "contact us",
  },
  faqText: {
    title: "FAQ",
    moreQuestions: "More questions?",
    contactLink: "Contact us",
  },
  booking: {
    title: "Request a booking",
    intro: "Tell us a little about your event and we’ll get back to you with availability and a quote.",
    note: "Please note that event requests are subject to our availability. Our team will be in touch to confirm your event booking.",
    successTitle: "Thanks — your request is in!",
    successMessage: "We’ll be in touch soon to confirm availability and details.",
  },
};

export type EventsPageText = typeof eventsPageText;
