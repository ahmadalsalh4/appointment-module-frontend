import { Check } from "lucide-react";

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  canAdvance?: () => boolean;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepChange?: (index: number) => void;
}

export default function Stepper({ steps, currentStep, onStepChange }: StepperProps) {
  return (
    <ol className="flex items-center w-full overflow-x-auto pb-2 gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = isCompleted && onStepChange;

        return (
          <li
            key={step.id}
            className="flex items-center gap-2 sm:gap-3 shrink-0"
            aria-current={isCurrent ? "step" : undefined}
          >
            <button
              type="button"
              onClick={() => isClickable && onStepChange?.(index)}
              disabled={!isClickable}
              className={`flex items-center gap-2 sm:gap-3 group ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold border-2 transition-colors ${
                  isCompleted
                    ? "bg-deep border-deep text-white"
                    : isCurrent
                      ? "border-deep text-deep bg-surface"
                      : "border-main/15 text-main/30 bg-surface"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span className="hidden sm:flex flex-col text-left">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isCurrent
                      ? "text-deep"
                      : isCompleted
                        ? "text-main/80"
                        : "text-main/30"
                  }`}
                >
                  Adım {index + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isCurrent ? "text-main" : isCompleted ? "text-main/70" : "text-main/30"
                  }`}
                >
                  {step.label}
                </span>
              </span>
            </button>
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`hidden sm:block h-0.5 w-8 lg:w-14 rounded-full transition-colors ${
                  isCompleted ? "bg-deep" : "bg-main/10"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
