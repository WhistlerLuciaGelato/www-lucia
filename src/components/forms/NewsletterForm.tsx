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
      <div className="flex flex-col items-start gap-5">
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
          className="h-[2.6875rem] w-full rounded-[1.25rem] border border-coral bg-snow px-4 text-center font-body text-base text-coral placeholder:font-bold placeholder:text-coral placeholder:italic focus:outline-none focus:ring-2 focus:ring-coral"
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button type="submit" className="btn bg-coral !text-base text-snow" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Joining…" : "Sign up"}
        </button>
      </div>
      {fieldError("email") || state.status === "error" ? (
        <p role="alert" className="mt-2 font-ui text-sm font-bold text-berry">
          {fieldError("email") ?? (state.status === "error" ? state.message : null)}
        </p>
      ) : null}
    </form>
  );
}
