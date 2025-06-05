import React from "react";
import { Stepper } from "@/components/ui/step-indicator";
import { useAppSelector } from "@/store/hooks";
import { getMaxAllowedStep } from "@/lib/validation/stepValidation";

interface ProgressStepperProps {
  steps: { label: string }[];
  currentStep: number;
  onStepClick?: (idx: number) => void;
}

export function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
}: ProgressStepperProps) {
  const calculatorState = useAppSelector((state) => state);
  const maxAllowedStep = getMaxAllowedStep(calculatorState);

  // Add disabled property to steps based on validation
  const stepsWithDisabled = steps.map((step, index) => ({
    ...step,
    disabled: index > maxAllowedStep,
  }));

  const handleStepClick = (index: number) => {
    // Only allow navigation to accessible steps
    if (index <= maxAllowedStep && onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <Stepper
      steps={stepsWithDisabled}
      currentStep={currentStep}
      onStepClick={handleStepClick}
      animate={true}
      showGlow={true}
      className="mb-8"
    />
  );
}
