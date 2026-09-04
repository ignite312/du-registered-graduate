"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Alert, Button, Field, Input, PageIntro, Select } from "@/components/ui";
import { ACADEMIC_SESSIONS, DEPARTMENTS, DEGREE_PROGRAMS, EXISTING_RG_REGISTRATION } from "@/lib/constants";
import { useAppState } from "@/lib/app-context";

export default function AcademicIdentificationPage() {
  return (
    <FlowGate require="authenticated">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Stepper current={3} />
        <PageIntro
          kicker="Identification"
          title="Academic identification"
          description="Submit the four keys used for eligibility and later record lookup. No further details are collected until eligibility is confirmed."
        />
        <AcademicForm />
      </div>
    </FlowGate>
  );
}

function AcademicForm() {
  const { state, update } = useAppState();
  const router = useRouter();
  const [registrationNumber, setRegistrationNumber] = useState(
    state.academic?.registrationNumber ?? "",
  );
  const [session, setSession] = useState(state.academic?.session ?? "");
  const [degreeProgramId, setDegreeProgramId] = useState(state.academic?.degreeProgramId ?? "");
  const [departmentId, setDepartmentId] = useState(state.academic?.departmentId ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    update({
      academic: { registrationNumber, session, degreeProgramId, departmentId },
      eligibility: "unchecked",
      eligibilityReasons: [],
      lookup: "idle",
      isExistingRg: false,
      profile: null,
      membership: null,
      payment: null,
    });
    router.push("/eligibility");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Alert>
        Demonstration: use session 2024–25 or the six-month certificate to see an
        ineligible result. Use registration {EXISTING_RG_REGISTRATION} with an
        older session to load an existing Registered Graduate.
      </Alert>
      <Field label="Registration number">
        <Input
          required
          name="registrationNumber"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          placeholder="e.g. 2015-10421"
        />
      </Field>
      <Field label="Academic session">
        <Select required name="session" value={session} onChange={(e) => setSession(e.target.value)}>
          <option value="">Select session</option>
          {ACADEMIC_SESSIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Degree programme">
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
      <Field label="Department">
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
      <Button type="submit" className="w-full">
        Check eligibility
      </Button>
    </form>
  );
}
