"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Alert, Button, Field, Input, PageIntro, Select, Textarea } from "@/components/ui";
import { GEOGRAPHY } from "@/lib/constants";
import { useAppState } from "@/lib/app-context";
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
    <FlowGate require="lookedUp">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Stepper current={6} />
        <ProfileForm />
      </div>
    </FlowGate>
  );
}

function ProfileForm() {
  const { state, setProfile } = useAppState();
  const router = useRouter();
  const [form, setForm] = useState<Profile>(
    state.profile ?? {
      fullName: "",
      fatherName: "",
      motherName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      mobile: state.phone,
      nid: "",
      present: emptyAddress,
      permanent: emptyAddress,
      sameAsPresent: false,
      missingFields: [],
    },
  );
  const [error, setError] = useState("");

  const missing = useMemo(() => new Set(form.missingFields), [form.missingFields]);

  function patch<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.mobile.trim()) {
      setError("Full name and mobile number are required.");
      return;
    }
    const present = form.present;
    if (!present.division || !present.district || !present.upazila || !present.union) {
      setError("Complete present address through Union.");
      return;
    }
    const permanent = form.sameAsPresent ? present : form.permanent;
    if (!form.sameAsPresent && (!permanent.division || !permanent.district || !permanent.upazila || !permanent.union)) {
      setError("Complete permanent address through Union.");
      return;
    }
    setProfile({ ...form, permanent, missingFields: [] });
    router.push("/membership");
  }

  return (
    <>
      <PageIntro
        kicker="Profile"
        title={state.isExistingRg ? "Registered Graduate record found" : "Complete your profile"}
        description={
          state.isExistingRg
            ? "No further data entry is required. You may continue, and edit details later from your dashboard."
            : "Fields returned by university records are filled. Empty fields were not found in any source and must be entered."
        }
      />
      {state.isExistingRg ? (
        <Alert tone="success" title="Existing member">
          Your record was matched in the previous Registered Graduate database. Review the details and continue.
        </Alert>
      ) : (
        <Alert>Auto-filled fields come from the four-source lookup. Manual fields are marked.</Alert>
      )}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error ? <Alert tone="danger">{error}</Alert> : null}
        <Field label="Full name" hint={missing.has("fullName") ? "Not returned — enter manually" : undefined}>
          <Input
            required
            value={form.fullName}
            readOnly={state.isExistingRg}
            onChange={(e) => patch("fullName", e.target.value)}
          />
        </Field>
        <Field label="Father's name" hint={missing.has("fatherName") ? "Not returned — enter manually" : undefined}>
          <Input
            required
            value={form.fatherName}
            readOnly={state.isExistingRg}
            onChange={(e) => patch("fatherName", e.target.value)}
          />
        </Field>
        <Field label="Mother's name" hint={missing.has("motherName") ? "Not returned — enter manually" : undefined}>
          <Input
            required
            value={form.motherName}
            readOnly={state.isExistingRg}
            onChange={(e) => patch("motherName", e.target.value)}
          />
        </Field>
        <Field label="Date of birth">
          <Input
            required
            type="date"
            value={form.dateOfBirth}
            readOnly={state.isExistingRg}
            onChange={(e) => patch("dateOfBirth", e.target.value)}
          />
        </Field>
        <Field label="Gender">
          <Select
            required
            value={form.gender}
            disabled={state.isExistingRg}
            onChange={(e) => patch("gender", e.target.value)}
          >
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </Select>
        </Field>
        <Field label="Email" hint={missing.has("email") ? "Not returned — enter manually" : undefined}>
          <Input
            required
            type="email"
            value={form.email}
            readOnly={state.isExistingRg}
            onChange={(e) => patch("email", e.target.value)}
          />
        </Field>
        <Field label="Mobile number">
          <Input required inputMode="numeric" value={form.mobile} onChange={(e) => patch("mobile", e.target.value)} />
        </Field>
        <Field label="National ID" hint={missing.has("nid") ? "Not returned — enter manually" : undefined}>
          <Input
            required
            value={form.nid}
            readOnly={state.isExistingRg}
            onChange={(e) => patch("nid", e.target.value)}
          />
        </Field>
        <h2 className="pt-2 font-serif text-lg text-du-purple">Present address</h2>
        <AddressFields
          value={form.present}
          onChange={(present) => patch("present", present)}
          readOnly={state.isExistingRg}
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
            <h2 className="pt-2 font-serif text-lg text-du-purple">Permanent address</h2>
            <AddressFields
              value={form.permanent}
              onChange={(permanent) => patch("permanent", permanent)}
              readOnly={state.isExistingRg}
            />
          </>
        ) : null}
        <Button type="submit" className="w-full">
          Continue to membership
        </Button>
      </form>
    </>
  );
}

function AddressFields({
  value,
  onChange,
  readOnly,
}: {
  value: Address;
  onChange: (next: Address) => void;
  readOnly?: boolean;
}) {
  const districts = value.division ? Object.keys(GEOGRAPHY[value.division] ?? {}) : [];
  const upazilas = value.division && value.district ? (GEOGRAPHY[value.division]?.[value.district] ?? []) : [];

  return (
    <div className="space-y-4">
      <Field label="Division">
        <Select
          required
          disabled={readOnly}
          value={value.division}
          onChange={(e) =>
            onChange({ ...value, division: e.target.value, district: "", upazila: "" })
          }
        >
          <option value="">Select division</option>
          {Object.keys(GEOGRAPHY).map((division) => (
            <option key={division}>{division}</option>
          ))}
        </Select>
      </Field>
      <Field label="District">
        <Select
          required
          disabled={readOnly || !value.division}
          value={value.district}
          onChange={(e) => onChange({ ...value, district: e.target.value, upazila: "" })}
        >
          <option value="">Select district</option>
          {districts.map((district) => (
            <option key={district}>{district}</option>
          ))}
        </Select>
      </Field>
      <Field label="Upazila">
        <Select
          required
          disabled={readOnly || !value.district}
          value={value.upazila}
          onChange={(e) => onChange({ ...value, upazila: e.target.value })}
        >
          <option value="">Select upazila</option>
          {upazilas.map((upazila) => (
            <option key={upazila}>{upazila}</option>
          ))}
        </Select>
      </Field>
      <Field label="Union" hint="Entered manually">
        <Input
          required
          readOnly={readOnly}
          value={value.union}
          onChange={(e) => onChange({ ...value, union: e.target.value })}
        />
      </Field>
      <Field label="Village / house / road">
        <Textarea
          required
          readOnly={readOnly}
          value={value.details}
          onChange={(e) => onChange({ ...value, details: e.target.value })}
        />
      </Field>
    </div>
  );
}
