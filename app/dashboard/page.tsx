"use client";

import Link from "next/link";
import { FlowGate } from "@/components/flow-gate";
import { Alert, PageIntro } from "@/components/ui";
import { DEPARTMENTS, LIFETIME_FEE_BDT, SESSION_FEE_BDT } from "@/lib/constants";
import { useAppState } from "@/lib/app-context";
import { programName } from "@/lib/eligibility";
import { applicantRole } from "@/lib/flow";
import { isSessionExpired } from "@/lib/membership";
import { collectMissing } from "@/lib/profile";

export default function DashboardPage() {
  return (
    <FlowGate require="member">
      <DashboardBody />
    </FlowGate>
  );
}

function DashboardBody() {
  const { state } = useAppState();
  const academic = state.academic;
  const payment = state.payment;
  const profile = state.profile!;
  const department = academic
    ? DEPARTMENTS.find((item) => item.id === academic.departmentId)?.name
    : profile.instituteOrCollege;
  const role = applicantRole(state);
  const missing = collectMissing(profile);
  const needsRenewal = state.rgStatus === "existing" && isSessionExpired(state.heldMembership);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageIntro
        kicker={state.rgId ? `RG ID ${state.rgId}` : "Applicant dashboard"}
        title={`Welcome, ${profile.fullName}`}
        description="Registration is complete at this point. Missing profile details and membership payment may be finished now or later. Senate election materials will appear when the Election Wing publishes them."
      />
      <div className="mb-6 inline-block border border-du-gold bg-du-paper px-3 py-1 text-xs font-semibold uppercase tracking-wider text-du-gold-deep">
        Role: {role}
      </div>

      {missing.length > 0 ? (
        <Alert title="Profile details still open">
          You can fill missing fields now or leave them for later. Open: {missing.join(", ")}.
          <span className="mt-2 block">
            <Link href="/profile" className="font-semibold text-du-purple hover:underline">
              Fill missing fields
            </Link>
          </span>
        </Alert>
      ) : null}

      {needsRenewal ? (
        <Alert tone="warning" title="Session membership expired">
          Your sessional membership ended on {state.heldMembership?.expiresAt}. Renew for ৳
          {SESSION_FEE_BDT.toLocaleString("en-BD")} covering three academic years.
          <span className="mt-2 block">
            <Link href="/profile" className="font-semibold text-du-purple hover:underline">
              Renew from your profile
            </Link>
          </span>
        </Alert>
      ) : payment ? (
        <Alert title="Membership">
          {payment.membership === "lifetime" || state.heldMembership?.type === "lifetime"
            ? "Lifetime"
            : "Session"}{" "}
          member
          {state.heldMembership?.expiresAt ? ` · valid until ${state.heldMembership.expiresAt}` : ""}
          {payment.gatePassId ? ` · Gate pass ${payment.gatePassId}` : ""}
        </Alert>
      ) : state.rgStatus === "existing" && state.heldMembership?.type === "lifetime" ? (
        <Alert tone="success" title="Lifetime member">
          Lifetime membership is in force. No renewal is required.
        </Alert>
      ) : state.rgStatus === "existing" && state.heldMembership ? (
        <Alert title="Session membership">
          Current term is valid until {state.heldMembership.expiresAt}.
        </Alert>
      ) : (
        <Alert title="Membership is optional">
          Session membership is ৳{SESSION_FEE_BDT.toLocaleString("en-BD")} (three academic years). Lifetime membership
          is ৳{LIFETIME_FEE_BDT.toLocaleString("en-BD")}. Payment is not required to hold {role} status.
          <span className="mt-2 block">
            <Link href="/membership" className="font-semibold text-du-purple hover:underline">
              Select a category later
            </Link>
          </span>
        </Alert>
      )}

      <p className="mt-4 text-sm">
        <Link href="/profile" className="font-semibold text-du-purple hover:underline">
          Review or update enrollment form
        </Link>
      </p>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-du-purple-deep">Enrollment profile</h2>
        <dl className="mt-3 divide-y divide-du-line border-y border-du-line text-sm">
          <Row label="Name" value={profile.fullName || "—"} />
          <Row label="Mother's name" value={profile.motherName || "—"} />
          <Row label="Father's name" value={profile.fatherName || "—"} />
          <Row label="Gender" value={profile.gender || "—"} />
          <Row label="Occupation" value={profile.occupation || "—"} />
        </dl>
      </section>

      {academic ? (
        <section className="mt-8">
          <h2 className="font-serif text-xl text-du-purple-deep">Academic record</h2>
          <dl className="mt-3 divide-y divide-du-line border-y border-du-line text-sm">
            <Row label="Registration number" value={academic.registrationNumber} />
            <Row label="Session" value={academic.session} />
            <Row label="Degree" value={programName(academic.degreeProgramId)} />
            <Row label="Department" value={department ?? "—"} />
            <Row label="Date of birth" value={academic.dateOfBirth} />
            <Row label="Graduation year" value={academic.graduationYear || profile.graduationYear} />
          </dl>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="font-serif text-xl text-du-purple-deep">Contact</h2>
        <dl className="mt-3 divide-y divide-du-line border-y border-du-line text-sm">
          <Row label="Mobile" value={profile.mobile} />
          <Row label="Email" value={profile.email || "—"} />
          <Row label="NID" value={profile.nid || "—"} />
          <Row
            label="Present address"
            value={
              profile.present.details
                ? `${profile.present.details}, ${profile.present.union}, ${profile.present.upazila}, ${profile.present.district}`
                : "Not yet completed"
            }
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
