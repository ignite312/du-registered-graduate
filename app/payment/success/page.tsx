"use client";

import Link from "next/link";
import { FlowGate } from "@/components/flow-gate";
import { Alert, PageIntro } from "@/components/ui";
import { useAppState } from "@/lib/app-context";

export default function PaymentSuccessPage() {
  return (
    <FlowGate require="paid">
      <SuccessBody />
    </FlowGate>
  );
}

function SuccessBody() {
  const { state } = useAppState();
  const payment = state.payment!;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <PageIntro
        kicker="Payment"
        title="Payment successful"
        description="Your Registered Graduate membership is recorded. A digital receipt and gate pass are shown below. SMS confirmation is simulated."
      />
      <Alert tone="success" title="Transaction complete">
        Paid through {payment.gateway} ({payment.method}).
      </Alert>
      <dl className="mt-6 divide-y divide-du-line border-y border-du-line text-sm">
        <Row label="Transaction ID" value={payment.transactionId} />
        <Row label="Gate pass" value={payment.gatePassId} />
        <Row label="Membership" value={`${payment.membership} member`} />
        <Row label="Amount" value={`৳${payment.amountBdt.toLocaleString("en-BD")}`} />
        <Row
          label="Paid at"
          value={new Date(payment.paidAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
        />
      </dl>
      <p className="mt-4 text-sm text-du-muted">SMS confirmation would be sent to {state.phone}.</p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex h-11 items-center justify-center bg-du-purple px-5 text-sm font-semibold text-white hover:bg-du-purple-deep"
      >
        Go to dashboard
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-du-muted">{label}</dt>
      <dd className="text-right font-medium capitalize">{value}</dd>
    </div>
  );
}
