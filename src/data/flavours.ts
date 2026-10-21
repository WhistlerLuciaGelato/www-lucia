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

export type PintFlavour = {
  slug: string;
  name: string;
  /** "Sorbet" etc. Shown under the name, as on the pint label. */
  style: "Gelato" | "Sorbet" | "Dairy-free gelato";
  blurb: string;
  diet: Diet[];
  /** Label colour, used for card accents. */
  color: string;
  /** What Lucia is up to on the label. */
  activity: string;
  bear: Bear;
};

/**
 * The 2025 retail pint lineup (473 mL), matching the new packaging.
 * Dietary tags follow the icons printed on each label.
 */
export const pintFlavours: PintFlavour[] = [
  {
    slug: "salted-caramel",
    name: "Salted Caramel",
    style: "Gelato",
    blurb:
      "Started as our answer to a trend and became our #1 flavour. Smooth, sweet and salty — we honestly can't make it fast enough.",
    diet: ["gluten-free"],
    color: "#d9874a",
    activity: "Lucia hikes the Sea to Sky",
    bear: "hiker",
  },
  {
    slug: "chocolate-caramel-sea-salt",
    name: "Chocolate Caramel Sea Salt",
    style: "Gelato",
    blurb:
      "How do you improve on our #1 flavour? Add deep, dangerous, dark chocolate. Sweet and salty never tasted so good.",
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
      "The perfect balance of sophisticated coolness and a little bit nutty. Dense, smooth and intense — the Italian way.",
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
      "Our friend KO ordered vanilla at every gelato shop in Italy. She knows what she likes — and she has very good taste.",
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
    slug: "coconut-cookies-cream",
    name: "Coconut Cookies & Cream",
    style: "Dairy-free gelato",
    blurb:
      "Our most-requested market flavour, made with coconut milk so everyone can dig in. Creamy, crunchy, completely dairy-free.",
    diet: ["dairy-free", "vegan"],
    color: "#5b74b5",
    activity: "Lucia rips the backcountry",
    bear: "snowmobile",
  },
  {
    slug: "choco-coco",
    name: "Choco Coco",
    style: "Dairy-free gelato",
    blurb:
      "Dark chocolate and coconut milk, dense and intense. Like Christopher Walken said, you can never have too much cowbell — we mean coconut.",
    diet: ["dairy-free", "vegan", "gluten-free"],
    color: "#4f8f9c",
    activity: "Lucia lays down a powder turn",
    bear: "snowboard-pink",
  },
  {
    slug: "mango",
    name: "Mango",
    style: "Sorbet",
    blurb:
      "Named for our daughter Lucy, who has loved all things mango since she could hold one. Bright, juicy, pure fruit.",
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
      "Goes out fast and strong, then fades away somewhere relaxing. A blast of fresh lemon that tastes like a bluebird day.",
    diet: ["dairy-free", "vegan", "gluten-free"],
    color: "#2f7aa0",
    activity: "Lucia hits the big air jump",
    bear: "ski-jump",
  },
  {
    slug: "wildberry",
    name: "Wildberry",
    style: "Sorbet",
    blurb:
      "A handful of mountain berries in every spoonful — tart, sweet and deep purple. Summer in the valley, all year round.",
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

export function getPintFlavour(slug: string) {
  return pintFlavours.find((f) => f.slug === slug);
}
