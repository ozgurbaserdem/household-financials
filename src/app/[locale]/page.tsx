"use client";

import React, { use } from "react";
import { useState } from "react";
import { ExpenseCategories } from "@/components/calculator/ExpenseCategories";
import { ResultsTable } from "@/components/calculator/ResultsTable";
import { ExpenseBreakdown } from "@/components/charts/ExpenseBreakdown";
import { calculateIncomeWithTax } from "@/lib/calculations";
import { DEFAULT_EXPENSES } from "@/data/expenseCategories";
import type { CalculatorState, ExpensesByCategory } from "@/lib/types";
import type { IncomeFormValues } from "@/components/calculator/Income";
import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { Section } from "@/components/ui/section";
import { Income } from "@/components/calculator/Income";
import { Loans } from "@/components/calculator/Loans";
import { Forecast } from "@/components/calculator/Forecast";
import { Navbar } from "@/components/Navbar";

// Utility: true if any expense > 0
function hasAnyExpense(expenses: ExpensesByCategory): boolean {
  return Object.values(expenses).some((categoryObj) =>
    Object.values(categoryObj).some((amount) => amount > 0)
  );
}

// Utility: true if any income field > 0
function hasAnyIncome(state: CalculatorState): boolean {
  return (
    state.income1.gross > 0 ||
    state.income2.gross > 0 ||
    state.secondaryIncome1.gross > 0 ||
    state.secondaryIncome2.gross > 0 ||
    state.childBenefits > 0 ||
    state.otherBenefits > 0 ||
    state.otherIncomes > 0
  );
}

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  use(params);

  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
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
  });

  const handleIncomeChange = (values: IncomeFormValues) => {
    setCalculatorState((prev) => ({
      ...prev,
      income1: calculateIncomeWithTax(values.income1),
      income2: calculateIncomeWithTax(values.income2),
      secondaryIncome1: calculateIncomeWithTax(values.secondaryIncome1, true),
      secondaryIncome2: calculateIncomeWithTax(values.secondaryIncome2, true),
      childBenefits: values.childBenefits,
      otherBenefits: values.otherBenefits,
      otherIncomes: values.otherIncomes,
      currentBuffer: values.currentBuffer,
    }));
  };

  const handleExpensesChange = (expenses: ExpensesByCategory) => {
    setCalculatorState((prev) => ({
      ...prev,
      expenses,
    }));
  };

  return (
    <Main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center">
      <Navbar />
      <Box className="w-full max-w-7xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10">
        <Box className="grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-8 items-start">
          <Box className="flex flex-col gap-4 md:col-span-3">
            <Section className="section-card">
              <Income
                values={{
                  income1: calculatorState.income1.gross,
                  income2: calculatorState.income2.gross,
                  secondaryIncome1: calculatorState.secondaryIncome1.gross,
                  secondaryIncome2: calculatorState.secondaryIncome2.gross,
                  childBenefits: calculatorState.childBenefits,
                  otherBenefits: calculatorState.otherBenefits,
                  otherIncomes: calculatorState.otherIncomes,
                  currentBuffer: calculatorState.currentBuffer,
                }}
                onChange={handleIncomeChange}
              />
            </Section>

            <Section className="section-card">
              <Loans
                values={{
                  loanAmount: calculatorState.loanParameters.amount,
                  interestRates: calculatorState.loanParameters.interestRates,
                  amortizationRates:
                    calculatorState.loanParameters.amortizationRates,
                }}
                onChange={(values) => {
                  setCalculatorState((prev) => ({
                    ...prev,
                    loanParameters: {
                      amount: values.loanAmount,
                      interestRates: values.interestRates,
                      amortizationRates: values.amortizationRates,
                    },
                  }));
                }}
              />
            </Section>
          </Box>

          <Section className="md:col-span-3 section-card">
            <ExpenseCategories
              expenses={calculatorState.expenses}
              onChange={handleExpensesChange}
            />
          </Section>
        </Box>

        <Section className="mt-6 sm:mt-8 flex flex-col gap-4">
          {hasAnyIncome(calculatorState) && (
            <Box className="section-card">
              <ResultsTable calculatorState={calculatorState} />
            </Box>
          )}
          {hasAnyExpense(calculatorState.expenses) && (
            <Box className="section-card">
              <ExpenseBreakdown expenses={calculatorState.expenses} />
            </Box>
          )}
          <Forecast calculatorState={calculatorState} />
        </Section>
      </Box>
    </Main>
  );
}
