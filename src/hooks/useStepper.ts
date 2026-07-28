import { useCallback, useState } from "react";
import type { StepperStep } from "../components/Stepper";

export function useStepper(steps: StepperStep[], initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = useCallback(() => {
    setCurrentStep((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentStep((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentStep(() => Math.max(0, Math.min(index, steps.length - 1)));
  }, [steps.length]);

  const canAdvance = steps[currentStep]?.canAdvance?.() ?? true;

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return { currentStep, next, prev, goTo, canAdvance, isFirst, isLast };
}
