"use client";

import { Field, FormNotice, Honeypot, SelectField, TextArea } from "@/components/forms/fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

export function ContactForm() {
  const { state, submit, fieldError } = useFormSubmit();

  if (state.status === "success") {
    return (
      <FormNotice
        state={state}
        success={
          <>
            <p className="subhead text-2xl">Message sent — thanks!</p>
            <p className="mt-2 font-normal">
              We&rsquo;ll get back to you as soon as we&rsquo;re off the hill.
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
          type: "contact",
          name: get("name"),
          email: get("email"),
          phone: get("phone"),
          topic: get("topic") as "general",
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
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" error={fieldError("phone")} />
      <SelectField label="What's it about?" name="topic" defaultValue="general">
        <option value="general">General question</option>
        <option value="order">An order or custom cake</option>
        <option value="events">Weddings &amp; events</option>
        <option value="wholesale">Wholesale</option>
        <option value="press">Press &amp; partnerships</option>
      </SelectField>
      <TextArea
        label="Message"
        name="message"
        required
        rows={6}
        className="sm:col-span-2"
        error={fieldError("message")}
      />
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
      <div className="sm:col-span-2">
        <FormNotice state={state} success={null} />
      </div>
    </form>
  );
}
