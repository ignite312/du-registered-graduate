"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppState } from "@/lib/app-context";
import { nextPath } from "@/lib/flow";
import type { AppState } from "@/lib/types";

export type Gate =
  | "otpPending"
  | "authenticated"
  | "existingRg"
  | "branchB"
  | "identified"
  | "lookedUp"
  | "eligible"
  | "ineligible"
  | "profiled"
  | "member"
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
  if (require === "otpPending") {
    return state.otpSent ? null : "/register";
  }

  if (!state.otpVerified) return "/register";

  if (require === "authenticated") {
    return state.loggedIn ? null : "/login";
  }

  if (!state.loggedIn) return "/login";

  if (state.rgStatus === "unknown") {
    return "/rg-status";
  }

  if (require === "existingRg") {
    return state.rgStatus === "existing" ? null : nextPath(state);
  }

  if (require === "branchB") {
    if (state.rgStatus !== "new") return nextPath(state);
    return null;
  }

  if (require === "member") {
    if (state.rgStatus === "existing" && state.rgId) return null;
    if (state.rgStatus === "new" && state.profileComplete) return null;
    return nextPath(state);
  }

  if (require === "membershipChosen" || require === "paid") {
    const memberMissing = missing("member", state);
    if (memberMissing) return memberMissing;
    if (require === "membershipChosen" && !state.membership) return "/membership";
    if (require === "paid" && !state.payment) return "/payment";
    return null;
  }

  if (require === "eligible" || require === "profiled") {
    if (state.rgStatus === "existing" && state.rgId) {
      return require === "profiled" && !state.profileComplete ? "/rg-id" : null;
    }
  }

  if (
    require === "identified" ||
    require === "lookedUp" ||
    require === "eligible" ||
    require === "ineligible" ||
    require === "profiled"
  ) {
    if (state.rgStatus !== "new") return nextPath(state);
    if (!state.academic) return "/academic-identification";
  }

  if (require === "identified") return null;

  if (require === "lookedUp" || require === "eligible" || require === "ineligible" || require === "profiled") {
    if (state.lookup === "idle") return "/rg-lookup";
  }

  if (require === "ineligible") {
    return state.eligibility === "ineligible" ? null : nextPath(state);
  }

  if (require === "eligible" || require === "profiled") {
    if (state.eligibility === "ineligible") return "/not-eligible";
    if (state.eligibility !== "eligible") return "/eligibility";
  }

  if (require === "profiled" && !state.profileComplete) return "/profile";

  return null;
}
