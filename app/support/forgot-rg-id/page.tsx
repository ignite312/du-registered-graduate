"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Alert, Button, Field, Input, PageIntro, TextLink, Textarea } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { submitSupportTicket } from "@/lib/mock-api";

export default function ForgotRgIdPage() {
  return (
    <FlowGate require="existingRg">
      <div className="mx-auto max-w-lg px-4 py-8">
        <PageIntro
          kicker="Support ticket"
          title="Forgot RG ID"
          description="The ticket is routed to Verifier Admin — RG ID Recovery (Admin-4, DU Wing). In this demonstration, approval is returned immediately."
        />
        <TicketForm />
      </div>
    </FlowGate>
  );
}

function TicketForm() {
  const { state, update } = useAppState();
  const router = useRouter();
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [recovered, setRecovered] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const ticket = await submitSupportTicket({ type: "forgot-rg-id", name, details });
      update({ tickets: [...state.tickets, ticket] });
      setRecovered(ticket.recoveredValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ticket could not be submitted.");
    } finally {
      setBusy(false);
    }
  }

  if (recovered) {
    return (
      <div className="space-y-4">
        <Alert tone="success" title="Admin approval (demonstration)">
          Your RG ID is {recovered}. Return to RG ID entry to load the profile.
        </Alert>
        <Button type="button" className="w-full" onClick={() => router.push("/rg-id")}>
          Continue with recovered RG ID
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <Field label="Name">
        <Input required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Identifying information" hint="Registration number, session, degree, department, or other details you have.">
        <Textarea required value={details} onChange={(e) => setDetails(e.target.value)} />
      </Field>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Submitting…" : "Submit ticket"}
      </Button>
      <p className="text-sm text-du-muted">
        <TextLink href="/rg-id">I remember my RG ID</TextLink>
      </p>
    </form>
  );
}
