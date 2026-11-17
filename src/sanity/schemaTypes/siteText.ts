import { defineType } from "sanity";
import { blurb, line, section } from "./pageFields";

const link = (name: string, label: string) => line(name, `“${label}” link`);

export const siteText = defineType({
  name: "siteText",
  title: "Header, footer & newsletter",
  type: "document",
  fields: [
    section(
      "menu",
      "Menu",
      [
        section("findUs", "Find us", [
          line("label", "Menu item"),
          link("seasonal", "Seasonal locations"),
          link("schedule", "Schedule & hours"),
          link("grocery", "Grocery stores"),
          link("scoops", "Scoop locations"),
        ]),
        section("order", "Order", [
          line("label", "Menu item", { description: "Also the pink “Order” button at the top." }),
          link("pints", "Pints"),
          link("cakes", "Gelato cakes"),
        ]),
        section("ourGelato", "Our gelato", [line("label", "Menu item")]),
        section("events", "Events", [
          line("label", "Menu item"),
          link("packages", "Packages & pricing"),
          link("faq", "FAQ"),
          link("book", "Booking request"),
        ]),
        section("wholesale", "Wholesale", [
          line("label", "Menu item"),
          link("info", "Wholesale info"),
          link("flavours", "Flavours list"),
          link("order", "Order form"),
        ]),
        section("about", "About", [
          line("label", "Menu item"),
          link("story", "Our story"),
          link("contact", "Contact us"),
        ]),
        line("cartLabel", "Cart button"),
      ],
      {
        collapsed: false,
        description:
          "The names of the pages in the menu at the top, the mobile menu and the footer. Where each one leads stays the same.",
      },
    ),
    section(
      "footer",
      "Footer",
      [
        line("kitchenHeading", "Heading above the kitchen address"),
        line("instagramLabel", "Heading above the Instagram link"),
      ],
      { description: "The address, email and phone number themselves are in Site settings." },
    ),
    section(
      "newsletter",
      "Newsletter sign-up",
      [
        line("heading", "Heading"),
        blurb("intro", "Text", { rows: 2 }),
        line("buttonLabel", "Sign-up button"),
        blurb("success", "Thank-you message", { rows: 2, description: "Shown once someone has signed up." }),
      ],
      { description: "In the footer of every page." },
    ),
    section(
      "notFound",
      "“Page not found” page",
      [
        line("title", "Heading"),
        blurb("text", "Text", { rows: 2 }),
        line("homeLabel", "“Back home” button"),
        line("findUsLabel", "“Find gelato” button"),
      ],
      { description: "Shown when someone follows a broken or out-of-date link." },
    ),
  ],
  preview: { prepare: () => ({ title: "Header, footer & newsletter" }) },
});
