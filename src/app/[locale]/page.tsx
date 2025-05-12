"use client";

import React, { use } from "react";
import { useState } from "react";
import { ExpenseCategories } from "@/components/calculator/ExpenseCategories";
import { ResultsTable } from "@/components/calculator/ResultsTable";
import { ExpenseBreakdown } from "@/components/charts/ExpenseBreakdown";
import {
  calculateLoanScenarios,
  calculateNetIncome,
  calculateNetIncomeSecond,
} from "@/lib/calculations";
import { DEFAULT_EXPENSES } from "@/data/expenseCategories";
import type { CalculatorState, ExpensesByCategory } from "@/lib/types";
import ExportImportButtons from "@/components/ExportImportButtons";
import { useTranslations } from "next-intl";
import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { Section } from "@/components/ui/section";
import { Income } from "@/components/calculator/Income";
import { Loans } from "@/components/calculator/Loans";
import { Navbar } from "@/components/Navbar";
import { useMediaQuery } from "@/lib/useMediaQuery";

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
    childBenefits: 0,
    otherBenefits: 0,
    otherIncomes: 0,
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
  };

  const handleCalculate = () => {
    const netIncome1 = calculateNetIncome(calculatorState.grossIncome1 ?? 0);
    const netIncome2 = calculateNetIncome(calculatorState.grossIncome2 ?? 0);
    const netIncome3 = calculateNetIncomeSecond(
      calculatorState.grossIncome3 ?? 0
    );
    const netIncome4 = calculateNetIncomeSecond(
      calculatorState.grossIncome4 ?? 0
    );
    setResults(
      calculateLoanScenarios({
        ...calculatorState,
        income1: netIncome1,
        income2: netIncome2,
        income3: netIncome3,
        income4: netIncome4,
      })
    );
  };

  const handleExpensesChange = (expenses: ExpensesByCategory) => {
    const newState = {
      ...calculatorState,
      expenses,
    };
    setCalculatorState(newState);

    // Recalculate net income
    const netIncome1 = calculateNetIncome(newState.grossIncome1 ?? 0);
    const netIncome2 = calculateNetIncome(newState.grossIncome2 ?? 0);
    const netIncome3 = calculateNetIncomeSecond(newState.grossIncome3 ?? 0);
    const netIncome4 = calculateNetIncomeSecond(newState.grossIncome4 ?? 0);

    // Update results with new net income
    setResults(
      calculateLoanScenarios({
        ...newState,
        income1: netIncome1,
        income2: netIncome2,
        income3: netIncome3,
        income4: netIncome4,
      })
    );
  };

  const handleImport = (imported: Partial<CalculatorState>) => {
    const merged: CalculatorState = {
      loanParameters: imported.loanParameters ?? calculatorState.loanParameters,
      grossIncome1: imported.grossIncome1 ?? calculatorState.grossIncome1,
      grossIncome2: imported.grossIncome2 ?? calculatorState.grossIncome2,
      grossIncome3: imported.grossIncome3 ?? calculatorState.grossIncome3,
      grossIncome4: imported.grossIncome4 ?? calculatorState.grossIncome4,
      childBenefits: imported.childBenefits ?? calculatorState.childBenefits,
      otherBenefits: imported.otherBenefits ?? calculatorState.otherBenefits,
      otherIncomes: imported.otherIncomes ?? calculatorState.otherIncomes,
      expenses: imported.expenses ?? calculatorState.expenses,
      // These will be set on calculate
      income1: 0,
      income2: 0,
      income3: 0,
      income4: 0,
    };
    setCalculatorState(merged);
  };

  const t = useTranslations();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center">
      <Navbar />
      <Box className="w-full max-w-7xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10">
        <Box className="mb-5 flex flex-wrap justify-end items-end gap-2">
          <ExportImportButtons
            state={calculatorState}
            onImport={handleImport}
          />
        </Box>
        <Box className="grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-8 items-start">
          <Box className="flex flex-col gap-4 md:col-span-3">
            <Section className="section-card">
              <Income
                onSubmit={handleFormSubmit}
                values={{
                  income1: calculatorState.grossIncome1,
                  income2: calculatorState.grossIncome2,
                  income3: calculatorState.grossIncome3,
                  income4: calculatorState.grossIncome4,
                  childBenefits: calculatorState.childBenefits,
                  otherBenefits: calculatorState.otherBenefits,
                  otherIncomes: calculatorState.otherIncomes,
                }}
              />
            </Section>
            <Section className="section-card">
              <Loans
                onSubmit={handleFormSubmit}
                values={{
                  loanAmount: calculatorState.loanParameters.amount,
                  interestRates: calculatorState.loanParameters.interestRates,
                  amortizationRates:
                    calculatorState.loanParameters.amortizationRates,
                }}
              />
            </Section>
            {!isMobile && (
              <button
                type="button"
                onClick={handleCalculate}
                className="
                  text-white
                  bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900
                  hover:bg-gradient-to-br hover:from-sky-600 hover:via-sky-700 hover:to-sky-800
                  focus:ring-4 focus:outline-none focus:ring-sky-400 dark:focus:ring-sky-900
                  shadow-lg shadow-sky-800/50 dark:shadow-lg dark:shadow-sky-900/80
                  font-medium rounded-lg text-lg px-5 py-2.5 text-center mb-2 w-full
                  transition-all duration-150
                "
              >
                {t("app.calculate")}
              </button>
            )}
          </Box>
          <Section className="md:col-span-3 section-card">
            <ExpenseCategories
              expenses={calculatorState.expenses}
              onChange={handleExpensesChange}
            />
          </Section>
        </Box>
        {isMobile && (
          <button
            type="button"
            onClick={handleCalculate}
            className="
                  mt-4
                  text-white
                  bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900
                  hover:bg-gradient-to-br hover:from-sky-600 hover:via-sky-700 hover:to-sky-800
                  focus:ring-4 focus:outline-none focus:ring-sky-400 dark:focus:ring-sky-900
                  shadow-lg shadow-sky-800/50 dark:shadow-lg dark:shadow-sky-900/80
                  font-medium rounded-lg text-lg px-5 py-2.5 text-center mb-2 w-full
                  transition-all duration-150
                "
          >
            {t("app.calculate")}
          </button>
        )}
        <Section className="mt-6 sm:mt-8 flex flex-col gap-4">
          <Box className="section-card">
            <ResultsTable results={results} />
          </Box>
          <Box className="section-card">
            <ExpenseBreakdown expenses={calculatorState.expenses} />
          </Box>
        </Section>
      </Box>
    </Main>
  );
}
