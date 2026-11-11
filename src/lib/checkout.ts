import { z } from "zod";
import { cartSchema } from "@/lib/cart";
import { isIsoDate } from "@/lib/format";

/** Who's picking up. Square needs a name and a way to reach them on the pickup fulfillment. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.email("Enter a valid email").max(254),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a phone number we can call"),
});

/** Pickup at the kitchen, or delivery by the Lucia team to an address in one of the delivery zones. */
export const fulfillmentSchema = z.discriminatedUnion("method", [
  z.object({ method: z.literal("pickup") }),
  z.object({
    method: z.literal("delivery"),
    zone: z.string().min(1).max(64),
    street: z.string().trim().min(1, "Enter the delivery address").max(200),
    city: z.string().trim().min(1, "Enter the town").max(100),
    postalCode: z
      .string()
      .trim()
      .regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Enter a valid postal code"),
  }),
]);

export const checkoutSchema = z.object({
  items: cartSchema,
  fulfillment: fulfillmentSchema.default({ method: "pickup" }),
  /** The pickup or delivery date. */
  pickupDate: z.string().refine(isIsoDate, "Choose a date"),
  notes: z.string().trim().max(500).optional(),
  contact: contactSchema,
  idempotencyKey: z.uuid(),
});

export const paySchema = z.object({
  orderId: z.string().min(1).max(192),
  sourceId: z.string().min(1).max(1024),
  method: z.enum(["card", "gift-card"]),
  idempotencyKey: z.uuid(),
  /** Gift card payments already approved against this order (partial balances). */
  heldPaymentIds: z.array(z.string().min(1).max(192)).max(5),
});

export const releaseSchema = z.object({
  orderId: z.string().min(1).max(192),
  paymentIds: z.array(z.string().min(1).max(192)).min(1).max(5),
});

export type Contact = z.infer<typeof contactSchema>;
export type Fulfillment = z.infer<typeof fulfillmentSchema>;

/** A payment applied to the order, as the browser shows it. */
export type HeldPayment = { id: string; label: string; amount: number };

export type CheckoutResponse = {
  orderId: string;
  total: number;
  tax: number;
  square: { applicationId: string; locationId: string; environment: "sandbox" | "production" };
};

export type PayResponse =
  { status: "partial"; held: HeldPayment; remaining: number } | { status: "paid"; orderId: string };
