import { defineArrayMember, defineField, defineType } from "sanity";
import { blurb, line, pageTextGroup, section, seoDescription } from "./pageFields";

export const eventsPage = defineType({
  name: "eventsPage",
  title: "Weddings & events",
  type: "document",
  groups: [{ name: "lists", title: "Packages, FAQ & photos", default: true }, pageTextGroup],
  fields: [
    defineField({
      name: "packages",
      group: "lists",
      title: "Packages",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "basePrice",
              title: "Starting price ($)",
              type: "number",
              validation: (r) => r.required().min(0),
            }),
            defineField({
              name: "baseGuests",
              title: "Guests included",
              type: "number",
              validation: (r) => r.required().integer().min(1),
            }),
            defineField({
              name: "perGuest",
              title: "Price per extra guest ($)",
              type: "number",
              validation: (r) => r.required().min(0),
            }),
            defineField({
              name: "features",
              title: "What's included",
              description: "Wrap words in **double asterisks** to make them bold.",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "moreInfo",
              title: "More info",
              description:
                "Shown under the list. Leave a blank line between paragraphs, and wrap words in **double asterisks** to make them bold.",
              type: "text",
              rows: 8,
            }),
            defineField({
              name: "accent",
              title: "Card colour",
              type: "string",
              options: {
                list: [
                  { title: "Pink", value: "strawberry" },
                  { title: "Blue", value: "lakeside" },
                  { title: "Orange", value: "heatwave" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "lakeside",
            }),
          ],
          preview: {
            select: { title: "name", price: "basePrice", guests: "baseGuests" },
            prepare: ({ title, price, guests }) => ({
              title,
              subtitle: `From $${price} for ${guests} guests`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "travelFees",
      group: "lists",
      title: "Travel fees",
      description:
        "These areas appear in the booking form, are added to the estimate, and are listed under Travel & Booking Info.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "area", title: "Area", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "fee",
              title: "Fee ($)",
              type: "number",
              validation: (r) => r.required().min(0),
            }),
          ],
          preview: {
            select: { title: "area", fee: "fee" },
            prepare: ({ title, fee }) => ({ title, subtitle: fee ? `+$${fee}` : "No travel fee" }),
          },
        }),
      ],
    }),
    defineField({
      name: "terms",
      group: "lists",
      title: "Booking info",
      description: "Pills under Travel & Booking Info, after the travel fees.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "faq",
      group: "lists",
      title: "FAQ",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
    defineField({
      name: "gallery",
      group: "lists",
      title: "Photo gallery",
      description: "Up to 20 photos for the scrolling gallery. Visitors can tap one to see it full screen.",
      type: "array",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Description",
              description: "What's in the photo, for people using screen readers.",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
      validation: (r) => r.max(20),
    }),
    section(
      "hero",
      "Top of the page",
      [
        line("eyebrow", "Small heading"),
        blurb("title", "Big heading", {
          rows: 2,
          description: "Start a new line where the heading should break.",
        }),
      ],
      { group: "pageText", collapsed: false },
    ),
    section(
      "packageCards",
      "Package cards",
      [
        line("startingAt", "Above the price"),
        line("moreInfo", "“More info” button"),
        line("request", "Button", {
          description: "The package name follows it, e.g. “Request Classic”.",
        }),
      ],
      {
        group: "pageText",
        description: "Words used on every card. Names, prices and lists are under Packages.",
      },
    ),
    section(
      "travelInfo",
      "Travel & Booking Info",
      [
        line("title", "Heading"),
        line("questionsBefore", "Text before the FAQ link", { description: "“More questions? See”" }),
        line("faqLink", "FAQ link"),
        line("questionsBetween", "Text between the links", { description: "“below or”" }),
        line("contactLink", "Contact link"),
      ],
      {
        group: "pageText",
        description: "The pills come from Travel fees and Booking info, under Packages, FAQ & photos.",
      },
    ),
    section(
      "faqText",
      "FAQ section",
      [
        line("title", "Heading"),
        line("moreQuestions", "Text under the questions"),
        line("contactLink", "Contact link"),
      ],
      { group: "pageText", description: "The questions themselves are under Packages, FAQ & photos." },
    ),
    section(
      "booking",
      "Booking request",
      [
        line("title", "Heading"),
        blurb("intro", "Text above the form", { rows: 2 }),
        blurb("note", "Text below the form", { rows: 2 }),
        line("successTitle", "Thank-you heading", { description: "Shown once a request is sent." }),
        blurb("successMessage", "Thank-you text", { rows: 2 }),
      ],
      { group: "pageText" },
    ),
    seoDescription({ group: "pageText" }),
  ],
  preview: { prepare: () => ({ title: "Weddings & events" }) },
});
