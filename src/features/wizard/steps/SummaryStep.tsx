import React from "react";

import { Summary } from "@/features/calculator/Summary";
import { useAppSelector } from "@/store/hooks";

import { useWizard } from "../WizardLayout";

export const SummaryStep = () => {
  const { setStepIndex } = useWizard();
  const income = useAppSelector((state) => state.income);
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const expenses = useAppSelector((state) => state.expenses);
  const expenseViewMode = useAppSelector((state) => state.expenseViewMode);
  const totalExpenses = useAppSelector((state) => state.totalExpenses);

  return (
    <Summary
      expenses={expenses}
      expenseViewMode={expenseViewMode}
      income={income}
      loanParameters={loanParameters}
      totalExpenses={totalExpenses}
      onEditStep={setStepIndex}
    />
  );
};
