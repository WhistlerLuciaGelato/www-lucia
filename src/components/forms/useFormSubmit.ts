"use client";

import { useState } from "react";
import type { FormPayload } from "@/lib/forms";

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors: Record<string, string> }
  /** Email delivery isn't configured: offer a prefilled email instead. */
  | { status: "fallback"; mailto: string; to: string };

type Issue = { path: (string | number)[]; message: string };

export function useFormSubmit() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submit(payload: FormPayload & { website?: string }) {
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        issues?: Issue[];
        fallback?: { subject: string; text: string; to: string };
      };
      if (res.ok && data.ok) {
        setState({ status: "success" });
        return true;
      }
      if (res.status === 503 && data.fallback) {
        const mailto = `mailto:${data.fallback.to}?subject=${encodeURIComponent(data.fallback.subject)}&body=${encodeURIComponent(data.fallback.text)}`;
        setState({ status: "fallback", mailto, to: data.fallback.to });
        return false;
      }
      const fieldErrors: Record<string, string> = {};
      for (const issue of data.issues ?? []) {
        const key = issue.path.join(".");
        fieldErrors[key] ??= issue.message;
      }
      setState({
        status: "error",
        message: data.error ?? "Something went wrong. Please try again.",
        fieldErrors,
      });
      return false;
    } catch {
      setState({
        status: "error",
        message: "We couldn't reach the server. Please check your connection and try again.",
        fieldErrors: {},
      });
      return false;
    }
  }

  const fieldError = (name: string) => (state.status === "error" ? state.fieldErrors[name] : undefined);

  return { state, submit, fieldError, reset: () => setState({ status: "idle" }) };
}
