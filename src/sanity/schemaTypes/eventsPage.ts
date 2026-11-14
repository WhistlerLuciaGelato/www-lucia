import { defineArrayMember, defineField, defineType } from "sanity";

export const eventsPage = defineType({
  name: "eventsPage",
  title: "Weddings & events",
  type: "document",
  fields: [
    defineField({
      name: "packages",
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
      title: "Booking info",
      description: "Pills under Travel & Booking Info, after the travel fees.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "faq",
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
  ],
  preview: { prepare: () => ({ title: "Weddings & events" }) },
});
