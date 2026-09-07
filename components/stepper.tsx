"use client";

import {
  BRANCH_A_STEPS,
  BRANCH_B_STEPS,
  ENTRY_STEPS,
  OPTIONAL_STEPS,
} from "@/lib/constants";
import { useAppState } from "@/lib/app-context";

export function Stepper({ current }: { current: string }) {
  const { state } = useAppState();

  if (state.rgStatus === "existing" && state.rgId && current !== "rg-id") {
    return null;
  }
  const core =
    current === "membership" || current === "payment"
      ? [...(state.rgStatus === "existing" ? BRANCH_A_STEPS : BRANCH_B_STEPS), ...OPTIONAL_STEPS]
      : state.rgStatus === "existing"
        ? BRANCH_A_STEPS
        : state.rgStatus === "new"
          ? BRANCH_B_STEPS
          : ENTRY_STEPS;
  const steps = [...core];
  const index = Math.max(0, steps.findIndex((step) => step.id === current));

  return (
    <div className="relative left-1/2 mb-8 w-screen max-w-[100vw] -translate-x-1/2 px-4">
      <ol
        className="mx-auto grid max-w-5xl gap-x-2"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        aria-label="Application progress"
      >
        {steps.map((step, stepIndex) => {
          const done = stepIndex < index;
          const active = step.id === current;
          return (
            <li
              key={step.id}
              className={`min-w-0 border-t-2 pt-2 text-[10px] leading-snug sm:text-[11px] ${
                active
                  ? "border-du-purple font-semibold text-du-purple"
                  : done
                    ? "border-du-gold text-du-gold-deep"
                    : "border-du-line text-du-muted"
              }`}
              aria-current={active ? "step" : undefined}
            >
              <span className="block tabular-nums">{stepIndex + 1}.</span>
              <span className="block break-words hyphens-auto">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
