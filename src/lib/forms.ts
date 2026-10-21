import { z } from "zod";
import type { EventPackage } from "@/data/events";
import { wholesaleFormats } from "@/data/wholesale";

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
  travel: z.enum(["Whistler", "Squamish / Pemberton", "Vancouver", "Other"]),
  guests: z.coerce.number().int().min(1, "How many guests?").max(5000),
  package: z.enum(["classic", "signature", "experience", "unsure"] satisfies (
    | EventPackage["id"]
    | "unsure"
  )[]),
  message,
});

const formatIds = wholesaleFormats.map((f) => f.id) as [string, ...string[]];

export const wholesaleLineSchema = z
  .object({
    format: z.enum(formatIds),
    flavour: z.string().trim().min(1, "Pick a flavour").max(120),
    qty: z.coerce.number().int().min(1).max(999),
  })
  .superRefine((line, ctx) => {
    const format = wholesaleFormats.find((f) => f.id === line.format);
    if (format && line.qty % format.multiple !== 0) {
      ctx.addIssue({
        code: "custom",
        path: ["qty"],
        message: `${format.label} are ordered in multiples of ${format.multiple}`,
      });
    }
  });

export const wholesaleSchema = z.object({
  type: z.literal("wholesale"),
  business: z.string().trim().min(1, "Business name, please").max(200),
  name,
  email,
  phone: z.string().trim().min(7, "Please add a phone number").max(40),
  area: z.enum(["Whistler", "Squamish", "Pemberton"]),
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
