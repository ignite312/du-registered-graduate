import { FLOW_STEPS } from "@/lib/constants";

export function Stepper({ current }: { current: number }) {
  return (
    <div className="relative left-1/2 mb-8 w-screen max-w-[100vw] -translate-x-1/2 px-4">
      <ol
        className="mx-auto grid max-w-5xl grid-cols-9 gap-x-2"
        aria-label="Application progress"
      >
        {FLOW_STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;
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
              <span className="block tabular-nums">{index + 1}.</span>
              <span className="block break-words hyphens-auto">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
