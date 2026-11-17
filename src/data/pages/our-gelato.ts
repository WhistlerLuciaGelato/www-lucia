import { img } from "@/lib/page-text";

/**
 * Our gelato page copy and photos as designed. Lucia edits them in the Studio (Pages › Our
 * gelato); any field left empty there shows the value here. Links, colours and the pint ordering
 * note (it shows live lead days and delivery times) stay in the code; the flavours themselves are
 * the Studio's pint flavours.
 */
export const ourGelatoPage = {
  metaDescription:
    "Order Whistler Lucia Gelato pints for pickup or Thursday delivery, and learn what makes gelato, dairy-free gelato and sorbetto different. Handcrafted on Blackcomb Mountain.",
  hero: {
    photo: img(
      "/our-gelato/hero-pints-snow.webp",
      "Lucia Gelato pints, Lemon Sorbet and Coconut Cookies & Cream among them, nestled in snow",
      2400,
      3600,
    ),
    /** The jump links on the photo. */
    shortcuts: {
      orderPints: "Order pints",
      orderCake: "Order a cake",
      whatIsGelato: "What’s gelato?",
      dairyFree: "Dairy-free gelato vs. sorbet",
      difference: "The Lucia difference",
    },
  },
  pints: {
    title: "Order pints",
  },
  allergies: {
    title: "Have allergies or dietary restrictions?",
    text: "Please let our team know before ordering. We’re always happy to help you explore ingredients and find a suitable option, whether you’re choosing a scoop, ordering a gelato cake, or planning an event.",
    linkLabel: "Contact us",
  },
  cakes: {
    title: "Feeding a crowd?",
    button: "Make it a cake!",
  },
  stores: {
    title: "Find pints in stores at",
    linkLabel: "See all locations",
  },
  whatIsGelato: {
    title: "What is gelato?",
    text: "Gelato is a traditional Italian frozen dessert known for its smooth, creamy texture and rich, intense flavours. Made with more milk, less cream, and less air than traditional ice cream, gelato has a denser, silkier consistency that lets the natural flavours of its ingredients shine through.",
  },
  dairyFree: {
    /** A line break in the heading shows where it wraps. */
    title: "Dairy-free gelato\nvs. sorbet",
    text: "Our **dairy-free gelato** is primarily made with coconut milk, creating a rich, smooth, and creamy consistency without the dairy. Our **fruit sorbettos** are made with simple ingredients, combining fruit purées, water, and sugar for a light, refreshing treat bursting with natural fruit flavour. We love using seasonal fruits whenever possible to bring out their best.",
  },
  difference: {
    title: "The Lucia Difference",
    text: "We believe the best gelato starts with simple, quality ingredients. That’s why we’re passionate about making our gelato fresh, using natural ingredients and sourcing locally whenever possible. Every batch is made with care, bringing together authentic Italian traditions, homemade quality and a little Whistler creativity.\n\nAlongside our signature favourites, we love experimenting with seasonal ingredients and creating exciting new flavours throughout the year. Whether you’re enjoying a scoop after a day on the mountain or bringing a gelato pint home to share, you’re enjoying a little taste of Whistler, made right here in the mountains.",
    linkLabel: "Read our story",
    photo: img(
      "/our-gelato/scooping-blob.webp",
      "Scooping mango sorbetto from a tray in the Lucia gelato case",
      900,
      1036,
    ),
  },
  /** The two scoop illustrations floating beside the cards. */
  scoops: {
    pink: img("/our-gelato/scoop-pink.webp", "", 744, 694),
    cream: img("/our-gelato/scoop-cream.webp", "", 318, 296),
  },
};

export type OurGelatoPage = typeof ourGelatoPage;
