"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { PageIntro } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { LOOKUP_TIERS, runFourSourceLookup } from "@/lib/mock-api";

export default function RgLookupPage() {
  return (
    <FlowGate require="identified">
      <LookupRunner />
    </FlowGate>
  );
}

function LookupRunner() {
  const { state, update } = useAppState();
  const router = useRouter();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!state.academic || state.lookup === "complete") return;
    let cancelled = false;

    (async () => {
      const result = await runFourSourceLookup(state.academic!, state.phone, (index) => {
        if (!cancelled) setActive(index);
      });
      if (cancelled) return;
      update({
        academic: result.academic,
        lookup: "complete",
        profile: result.profile,
        profileComplete: false,
        eligibility: "unchecked",
      });
      router.replace("/eligibility");
    })();

    return () => {
      cancelled = true;
    };
  }, [router, state.academic, state.lookup, state.phone, update]);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Stepper current="lookup" />
      <PageIntro
        kicker="Verification"
        title="Four-source auto-fill lookup"
        description="Sources are queried in order: Previous RG database, Admission Office, Exam Controller, then Convocation snapshot. Fields returned by any source are pre-filled; the rest stay open."
      />
      <ol className="border border-du-line bg-du-paper">
        {LOOKUP_TIERS.map((label, index) => (
          <li
            key={label}
            className="flex items-start gap-3 border-b border-du-line px-4 py-3 last:border-b-0"
          >
            <span className="w-6 text-sm tabular-nums text-du-gold-deep">{index + 1}</span>
            <span className={`text-sm ${index === active ? "font-semibold text-du-purple" : "text-du-muted"}`}>
              {label}
              {index === active ? " — searching" : index < active ? " — no exclusive match" : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
