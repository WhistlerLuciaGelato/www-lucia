import { defineArrayMember, defineField, defineType } from "sanity";

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  groups: [
    { name: "hours", title: "Hours & status", default: true },
    { name: "details", title: "Details & map" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: ["hours", "details"],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "hours",
      title: "Opening hours",
      description: "One line per set of days. Add a line when some days have different hours.",
      type: "array",
      group: "hours",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "days", title: "Days", type: "string", placeholder: "Mon–Thu" }),
            defineField({ name: "time", title: "Hours", type: "string", placeholder: "12–6pm" }),
          ],
          preview: {
            select: { days: "days", time: "time" },
            prepare: ({ days, time }) => ({ title: [days, time].filter(Boolean).join(" · ") || "New line" }),
          },
        }),
      ],
    }),
    defineField({
      name: "closedOn",
      title: "Closed for a day",
      description:
        "Pick a date to show “Closed today” for this spot on that day only. It disappears by itself the next day.",
      type: "date",
      group: "hours",
    }),
    defineField({
      name: "closureNote",
      title: "Reason (optional)",
      description: "Shown next to “Closed today”, e.g. “Too windy — back tomorrow!”",
      type: "string",
      group: "hours",
      validation: (r) => r.max(80),
    }),
    defineField({
      name: "seasonClosed",
      title: "Closed for the season",
      description: "Keeps the spot on the site with a “Closed for the season” label.",
      type: "boolean",
      group: "hours",
      initialValue: false,
    }),
    defineField({
      name: "scheduleSeason",
      title: "Season dates",
      type: "string",
      group: "hours",
      placeholder: "Summer (late Jun – Sep)",
    }),
    defineField({
      name: "season",
      title: "Season",
      type: "string",
      group: "details",
      options: { list: ["Winter", "Summer"], layout: "radio", direction: "horizontal" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "area",
      title: "Subtitle",
      type: "string",
      group: "details",
      placeholder: "Gelato Trailer – Rotating RMOW Lakes",
    }),
    defineField({
      name: "description",
      title: "Description",
      description:
        "Shown when someone opens this spot on the map. Wrap words in **double asterisks** to make them bold; Instagram handles like @whistlerluciagelato are bolded automatically.",
      type: "text",
      rows: 4,
      group: "details",
    }),
    defineField({
      name: "lat",
      title: "Map pin — latitude",
      description:
        "In Google Maps, right-click the spot and click the numbers to copy them. The first number is latitude.",
      type: "number",
      group: "details",
      validation: (r) => r.required().min(-90).max(90),
    }),
    defineField({
      name: "lng",
      title: "Map pin — longitude",
      description: "The second number (it starts with a minus sign in BC).",
      type: "number",
      group: "details",
      validation: (r) => r.required().min(-180).max(180),
    }),
    defineField({
      name: "active",
      title: "Show on the website",
      type: "boolean",
      group: "details",
      initialValue: true,
    }),
    defineField({
      name: "orderRank",
      title: "Sort order",
      type: "number",
      group: "details",
      initialValue: 100,
    }),
  ],
  orderings: [{ title: "Sort order", name: "rank", by: [{ field: "orderRank", direction: "asc" }] }],
  preview: {
    select: {
      title: "name",
      hours: "hours",
      closedOn: "closedOn",
      seasonClosed: "seasonClosed",
      active: "active",
    },
    prepare: ({ title, hours, closedOn, seasonClosed, active }) => {
      const lines = ((hours as { days?: string; time?: string }[] | undefined) ?? [])
        .map((h) => [h.days, h.time].filter(Boolean).join(" "))
        .join(", ");
      const status =
        active === false
          ? "Hidden"
          : seasonClosed
            ? "Closed for the season"
            : closedOn
              ? `Closed ${closedOn}`
              : "";
      return { title, subtitle: [status, lines || "No hours yet"].filter(Boolean).join(" · ") };
    },
  },
});
