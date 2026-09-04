/**
 * Mock service layer. Replace these functions with fetch() calls to the
 * FastAPI backend without changing page components.
 */
import { EXISTING_RG_REGISTRATION, MOCK_OTP } from "./constants";
import { checkEligibility } from "./eligibility";
import type {
  AcademicIdentification,
  PaymentReceipt,
  Profile,
} from "./types";

function wait(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendOtp(phone: string): Promise<{ ok: true }> {
  await wait(500);
  if (!/^01[3-9]\d{8}$/.test(phone)) {
    throw new Error("Enter a valid Bangladesh mobile number (01XXXXXXXXX).");
  }
  return { ok: true };
}

export async function verifyOtp(code: string): Promise<{ ok: true }> {
  await wait(400);
  if (code !== MOCK_OTP) {
    throw new Error("Invalid OTP. For this demonstration, use 123456.");
  }
  return { ok: true };
}

export async function login(phone: string, password: string, stored: { phone: string; password: string }) {
  await wait(500);
  if (phone !== stored.phone || password !== stored.password) {
    throw new Error("Mobile number or password is incorrect.");
  }
  return { ok: true as const };
}

export async function evaluateEligibility(academic: AcademicIdentification) {
  await wait(800);
  return checkEligibility(academic);
}

const LOOKUP_TIERS = [
  "Admission Office records (2010 onward)",
  "Convocation database snapshot",
  "Controller of Examinations",
  "Previous Registered Graduate database",
] as const;

export async function runExistingRgLookup(
  academic: AcademicIdentification,
  onTier?: (index: number, label: string) => void,
): Promise<{ existing: boolean; profile: Profile }> {
  for (let i = 0; i < LOOKUP_TIERS.length; i += 1) {
    onTier?.(i, LOOKUP_TIERS[i]);
    await wait(450);
  }

  const existing = academic.registrationNumber.trim() === EXISTING_RG_REGISTRATION;

  const base: Profile = {
    fullName: existing ? "Dr. A. K. M. Rahman" : "Fatema Jahan",
    fatherName: existing ? "Abdul Karim Rahman" : "",
    motherName: existing ? "Rokeya Begum" : "",
    dateOfBirth: existing ? "1988-04-12" : "1996-11-03",
    gender: existing ? "Male" : "Female",
    email: existing ? "rahman.akm@alumni.du.ac.bd" : "",
    mobile: "",
    nid: existing ? "1988123456789" : "",
    present: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Savar",
      union: existing ? "Savar Union" : "",
      details: existing ? "House 12, Road 4, Savar" : "",
    },
    permanent: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Savar",
      union: existing ? "Savar Union" : "",
      details: existing ? "Village: Shimulia" : "",
    },
    sameAsPresent: false,
    missingFields: existing
      ? []
      : ["fatherName", "motherName", "email", "nid", "present.union", "present.details"],
  };

  return { existing, profile: base };
}

export async function createSslcommerzSession(input: {
  membership: "session" | "lifetime";
  amountBdt: number;
  method: string;
}): Promise<PaymentReceipt> {
  await wait(900);
  const stamp = Date.now().toString(36).toUpperCase();
  return {
    transactionId: `SSL${stamp}`,
    gateway: "SSLCommerz",
    method: input.method,
    amountBdt: input.amountBdt,
    membership: input.membership,
    paidAt: new Date().toISOString(),
    gatePassId: `GP-DU-${stamp.slice(-6)}`,
  };
}

export { LOOKUP_TIERS };
