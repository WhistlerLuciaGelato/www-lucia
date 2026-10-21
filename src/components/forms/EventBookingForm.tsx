"use client";

import { useState } from "react";
import { eventPackages, estimateEvent, travelFees, type EventPackage } from "@/data/events";
import { useToday } from "@/lib/cart-store";
import { Field, FormNotice, Honeypot, SelectField, TextArea } from "@/components/forms/fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

const travelOptions = [...travelFees.map((t) => t.area), "Other"] as const;

export function EventBookingForm() {
  const { state, submit, fieldError } = useFormSubmit();
  const today = useToday();
  const [pkgId, setPkgId] = useState<EventPackage["id"] | "unsure">("signature");
  const [guests, setGuests] = useState("75");
  const [travel, setTravel] = useState<(typeof travelOptions)[number]>("Whistler");

  const pkg = eventPackages.find((p) => p.id === pkgId);
  const fee = travelFees.find((t) => t.area === travel)?.fee;
  const guestCount = Number(guests);
  const estimate = pkg && fee !== undefined && guestCount > 0 ? estimateEvent(pkg, guestCount, fee) : null;

  if (state.status === "success") {
    return (
      <FormNotice
        state={state}
        success={
          <>
            <p className="subhead text-2xl">Thanks — your request is in!</p>
            <p className="mt-2 font-normal">
              We&rsquo;ll be in touch soon to confirm availability and details.
            </p>
          </>
        }
      />
    );
  }

  return (
    <form
      noValidate
      className="relative grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const get = (k: string) => String(d.get(k) ?? "");
        submit({
          type: "event",
          name: get("name"),
          email: get("email"),
          phone: get("phone"),
          eventDate: get("eventDate"),
          eventType: get("eventType") as "wedding",
          location: get("location"),
          travel,
          guests: guestCount,
          package: pkgId,
          message: get("message"),
          website: get("website"),
        });
      }}
    >
      <Honeypot />
      <Field label="Your name" name="name" required autoComplete="name" error={fieldError("name")} />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        error={fieldError("email")}
      />
      <Field label="Phone" name="phone" type="tel" required autoComplete="tel" error={fieldError("phone")} />
      <Field
        label="Event date"
        name="eventDate"
        type="date"
        required
        min={today ?? undefined}
        error={fieldError("eventDate")}
      />
      <SelectField
        label="Type of event"
        name="eventType"
        defaultValue="wedding"
        error={fieldError("eventType")}
      >
        <option value="wedding">Wedding</option>
        <option value="private">Birthday or private party</option>
        <option value="corporate">Corporate event</option>
        <option value="festival">Festival or community event</option>
        <option value="other">Something else</option>
      </SelectField>
      <Field
        label="Guests"
        name="guests"
        type="number"
        inputMode="numeric"
        min={1}
        required
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        error={fieldError("guests")}
      />
      <Field
        label="Venue or address"
        name="location"
        required
        className="sm:col-span-2"
        error={fieldError("location")}
      />
      <SelectField
        label="Area"
        name="travel"
        value={travel}
        onChange={(e) => setTravel(e.target.value as (typeof travelOptions)[number])}
        error={fieldError("travel")}
      >
        {travelOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </SelectField>
      <SelectField
        label="Package"
        name="package"
        value={pkgId}
        onChange={(e) => setPkgId(e.target.value as EventPackage["id"] | "unsure")}
      >
        {eventPackages.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
        <option value="unsure">Not sure yet — help me choose</option>
      </SelectField>
      <TextArea
        label="Tell us about your event"
        name="message"
        className="sm:col-span-2"
        placeholder="Timing, flavour ideas, dietary needs, anything else"
        error={fieldError("message")}
      />

      <div className="flex flex-col gap-4 rounded-3xl bg-mist p-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-ui">
          <p className="text-sm text-ink/70">Estimated starting price</p>
          <p className="text-2xl font-extrabold text-ink" aria-live="polite">
            {estimate !== null ? `$${estimate.toLocaleString("en-CA")}` : "We'll quote you"}
          </p>
          <p className="text-xs text-ink/60">
            Before taxes &amp; gratuity. Final quote confirmed by our team.
          </p>
        </div>
        <button type="submit" className="btn btn-berry" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Sending…" : "Send booking request"}
        </button>
      </div>
      <div className="sm:col-span-2">
        <FormNotice state={state} success={null} />
      </div>
    </form>
  );
}
