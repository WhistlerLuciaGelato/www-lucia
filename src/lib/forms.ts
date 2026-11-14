import { z } from "zod";
import type { WholesaleFormat } from "@/lib/content-types";

const name = z.string().trim().min(1, "Please tell us your name").max(120);
const email = z.email("Please enter a valid email").max(200);
const phone = z.string().trim().max(40).optional().or(z.literal(""));
const message = z.string().trim().max(4000).optional().or(z.literal(""));
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date");

export const contactSchema = z.object({
  type: z.literal("contact"),
  name,
  email,
  phone,
  topic: z.enum(["general", "order", "events", "wholesale", "press"]),
  message: z.string().trim().min(1, "Please add a message").max(4000),
});

export const newsletterSchema = z.object({
  type: z.literal("newsletter"),
  email,
});

export const eventSchema = z.object({
  type: z.literal("event"),
  name,
  email,
  phone: z.string().trim().min(7, "Please add a phone number").max(40),
  eventDate: isoDate,
  eventType: z.enum(["wedding", "private", "corporate", "festival", "other"]),
  location: z.string().trim().min(1, "Where is the event?").max(200),
  // Travel areas and packages are editable in the Studio; the API checks them against live content.
  travel: z.string().trim().min(1).max(120),
  guests: z.coerce.number().int().min(1, "How many guests?").max(5000),
  package: z.string().trim().min(1).max(64),
  message,
});

export const wholesaleLineSchema = z.object({
  format: z.string().min(1).max(64),
  flavour: z.string().trim().min(1, "Pick a flavour").max(120),
  qty: z.coerce.number().int().min(1).max(999),
});

/** "Other custom size" in the wholesale form: the customer describes the size in the notes. */
export const OTHER_FORMAT = { id: "other", label: "Other custom size (tell us in the notes)" } as const;
/** "Other / custom flavour" in the wholesale form, available in every size. */
export const OTHER_FLAVOUR = "Other / custom flavour (tell us in the notes)";

/** Checks each line against the current formats and flavour lists. Returns zod-style issues. */
export function wholesaleLineIssues(
  lines: z.infer<typeof wholesaleLineSchema>[],
  formats: WholesaleFormat[],
  flavoursFor: (format: WholesaleFormat) => string[],
) {
  const issues: { path: (string | number)[]; message: string }[] = [];
  lines.forEach((line, i) => {
    if (line.format === OTHER_FORMAT.id) return; // Any flavour and quantity; the notes say what's wanted.
    const format = formats.find((f) => f.id === line.format);
    if (!format) {
      issues.push({ path: ["lines", i, "format"], message: "This format is no longer available" });
      return;
    }
    if (line.qty % format.multiple !== 0) {
      issues.push({
        path: ["lines", i, "qty"],
        message: `${format.label} are ordered in multiples of ${format.multiple}`,
      });
    }
    if (line.flavour !== OTHER_FLAVOUR && !flavoursFor(format).includes(line.flavour)) {
      issues.push({ path: ["lines", i, "flavour"], message: "Pick a flavour from the list" });
    }
  });
  return issues;
}

export const wholesaleSchema = z.object({
  type: z.literal("wholesale"),
  business: z.string().trim().min(1, "Business name, please").max(200),
  name,
  email,
  phone: z.string().trim().min(7, "Please add a phone number").max(40),
  area: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1, "Where should we deliver?").max(300),
  deliveryDate: isoDate.optional().or(z.literal("")),
  newAccount: z.boolean().optional(),
  lines: z.array(wholesaleLineSchema).min(1, "Add at least one item").max(40),
  message,
});

export const formSchema = z.discriminatedUnion("type", [
  contactSchema,
  newsletterSchema,
  eventSchema,
  wholesaleSchema,
]);

export type FormPayload = z.infer<typeof formSchema>;
export type FormType = FormPayload["type"];
