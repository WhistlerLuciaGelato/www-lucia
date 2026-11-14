import { defineArrayMember, defineField, defineType } from "sanity";

const stringList = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })] });

const websiteField = defineField({
  name: "url",
  title: "Website",
  description: "Optional. The name links here, opening in a new tab.",
  type: "url",
  validation: (r) => r.uri({ scheme: ["http", "https"] }),
});

export const stockists = defineType({
  name: "stockists",
  title: "Stockists",
  type: "document",
  fields: [
    defineField({
      name: "groceryStores",
      title: "Grocery stores (by town)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "town", title: "Town", type: "string" }),
            stringList("stores", "Stores"),
          ],
          preview: { select: { title: "town" } },
        }),
      ],
    }),
    defineField({
      name: "scoopShops",
      title: "Scoop locations",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "address", title: "Address", type: "string" }),
            defineField({ name: "town", title: "Town", type: "string" }),
            websiteField,
          ],
          preview: { select: { title: "name", subtitle: "town" } },
        }),
      ],
    }),
    defineField({
      name: "onTheMenu",
      title: "Also on the menu at",
      description: "Restaurants, cafés, caterers and hotels that serve Lucia.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "group", title: "Group", type: "string" }),
            defineField({
              name: "venues",
              title: "Places",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "venue",
                  fields: [
                    defineField({
                      name: "name",
                      title: "Name",
                      type: "string",
                      validation: (r) => r.required(),
                    }),
                    websiteField,
                  ],
                  preview: { select: { title: "name", subtitle: "url" } },
                }),
              ],
            }),
            defineField({
              ...stringList("places", "Places (old list)"),
              description:
                "Names from before places could have a website. Only shown on the site while the list above is empty.",
              hidden: ({ value }) => !(value as unknown[] | undefined)?.length,
            }),
          ],
          preview: { select: { title: "group" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Stockists" }) },
});
