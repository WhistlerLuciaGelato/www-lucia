import { defineArrayMember, defineField, defineType } from "sanity";
import { blurb, line, pageTextGroup, section, seoDescription } from "./pageFields";
import { wholesaleKindOptions } from "./options";

export const wholesalePage = defineType({
  name: "wholesalePage",
  title: "Wholesale",
  type: "document",
  groups: [{ name: "lists", title: "Sizes, flavours & suppliers", default: true }, pageTextGroup],
  fields: [
    defineField({
      name: "formats",
      group: "lists",
      title: "Sizes",
      description:
        "Listed under Wholesale Pricing and offered in the quote request form. Prices aren't shown on the website.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "kind",
              title: "Format type",
              description: "Decides which flavour lists can be ordered in this format.",
              type: "string",
              options: { list: wholesaleKindOptions },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "price",
              title: "Reference price ($)",
              description: "Optional, for your own reference. Not shown on the website or in quote requests.",
              type: "number",
              validation: (r) => r.min(0).precision(2),
            }),
            defineField({
              name: "multiple",
              title: "Order in multiples of",
              type: "number",
              initialValue: 1,
              validation: (r) => r.required().integer().min(1),
            }),
            defineField({ name: "note", title: "Note (optional)", type: "string" }),
          ],
          preview: {
            select: { title: "label", subtitle: "note" },
          },
        }),
      ],
    }),
    defineField({
      name: "deliverySchedule",
      group: "lists",
      title: "Delivery schedule",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "area", title: "Area", type: "string" }),
            defineField({ name: "days", title: "Delivery days", type: "string" }),
            defineField({ name: "terms", title: "Fees & minimums", type: "string" }),
          ],
          preview: { select: { title: "area", subtitle: "days" } },
        }),
      ],
    }),
    defineField({
      name: "flavourGroups",
      group: "lists",
      title: "Flavour lists",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "List name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "note",
              title: "Note (optional)",
              type: "string",
              placeholder: "Dairy-free",
            }),
            defineField({
              name: "availableIn",
              title: "Can be ordered as",
              description:
                "Leave all unticked to show the list without offering it in the order form. A list named “Bestsellers” always comes first in the form.",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: { list: wholesaleKindOptions, layout: "grid" },
            }),
            defineField({
              name: "flavours",
              title: "Flavours",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { title: "label", flavours: "flavours" },
            prepare: ({ title, flavours }) => ({ title, subtitle: `${flavours?.length ?? 0} flavours` }),
          },
        }),
      ],
    }),
    defineField({
      name: "suppliers",
      group: "lists",
      title: "Suppliers",
      description:
        "Shown in “Where our ingredients come from”. Suppliers with the same “Supplies” are grouped on one card, in the order listed here.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "supplies",
              title: "Supplies",
              type: "string",
              placeholder: "Pistachio",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "Website or Instagram (optional)",
              type: "url",
              validation: (r) => r.uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "name", subtitle: "supplies" } },
        }),
      ],
    }),
    section(
      "hero",
      "Top of the page",
      [
        line("eyebrow", "Small heading"),
        line("title", "Big heading"),
        line("orderButton", "“Place an order” button"),
        line("flavoursButton", "“Browse flavours” button"),
      ],
      { group: "pageText", collapsed: false },
    ),
    section(
      "pricing",
      "Wholesale Pricing card",
      [
        line("title", "Heading"),
        blurb("intro", "Text", { rows: 2 }),
        line("customSize", "Last size in the list", {
          description: "Matches “Other custom size” in the quote form, so keep the wording close.",
        }),
        blurb("customSizeNote", "Text under the last size", { rows: 2 }),
      ],
      { group: "pageText", description: "The sizes themselves are under Sizes." },
    ),
    section(
      "delivery",
      "Delivery Schedule card",
      [
        line("title", "Heading"),
        line("cutoff", "Order deadline", {
          description: "Shown at the top of the card and again next to the quote form’s button.",
        }),
      ],
      { group: "pageText", description: "The areas and days are under Delivery schedule." },
    ),
    section(
      "flavoursText",
      "Flavours section",
      [line("eyebrow", "Small heading"), blurb("intro", "Text", { rows: 2 })],
      {
        group: "pageText",
        description: "The big heading counts the flavours for you, e.g. “Over 100 flavours”.",
      },
    ),
    section(
      "suppliersText",
      "Suppliers section",
      [line("eyebrow", "Small heading"), line("title", "Heading"), blurb("intro", "Text", { rows: 2 })],
      { group: "pageText", description: "The suppliers themselves are under Suppliers." },
    ),
    section(
      "order",
      "Quote request form",
      [
        line("eyebrow", "Small heading"),
        line("title", "Heading"),
        blurb("intro", "Text above the form", { rows: 2 }),
        line("replyNote", "Text next to the button", {
          description: "Under the order deadline.",
        }),
        line("successTitle", "Thank-you heading", { description: "Shown once a request is sent." }),
        blurb("successMessage", "Thank-you text", { rows: 2 }),
      ],
      { group: "pageText" },
    ),
    seoDescription({ group: "pageText" }),
  ],
  preview: { prepare: () => ({ title: "Wholesale" }) },
});
