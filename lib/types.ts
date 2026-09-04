export type MembershipType = "session" | "lifetime";

export type EligibilityStatus = "unchecked" | "eligible" | "ineligible";

export type LookupStatus = "idle" | "existing" | "new";

export type AcademicIdentification = {
  registrationNumber: string;
  session: string;
  degreeProgramId: string;
  departmentId: string;
};

export type Address = {
  division: string;
  district: string;
  upazila: string;
  union: string;
  details: string;
};

export type Profile = {
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
  missingFields: string[];
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

export type AppState = {
  phone: string;
  password: string;
  otpSent: boolean;
  otpVerified: boolean;
  loggedIn: boolean;
  academic: AcademicIdentification | null;
  eligibility: EligibilityStatus;
  eligibilityReasons: string[];
  lookup: LookupStatus;
  isExistingRg: boolean;
  profile: Profile | null;
  membership: MembershipType | null;
  payment: PaymentReceipt | null;
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
