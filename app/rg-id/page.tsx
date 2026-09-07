"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Alert, Button, Field, Input, PageIntro, TextLink } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { EXISTING_RG_ID } from "@/lib/constants";
import { verifyRgId } from "@/lib/mock-api";

export default function RgIdPage() {
  return (
    <FlowGate require="existingRg">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Stepper current="rg-id" />
        <PageIntro
          kicker="Branch A"
          title="Enter your RG ID"
          description="A recognised Registered Graduate ID loads the full existing profile. You may fill any missing fields now, or save and complete them later."
        />
        <RgIdForm />
      </div>
    </FlowGate>
  );
}

function RgIdForm() {
  const { update } = useAppState();
  const router = useRouter();
  const [rgId, setRgId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await verifyRgId(rgId);
      update({
        rgId: rgId.trim().toUpperCase(),
        profile: result.profile,
        profileComplete: true,
        academic: {
          registrationNumber: result.registrationNumber,
          session: "2011-12",
          degreeProgramId: "bsc-hons",
          departmentId: "physics",
          dateOfBirth: result.profile.dateOfBirth,
          graduationYear: result.profile.graduationYear,
          lookupSource: "Previous Registered Graduate database (Tier 1)",
        },
        eligibility: "eligible",
        lookup: "complete",
        heldMembership: result.heldMembership,
        payment: null,
        membership: null,
        paymentSkipped: true,
      });
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "RG ID could not be verified.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Alert>Demonstration RG ID: {EXISTING_RG_ID}</Alert>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <Field label="Registered Graduate ID">
        <Input required value={rgId} onChange={(e) => setRgId(e.target.value)} placeholder="RG-…" />
      </Field>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Looking up…" : "Load existing profile"}
      </Button>
      <p className="text-sm text-du-muted">
        Forgot RG ID? <TextLink href="/support/forgot-rg-id">Open a support ticket</TextLink>
      </p>
    </form>
  );
}
