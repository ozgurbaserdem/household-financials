import React, { useMemo } from "react";
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
  // Get calculator state for validation using individual selectors to avoid object creation
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const income = useAppSelector((state) => state.income);
  const expenses = useAppSelector((state) => state.expenses);
  const expenseViewMode = useAppSelector((state) => state.expenseViewMode);
  const totalExpenses = useAppSelector((state) => state.totalExpenses);

  // Memoize the calculator state object
  const calculatorState = useMemo(
    () => ({
      loanParameters,
      income,
      expenses,
      expenseViewMode,
      totalExpenses,
    }),
    [loanParameters, income, expenses, expenseViewMode, totalExpenses]
  );
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
