"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Button, PageIntro } from "@/components/ui";
import { LIFETIME_FEE_BDT, SESSION_FEE_BDT } from "@/lib/constants";
import { useAppState } from "@/lib/app-context";
import type { MembershipType } from "@/lib/types";

export default function MembershipPage() {
  return (
    <FlowGate require="member">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Stepper current="membership" />
        <PageIntro
          kicker="Membership · optional"
          title="Select membership"
          description="Session membership is ৳1,000 for three academic years. Lifetime membership is ৳2,500. This step is never required to hold Unregistered Graduate or Registered Graduate status."
        />
        <MembershipForm />
      </div>
    </FlowGate>
  );
}

function MembershipForm() {
  const { state, setMembership, update } = useAppState();
  const router = useRouter();
  const [choice, setChoice] = useState<MembershipType>(state.membership ?? "session");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMembership(choice);
    update({ paymentSkipped: false });
    router.push("/payment");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <fieldset className="space-y-3">
        <legend className="sr-only">Membership category</legend>
        <label className="flex cursor-pointer gap-3 border border-du-line bg-du-paper p-4 has-[:checked]:border-du-purple">
          <input
            type="radio"
            name="membership"
            value="session"
            checked={choice === "session"}
            onChange={() => setChoice("session")}
            className="mt-1"
          />
          <span>
            <span className="block font-serif text-du-purple">Session Member</span>
            <span className="mt-1 block text-sm text-du-muted">
              Taka {SESSION_FEE_BDT.toLocaleString("en-BD")} for three academic years.
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer gap-3 border border-du-line bg-du-paper p-4 has-[:checked]:border-du-purple">
          <input
            type="radio"
            name="membership"
            value="lifetime"
            checked={choice === "lifetime"}
            onChange={() => setChoice("lifetime")}
            className="mt-1"
          />
          <span>
            <span className="block font-serif text-du-purple">Lifetime Member</span>
            <span className="mt-1 block text-sm text-du-muted">
              Permanent membership with a single payment. Fee ৳{LIFETIME_FEE_BDT.toLocaleString("en-BD")}.
            </span>
          </span>
        </label>
      </fieldset>
      <Button type="submit" className="w-full">
        Continue to payment
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
