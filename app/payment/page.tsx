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
      <div className="mx-auto max-w-lg px-4 py-8">
        <Stepper current={8} />
        <PageIntro
          kicker="Payment"
          title="Pay with SSLCommerz"
          description="You will be taken to a demonstration SSLCommerz checkout. No real charge is made."
        />
        <PaymentForm />
      </div>
    </FlowGate>
  );
}

function PaymentForm() {
  const { state } = useAppState();
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
    </form>
  );
}
