import { defineType } from "sanity";
import { blurb, line, section, seoDescription } from "./pageFields";

const step = (name: string, title: string) =>
  section(name, title, [line("title", "Heading"), blurb("text", "Text", { rows: 2 })], { collapsed: false });

export const orderPage = defineType({
  name: "orderPage",
  title: "Order, cakes & cart",
  type: "document",
  fields: [
    section(
      "hero",
      "Order page: top",
      [line("eyebrow", "Small heading"), line("title", "Big heading"), blurb("intro", "Text")],
      { collapsed: false },
    ),
    section("pintsCard", "Order page: pints card", [
      line("title", "Heading", {
        description: "The size and price above it come from the Shop settings.",
      }),
      section("points", "Ticked points", [line("flavours", "First point"), line("options", "Second point")], {
        collapsed: false,
        description: "A third point, how soon pints are ready, comes from the Shop settings.",
      }),
      line("button", "Button"),
    ]),
    section("cakesCard", "Order page: cakes card", [
      line("title", "Heading", {
        description:
          "The starting price and servings above it come from the cake sizes in the Shop settings.",
      }),
      section("points", "Ticked points", [line("choices", "First point"), line("options", "Second point")], {
        collapsed: false,
        description: "A third point, how many days’ notice cakes need, comes from the Shop settings.",
      }),
      line("button", "Button"),
    ]),
    section("howItWorks", "Order page: how it works", [
      line("title", "Heading"),
      section(
        "steps",
        "Steps",
        [step("order", "Step 1"), step("make", "Step 2"), step("collect", "Step 3")],
        { collapsed: false },
      ),
    ]),
    section("cakesHero", "Gelato cakes page: top", [
      line("eyebrow", "Small heading"),
      line("title", "Big heading"),
      blurb("intro", "Text", {
        description:
          "Followed automatically by “— made to order with … days’ notice.”, using the cake notice from the Shop settings, so end without a full stop.",
      }),
    ]),
    section("cakeBuilder", "Gelato cakes page: cake builder", [
      section(
        "steps",
        "Step headings",
        [
          line("size", "Step 1 (size)"),
          line("base", "Step 2 (base)"),
          line("flavours", "Step 3 (flavours)"),
          line("dietary", "Step 4 (allergies)"),
        ],
        {
          collapsed: false,
          description: "Cake sizes, bases and flavour combinations are in the Shop settings.",
        },
      ),
      line("customQuestion", "Question under the flavours", {
        description: "Followed by the link below.",
      }),
      line("customLinkLabel", "Link to the Contact page"),
      line("summaryEyebrow", "Small heading on the cake summary"),
    ]),
    section("success", "Thank-you page (after paying)", [
      line("title", "Big heading"),
      blurb("intro", "Text", { rows: 2 }),
      line("homeButton", "Button back to the home page"),
    ]),
    section("cart", "Cart page", [
      line("title", "Big heading"),
      section(
        "empty",
        "When the cart is empty",
        [
          line("title", "Heading"),
          blurb("text", "Text", { rows: 2 }),
          line("pintsButton", "Button to the pints"),
          line("cakeButton", "Button to the cakes page"),
        ],
        { collapsed: false },
      ),
      line("pickupHeading", "Checkout heading", {
        description:
          "Above the pickup or delivery choice. The rest of the checkout's wording stays as it is.",
      }),
      line("paymentHeading", "Payment heading"),
    ]),
    seoDescription({
      description:
        "For the Order page: one or two sentences shown under its link in Google and in link previews.",
    }),
    blurb("cakesMetaDescription", "Search engine description (Gelato cakes page)", {
      rows: 3,
      description: "One or two sentences shown under the page's link in Google and in link previews.",
    }),
  ],
  preview: { prepare: () => ({ title: "Order, cakes & cart" }) },
});
