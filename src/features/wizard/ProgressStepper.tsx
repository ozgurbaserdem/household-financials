import React from "react";
import { Stepper } from "@/components/ui/step-indicator";

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
  return (
    <Stepper
      steps={steps}
      currentStep={currentStep}
      onStepClick={onStepClick}
      animate={true}
      showGlow={true}
      className="mb-8"
    />
  );
}
