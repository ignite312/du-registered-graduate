/**
 * Mock service layer. Replace these functions with fetch() calls to the
 * FastAPI backend without changing page components.
 */
import {
  DEPARTMENTS,
  EXISTING_RG_ID,
  EXISTING_RG_REGISTRATION,
  MOCK_OTP,
} from "./constants";
import { checkEligibility, qualifyingDegreeForProgram, sessionEndYear } from "./eligibility";
import type {
  AcademicIdentification,
  Address,
  PaymentReceipt,
  Profile,
  StoredMembership,
  SupportTicket,
} from "./types";

function wait(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const emptyAddress: Address = {
  division: "",
  district: "",
  upazila: "",
  union: "",
  details: "",
};

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

export async function resetPassword(phone: string, code: string, nextPassword: string, storedPhone: string) {
  await wait(500);
  if (phone !== storedPhone) {
    throw new Error("This mobile number is not registered in this demonstration.");
  }
  await verifyOtp(code);
  if (nextPassword.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  return { ok: true as const };
}

export async function evaluateEligibility(academic: AcademicIdentification) {
  await wait(800);
  return checkEligibility(academic);
}

export async function verifyRgId(
  rgId: string,
): Promise<{ profile: Profile; registrationNumber: string; heldMembership: StoredMembership }> {
  await wait(600);
  const normalised = rgId.trim().toUpperCase();
  if (normalised !== EXISTING_RG_ID) {
    throw new Error(`RG ID not found. For this demonstration, use ${EXISTING_RG_ID}.`);
  }
  return {
    registrationNumber: EXISTING_RG_REGISTRATION,
    profile: existingRgProfile(),
    heldMembership: {
      type: "session",
      expiresAt: "2024-06-30",
    },
  };
}

export async function submitSupportTicket(input: {
  type: SupportTicket["type"];
  name: string;
  details: string;
}): Promise<SupportTicket> {
  await wait(700);
  const recoveredValue = input.type === "forgot-rg-id" ? EXISTING_RG_ID : EXISTING_RG_REGISTRATION;
  return {
    type: input.type,
    name: input.name,
    details: input.details,
    submittedAt: new Date().toISOString(),
    status: "approved",
    recoveredValue,
  };
}

const LOOKUP_TIERS = [
  "Previous Registered Graduate database (Tier 1)",
  "Admission Office API, 2010 onward (Tier 2)",
  "Controller of Examinations (Tier 3)",
  "Convocation database snapshot (Tier 4)",
] as const;

export async function runFourSourceLookup(
  keys: Pick<AcademicIdentification, "registrationNumber" | "session" | "degreeProgramId" | "departmentId" | "dateOfBirth">,
  phone: string,
  onTier?: (index: number, label: string) => void,
): Promise<{ academic: AcademicIdentification; profile: Profile }> {
  for (let i = 0; i < LOOKUP_TIERS.length; i += 1) {
    onTier?.(i, LOOKUP_TIERS[i]);
    await wait(450);
  }

  const department = DEPARTMENTS.find((item) => item.id === keys.departmentId)?.name ?? "";
  const graduationYear = String(sessionEndYear(keys.session) ?? "");
  const academic: AcademicIdentification = {
    ...keys,
    graduationYear,
    lookupSource: LOOKUP_TIERS[2],
  };

  return { academic, profile: branchBAutofill(academic, department, phone) };
}

function branchBAutofill(academic: AcademicIdentification, department: string, phone: string): Profile {
  const today = new Date().toISOString().slice(0, 10);
  const rich = academic.registrationNumber.trim() === EXISTING_RG_REGISTRATION;

  return {
    photoName: "",
    fullName: rich ? "DR. A. K. M. RAHMAN" : "FATEMA JAHAN",
    fatherName: rich ? "ABDUL KARIM RAHMAN" : "",
    motherName: "",
    dateOfBirth: academic.dateOfBirth,
    gender: rich ? "Male" : "Female",
    email: "",
    mobile: phone,
    nid: "",
    present: emptyAddress,
    permanent: emptyAddress,
    sameAsPresent: false,
    qualifyingDegree: qualifyingDegreeForProgram(academic.degreeProgramId),
    instituteOrCollege: department,
    graduationYear: academic.graduationYear,
    occupation: "",
    declarationAccepted: false,
    signature: "",
    applicationDate: today,
    missingFields: rich
      ? ["motherName", "nid", "email", "present", "occupation", "photoName"]
      : ["fatherName", "motherName", "nid", "email", "present", "occupation", "photoName"],
  };
}

function existingRgProfile(): Profile {
  const today = new Date().toISOString().slice(0, 10);
  return {
    photoName: "passport-photo.jpg",
    fullName: "DR. A. K. M. RAHMAN",
    fatherName: "ABDUL KARIM RAHMAN",
    motherName: "ROKEYA BEGUM",
    dateOfBirth: "1988-04-12",
    gender: "Male",
    email: "",
    mobile: "01711112222",
    nid: "",
    present: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Savar",
      union: "Savar Union",
      details: "House 12, Road 4, Savar",
    },
    permanent: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Savar",
      union: "Savar Union",
      details: "Village: Shimulia",
    },
    sameAsPresent: false,
    qualifyingDegree: "hons",
    instituteOrCollege: "Physics",
    graduationYear: "2012",
    occupation: "",
    declarationAccepted: true,
    signature: "A. K. M. Rahman",
    applicationDate: today,
    missingFields: ["email", "nid", "occupation"],
  };
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
