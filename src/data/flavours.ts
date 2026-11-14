import type { PintFlavour } from "@/lib/content-types";

export type Diet = "dairy-free" | "vegan" | "gluten-free";

export type Bear =
  | "bike"
  | "bmx"
  | "hiker"
  | "kayak"
  | "paddleboard"
  | "ski-jump"
  | "ski-touring"
  | "snowboard-pink"
  | "snowmobile"
  | "whitewater"
  | "zipline";

type DefaultPint = Omit<PintFlavour, "image" | "available" | "label" | "stock"> & { render?: boolean };

/** Flavours with a round lid label in public/pints/label (from the Figma product cards). */
export const roundLabels = new Set([
  "salted-caramel",
  "coconut-cookies-cream",
  "mango",
  "lemon",
  "chocolate-caramel-sea-salt",
  "pistachio",
  "choco-coco",
  "vanilla-bean",
  "wildberry",
]);

/**
 * The retail pint lineup (473 mL), in the order shown on the website. `render: true` flavours
 * have transparent pint renders (public/pints/render) shown in front of a lid.
 * The 2025 lineup matches the new packaging.
 * Dietary tags follow the icons printed on each label.
 */
export const pintFlavours: DefaultPint[] = [
  {
    slug: "salted-caramel",
    name: "Salted Caramel",
    style: "Gelato",
    blurb:
      "Featuring our homemade caramel sauce, carefully prepared in-house and finished with a touch of salt. The perfect balance of sweet, salty, and creamy.",
    render: true,
    diet: ["gluten-free"],
    ingredients:
      "Whole Milk, Sugars (sugar, dextrose), Cream, Caramel Sauce (Sugar, Cream, Glucose, Water, Salt), Skim Milk Powder, Kosher Salt, Stabilizer (Mono and diglycerides, locust bean gum, sodium alginate, guar gum, carrageenan)",
    contains: "Milk",
    color: "#d9874a",
    activity: "Lucia hikes the Sea to Sky",
    bear: "hiker",
  },
  {
    slug: "coconut-cookies-cream",
    name: "Coconut Cookies & Cream",
    style: "Dairy-free gelato",
    blurb:
      "Smooth and creamy coconut-based gelato loaded with crunchy cookie pieces. All the indulgence of a classic favourite, without the dairy!",
    render: true,
    diet: ["dairy-free", "vegan"],
    color: "#5b74b5",
    activity: "Lucia rips the backcountry",
    bear: "snowmobile",
  },
  {
    slug: "mango",
    name: "Mango",
    style: "Sorbet",
    blurb:
      "A Lucia bestseller for over 20 years! Our signature mango sorbetto has been a favourite since the very beginning. Sweet, tropical and bursting with real mango flavour.",
    render: true,
    diet: ["dairy-free", "vegan", "gluten-free"],
    color: "#f07a2e",
    activity: "Lucia paddleboards at sunset",
    bear: "paddleboard",
  },
  {
    slug: "lemon",
    name: "Lemon",
    style: "Sorbet",
    blurb:
      "Made with lemons freshly squeezed in-house and blended with a simple sugar syrup. Bright, refreshing and the perfect balance of sweet and tart.",
    render: true,
    diet: ["dairy-free", "vegan", "gluten-free"],
    color: "#2f7aa0",
    activity: "Lucia hits the big air jump",
    bear: "ski-jump",
  },
  {
    slug: "chocolate-caramel-sea-salt",
    name: "Chocolate Caramel Sea Salt",
    style: "Gelato",
    blurb:
      "Rich chocolate gelato swirled with our homemade caramel sauce and a hint of sea salt. A decadent combination of sweet and salty flavours.",
    render: true,
    diet: ["gluten-free"],
    color: "#b05aa8",
    activity: "Lucia sends the bike park",
    bear: "bmx",
  },
  {
    slug: "pistachio",
    name: "Pistachio",
    style: "Gelato",
    blurb:
      "Made with premium Iranian pistachios, roasted and ground in-house to create our very own pistachio paste. Rich, nutty, and full of authentic pistachio flavour.",
    render: true,
    diet: ["gluten-free"],
    color: "#7d8b2c",
    activity: "Lucia skins up for first tracks",
    bear: "ski-touring",
  },
  {
    slug: "vanilla-bean",
    name: "Vanilla Bean",
    style: "Gelato",
    blurb:
      "Made with real organic Madagascar vanilla beans for a beautifully smooth, fragrant, and timeless classic.",
    render: true,
    diet: ["gluten-free"],
    color: "#6b5a49",
    activity: "Lucia paddles Alta Lake",
    bear: "kayak",
  },
  {
    slug: "fresh-mint-chips",
    name: "Fresh Mint Chips",
    style: "Gelato",
    blurb:
      "Cool, fresh mint with dark chocolate chips folded through. Once it's open, it has a hard time making it back to the freezer.",
    diet: ["gluten-free"],
    color: "#3f8a6c",
    activity: "Lucia runs the River of Golden Dreams",
    bear: "whitewater",
  },
  {
    slug: "choco-coco",
    name: "Choco Coco",
    style: "Dairy-free gelato",
    blurb:
      "Rich, chocolatey and irresistibly creamy. Made with a coconut milk base for a deliciously indulgent dairy-free treat.",
    render: true,
    diet: ["dairy-free", "vegan", "gluten-free"],
    color: "#4f8f9c",
    activity: "Lucia lays down a powder turn",
    bear: "snowboard-pink",
  },
  {
    slug: "wildberry",
    name: "Wildberry",
    style: "Sorbet",
    blurb:
      "A delicious blend of raspberries, blueberries and strawberries sourced from Mandair Farm in Abbotsford, BC. A refreshing taste of summer berries in every spoonful.",
    render: true,
    diet: ["dairy-free", "vegan", "gluten-free"],
    color: "#b33c8a",
    activity: "Lucia ziplines over the valley",
    bear: "zipline",
  },
];

export const dietLabels: Record<Diet, string> = {
  "dairy-free": "Dairy-free",
  vegan: "Vegan",
  "gluten-free": "Gluten-free",
};
