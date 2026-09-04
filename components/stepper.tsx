import { FLOW_STEPS } from "@/lib/constants";

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9" aria-label="Application progress">
      {FLOW_STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step.id}
            className={`border-t-2 pt-2 text-[11px] leading-tight ${
              active
                ? "border-du-purple text-du-purple font-semibold"
                : done
                  ? "border-du-gold text-du-gold-deep"
                  : "border-du-line text-du-muted"
            }`}
            aria-current={active ? "step" : undefined}
          >
            <span className="block tabular-nums">{index + 1}.</span>
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
