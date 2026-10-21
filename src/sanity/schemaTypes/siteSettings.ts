import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Announcement & contact",
  type: "document",
  fields: [
    defineField({
      name: "announcement",
      title: "Announcement banner",
      description:
        "A strip across the top of every page. Great for “Closed today — too windy!” or a new flavour launch.",
      type: "object",
      fields: [
        defineField({ name: "enabled", title: "Show the banner", type: "boolean", initialValue: false }),
        defineField({ name: "message", title: "Message", type: "string", validation: (r) => r.max(140) }),
        defineField({
          name: "tone",
          title: "Style",
          type: "string",
          options: {
            list: [
              { title: "Friendly (blue)", value: "info" },
              { title: "Heads up (pink)", value: "alert" },
            ],
            layout: "radio",
            direction: "horizontal",
          },
          initialValue: "info",
        }),
        defineField({ name: "linkLabel", title: "Link text (optional)", type: "string" }),
        defineField({
          name: "linkUrl",
          title: "Link (optional)",
          description: "A page on the site like /find-us, or a full web address.",
          type: "string",
        }),
      ],
    }),
    defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "phone", title: "Phone", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "instagramHandle",
      title: "Instagram handle",
      type: "string",
      placeholder: "@whistlerluciagelato",
    }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url" }),
    defineField({ name: "kitchenStreet", title: "Kitchen address — street", type: "string" }),
    defineField({ name: "kitchenCity", title: "Kitchen address — city & postal code", type: "string" }),
    defineField({ name: "mailingStreet", title: "Mailing address — street / PO box", type: "string" }),
    defineField({ name: "mailingCity", title: "Mailing address — city & postal code", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Announcement & contact" }) },
});
