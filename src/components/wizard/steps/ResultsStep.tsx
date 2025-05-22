import React from "react";
import { useWizard } from "../WizardLayout";
import { ResultsTable } from "@/components/calculator/ResultsTable";
import { ExpenseBreakdown } from "@/components/charts/ExpenseBreakdown";
import { Forecast } from "@/components/calculator/Forecast";
import { Box } from "@/components/ui/box";

export function ResultsStep() {
  const { formData } = useWizard();
  return (
    <Box className="space-y-6">
      <ResultsTable calculatorState={formData} />
      <ExpenseBreakdown expenses={formData.expenses} />
      <Forecast calculatorState={formData} />
    </Box>
  );
}
