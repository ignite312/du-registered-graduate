import type { StoredMembership } from "./types";

export function sessionExpiryDate(from = new Date()) {
  const next = new Date(from);
  next.setFullYear(next.getFullYear() + 3);
  return next.toISOString().slice(0, 10);
}

export function isSessionExpired(held: StoredMembership | null, asOf = new Date()) {
  if (!held || held.type !== "session") return false;
  if (!held.expiresAt) return true;
  return held.expiresAt < asOf.toISOString().slice(0, 10);
}
