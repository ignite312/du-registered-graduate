"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Alert, Button, Field, Input, PageIntro, Select, Textarea } from "@/components/ui";
import {
  AFFILIATED_UNITS,
  DECLARATION_TEXT,
  DEPARTMENTS,
  GEOGRAPHY,
  QUALIFYING_DEGREES,
  SESSION_FEE_BDT,
} from "@/lib/constants";
import { useAppState } from "@/lib/app-context";
import { programName } from "@/lib/eligibility";
import { collectMissing, profileReady } from "@/lib/profile";
import { isSessionExpired } from "@/lib/membership";
import type { Address, Profile } from "@/lib/types";

const emptyAddress: Address = {
  division: "",
  district: "",
  upazila: "",
  union: "",
  details: "",
};

export default function ProfilePage() {
  return (
    <FlowGate require="eligible">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Stepper current="profile" />
        <ProfileForm />
      </div>
    </FlowGate>
  );
}

function ProfileForm() {
  const { state, setProfile, update } = useAppState();
  const router = useRouter();
  const existing = state.rgStatus === "existing";
  const needsRenewal = existing && isSessionExpired(state.heldMembership);
  const academic = state.academic!;
  const department = DEPARTMENTS.find((item) => item.id === academic.departmentId)?.name ?? "";
  const [form, setForm] = useState<Profile>(
    state.profile ?? {
      photoName: "",
      fullName: "",
      fatherName: "",
      motherName: "",
      dateOfBirth: academic.dateOfBirth,
      gender: "",
      email: "",
      mobile: state.phone,
      nid: "",
      present: emptyAddress,
      permanent: emptyAddress,
      sameAsPresent: false,
      qualifyingDegree: "",
      instituteOrCollege: department,
      graduationYear: academic.graduationYear,
      occupation: "",
      declarationAccepted: false,
      signature: "",
      applicationDate: new Date().toISOString().slice(0, 10),
      missingFields: [],
    },
  );
  const [error, setError] = useState("");

  const missing = useMemo(() => new Set(form.missingFields), [form.missingFields]);
  const badge = (key: string) => (missing.has(key) ? "required" : form.missingFields.length ? "filled" : undefined);

  function patch<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function persist(next: Profile) {
    const permanent = next.sameAsPresent ? next.present : next.permanent;
    const saved = { ...next, permanent, missingFields: collectMissing({ ...next, permanent }) };
    setProfile(saved);
    return saved;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (existing) {
      persist(form);
      router.push("/dashboard");
      return;
    }
    if (!profileReady({ ...form, permanent: form.sameAsPresent ? form.present : form.permanent })) {
      if (!form.photoName) setError("Attach a passport-size photograph (field on Appendix A).");
      else if (!form.fullName.trim() || !form.fatherName.trim() || !form.motherName.trim()) {
        setError("Name, father's name, and mother's name are required.");
      } else if (!form.nid.trim()) setError("NID number is required.");
      else if (!form.gender || !form.email.trim() || !form.mobile.trim()) {
        setError("Gender, mobile number, and email are required.");
      } else if (!form.qualifyingDegree || !form.instituteOrCollege.trim() || !form.graduationYear.trim()) {
        setError("Complete the qualifying degree, department/institute/college, and graduation year.");
      } else if (!form.occupation.trim()) setError("Occupation (with designation) is required.");
      else if (collectMissing(form).includes("present") || collectMissing(form).includes("permanent")) {
        setError("Complete present and permanent address through Union.");
      } else setError("Accept the declaration, enter the date, and type your signature.");
      return;
    }
    persist(form);
    update({ paymentSkipped: false });
    router.push("/membership");
  }

  function renewSession() {
    persist(form);
    update({ membership: "session", paymentSkipped: false });
    router.push("/payment");
  }

  return (
    <>
      <PageIntro
        kicker={existing ? `RG ID ${state.rgId}` : "Appendix A · Form 8377"}
        title={existing ? "Your Registered Graduate profile" : "Registered Graduate Enrollment Form"}
        description={
          existing
            ? "Your record is loaded below. Fill any missing fields now, or save and return later. Session members whose term has ended may renew."
            : "Fields returned by the four university sources are marked Auto-filled. After you complete this form, membership payment opens — you may pay now or skip for later."
        }
      />
      {existing && needsRenewal ? (
        <Alert tone="warning" title="Session membership expired">
          Your sessional membership ended on {state.heldMembership?.expiresAt}. You may renew for three academic years
          (৳{SESSION_FEE_BDT.toLocaleString("en-BD")}) or save the profile and renew later.
        </Alert>
      ) : existing && state.heldMembership?.type === "lifetime" ? (
        <Alert tone="success" title="Lifetime member">
          Lifetime membership does not expire. No renewal is required.
        </Alert>
      ) : existing && state.heldMembership ? (
        <Alert title="Session membership">
          Current term is valid until {state.heldMembership.expiresAt}. Renewal appears only after this date.
        </Alert>
      ) : null}

      {existing && missing.size > 0 ? (
        <Alert title="Some fields are missing">
          You can complete them now, or save and fill them later. Missing:{" "}
          {Array.from(missing).join(", ")}.
        </Alert>
      ) : (
        <Alert>
          Lookup keys already submitted: registration {academic.registrationNumber}, session {academic.session},{" "}
          {programName(academic.degreeProgramId)}, {department || "department"}, date of birth {academic.dateOfBirth}.
        </Alert>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error ? <Alert tone="danger">{error}</Alert> : null}

        <Field label="Passport-size photograph" badge={badge("photoName")} hint="Four photographs are required with the paper form; attach one file here.">
          <Input
            type="file"
            accept="image/*"
            required={!existing}
            onChange={(e) => patch("photoName", e.target.files?.[0]?.name ?? "")}
          />
          {form.photoName ? <span className="block text-xs text-du-muted">Selected: {form.photoName}</span> : null}
        </Field>

        <Field label="1. Name (in block letters)" badge={badge("fullName")}>
          <Input required value={form.fullName} onChange={(e) => patch("fullName", e.target.value.toUpperCase())} />
        </Field>
        <Field label="2. Mother's name (in block letters)" badge={badge("motherName")}>
          <Input required value={form.motherName} onChange={(e) => patch("motherName", e.target.value.toUpperCase())} />
        </Field>
        <Field label="3. Father's name (in block letters)" badge={badge("fatherName")}>
          <Input required value={form.fatherName} onChange={(e) => patch("fatherName", e.target.value.toUpperCase())} />
        </Field>

        <h2 className="pt-2 font-serif text-lg text-du-purple">4. Address</h2>
        <p className="text-xs text-du-muted">Division → District → Upazila → Union (Union entered manually).</p>
        <h3 className="text-sm font-semibold text-du-ink">4(a) Present</h3>
        <AddressFields
          value={form.present}
          onChange={(present) => patch("present", present)}
          missing={missing.has("present")}
          enforceRequired={!existing}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.sameAsPresent}
            onChange={(e) => patch("sameAsPresent", e.target.checked)}
          />
          Permanent address is the same as present
        </label>
        {!form.sameAsPresent ? (
          <>
            <h3 className="text-sm font-semibold text-du-ink">4(b) Permanent</h3>
            <AddressFields
              value={form.permanent}
              onChange={(permanent) => patch("permanent", permanent)}
              missing={missing.has("present") || missing.has("permanent")}
              enforceRequired={!existing}
            />
          </>
        ) : null}

        <Field label="5. NID No." badge={badge("nid")}>
          <Input required={!existing} value={form.nid} onChange={(e) => patch("nid", e.target.value)} />
        </Field>
        <Field label="6. Date of birth" badge="filled" hint="Taken from the five lookup keys.">
          <Input required type="date" readOnly value={form.dateOfBirth} />
        </Field>
        <Field label="Gender" badge={badge("gender")}>
          <Select required value={form.gender} onChange={(e) => patch("gender", e.target.value)}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
          </Select>
        </Field>
        <Field label="7. Mobile No." badge="filled" hint="From the verified account.">
          <Input required inputMode="numeric" value={form.mobile} onChange={(e) => patch("mobile", e.target.value)} />
        </Field>
        <Field label="Email (if any)" badge={badge("email")}>
          <Input required={!existing} type="email" value={form.email} onChange={(e) => patch("email", e.target.value)} />
        </Field>

        <Field
          label="8. Qualifying degree from the University of Dhaka"
          badge={badge("qualifyingDegree")}
          hint="Attested photocopy must be attached with a paper application."
        >
          <Select
            required
            value={form.qualifyingDegree}
            onChange={(e) => patch("qualifyingDegree", e.target.value as Profile["qualifyingDegree"])}
          >
            <option value="">Select</option>
            {QUALIFYING_DEGREES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="9. Dept. / Institute / College" badge={badge("instituteOrCollege")}>
          <Select required value={form.instituteOrCollege} onChange={(e) => patch("instituteOrCollege", e.target.value)}>
            <option value="">Select</option>
            {department ? <option value={department}>{department}</option> : null}
            {AFFILIATED_UNITS.filter((item) => item !== department).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Registration No." badge="filled">
            <Input readOnly value={academic.registrationNumber} />
          </Field>
          <Field label="Session" badge="filled">
            <Input readOnly value={academic.session} />
          </Field>
        </div>
        <Field label="10. Graduation year" badge={badge("graduationYear")}>
          <Input required value={form.graduationYear} onChange={(e) => patch("graduationYear", e.target.value)} />
        </Field>
        <Field label="11. Occupation (with designation)" badge={badge("occupation")}>
          <Input required={!existing} value={form.occupation} onChange={(e) => patch("occupation", e.target.value)} />
        </Field>

        {existing ? null : (
          <Alert title="12. Registration fee (optional)">
            Taka 1,000 for three academic years, or Taka 2,500 for life. After this form, you can pay now or skip and
            pay later from the dashboard.
          </Alert>
        )}

        <div className="border border-du-line bg-du-paper p-4">
          <p className="font-serif text-du-purple">Declaration</p>
          <p className="mt-2 text-sm leading-6 text-du-muted">{DECLARATION_TEXT}</p>
          <label className="mt-3 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.declarationAccepted}
              onChange={(e) => patch("declarationAccepted", e.target.checked)}
            />
            I agree to the declaration above.
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input required type="date" value={form.applicationDate} onChange={(e) => patch("applicationDate", e.target.value)} />
            </Field>
            <Field label="Signature (type full name)">
              <Input required value={form.signature} onChange={(e) => patch("signature", e.target.value)} />
            </Field>
          </div>
        </div>

        {existing ? (
          <>
            {needsRenewal ? (
              <Button type="button" className="w-full" onClick={renewSession}>
                Renew expired session membership
              </Button>
            ) : null}
            <Button type="submit" variant={needsRenewal ? "secondary" : "primary"} className="w-full">
              {missing.size > 0 ? "Save and fill missing fields later" : "Save profile"}
            </Button>
          </>
        ) : (
          <Button type="submit" className="w-full">
            Complete registration and continue to payment
          </Button>
        )}
      </form>
    </>
  );
}

function AddressFields({
  value,
  onChange,
  missing,
  enforceRequired = true,
}: {
  value: Address;
  onChange: (next: Address) => void;
  missing?: boolean;
  enforceRequired?: boolean;
}) {
  const districts = value.division ? Object.keys(GEOGRAPHY[value.division] ?? {}) : [];
  const upazilas = value.division && value.district ? (GEOGRAPHY[value.division]?.[value.district] ?? []) : [];
  const mark = missing ? "required" : undefined;

  return (
    <div className="space-y-4">
      <Field label="Division" badge={mark}>
        <Select
          required={enforceRequired}
          value={value.division}
          onChange={(e) => onChange({ ...value, division: e.target.value, district: "", upazila: "" })}
        >
          <option value="">Select division</option>
          {Object.keys(GEOGRAPHY).map((division) => (
            <option key={division}>{division}</option>
          ))}
        </Select>
      </Field>
      <Field label="District" badge={mark}>
        <Select
          required={enforceRequired}
          disabled={!value.division}
          value={value.district}
          onChange={(e) => onChange({ ...value, district: e.target.value, upazila: "" })}
        >
          <option value="">Select district</option>
          {districts.map((district) => (
            <option key={district}>{district}</option>
          ))}
        </Select>
      </Field>
      <Field label="Upazila / Thana" badge={mark}>
        <Select
          required={enforceRequired}
          disabled={!value.district}
          value={value.upazila}
          onChange={(e) => onChange({ ...value, upazila: e.target.value })}
        >
          <option value="">Select upazila</option>
          {upazilas.map((upazila) => (
            <option key={upazila}>{upazila}</option>
          ))}
        </Select>
      </Field>
      <Field label="Union" hint="Entered manually" badge={mark}>
        <Input required={enforceRequired} value={value.union} onChange={(e) => onChange({ ...value, union: e.target.value })} />
      </Field>
      <Field label="Village / house / road" badge={mark}>
        <Textarea required={enforceRequired} value={value.details} onChange={(e) => onChange({ ...value, details: e.target.value })} />
      </Field>
    </div>
  );
}
