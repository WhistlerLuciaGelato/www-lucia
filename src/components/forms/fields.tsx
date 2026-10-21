"use client";

import { useId } from "react";
import type { SubmitState } from "@/components/forms/useFormSubmit";

type FieldProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  className?: string;
};

export function Field({
  label,
  name,
  error,
  hint,
  className = "",
  ...input
}: FieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {input.required ? null : <span className="ml-1 font-normal text-ink/50">(optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        className="field"
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        {...input}
      />
      <FieldMessage id={`${id}-msg`} error={error} hint={hint} />
    </div>
  );
}

export function SelectField({
  label,
  name,
  error,
  hint,
  className = "",
  children,
  ...select
}: FieldProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          className="field appearance-none pr-10"
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          {...select}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 12 12"
          className="pointer-events-none absolute top-1/2 right-4 h-3 w-3 -translate-y-1/2 text-lake-deep"
          aria-hidden
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <FieldMessage id={`${id}-msg`} error={error} hint={hint} />
    </div>
  );
}

export function TextArea({
  label,
  name,
  error,
  hint,
  className = "",
  ...area
}: FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {area.required ? null : <span className="ml-1 font-normal text-ink/50">(optional)</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={4}
        className="field resize-y"
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        {...area}
      />
      <FieldMessage id={`${id}-msg`} error={error} hint={hint} />
    </div>
  );
}

function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p id={id} className="mt-1.5 font-ui text-sm font-semibold text-berry">
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={id} className="mt-1.5 font-ui text-sm text-ink/60">
        {hint}
      </p>
    );
  }
  return null;
}

/** Hidden from people, irresistible to bots. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormNotice({ state, success }: { state: SubmitState; success: React.ReactNode }) {
  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl bg-light-green/70 p-5 font-ui font-semibold text-[#3d4410]">
        {success}
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div role="alert" className="rounded-3xl bg-blush p-5 font-ui font-semibold text-berry">
        {state.message}
      </div>
    );
  }
  if (state.status === "fallback") {
    return (
      <div role="alert" className="rounded-3xl bg-butter p-5 font-ui text-ink">
        <p className="font-bold">Our online form is taking a break.</p>
        <p className="mt-1">
          We&rsquo;ve put your details into an email so nothing gets lost — just hit send.
        </p>
        <a href={state.mailto} className="btn btn-primary mt-4">
          Open email to {state.to}
        </a>
      </div>
    );
  }
  return null;
}
