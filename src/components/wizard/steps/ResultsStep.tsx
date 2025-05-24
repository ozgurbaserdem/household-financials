import React from "react";
import { useAppSelector } from "@/store/hooks";
import { ResultsTable } from "@/components/calculator/ResultsTable";
import { ExpenseBreakdown } from "@/components/charts/ExpenseBreakdown";
import { Forecast } from "@/components/calculator/Forecast";
import { Box } from "@/components/ui/box";

export function ResultsStep() {
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const income = useAppSelector((state) => state.income);
  const expenses = useAppSelector((state) => state.expenses);
  const calculatorState = { loanParameters, income, expenses };

  return (
    <Box className="space-y-6">
      <ResultsTable calculatorState={calculatorState} />
      <ExpenseBreakdown expenses={expenses} />
      <Forecast calculatorState={calculatorState} />
    </Box>
  );
}
