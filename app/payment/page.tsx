"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Button, PageIntro } from "@/components/ui";
import { LIFETIME_FEE_BDT, SESSION_FEE_BDT } from "@/lib/constants";
import { useAppState } from "@/lib/app-context";

const METHODS = [
  { id: "bkash", label: "bKash" },
  { id: "nagad", label: "Nagad" },
  { id: "card", label: "Credit / Debit card" },
  { id: "ibank", label: "Internet banking" },
];

export default function PaymentPage() {
  return (
    <FlowGate require="membershipChosen">
      <PaymentBody />
    </FlowGate>
  );
}

function PaymentBody() {
  const { state } = useAppState();
  const renewing = state.rgStatus === "existing" && state.membership === "session";

  return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <Stepper current="payment" />
        <PageIntro
          kicker={renewing ? "Renewal" : "Payment · optional"}
          title={renewing ? "Renew session membership" : "Pay with SSLCommerz"}
          description={
            renewing
              ? "Your sessional term has ended. Pay ৳1,000 to renew for three academic years. You may skip and renew later from the dashboard."
              : "All payment types are optional and may be completed later from the dashboard. This checkout is a demonstration only."
          }
        />
        <PaymentForm />
      </div>
  );
}

function PaymentForm() {
  const { state, update } = useAppState();
  const router = useRouter();
  const [method, setMethod] = useState("bkash");
  const amount = state.membership === "lifetime" ? LIFETIME_FEE_BDT : SESSION_FEE_BDT;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/payment/sslcommerz?method=${encodeURIComponent(method)}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <dl className="divide-y divide-du-line border-y border-du-line text-sm">
        <div className="flex justify-between py-3">
          <dt className="text-du-muted">Category</dt>
          <dd className="font-medium capitalize">{state.membership} member</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-du-muted">Amount</dt>
          <dd className="font-medium">৳{amount.toLocaleString("en-BD")}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-du-muted">Gateway</dt>
          <dd className="font-medium">SSLCommerz</dd>
        </div>
      </dl>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Payment method</legend>
        {METHODS.map((item) => (
          <label key={item.id} className="flex items-center gap-2 border border-du-line bg-du-paper px-3 py-2 text-sm">
            <input
              type="radio"
              name="method"
              value={item.id}
              checked={method === item.id}
              onChange={() => setMethod(item.id)}
            />
            {item.label}
          </label>
        ))}
      </fieldset>
      <Button type="submit" className="w-full">
        Continue to SSLCommerz
      </Button>
      <Button type="button" variant="secondary" className="w-full" onClick={() => {
        update({ paymentSkipped: true });
        router.push("/dashboard");
      }}>
        Skip for later
      </Button>
    </form>
  );
}
