import React from "react";
import { Box } from "@/components/ui/box";

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
    <Box className="flex items-center justify-between gap-2 w-full">
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <Box className="flex-1 flex flex-col items-center">
            <button
              type="button"
              className={`rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 transition-colors ${
                idx === currentStep
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-900 text-gray-500 border-gray-300 dark:border-gray-700"
              }`}
              onClick={() => onStepClick && onStepClick(idx)}
              aria-current={idx === currentStep ? "step" : undefined}
              aria-label={step.label}
            >
              {idx + 1}
            </button>
            <span
              className={`mt-2 text-xs text-center ${idx === currentStep ? "font-semibold text-blue-600" : "text-gray-500 dark:text-gray-400"}`}
            >
              {step.label}
            </span>
          </Box>
          {idx < steps.length - 1 && (
            <Box className="hidden md:block flex-1 h-1 bg-gray-300 dark:bg-gray-700 mx-1 rounded-full" />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}
