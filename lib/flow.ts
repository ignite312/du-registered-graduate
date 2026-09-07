import type { AppState } from "./types";

export function nextPath(state: AppState): string {
  if (!state.otpSent) return "/register";
  if (!state.otpVerified) return "/verify-otp";
  if (!state.loggedIn) return "/login";
  if (state.rgStatus === "unknown") return "/rg-status";

  if (state.rgStatus === "existing") {
    if (!state.rgId) return "/rg-id";
    return "/dashboard";
  }

  if (!state.academic) return "/academic-identification";
  if (state.lookup === "idle") return "/rg-lookup";
  if (state.eligibility === "unchecked") return "/eligibility";
  if (state.eligibility === "ineligible") return "/not-eligible";
  if (!state.profileComplete) return "/profile";
  if (!state.payment && !state.paymentSkipped) return "/membership";
  return "/dashboard";
}

export function applicantRole(state: AppState): "Registered Graduate (RG)" | "Unregistered Graduate (URG)" | "Guest" {
  if (state.rgStatus === "existing" && state.rgId) return "Registered Graduate (RG)";
  if (state.profileComplete) return "Unregistered Graduate (URG)";
  return "Guest";
}
