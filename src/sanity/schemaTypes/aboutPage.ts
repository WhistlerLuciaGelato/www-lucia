import { defineType } from "sanity";
import { blurb, line, paragraphs, photo, section, seoDescription } from "./pageFields";

const pillar = (name: string, title: string) =>
  section(name, title, [line("title", "Heading"), blurb("body", "Text")]);

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  fields: [
    section(
      "heading",
      "Top of the page",
      [line("eyebrow", "Small heading"), line("title", "Big heading"), blurb("intro", "Text", { rows: 2 })],
      { collapsed: false },
    ),
    section("story", "Our story", [
      photo("photo", "Photo", { description: "A tall (portrait) photo works best." }),
      line("startedTitle", "First heading"),
      paragraphs("started", "Text under the first heading"),
      line("commitmentTitle", "Second heading"),
      paragraphs("commitment", "Text under the second heading", { rows: 5 }),
      line("signOff", "Sign-off", {
        description: "The line at the end, e.g. “Ciao, Tancrede & Team Lucia”.",
      }),
    ]),
    section(
      "pillars",
      "Coloured bubbles",
      [
        pillar("madeHere", "Blue bubble"),
        pillar("seaToSky", "Pink bubble"),
        pillar("adventure", "Orange bubble"),
        pillar("whistler", "Green bubble"),
      ],
      { description: "The four bubbles under the story, from left to right." },
    ),
    section("lucia", "Meet Lucia", [
      line("eyebrow", "Small heading"),
      line("title", "Heading"),
      paragraphs("body", "Text", { rows: 6 }),
      photo("illustration", "Illustration", {
        decorative: true,
        description:
          "The white Lucia in the top corner. A cut-out with a transparent background works best (PNG or WebP).",
      }),
    ]),
    section("sayHi", "Come say hi", [
      line("title", "Heading"),
      blurb("intro", "Text", { rows: 2 }),
      line("contactLabel", "“Contact us” button"),
      line("findUsLabel", "“Find Lucia” button"),
    ]),
    seoDescription(),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});
