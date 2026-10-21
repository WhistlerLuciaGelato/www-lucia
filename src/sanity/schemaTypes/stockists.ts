import { defineArrayMember, defineField, defineType } from "sanity";

const stringList = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })] });

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
            stringList("places", "Places"),
          ],
          preview: { select: { title: "group" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Stockists" }) },
});
