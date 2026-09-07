import type { Address, Profile } from "./types";

function addressIncomplete(address: Address) {
  return !address.division || !address.district || !address.upazila || !address.union || !address.details;
}

export function collectMissing(profile: Profile): string[] {
  const missing: string[] = [];
  if (!profile.photoName) missing.push("photoName");
  if (!profile.fullName.trim()) missing.push("fullName");
  if (!profile.motherName.trim()) missing.push("motherName");
  if (!profile.fatherName.trim()) missing.push("fatherName");
  if (addressIncomplete(profile.present)) missing.push("present");
  if (!profile.sameAsPresent && addressIncomplete(profile.permanent)) missing.push("permanent");
  if (!profile.nid.trim()) missing.push("nid");
  if (!profile.gender) missing.push("gender");
  if (!profile.email.trim()) missing.push("email");
  if (!profile.occupation.trim()) missing.push("occupation");
  return missing;
}

export function profileReady(profile: Profile) {
  return collectMissing(profile).length === 0 && profile.declarationAccepted && Boolean(profile.signature.trim());
}
