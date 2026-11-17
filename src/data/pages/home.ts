import { img } from "@/lib/page-text";
import { site } from "@/data/site";

/**
 * Home page copy and photos as designed. Lucia edits them in the Studio (Pages › Home); any
 * field left empty there shows the value here. Links and colours stay in the code.
 */
export const homePage = {
  metaDescription: site.description,
  hero: {
    eyebrow: "Locally crafted since 2007",
    title: "Made on the Mountain",
    intro:
      "Small-batch gelato and sorbet, handmade in our kitchen at Base II — the only frozen treats made right here in Whistler.",
    findUsLabel: "Find us",
    orderLabel: "Order",
    photo: img(
      "/home/hero-mango-cone.webp",
      "A mango sorbet cone held up against snowy mountains",
      2560,
      1707,
    ),
  },
  /** The four drifting tiles. */
  tiles: {
    findUs: {
      label: "Find us",
      copy: "Seasonal spots, opening hours and where to grab a pint near you.",
      image: img("/home/bear-findus.webp", "", 567, 700),
    },
    order: {
      label: "Order",
      copy: "Pints and custom gelato cakes, for pickup at Base II or Thursday delivery.",
      image: img("/home/bear-order.webp", "", 700, 635),
    },
    events: {
      label: "Events",
      copy: "Weddings, parties and corporate days, with or without the trailer.",
      image: img("/home/bear-events.webp", "", 470, 700),
    },
    wholesale: {
      label: "Wholesale",
      copy: "Premium gelato for cafés, restaurants and retailers in the Sea to Sky.",
      image: img("/home/bear-wholesale.webp", "", 700, 539),
    },
  },
  flavours: {
    title: "Find your flavour",
    orderPintsLabel: "Order pints",
    cakeLabel: "Make it a cake",
    wholesaleLabel: "Wholesale flavours",
  },
  where: {
    title: "Where’s Lucia?",
    scoops: {
      title: "Craving a scoop?",
      copy: "Discover our seasonal locations and local scoop partners.",
      cta: "See the map",
    },
    pints: {
      title: "Fancy a pint?",
      copy: "Get pints at grocery stores around the Sea to Sky.",
      cta: "See stores",
    },
    elsewhere: {
      title: "Where else?",
      copy: "Find Lucia at restaurants, hotels, and other vendors.",
      cta: "Other vendors",
    },
    photo: img("/home/trailer-blob.webp", "The Lucia crew waving from the gelato trailer", 1344, 1080),
  },
  story: {
    eyebrow: "Our story",
    title: "Inspired by Italy, made in Whistler",
    body: "Lucia Gelato’s story began in Italy, inspired by the simple pleasure of stopping for a scoop of gelato along the way. A little pause after exploring, a chance to soak in somewhere new, or a sweet treat after a day of adventure.\n\nThe idea was simple: to bring a little bit of that Italian feeling back to Whistler.",
    linkLabel: "Read more",
    photo: img(
      "/home/story-skiers.webp",
      "Two skiers sharing a Lucia gelato cone on the mountain",
      900,
      1375,
    ),
  },
};

export type HomePage = typeof homePage;
