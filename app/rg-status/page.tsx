"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Button, PageIntro } from "@/components/ui";
import { useAppState } from "@/lib/app-context";

export default function RgStatusPage() {
  return (
    <FlowGate require="authenticated">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Stepper current="rg-status" />
        <PageIntro
          kicker="Routing"
          title="Are you already a Registered Graduate (RG) member?"
          description="This answer selects Branch A (existing RG ID) or Branch B (new registration details). Category selection and payment stay optional on both paths."
        />
        <StatusForm />
      </div>
    </FlowGate>
  );
}

function StatusForm() {
  const { update } = useAppState();
  const router = useRouter();
  const [answer, setAnswer] = useState<"existing" | "new">("new");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answer === "existing") {
      update({ rgStatus: "existing", rgId: "", profileComplete: false, profile: null });
      router.push("/rg-id");
      return;
    }
    update({
      rgStatus: "new",
      rgId: "",
      academic: null,
      eligibility: "unchecked",
      eligibilityReasons: [],
      lookup: "idle",
      profile: null,
      profileComplete: false,
    });
    router.push("/academic-identification");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="flex cursor-pointer gap-3 border border-du-line bg-du-paper p-4 has-[:checked]:border-du-purple">
        <input
          type="radio"
          name="rg"
          checked={answer === "existing"}
          onChange={() => setAnswer("existing")}
          className="mt-1"
        />
        <span>
          <span className="block font-serif text-du-purple">Yes — I already have an RG ID</span>
          <span className="mt-1 block text-sm text-du-muted">
            Load the existing Registered Graduate profile. Missing details and payment can wait.
          </span>
        </span>
      </label>
      <label className="flex cursor-pointer gap-3 border border-du-line bg-du-paper p-4 has-[:checked]:border-du-purple">
        <input
          type="radio"
          name="rg"
          checked={answer === "new"}
          onChange={() => setAnswer("new")}
          className="mt-1"
        />
        <span>
          <span className="block font-serif text-du-purple">No — I am not yet an RG member</span>
          <span className="mt-1 block text-sm text-du-muted">
            Enter five academic keys. University records will pre-fill the enrollment form where a match exists.
          </span>
        </span>
      </label>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
}
