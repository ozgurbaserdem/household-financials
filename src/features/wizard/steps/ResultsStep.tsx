import React from "react";

import { Results } from "@/features/calculator/Results";
import { useAppSelector } from "@/store/hooks";

export const ResultsStep = () => {
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const income = useAppSelector((state) => state.income);
  const expenses = useAppSelector((state) => state.expenses);
  const expenseViewMode = useAppSelector((state) => state.expenseViewMode);
  const totalExpenses = useAppSelector((state) => state.totalExpenses);

  const calculatorState = {
    loanParameters,
    income,
    expenses,
    expenseViewMode,
    totalExpenses,
  };

  return <Results calculatorState={calculatorState} />;
};
