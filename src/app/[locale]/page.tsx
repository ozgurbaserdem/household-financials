"use client";

import React, { use } from "react";
import { useState } from "react";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";
import { ExpenseCategories } from "@/components/calculator/ExpenseCategories";
import { ResultsTable } from "@/components/calculator/ResultsTable";
import { ExpenseBreakdown } from "@/components/charts/ExpenseBreakdown";
import { calculateLoanScenarios } from "@/lib/calculations";
import { DEFAULT_EXPENSES } from "@/data/expenseCategories";
import type { CalculatorState, ExpensesByCategory } from "@/lib/types";
import ExportImportButtons from "@/components/export-import-buttons";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { Section } from "@/components/ui/section";
import ThemeSwitcher from "@/components/ThemeSwitcher";

function getFormValuesFromState(state: CalculatorState) {
  return {
    loanAmount: state.loanParameters.amount,
    interestRates: state.loanParameters.interestRates,
    amortizationRates: state.loanParameters.amortizationRates,
    income1: state.grossIncome1 ?? state.income1,
    income2: state.grossIncome2 ?? state.income2,
    income3: state.grossIncome3 ?? state.income3,
    income4: state.grossIncome4 ?? state.income4,
    runningCosts: state.runningCosts,
  };
}

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  use(params);

  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    loanParameters: {
      amount: 5000000,
      interestRates: [3.5],
      amortizationRates: [2],
    },
    income1: 30000,
    income2: 30000,
    income3: 0,
    income4: 0,
    grossIncome1: 30000,
    grossIncome2: 30000,
    grossIncome3: 0,
    grossIncome4: 0,
    runningCosts: 5000,
    expenses: DEFAULT_EXPENSES,
  });

  const [results, setResults] = useState<
    ReturnType<typeof calculateLoanScenarios>
  >([]);
  const handleFormSubmit = (state: Partial<CalculatorState>) => {
    const newState: CalculatorState = {
      ...calculatorState,
      ...state,
      expenses: calculatorState.expenses,
    };
    setCalculatorState(newState);
    setResults(calculateLoanScenarios(newState));
  };

  const handleExpensesChange = (expenses: ExpensesByCategory) => {
    const newState = {
      ...calculatorState,
      expenses,
    };
    setCalculatorState(newState);
    setResults(calculateLoanScenarios(newState));
  };

  const handleImport = (imported: Partial<CalculatorState>) => {
    const merged: CalculatorState = {
      loanParameters: imported.loanParameters ?? calculatorState.loanParameters,
      income1: imported.income1 ?? calculatorState.income1,
      income2: imported.income2 ?? calculatorState.income2,
      income3: imported.income3 ?? calculatorState.income3,
      income4: imported.income4 ?? calculatorState.income4,
      grossIncome1: imported.grossIncome1 ?? calculatorState.grossIncome1,
      grossIncome2: imported.grossIncome2 ?? calculatorState.grossIncome2,
      grossIncome3: imported.grossIncome3 ?? calculatorState.grossIncome3,
      grossIncome4: imported.grossIncome4 ?? calculatorState.grossIncome4,
      runningCosts: imported.runningCosts ?? calculatorState.runningCosts,
      expenses: imported.expenses ?? calculatorState.expenses,
    };
    setCalculatorState(merged);
    setResults(calculateLoanScenarios(merged));
  };

  const t = useTranslations();

  return (
    <Main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center">
      <Box className="w-full max-w-7xl px-2 sm:px-4 py-6 sm:py-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 sm:mb-10 text-center tracking-tight">
          {t("app.title")}
        </h1>
        <Box className="mb-6 flex flex-row sm:flex-row justify-end items-end gap-2">
          <ExportImportButtons
            state={calculatorState}
            onImport={handleImport}
          />
          <LanguageSwitcher />
          <ThemeSwitcher />
        </Box>
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          <Section className="col-span-2 md:col-span-1 w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-200 dark:border-gray-700">
            <CalculatorForm
              onSubmit={handleFormSubmit}
              values={getFormValuesFromState(calculatorState)}
            />
          </Section>
          <Section className="col-span-2 flex flex-col gap-4 sm:gap-8">
            <Box className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-200 dark:border-gray-700 w-full">
              <ResultsTable results={results} />
            </Box>
            <Box className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-200 dark:border-gray-700 w-full">
              <ExpenseBreakdown expenses={calculatorState.expenses} />
            </Box>
          </Section>
        </Box>
        <Section className="mt-6 sm:mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-200 dark:border-gray-700 w-full">
          <ExpenseCategories
            expenses={calculatorState.expenses}
            onChange={handleExpensesChange}
          />
        </Section>
      </Box>
    </Main>
  );
}
