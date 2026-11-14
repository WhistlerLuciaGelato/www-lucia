import { defineArrayMember, defineField, defineType } from "sanity";
import { bearOptions, dietOptions } from "./options";

export const pintFlavour = defineType({
  name: "pintFlavour",
  title: "Pint flavour",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Flavour name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      description:
        "Click Generate. Used in links and to remember what's in a customer's cart, so avoid changing it later.",
      type: "slug",
      options: { source: "name", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "available",
      title: "Available to order online",
      description: "Turn off to show this flavour as sold out.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "stock",
      title: "Pints in stock",
      description:
        "How many pints of this flavour can still be ordered online. Goes down by itself as orders are paid; at 0 the flavour shows as sold out. Leave empty for no limit.",
      type: "number",
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: "style",
      title: "Type",
      type: "string",
      options: { list: ["Gelato", "Sorbet", "Dairy-free gelato"], layout: "radio", direction: "horizontal" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "blurb",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(240),
    }),
    defineField({
      name: "diet",
      title: "Dietary",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { list: dietOptions, layout: "grid" },
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      description: "Shown when a customer opens the flavour card, e.g. \"Whole Milk, Sugars (sugar, dextrose), Cream, …\".",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "contains",
      title: "Contains (allergens)",
      description: "E.g. \"Milk\" or \"Milk, Tree nuts\".",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Pint image",
      description: "A square image of the pint works best.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "lid",
      title: "Lid behind the image",
      description:
        "For transparent pint renders (no background): shows the lid behind the pint, as on the home page. Leave on None for regular photos.",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Made on the Mountain lid", value: "local" },
          { title: "Hello I'm dairy-free lid", value: "dairy-free" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "none",
    }),
    defineField({
      name: "roundLabel",
      title: "Round lid label",
      description:
        "The round label sticker shown over the pint's top-left corner. A square image with a transparent background works best.",
      type: "image",
    }),
    defineField({
      name: "color",
      title: "Accent colour",
      description: "Hex colour from the label, e.g. #f07a2e.",
      type: "string",
      validation: (r) => r.regex(/^#[0-9a-fA-F]{6}$/, { name: "hex colour" }),
    }),
    defineField({
      name: "bear",
      title: "Lucia illustration",
      type: "string",
      options: { list: bearOptions },
    }),
    defineField({
      name: "activity",
      title: "What Lucia is up to on the label",
      type: "string",
      placeholder: "Lucia paddleboards at sunset",
    }),
    defineField({
      name: "orderRank",
      title: "Sort order",
      description: "Lower numbers appear first.",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [{ title: "Sort order", name: "rank", by: [{ field: "orderRank", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "style", media: "image", available: "available", stock: "stock" },
    prepare: ({ title, subtitle, media, available, stock }) => ({
      title,
      subtitle:
        available === false || stock === 0
          ? `${subtitle} · SOLD OUT`
          : typeof stock === "number"
            ? `${subtitle} · ${stock} in stock`
            : subtitle,
      media,
    }),
  },
});
