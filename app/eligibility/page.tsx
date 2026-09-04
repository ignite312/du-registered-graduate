"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { PageIntro } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { evaluateEligibility } from "@/lib/mock-api";

export default function EligibilityPage() {
  return (
    <FlowGate require="identified">
      <EligibilityCheck />
    </FlowGate>
  );
}

function EligibilityCheck() {
  const { state, update } = useAppState();
  const router = useRouter();
  const [message, setMessage] = useState("Reviewing degree duration…");

  useEffect(() => {
    if (!state.academic) return;
    let cancelled = false;

    (async () => {
      setMessage("Reviewing degree duration…");
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;
      setMessage("Confirming three-year waiting period since graduation…");
      const result = await evaluateEligibility(state.academic!);
      if (cancelled) return;
      if (result.eligible) {
        update({ eligibility: "eligible", eligibilityReasons: [] });
        router.replace("/rg-lookup");
      } else {
        update({
          eligibility: "ineligible",
          eligibilityReasons: result.reasons,
          lookup: "idle",
          profile: null,
          membership: null,
          payment: null,
        });
        router.replace("/not-eligible");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, state.academic, update]);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Stepper current={4} />
      <PageIntro
        kicker="Gate"
        title="Eligibility check"
        description="The portal applies the one-year degree rule and the three-year post-graduation rule before any database lookup."
      />
      <p className="border border-du-line bg-du-paper px-4 py-6 text-sm text-du-muted" role="status">
        {message}
      </p>
    </div>
  );
}
