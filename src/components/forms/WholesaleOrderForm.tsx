"use client";

import { useRef, useState } from "react";
import type { FlavourGroup, WholesaleContent, WholesaleFormat } from "@/lib/content-types";
import { useToday } from "@/lib/cart-store";
import { Field, FormNotice, Honeypot, SelectField, TextArea } from "@/components/forms/fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { OTHER_FLAVOUR, OTHER_FORMAT } from "@/lib/forms";
import { orderCutoff } from "@/data/wholesale";

type Line = { id: number; format: string; flavour: string; qty: number };

export function WholesaleOrderForm({ content }: { content: WholesaleContent }) {
  const { formats: wholesaleFormats, flavourGroups, deliverySchedule } = content;
  const newLine = (id: number): Line => ({
    id,
    format: wholesaleFormats[0].id,
    flavour: "",
    qty: wholesaleFormats[0].multiple,
  });
  // Bestsellers always lead the flavour dropdown, whatever order the Studio lists are in.
  const isBestsellers = (g: FlavourGroup) => g.id === "bestsellers" || /^bestsellers?$/i.test(g.label.trim());
  const orderedGroups = [
    ...flavourGroups.filter(isBestsellers),
    ...flavourGroups.filter((g) => !isBestsellers(g)),
  ];
  const groupsFor = (format: WholesaleFormat) =>
    orderedGroups.filter((g) => g.availableIn.includes(format.kind));
  const { state, submit, fieldError } = useFormSubmit();
  const today = useToday();
  const [lines, setLines] = useState<Line[]>(() => [newLine(0)]);
  const nextId = useRef(1);

  const update = (id: number, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  if (state.status === "success") {
    return (
      <FormNotice
        state={state}
        success={
          <>
            <p className="subhead text-2xl">Quote request received — thank you!</p>
            <p className="mt-2 font-normal">
              We&rsquo;ll be in touch by email with your quote and delivery day.
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
          type: "wholesale",
          business: get("business"),
          name: get("name"),
          email: get("email"),
          phone: get("phone"),
          area: get("area"),
          address: get("address"),
          deliveryDate: get("deliveryDate"),
          newAccount: d.get("newAccount") === "on",
          lines: lines.map(({ format, flavour, qty }) => ({ format, flavour, qty })),
          message: get("message"),
          website: get("website"),
        });
      }}
    >
      <Honeypot />
      <Field
        label="Business name"
        name="business"
        required
        autoComplete="organization"
        error={fieldError("business")}
      />
      <Field label="Contact name" name="name" required autoComplete="name" error={fieldError("name")} />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        error={fieldError("email")}
      />
      <Field label="Phone" name="phone" type="tel" required autoComplete="tel" error={fieldError("phone")} />
      <SelectField label="Delivery area" name="area" error={fieldError("area")}>
        {deliverySchedule.map((d) => (
          <option key={d.area}>{d.area}</option>
        ))}
      </SelectField>
      <Field
        label="Preferred delivery date"
        name="deliveryDate"
        type="date"
        min={today ?? undefined}
        hint="Leave blank for your next scheduled delivery day"
        error={fieldError("deliveryDate")}
      />
      <Field
        label="Delivery address"
        name="address"
        required
        autoComplete="street-address"
        className="sm:col-span-2"
        error={fieldError("address")}
      />

      <fieldset className="sm:col-span-2">
        <legend className="label">What would you like a quote for?</legend>
        <ul className="space-y-3">
          {lines.map((line, index) => {
            const other = line.format === OTHER_FORMAT.id;
            const format = other
              ? { ...wholesaleFormats[0], multiple: 1, note: undefined }
              : (wholesaleFormats.find((f) => f.id === line.format) ?? wholesaleFormats[0]);
            // "Other custom size" can be any flavour; otherwise only those made in that size.
            const groups = other ? orderedGroups : groupsFor(format);
            const qtyError = fieldError(`lines.${index}.qty`);
            const flavourError = fieldError(`lines.${index}.flavour`);
            const badMultiple = line.qty > 0 && line.qty % format.multiple !== 0;
            return (
              <li
                key={line.id}
                className="grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-alpine sm:grid-cols-12 sm:items-start"
              >
                <div className="sm:col-span-4">
                  <label className="sr-only" htmlFor={`format-${line.id}`}>
                    Format
                  </label>
                  <select
                    id={`format-${line.id}`}
                    className="field"
                    value={line.format}
                    onChange={(e) => {
                      const nextFormat = e.target.value;
                      const f = wholesaleFormats.find((x) => x.id === nextFormat);
                      update(line.id, { format: nextFormat, flavour: "", qty: f?.multiple ?? 1 });
                    }}
                  >
                    {wholesaleFormats.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                    <option value={OTHER_FORMAT.id}>{OTHER_FORMAT.label}</option>
                  </select>
                </div>
                <div className="sm:col-span-4">
                  <label className="sr-only" htmlFor={`flavour-${line.id}`}>
                    Flavour
                  </label>
                  <select
                    id={`flavour-${line.id}`}
                    className="field"
                    value={line.flavour}
                    onChange={(e) => update(line.id, { flavour: e.target.value })}
                    aria-invalid={flavourError ? true : undefined}
                  >
                    <option value="">Choose a flavour…</option>
                    {groups.map((g) => (
                      <optgroup key={g.id} label={g.note ? `${g.label} · ${g.note}` : g.label}>
                        {g.flavours.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <optgroup label="Other">
                      <option value={OTHER_FLAVOUR}>{OTHER_FLAVOUR}</option>
                    </optgroup>
                  </select>
                  {flavourError ? (
                    <p className="mt-1 font-ui text-sm font-semibold text-berry">{flavourError}</p>
                  ) : null}
                </div>
                <div className="sm:col-span-3">
                  <label className="sr-only" htmlFor={`qty-${line.id}`}>
                    Quantity
                  </label>
                  <input
                    id={`qty-${line.id}`}
                    type="number"
                    inputMode="numeric"
                    min={format.multiple}
                    step={format.multiple}
                    className="field"
                    value={line.qty || ""}
                    onChange={(e) => update(line.id, { qty: Number(e.target.value) })}
                    aria-invalid={qtyError || badMultiple ? true : undefined}
                  />
                </div>
                <div className="flex items-center justify-end gap-2 sm:col-span-1 sm:pt-2.5">
                  {lines.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setLines((ls) => ls.filter((l) => l.id !== line.id))}
                      className="grid h-8 w-8 place-items-center rounded-full bg-mist text-lakeside transition hover:bg-blush hover:text-strawberry"
                      aria-label="Remove this item"
                    >
                      ×
                    </button>
                  ) : null}
                </div>
                {format.note || qtyError ? (
                  <p
                    className={`font-ui text-sm sm:col-span-12 ${qtyError || badMultiple ? "font-semibold text-berry" : "text-ink/60"}`}
                  >
                    {qtyError ?? format.note}
                  </p>
                ) : null}
                {other || line.flavour === OTHER_FLAVOUR ? (
                  <p className="font-ui text-sm font-semibold text-lake-deep sm:col-span-12">
                    Please make a note below with your desired {other ? "size" : "flavour"} and we&rsquo;ll
                    get back to you.
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => setLines((ls) => [...ls, newLine(nextId.current++)])}
          className="mt-3 font-ui font-bold text-lake-deep underline underline-offset-2"
        >
          + Add another item
        </button>
      </fieldset>

      <label className="flex items-center gap-3 font-ui text-ink sm:col-span-2">
        <input type="checkbox" name="newAccount" className="h-5 w-5 accent-[#2f6e7e]" />
        This is our first order — please set us up as a new wholesale account
      </label>

      <TextArea label="Notes" name="message" className="sm:col-span-2" error={fieldError("message")} />

      <div className="flex flex-col gap-4 rounded-[1.25rem] bg-seafoam p-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-ui">
          <p className="font-extrabold text-ink">{orderCutoff}</p>
          <p className="text-sm text-ink/70">We&rsquo;ll reply by email with your quote and delivery day.</p>
        </div>
        <button type="submit" className="btn btn-primary" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Sending…" : "Request quote"}
        </button>
      </div>
      <div className="sm:col-span-2">
        <FormNotice state={state} success={null} />
      </div>
    </form>
  );
}
