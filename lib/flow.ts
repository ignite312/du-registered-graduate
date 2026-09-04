import type { AppState } from "./types";

export function nextPath(state: AppState): string {
  if (!state.otpSent) return "/register";
  if (!state.otpVerified) return "/verify-otp";
  if (!state.loggedIn) return "/login";
  if (state.payment) return "/dashboard";
  if (state.eligibility === "ineligible") return "/not-eligible";
  if (!state.academic) return "/academic-identification";
  if (state.eligibility !== "eligible") return "/eligibility";
  if (state.lookup === "idle") return "/rg-lookup";
  if (!state.profile) return "/profile";
  if (!state.membership) return "/membership";
  return "/payment";
}
