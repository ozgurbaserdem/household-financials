"use client";

import React, { use } from "react";
import { useState } from "react";
import { calculateIncomeWithTax } from "@/lib/calculations";
import { DEFAULT_EXPENSES } from "@/data/expenseCategories";
import type { CalculatorState } from "@/lib/types";
import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { Navbar } from "@/components/Navbar";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { IncomeStep } from "@/components/wizard/steps/IncomeStep";
import { LoansStep } from "@/components/wizard/steps/LoansStep";
import { ExpensesStep } from "@/components/wizard/steps/ExpensesStep";
import { SummaryStep } from "@/components/wizard/steps/SummaryStep";
import { ResultsStep } from "@/components/wizard/steps/ResultsStep";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  use(params);

  const [calculatorState] = useState<CalculatorState>({
    loanParameters: {
      amount: 0,
      interestRates: [3],
      amortizationRates: [3],
    },
    income1: calculateIncomeWithTax(0),
    income2: calculateIncomeWithTax(0),
    secondaryIncome1: calculateIncomeWithTax(0),
    secondaryIncome2: calculateIncomeWithTax(0),
    childBenefits: 0,
    otherBenefits: 0,
    otherIncomes: 0,
    expenses: DEFAULT_EXPENSES,
    currentBuffer: 0,
    numberOfAdults: "1",
  });

  return (
    <Main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center">
      <Navbar />
      <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10">
        <WizardLayout
          initialData={calculatorState}
          steps={[
            { label: "Income", component: <IncomeStep /> },
            { label: "Loans", component: <LoansStep /> },
            { label: "Expenses", component: <ExpensesStep /> },
            { label: "Summary", component: <SummaryStep /> },
            { label: "Results", component: <ResultsStep /> },
          ]}
        />
      </Box>
    </Main>
  );
}
