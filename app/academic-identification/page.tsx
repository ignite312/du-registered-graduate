"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Alert, Button, Field, Input, PageIntro, Select, TextLink } from "@/components/ui";
import { ACADEMIC_SESSIONS, DEMO_NEW_REGISTRATION, DEPARTMENTS, DEGREE_PROGRAMS } from "@/lib/constants";
import { useAppState } from "@/lib/app-context";

export default function AcademicIdentificationPage() {
  return (
    <FlowGate require="branchB">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Stepper current="details" />
        <PageIntro
          kicker="Branch B"
          title="Registration detail entry"
          description="Submit the five lookup keys. University sources then pre-fill the Registered Graduate Enrollment Form (Appendix A)."
        />
        <AcademicForm />
      </div>
    </FlowGate>
  );
}

function AcademicForm() {
  const { state, update } = useAppState();
  const router = useRouter();
  const recovered = state.tickets.find((item) => item.type === "forgot-reg-number")?.recoveredValue;
  const [registrationNumber, setRegistrationNumber] = useState(
    state.academic?.registrationNumber || recovered || "",
  );
  const [session, setSession] = useState(state.academic?.session ?? "");
  const [degreeProgramId, setDegreeProgramId] = useState(state.academic?.degreeProgramId ?? "");
  const [departmentId, setDepartmentId] = useState(state.academic?.departmentId ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(state.academic?.dateOfBirth ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    update({
      rgStatus: "new",
      academic: {
        registrationNumber,
        session,
        degreeProgramId,
        departmentId,
        dateOfBirth,
        graduationYear: "",
        lookupSource: "",
      },
      eligibility: "unchecked",
      eligibilityReasons: [],
      lookup: "idle",
      profile: null,
      profileComplete: false,
      membership: null,
      payment: null,
    });
    router.push("/rg-lookup");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Alert>
        After these five fields, matching records are auto-filled. Empty fields on the next form must be completed
        by hand. Example registration: {DEMO_NEW_REGISTRATION}. Use session 2024–25 or the six-month certificate to
        see an ineligible result.
      </Alert>
      <Field label="1. Registration number">
        <Input
          required
          name="registrationNumber"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          placeholder="e.g. 2015-10421"
        />
      </Field>
      <p className="-mt-2 text-sm text-du-muted">
        Forgot DU registration number?{" "}
        <TextLink href="/support/forgot-registration">Open a support ticket</TextLink>
      </p>
      <Field label="2. Academic session">
        <Select required name="session" value={session} onChange={(e) => setSession(e.target.value)}>
          <option value="">Select session</option>
          {ACADEMIC_SESSIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="3. Degree programme">
        <Select
          required
          name="degreeProgramId"
          value={degreeProgramId}
          onChange={(e) => setDegreeProgramId(e.target.value)}
        >
          <option value="">Select programme</option>
          {DEGREE_PROGRAMS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="4. Department">
        <Select
          required
          name="departmentId"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Select department</option>
          {DEPARTMENTS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.faculty})
            </option>
          ))}
        </Select>
      </Field>
      <Field label="5. Date of birth">
        <Input required type="date" name="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
      </Field>
      <Button type="submit" className="w-full">
        Search university records
      </Button>
    </form>
  );
}
