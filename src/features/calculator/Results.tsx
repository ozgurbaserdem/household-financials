import React, { useMemo } from "react";

import { calculateLoanScenarios } from "@/lib/calculations";
import { calculateWealthProjection } from "@/lib/compound-interest";
import type { CalculatorState, CalculationResult } from "@/lib/types";

import { CompoundInterestCTA } from "./components/CompoundInterestCTA";
import { ExpenseBreakdownCard } from "./components/ExpenseBreakdownCard";
import { LoanForecastCard } from "./components/LoanForecastCard";
import { ResultsHeader } from "./components/ResultsHeader";
import {
  getSafeArrayElement,
  CALCULATION_CONSTANTS,
} from "./constants/calculations";

interface ResultsProps {
  calculatorState: CalculatorState;
}

export const Results = React.memo(({ calculatorState }: ResultsProps) => {
  const { loanParameters, income, expenses } = calculatorState;

  // Memoized calculations for performance
  const loanScenarios = useMemo(
    () => calculateLoanScenarios(calculatorState),
    [calculatorState]
  );

  const scenario = useMemo(
    () =>
      getSafeArrayElement(
        loanScenarios,
        CALCULATION_CONSTANTS.DEFAULT_SCENARIO_INDEX,
        null as CalculationResult | null
      ),
    [loanScenarios]
  );

  const monthlySavings = useMemo(
    () =>
      scenario?.remainingSavings ??
      CALCULATION_CONSTANTS.DEFAULT_SAVINGS_AMOUNT,
    [scenario]
  );

  const currentBuffer = useMemo(
    () => income.currentBuffer ?? CALCULATION_CONSTANTS.DEFAULT_BUFFER_AMOUNT,
    [income.currentBuffer]
  );

  const projectedWealth = useMemo(
    () => calculateWealthProjection(monthlySavings, currentBuffer),
    [monthlySavings, currentBuffer]
  );

  return (
    <main
      aria-label="Budget calculation results"
      className="space-y-4 md:space-y-6"
    >
      <ResultsHeader calculatorState={calculatorState} />

      <ExpenseBreakdownCard expenses={expenses} />

      <LoanForecastCard
        calculatorState={calculatorState}
        loanParameters={loanParameters}
      />

      <CompoundInterestCTA
        currentBuffer={currentBuffer}
        monthlySavings={monthlySavings}
        projectedWealth={projectedWealth}
      />
    </main>
  );
});

Results.displayName = "Results";
