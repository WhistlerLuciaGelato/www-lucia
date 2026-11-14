import { defineArrayMember, defineField, defineType } from "sanity";
import { wholesaleKindOptions } from "./options";

export const wholesalePage = defineType({
  name: "wholesalePage",
  title: "Wholesale",
  type: "document",
  fields: [
    defineField({
      name: "formats",
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
  ],
  preview: { prepare: () => ({ title: "Wholesale" }) },
});
