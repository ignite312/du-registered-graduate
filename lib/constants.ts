import type { DegreeProgram, Department } from "./types";

export const APP_NAME = "Registered Graduate & Senate Election System";
export const UNIVERSITY_NAME_EN = "University of Dhaka";
export const UNIVERSITY_NAME_BN = "ঢাকা বিশ্ববিদ্যালয়";

export const MOCK_OTP = "123456";
export const EXISTING_RG_ID = "RG-2012-18542";
export const EXISTING_RG_REGISTRATION = "2012-18542";
export const DEMO_NEW_REGISTRATION = "2015-10421";

export const SESSION_FEE_BDT = 1000;
export const LIFETIME_FEE_BDT = 2500;

export const QUALIFYING_DEGREES = [
  { id: "hons", label: "Hons." },
  { id: "masters", label: "Masters" },
  { id: "degree", label: "Degree" },
  { id: "diploma", label: "Diploma" },
] as const;

export const AFFILIATED_UNITS = [
  "Department (University of Dhaka)",
  "Institute of Education and Research",
  "Institute of Statistical Research and Training",
  "Dhaka College",
  "Eden Mohila College",
];

export const DEGREE_PROGRAMS: DegreeProgram[] = [
  { id: "ba-hons", name: "B.A. (Hons)", durationMonths: 48 },
  { id: "bsc-hons", name: "B.Sc. (Hons)", durationMonths: 48 },
  { id: "bba", name: "B.B.A.", durationMonths: 48 },
  { id: "ma", name: "M.A.", durationMonths: 12 },
  { id: "msc", name: "M.Sc.", durationMonths: 12 },
  { id: "mba", name: "M.B.A.", durationMonths: 12 },
  { id: "mphil", name: "M.Phil.", durationMonths: 24 },
  { id: "phd", name: "Ph.D.", durationMonths: 36 },
  { id: "diploma-1y", name: "Professional Diploma (1 year)", durationMonths: 12 },
  { id: "cert-6m", name: "Certificate (6 months)", durationMonths: 6 },
];

export const DEPARTMENTS: Department[] = [
  { id: "bangla", name: "Bangla", faculty: "Arts" },
  { id: "english", name: "English", faculty: "Arts" },
  { id: "history", name: "History", faculty: "Arts" },
  { id: "political-science", name: "Political Science", faculty: "Social Sciences" },
  { id: "economics", name: "Economics", faculty: "Social Sciences" },
  { id: "physics", name: "Physics", faculty: "Science" },
  { id: "chemistry", name: "Chemistry", faculty: "Science" },
  { id: "mathematics", name: "Mathematics", faculty: "Science" },
  { id: "botany", name: "Botany", faculty: "Biological Sciences" },
  { id: "zoology", name: "Zoology", faculty: "Biological Sciences" },
  { id: "law", name: "Law", faculty: "Law" },
  { id: "management", name: "Management", faculty: "Business Studies" },
  { id: "accounting", name: "Accounting & Information Systems", faculty: "Business Studies" },
];

export const ACADEMIC_SESSIONS = Array.from({ length: 20 }, (_, i) => {
  const start = 2006 + i;
  return `${start}-${String(start + 1).slice(-2)}`;
});

export const GEOGRAPHY: Record<string, Record<string, string[]>> = {
  Dhaka: {
    Dhaka: ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar"],
    Gazipur: ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur"],
    Narayanganj: ["Narayanganj Sadar", "Araihazar", "Bandar", "Rupganj"],
  },
  Chattogram: {
    Chattogram: ["Chattogram Sadar", "Hathazari", "Patiya", "Sitakunda"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Teknaf", "Ukhiya"],
  },
  Rajshahi: {
    Rajshahi: ["Boalia", "Paba", "Godagari", "Mohanpur"],
    Natore: ["Natore Sadar", "Bagatipara", "Baraigram"],
  },
  Khulna: {
    Khulna: ["Khulna Sadar", "Batiaghata", "Dacope", "Dumuria"],
    Jessore: ["Jashore Sadar", "Abhaynagar", "Keshabpur"],
  },
  Barishal: {
    Barishal: ["Barishal Sadar", "Bakerganj", "Babuganj"],
  },
  Sylhet: {
    Sylhet: ["Sylhet Sadar", "Beanibazar", "Golapganj", "Zakiganj"],
  },
  Rangpur: {
    Rangpur: ["Rangpur Sadar", "Gangachara", "Mithapukur"],
  },
  Mymensingh: {
    Mymensingh: ["Mymensingh Sadar", "Trishal", "Bhaluka", "Muktagacha"],
  },
};

export const NOTICES = [
  {
    date: "1 September 2026",
    title: "Registered Graduate enrolment circular, 2026–27",
    body: "Online applications are now open for Session and Lifetime membership. Eligibility: a degree programme of at least one year, and graduation no fewer than three years ago.",
  },
  {
    date: "18 August 2026",
    title: "Senate election: 25 elected members",
    body: "The Election Wing will publish the voter roll after verification of Registered Graduate membership. Further instructions will follow by circular.",
  },
  {
    date: "4 July 2026",
    title: "Paper applications remain accepted",
    body: "Graduates may still submit a manual application with degree certificates for Syndicate approval. Online applicants should use this portal.",
  },
];

export const ENTRY_STEPS = [
  { id: "register", label: "Register" },
  { id: "otp", label: "OTP" },
  { id: "login", label: "Login" },
  { id: "rg-status", label: "RG Status" },
] as const;

export const BRANCH_A_STEPS = [
  ...ENTRY_STEPS,
  { id: "rg-id", label: "RG ID" },
  { id: "dashboard", label: "Dashboard" },
] as const;

export const BRANCH_B_STEPS = [
  ...ENTRY_STEPS,
  { id: "details", label: "Details" },
  { id: "lookup", label: "Lookup" },
  { id: "eligibility", label: "Eligibility" },
  { id: "profile", label: "Profile" },
] as const;

export const OPTIONAL_STEPS = [
  { id: "membership", label: "Membership" },
  { id: "payment", label: "Payment" },
] as const;

export const DECLARATION_TEXT =
  "I do hereby declare that the statements made above are correct. In case of detection of any wrong entries my registration will be liable to cancellation without any reference.";
