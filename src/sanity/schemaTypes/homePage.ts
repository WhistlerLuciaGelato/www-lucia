import { defineType } from "sanity";
import { blurb, line, paragraphs, photo, section, seoDescription } from "./pageFields";

const tile = (name: string, title: string) =>
  section(name, title, [
    line("label", "Label"),
    blurb("copy", "Text under the tile", { rows: 2 }),
    photo("image", "Illustration", {
      decorative: true,
      description: "A cut-out with a transparent background works best (PNG or WebP).",
    }),
  ]);

const whereCard = (name: string, title: string) =>
  section(name, title, [line("title", "Heading"), blurb("copy", "Text", { rows: 2 }), line("cta", "Button")]);

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  fields: [
    section(
      "hero",
      "Top of the page",
      [
        line("eyebrow", "Small heading"),
        line("title", "Big heading"),
        blurb("intro", "Text"),
        line("findUsLabel", "“Find us” button"),
        line("orderLabel", "“Order” button"),
        photo("photo", "Background photo", {
          description: "A wide landscape photo. Drag the hotspot to keep the important part in view.",
        }),
      ],
      { collapsed: false },
    ),
    section("tiles", "Section tiles", [
      tile("findUs", "Find us tile"),
      tile("order", "Order tile"),
      tile("events", "Events tile"),
      tile("wholesale", "Wholesale tile"),
    ]),
    section("flavours", "Find your flavour", [
      line("title", "Heading"),
      line("orderPintsLabel", "“Order pints” button"),
      line("cakeLabel", "“Make it a cake” button"),
      line("wholesaleLabel", "“Wholesale flavours” button"),
    ]),
    section("where", "Where’s Lucia?", [
      line("title", "Heading"),
      whereCard("scoops", "Scoops card"),
      whereCard("pints", "Pints card"),
      whereCard("elsewhere", "Other vendors card"),
      photo("photo", "Photo", {
        description:
          "The design’s photo has its blob shape cut out already. A replacement shows as uploaded, so use a PNG with a transparent background for the same look.",
      }),
    ]),
    section("story", "Our story panel", [
      line("eyebrow", "Small heading"),
      line("title", "Heading"),
      paragraphs("body", "Text", { rows: 6 }),
      line("linkLabel", "Link to the About page"),
      photo("photo", "Photo", { description: "A tall (portrait) photo works best." }),
    ]),
    seoDescription(),
  ],
  preview: { prepare: () => ({ title: "Home" }) },
});
