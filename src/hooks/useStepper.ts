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

  const isGateValid = useCallback(
    (stepIndex: number): boolean => {
      // A step's gate is only meaningful for the CURRENT data — the
      // user can't pre-validate steps they've never reached.
      const idx = clamp(stepIndex);
      return steps[idx]?.canAdvance?.() ?? true;
    },
    [steps, clamp],
  );

  const next = useCallback(() => {
    // Re-check every gate up to and including the current step before
    // advancing. This catches the "user changed step 0 and step 1's
    // gate would now fail" case.
    for (let i = 0; i <= currentStep; i++) {
      if (!isGateValid(i)) return;
    }
    setRequestedStep((i) => clamp(i + 1));
  }, [currentStep, isGateValid, clamp]);

  const prev = useCallback(() => {
    setRequestedStep((i) => clamp(i - 1));
  }, [clamp]);

  const goTo = useCallback(
    (index: number) => {
      const target = clamp(index);
      // Only allow jumping backwards. Forward jumps are reserved for
      // `next()` so gate enforcement can't be bypassed. `target !==
      // currentStep` guards against the redundant "click the current
      // step" re-render.
      if (target < currentStep && target !== currentStep) {
        setRequestedStep(target);
      }
    },
    [currentStep, clamp],
  );

  // The "canAdvance" the consumer checks before rendering the next
  // button must reflect ALL gates up to the current step, not just the
  // current one — see comment above. `isGateValid` closes over `steps`
  // so listing it as a dep is sufficient.
  const canAdvance = useMemo(() => {
    for (let i = 0; i <= currentStep; i++) {
      if (!isGateValid(i)) return false;
    }
    return true;
  }, [currentStep, isGateValid]);

  return {
    currentStep,
    next,
    prev,
    goTo,
    canAdvance,
    isFirst: currentStep === 0,
    isLast: steps.length === 0 || currentStep === steps.length - 1,
  };
}