export type MembershipType = "session" | "lifetime";

export type EligibilityStatus = "unchecked" | "eligible" | "ineligible";

export type LookupStatus = "idle" | "complete";

export type RgStatusAnswer = "unknown" | "existing" | "new";

export type QualifyingDegree = "hons" | "masters" | "degree" | "diploma";

export type ApplicantRole = "guest" | "urg" | "rg";

export type AcademicIdentification = {
  registrationNumber: string;
  session: string;
  degreeProgramId: string;
  departmentId: string;
  dateOfBirth: string;
  graduationYear: string;
  lookupSource: string;
};

export type Address = {
  division: string;
  district: string;
  upazila: string;
  union: string;
  details: string;
};

export type Profile = {
  photoName: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  mobile: string;
  nid: string;
  present: Address;
  permanent: Address;
  sameAsPresent: boolean;
  qualifyingDegree: QualifyingDegree | "";
  instituteOrCollege: string;
  graduationYear: string;
  occupation: string;
  declarationAccepted: boolean;
  signature: string;
  applicationDate: string;
  missingFields: string[];
};

export type StoredMembership = {
  type: MembershipType;
  expiresAt: string | null;
};

export type PaymentReceipt = {
  transactionId: string;
  gateway: "SSLCommerz";
  method: string;
  amountBdt: number;
  membership: MembershipType;
  paidAt: string;
  gatePassId: string;
};

export type SupportTicket = {
  type: "forgot-rg-id" | "forgot-reg-number";
  name: string;
  details: string;
  submittedAt: string;
  status: "approved";
  recoveredValue: string;
};

export type AppState = {
  phone: string;
  password: string;
  otpSent: boolean;
  otpVerified: boolean;
  loggedIn: boolean;
  rgStatus: RgStatusAnswer;
  rgId: string;
  academic: AcademicIdentification | null;
  eligibility: EligibilityStatus;
  eligibilityReasons: string[];
  lookup: LookupStatus;
  profile: Profile | null;
  profileComplete: boolean;
  membership: MembershipType | null;
  heldMembership: StoredMembership | null;
  payment: PaymentReceipt | null;
  paymentSkipped: boolean;
  tickets: SupportTicket[];
};

export type DegreeProgram = {
  id: string;
  name: string;
  durationMonths: number;
};

export type Department = {
  id: string;
  name: string;
  faculty: string;
};
