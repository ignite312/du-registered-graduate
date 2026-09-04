"use client";

import Link from "next/link";
import { FlowGate } from "@/components/flow-gate";
import { Alert, PageIntro } from "@/components/ui";
import { DEPARTMENTS } from "@/lib/constants";
import { useAppState } from "@/lib/app-context";
import { programName } from "@/lib/eligibility";

export default function DashboardPage() {
  return (
    <FlowGate require="paid">
      <DashboardBody />
    </FlowGate>
  );
}

function DashboardBody() {
  const { state } = useAppState();
  const academic = state.academic!;
  const payment = state.payment!;
  const profile = state.profile!;
  const department = DEPARTMENTS.find((item) => item.id === academic.departmentId)?.name;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageIntro
        kicker="Registered Graduate"
        title={`Welcome, ${profile.fullName}`}
        description="You are a verified Registered Graduate. Senate election materials will appear here when the Election Wing publishes them."
      />
      <div className="mb-6 inline-block border border-du-gold bg-du-paper px-3 py-1 text-xs font-semibold uppercase tracking-wider text-du-gold-deep">
        Role: Registered Graduate (RG)
      </div>
      <Alert title="Membership">
        {payment.membership === "lifetime" ? "Lifetime" : "Session"} member · Gate pass {payment.gatePassId} ·
        Transaction {payment.transactionId}
      </Alert>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-du-purple-deep">Academic record</h2>
        <dl className="mt-3 divide-y divide-du-line border-y border-du-line text-sm">
          <Row label="Registration number" value={academic.registrationNumber} />
          <Row label="Session" value={academic.session} />
          <Row label="Degree" value={programName(academic.degreeProgramId)} />
          <Row label="Department" value={department ?? "—"} />
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-du-purple-deep">Contact</h2>
        <dl className="mt-3 divide-y divide-du-line border-y border-du-line text-sm">
          <Row label="Mobile" value={profile.mobile} />
          <Row label="Email" value={profile.email} />
          <Row
            label="Present address"
            value={`${profile.present.details}, ${profile.present.union}, ${profile.present.upazila}, ${profile.present.district}`}
          />
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-du-purple-deep">Senate election</h2>
        <p className="mt-2 text-sm leading-6 text-du-muted">
          Elections will be held for 25 Senate members. Voter-roll publication and candidate lists are not yet
          open in this portal.
        </p>
      </section>

      <p className="mt-8 text-sm">
        <Link href="/" className="font-semibold text-du-purple hover:underline">
          Return to home
        </Link>
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr]">
      <dt className="text-du-muted">{label}</dt>
      <dd className="font-medium text-du-ink">{value}</dd>
    </div>
  );
}
