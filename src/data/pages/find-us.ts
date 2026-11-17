import { img } from "@/lib/page-text";
import { site } from "@/data/site";

/**
 * Find us page copy and photos as designed. Lucia edits them in the Studio (Pages › Find us);
 * any field left empty there shows the value here. Locations, hours and stockists have their own
 * documents; links, colours and the map stay in the code.
 *
 * Line breaks (Enter) in the headings and notes are kept, and words in [square brackets] link to
 * Lucia's Instagram.
 */
export const findUsPage = {
  metaDescription:
    "Where to find Whistler Lucia Gelato: seasonal scoop shops, the gelato trailer, grocery stores and partners across Whistler, Squamish and Pemberton.",
  hero: {
    title: "Find Lucia",
    intro:
      "Handcrafted with care in Whistler, our gelato and sorbetto can be found at our seasonal stands, mobile trailer, and a variety of local partners throughout Whistler, Squamish, and Pemberton.",
    scheduleLabel: "Schedule & hours",
    /** The three round shortcuts under the intro. */
    shortcuts: {
      scoopShops: "Summer scoop shops",
      pints: "Take-home pints",
      otherVendors: "Other vendors",
    },
    photo: img(
      "/find-us/hero-trailer.webp",
      "A Lucia scooper handing a cup of gelato across the counter of the gelato trailer",
      1500,
      2251,
    ),
  },
  seasonal: {
    pill: "Summer only!",
    title: "Seasonal\nscoop shops",
    /** The buttons under the map. */
    mapButtons: {
      nearest: "Find scoop nearest me",
      seeAll: "See all on map",
      schedule: "Schedule & hours",
    },
    /** The buttons inside an opened location card. */
    cardButtons: {
      googleMaps: "Show in Google Maps",
      schedule: "Schedule",
    },
    note: {
      title: "Take note!",
      text: "Please note that locations, hours, and operating dates vary throughout the season. We try our best to keep this page up to date, but please check our latest updates on [Instagram] before heading out to find us!",
    },
  },
  schedule: {
    pill: "Summer only!",
    title: "Schedule & Hours",
    /** Above the calendar: one note while spots have open dates coming up, another when they don't. */
    calendarNote: {
      open: "Check [Instagram] to confirm we’re open before heading out!",
      closed:
        "**Our retail scooping locations are currently closed for the season.** Stay tuned for updates here or on [Instagram] in late May / early June.",
    },
    intro: "Our outdoor spots open with the seasons and the weather. Here’s when to find us.",
    table: {
      location: "Location",
      season: "Season",
      hours: "Hours",
      noHours: "Hours TBC",
    },
    weather: {
      title: "Mountain weather disclaimer",
      text: `Our outdoor spots are weather-dependent. On stormy, smoky or very cold days we may close early or stay in the kitchen. Check Instagram [${site.instagramHandle}] for same-day updates before you make the trip.`,
    },
  },
  grocery: {
    pill: "Year-round",
    title: "Take home a pint!",
    intro:
      "Craving Lucia Gelato from the comfort of your own home? Find our take-home tubs at local grocery stores and retailers throughout Whistler, Squamish and Pemberton. Stock up on your favourite flavours or discover something new!",
    note: "Flavours and availability vary by location.",
  },
  partners: {
    pill: "Seasonal",
    title: "Scoop partners",
    intro:
      "We’re proud to partner with local businesses throughout the Sea to Sky corridor that serve Lucia Gelato by the scoop! Whether you’re exploring Whistler, spending the day in Squamish, or visiting Pemberton, you can enjoy your favourite flavours at these local spots.",
    note: "Flavours and availability vary by location.\nCheck directly with our partners for current availability.",
  },
  menu: {
    title: "Also on the menu at…",
    note: "Flavours, menu offerings, and availability vary by location.\nPlease check directly with each business to see how they’re serving Lucia Gelato!",
    wholesalePrompt: "Want Lucia on your menu?",
    wholesaleLabel: "Become a wholesale partner",
  },
};

export type FindUsPage = typeof findUsPage;
