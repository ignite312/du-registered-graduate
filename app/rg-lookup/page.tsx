"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { PageIntro } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { LOOKUP_TIERS, runExistingRgLookup } from "@/lib/mock-api";

export default function RgLookupPage() {
  return (
    <FlowGate require="eligible">
      <LookupRunner />
    </FlowGate>
  );
}

function LookupRunner() {
  const { state, update } = useAppState();
  const router = useRouter();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!state.academic) return;
    let cancelled = false;

    (async () => {
      const result = await runExistingRgLookup(state.academic!, (index) => {
        if (!cancelled) setActive(index);
      });
      if (cancelled) return;
      update({
        lookup: result.existing ? "existing" : "new",
        isExistingRg: result.existing,
        profile: { ...result.profile, mobile: result.profile.mobile || state.phone },
      });
      router.replace("/profile");
    })();

    return () => {
      cancelled = true;
    };
  }, [router, state.academic, state.phone, update]);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Stepper current={5} />
      <PageIntro
        kicker="Verification"
        title="Existing Registered Graduate lookup"
        description="Sources are queried in order. The next source is used only if the previous one returns no match."
      />
      <ol className="border border-du-line bg-du-paper">
        {LOOKUP_TIERS.map((label, index) => (
          <li
            key={label}
            className="flex items-start gap-3 border-b border-du-line px-4 py-3 last:border-b-0"
          >
            <span className="w-6 text-sm tabular-nums text-du-gold-deep">{index + 1}</span>
            <span className={`text-sm ${index === active ? "text-du-purple font-semibold" : "text-du-muted"}`}>
              {label}
              {index === active ? " — searching" : index < active ? " — no exclusive match" : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
