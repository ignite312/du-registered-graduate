"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppState } from "@/lib/app-context";
import type { AppState } from "@/lib/types";

export type Gate =
  | "otpPending"
  | "verified"
  | "authenticated"
  | "identified"
  | "eligible"
  | "ineligible"
  | "lookedUp"
  | "profiled"
  | "membershipChosen"
  | "paid";

export function FlowGate({
  require,
  children,
}: {
  require: Gate;
  children: React.ReactNode;
}) {
  const { state, hydrated } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    const redirect = missing(require, state);
    if (redirect) router.replace(redirect);
  }, [hydrated, require, router, state]);

  if (!hydrated) {
    return <p className="py-16 text-center text-sm text-du-muted">Loading…</p>;
  }

  if (missing(require, state)) return null;
  return children;
}

function missing(require: Gate, state: AppState): string | null {
  if (require === "otpPending" && !state.otpSent) return "/register";

  if (require === "verified" && !state.otpVerified) return "/register";

  if (require === "authenticated") {
    if (!state.otpVerified) return "/register";
    if (!state.loggedIn) return "/login";
  }

  if (
    require === "identified" ||
    require === "eligible" ||
    require === "ineligible" ||
    require === "lookedUp" ||
    require === "profiled" ||
    require === "membershipChosen" ||
    require === "paid"
  ) {
    if (!state.loggedIn) return "/login";
  }

  if (require === "identified" && !state.academic) return "/academic-identification";

  if (require === "ineligible") {
    if (!state.academic) return "/academic-identification";
    if (state.eligibility !== "ineligible") return "/eligibility";
  }

  if (require === "eligible" || require === "lookedUp" || require === "profiled" || require === "membershipChosen" || require === "paid") {
    if (!state.academic) return "/academic-identification";
    if (state.eligibility === "ineligible") return "/not-eligible";
    if (state.eligibility !== "eligible") return "/eligibility";
  }

  if (require === "lookedUp" || require === "profiled" || require === "membershipChosen" || require === "paid") {
    if (state.lookup === "idle") return "/rg-lookup";
  }

  if (require === "profiled" || require === "membershipChosen" || require === "paid") {
    if (!state.profile) return "/profile";
  }

  if (require === "membershipChosen" || require === "paid") {
    if (!state.membership) return "/membership";
  }

  if (require === "paid" && !state.payment) return "/payment";

  return null;
}
