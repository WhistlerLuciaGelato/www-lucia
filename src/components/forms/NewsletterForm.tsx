"use client";

import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { FormNotice } from "@/components/forms/fields";

export function NewsletterForm() {
  const { state, submit, fieldError } = useFormSubmit();

  if (state.status === "success" || state.status === "fallback") {
    return (
      <div className="mt-5">
        <FormNotice state={state} success="You're in! Watch your inbox for Lucia's next adventure." />
      </div>
    );
  }

  return (
    <form
      className="mt-5"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        submit({
          type: "newsletter",
          email: String(data.get("email") ?? ""),
          website: String(data.get("website") ?? ""),
        });
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="yourname@email.com"
          className="field !rounded-full !border-snow"
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button
          type="submit"
          className="btn shrink-0 bg-snow whitespace-nowrap text-berry"
          disabled={state.status === "submitting"}
        >
          {state.status === "submitting" ? "Joining…" : "Sign up"}
        </button>
      </div>
      {fieldError("email") || state.status === "error" ? (
        <p role="alert" className="mt-2 font-ui text-sm font-bold text-[#4a1418]">
          {fieldError("email") ?? (state.status === "error" ? state.message : null)}
        </p>
      ) : null}
    </form>
  );
}
