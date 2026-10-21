import { defineArrayMember, defineField, defineType } from "sanity";
import { weekdayOptions } from "./options";

export const shopSettings = defineType({
  name: "shopSettings",
  title: "Online shop",
  type: "document",
  groups: [
    { name: "pickup", title: "Pickup & pints", default: true },
    { name: "cakes", title: "Gelato cakes" },
  ],
  fields: [
    defineField({
      name: "pintPrice",
      title: "Pint price ($)",
      type: "number",
      group: "pickup",
      validation: (r) => r.required().min(0).precision(2),
    }),
    defineField({
      name: "pintLeadDays",
      title: "Days' notice for pint orders",
      description: "0 = same day, 1 = tomorrow, and so on.",
      type: "number",
      group: "pickup",
      validation: (r) => r.required().integer().min(0).max(30),
    }),
    defineField({
      name: "pickupWindow",
      title: "Pickup hours",
      type: "string",
      group: "pickup",
      placeholder: "12–5pm",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pickupWhere",
      title: "Pickup location",
      type: "string",
      group: "pickup",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pickupDays",
      title: "Pickup days",
      description: "Customers can only choose these days in the pickup calendar.",
      type: "array",
      group: "pickup",
      of: [defineArrayMember({ type: "string" })],
      options: { list: weekdayOptions, layout: "grid" },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "blackoutDates",
      title: "Closed dates",
      description: "Holidays or days off. These are greyed out in the pickup calendar.",
      type: "array",
      group: "pickup",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "date", title: "Date", type: "date", validation: (r) => r.required() }),
            defineField({ name: "note", title: "Reason (optional)", type: "string" }),
          ],
          preview: { select: { title: "date", subtitle: "note" } },
        }),
      ],
    }),
    defineField({
      name: "cakeLeadDays",
      title: "Days' notice for cakes",
      type: "number",
      group: "cakes",
      validation: (r) => r.required().integer().min(0).max(60),
    }),
    defineField({
      name: "cakeSizes",
      title: "Cake sizes",
      type: "array",
      group: "cakes",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Size",
              type: "string",
              placeholder: '9"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "serves",
              title: "Serves",
              type: "number",
              validation: (r) => r.required().integer().min(1),
            }),
            defineField({
              name: "price",
              title: "Price ($)",
              type: "number",
              validation: (r) => r.required().min(0),
            }),
          ],
          preview: {
            select: { label: "label", serves: "serves", price: "price" },
            prepare: ({ label, serves, price }) => ({
              title: `${label} cake — $${price}`,
              subtitle: `Serves ${serves}`,
            }),
          },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "cakeBases",
      title: "Cake bases",
      type: "array",
      group: "cakes",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Base", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "note",
              title: "Dietary note (optional)",
              type: "string",
              placeholder: "Gluten-free & dairy-free",
            }),
          ],
          preview: { select: { title: "label", subtitle: "note" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "cakeCombos",
      title: "Cake flavour combinations",
      type: "array",
      group: "cakes",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Name",
              type: "string",
              placeholder: "Sorbet",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "flavours",
              title: "Flavours",
              type: "string",
              placeholder: "Mango & Wildberry",
              validation: (r) => r.required(),
            }),
            defineField({ name: "note", title: "Dietary note (optional)", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "flavours" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: "Online shop" }) },
});
