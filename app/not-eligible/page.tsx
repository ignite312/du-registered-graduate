"use client";

import Link from "next/link";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Alert, PageIntro } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { DEPARTMENTS } from "@/lib/constants";
import { programName } from "@/lib/eligibility";

export default function NotEligiblePage() {
  return (
    <FlowGate require="ineligible">
      <NotEligibleNotice />
    </FlowGate>
  );
}

function NotEligibleNotice() {
  const { state } = useAppState();
  const academic = state.academic;
  const department = DEPARTMENTS.find((item) => item.id === academic?.departmentId)?.name;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Stepper current="eligibility" />
      <PageIntro
        kicker="Gate"
        title="Not eligible"
        description="Registered Graduate membership cannot proceed. Profile completion and payment are not offered."
      />
      <Alert tone="danger" title="Application stopped">
        <p>You do not meet the eligibility criteria for Registered Graduate status.</p>
      </Alert>
      {academic ? (
        <dl className="mt-6 divide-y divide-du-line border-y border-du-line text-sm">
          <Row label="Registration number" value={academic.registrationNumber} />
          <Row label="Session" value={academic.session} />
          <Row label="Degree programme" value={programName(academic.degreeProgramId)} />
          <Row label="Department" value={department ?? "—"} />
          <Row label="Date of birth" value={academic.dateOfBirth} />
        </dl>
      ) : null}
      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-6 text-du-muted">
        {state.eligibilityReasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        <Link href="/academic-identification" className="font-semibold text-du-purple hover:underline">
          Correct academic details
        </Link>
        <span className="text-du-muted"> if a field was entered in error.</span>
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-du-muted">{label}</dt>
      <dd className="text-right font-medium text-du-ink">{value}</dd>
    </div>
  );
}
