import { useCallback, useMemo, useState } from "react";
import type { StepperStep } from "../components/Stepper";

export function useStepper(steps: StepperStep[], initialStep = 0) {
  const clamp = useCallback(
    (i: number) => (steps.length === 0 ? 0 : Math.max(0, Math.min(i, steps.length - 1))),
    [steps.length],
  );

  // We hold the user's "intended" step in state, but always render the
  // clamped value. If steps shrinks after a re-render, the rendered
  // step is silently clamped without us having to call setState in an
  // effect (which the React linter rightly flags as a cascading
  // render).
  const [requestedStep, setRequestedStep] = useState(() => clamp(initialStep));
  const currentStep = useMemo(() => clamp(requestedStep), [clamp, requestedStep]);

  const canAdvanceCurrent = steps[currentStep]?.canAdvance?.() ?? true;

  const next = useCallback(() => {
    if (!canAdvanceCurrent) return;
    setRequestedStep((i) => clamp(i + 1));
  }, [canAdvanceCurrent, clamp]);

  const prev = useCallback(() => {
    setRequestedStep((i) => clamp(i - 1));
  }, [clamp]);

  const goTo = useCallback(
    (index: number) => {
      // Only allow jumping to a step that has already been completed
      // (or to the current one). The Stepper component also enforces
      // this on click; we repeat it here so programmatic goTo() calls
      // can't bypass the gate.
      const target = clamp(index);
      if (target <= currentStep) {
        setRequestedStep(target);
      }
    },
    [currentStep, clamp],
  );

  return {
    currentStep,
    next,
    prev,
    goTo,
    canAdvance: canAdvanceCurrent,
    isFirst: currentStep === 0,
    isLast: steps.length === 0 || currentStep === steps.length - 1,
  };
}
