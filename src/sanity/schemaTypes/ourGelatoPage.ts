import { defineType } from "sanity";
import { blurb, line, paragraphs, photo, section, seoDescription } from "./pageFields";

export const ourGelatoPage = defineType({
  name: "ourGelatoPage",
  title: "Our gelato",
  type: "document",
  fields: [
    section(
      "hero",
      "Top of the page",
      [
        photo("photo", "Big photo", {
          description:
            "Shown with the shortcut buttons over its bottom-left corner. Drag the hotspot to keep the important part in view.",
        }),
        section(
          "shortcuts",
          "Shortcut buttons on the photo",
          [
            line("orderPints", "“Order pints” button"),
            line("orderCake", "“Order a cake” button"),
            line("whatIsGelato", "“What’s gelato?” button"),
            line("dairyFree", "“Dairy-free gelato vs. sorbet” button"),
            line("difference", "“The Lucia difference” button"),
          ],
          { collapsed: false },
        ),
      ],
      { collapsed: false },
    ),
    section("pints", "Order pints", [
      line("title", "Heading", {
        description:
          "The ordering note under it (how far ahead to order, delivery days and free delivery) comes from the Shop settings. The flavours are under Pint flavours.",
      }),
    ]),
    section("allergies", "Allergies box", [
      line("title", "Heading"),
      blurb("text", "Text", { rows: 4 }),
      line("linkLabel", "“Contact us” link"),
    ]),
    section("cakes", "“Feeding a crowd?” box", [
      line("title", "Heading"),
      line("button", "Button to the cakes page"),
    ]),
    section("stores", "Pints in stores box", [
      line("title", "Heading", { description: "The store list comes from Stockists." }),
      line("linkLabel", "“See all locations” link"),
    ]),
    section("whatIsGelato", "What is gelato?", [
      line("title", "Heading"),
      paragraphs("text", "Text", { rows: 6 }),
    ]),
    section("dairyFree", "Dairy-free gelato vs. sorbet", [
      blurb("title", "Heading", { rows: 2, description: "Start a new line where the heading should wrap." }),
      paragraphs("text", "Text", { rows: 6 }),
    ]),
    section("difference", "The Lucia Difference", [
      line("title", "Heading"),
      paragraphs("text", "Text"),
      line("linkLabel", "Link to the About page"),
      photo("photo", "Photo", {
        description:
          "The design’s photo has its blob shape cut out already. A replacement shows as uploaded, so use a PNG with a transparent background for the same look.",
      }),
    ]),
    section("scoops", "Scoop illustrations", [
      photo("pink", "Pink scoop", {
        decorative: true,
        description:
          "Beside the “Pints in stores” box on wide screens. A cut-out with a transparent background works best (PNG or WebP).",
      }),
      photo("cream", "Cream scoop", {
        decorative: true,
        description:
          "Above “What is gelato?”. A cut-out with a transparent background works best (PNG or WebP).",
      }),
    ]),
    seoDescription(),
  ],
  preview: { prepare: () => ({ title: "Our gelato" }) },
});
