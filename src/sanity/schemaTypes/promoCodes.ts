import { defineArrayMember, defineField, defineType } from "sanity";

type PromoParent = { kind?: string } | undefined;

/**
 * Discount codes customers can enter in the cart. They live in one private document
 * (PROMO_CODES_ID in sanity/promo-codes-id.ts), so nobody can list them from the public content API; the website reads it
 * with a token.
 */
export const promoCodes = defineType({
  name: "promoCodes",
  title: "Promo codes",
  type: "document",
  fields: [
    defineField({
      name: "codes",
      title: "Promo codes",
      description:
        "Customers type a code in the cart to get the discount. Untick “Active” to stop a code working.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "promoCode",
          title: "Promo code",
          fields: [
            defineField({
              name: "code",
              title: "Code",
              description:
                "What customers type, e.g. SUMMER10. Letters, numbers and dashes; capitals don't matter.",
              type: "string",
              validation: (r) =>
                r
                  .required()
                  .max(32)
                  .regex(/^[A-Za-z0-9-]+$/, { name: "letters, numbers and dashes" }),
            }),
            defineField({
              name: "active",
              title: "Active",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "kind",
              title: "Discount",
              type: "string",
              options: {
                list: [
                  { title: "Percentage off", value: "percent" },
                  { title: "Dollar amount off", value: "amount" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "percent",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "percentOff",
              title: "Percentage off (%)",
              type: "number",
              hidden: ({ parent }) => (parent as PromoParent)?.kind !== "percent",
              validation: (r) =>
                r.custom((value, { parent }) =>
                  (parent as PromoParent)?.kind !== "percent" ||
                  (typeof value === "number" && value > 0 && value <= 100)
                    ? true
                    : "Enter a percentage between 1 and 100",
                ),
            }),
            defineField({
              name: "amountOff",
              title: "Amount off ($)",
              type: "number",
              hidden: ({ parent }) => (parent as PromoParent)?.kind !== "amount",
              validation: (r) =>
                r.custom((value, { parent }) =>
                  (parent as PromoParent)?.kind !== "amount" || (typeof value === "number" && value > 0)
                    ? true
                    : "Enter the dollar amount off",
                ),
            }),
            defineField({
              name: "appliesTo",
              title: "Applies to",
              type: "string",
              options: {
                list: [
                  { title: "Everything (not delivery)", value: "all" },
                  { title: "Pints only", value: "pints" },
                  { title: "Gelato cakes only", value: "cakes" },
                ],
                layout: "radio",
              },
              initialValue: "all",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "minOrder",
              title: "Minimum order ($)",
              description: "Optional. The order (before tax and delivery) must be at least this much.",
              type: "number",
              validation: (r) => r.min(0),
            }),
            defineField({
              name: "startsOn",
              title: "Starts on",
              description: "Optional. Leave empty to start now.",
              type: "date",
            }),
            defineField({
              name: "endsOn",
              title: "Ends on",
              description: "Optional. The code works up to and including this day.",
              type: "date",
            }),
            defineField({
              name: "note",
              title: "Note (not shown to customers)",
              description: "e.g. who the code was given to.",
              type: "string",
            }),
          ],
          preview: {
            select: {
              code: "code",
              active: "active",
              kind: "kind",
              percentOff: "percentOff",
              amountOff: "amountOff",
            },
            prepare: ({ code, active, kind, percentOff, amountOff }) => ({
              title: `${String(code ?? "").toUpperCase()}${active === false ? " (off)" : ""}`,
              subtitle: kind === "amount" ? `$${amountOff ?? "?"} off` : `${percentOff ?? "?"}% off`,
            }),
          },
        }),
      ],
      validation: (r) =>
        r.custom((codes: { code?: string }[] | undefined) => {
          const seen = new Set<string>();
          for (const c of codes ?? []) {
            const code = c.code?.toUpperCase();
            if (!code) continue;
            if (seen.has(code)) return `${code} is listed twice`;
            seen.add(code);
          }
          return true;
        }),
    }),
  ],
  preview: { prepare: () => ({ title: "Promo codes" }) },
});
