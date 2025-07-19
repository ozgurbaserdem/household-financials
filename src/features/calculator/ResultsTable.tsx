"use client";

import { Percent, Calendar, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { Box } from "@/components/ui/Box";
import { FormLabel } from "@/components/ui/Form";
import { SliderInput } from "@/components/ui/SliderInput";
import { Text } from "@/components/ui/Text";
import {
  formatCurrency,
  formatPercentage,
  calculateLoanScenarios,
} from "@/lib/calculations";
import type { CalculationResult, CalculatorState } from "@/lib/types";
import { useAppDispatch } from "@/store/hooks";
import { updateLoanParameters } from "@/store/slices/calculatorSlice";

import { ResultCard } from "./ResultCard";

interface ResultsTableProps {
  calculatorState: CalculatorState;
}

interface HeadCell {
  key: string;
  tooltipKey: string;
  className?: string;
  render?: (result: CalculationResult) => React.ReactNode;
  getRawValue?: (result: CalculationResult) => number;
  format?: (value: number) => string;
  priority?: number;
}

const HEAD_CELLS: HeadCell[] = [
  {
    key: "interest_rate",
    tooltipKey: "interest_rate_tooltip",
    render: (result) => formatPercentage(result.interestRate),
    getRawValue: (result) => result.interestRate,
    format: formatPercentage,
    priority: 1,
  },
  {
    key: "amortization",
    tooltipKey: "amortization_tooltip",
    render: (result) => formatPercentage(result.amortizationRate),
    getRawValue: (result) => result.amortizationRate,
    format: formatPercentage,
    priority: 2,
  },
  {
    key: "housing_cost",
    tooltipKey: "housing_cost_tooltip",
    render: (result) => formatCurrency(result.totalHousingCost),
    getRawValue: (result) => result.totalHousingCost,
    format: formatCurrency,
    priority: 3,
  },
  {
    key: "total_expenses",
    tooltipKey: "total_expenses_tooltip",
    render: (result) => formatCurrency(result.totalExpenses),
    getRawValue: (result) => result.totalExpenses,
    format: formatCurrency,
    priority: 4,
  },
  {
    key: "total_income",
    tooltipKey: "total_income_tooltip",
    render: (result) => formatCurrency(result.totalIncome?.net ?? 0),
    getRawValue: (result) => result.totalIncome?.net ?? 0,
    format: formatCurrency,
    priority: 5,
  },
  {
    key: "remaining_savings",
    tooltipKey: "remaining_savings_tooltip",
    className: "font-bold",
    render: (result) => formatCurrency(result.remainingSavings),
    getRawValue: (result) => result.remainingSavings,
    format: formatCurrency,
    priority: 6,
  },
];

export const ResultsTable = ({ calculatorState }: ResultsTableProps) => {
  const dispatch = useAppDispatch();
  const t = useTranslations("results");
  const tLoan = useTranslations("loan_parameters");

  // Local state for rate adjustments
  const [interestRate, setInterestRate] = useState(
    calculatorState.loanParameters.interestRate
  );
  const [amortizationRate, setAmortizationRate] = useState(
    calculatorState.loanParameters.amortizationRate
  );

  // Refs for debounce timeouts (for Redux updates only)
  const interestRateTimeoutReference = useRef<NodeJS.Timeout | null>(null);
  const amortizationRateTimeoutReference = useRef<NodeJS.Timeout | null>(null);

  const results = useMemo(() => {
    // Create updated calculator state with real-time rates (immediate calculation)
    const updatedCalculatorState = {
      ...calculatorState,
      loanParameters: {
        ...calculatorState.loanParameters,
        interestRate,
        amortizationRate,
      },
    };
    return calculateLoanScenarios(updatedCalculatorState);
  }, [calculatorState, interestRate, amortizationRate]);

  // Now we always have a single scenario
  const result = results[0];

  // Debounced Redux update functions (only for persisting to global state)
  const debouncedUpdateInterestRate = useCallback(
    (value: number) => {
      if (interestRateTimeoutReference.current) {
        clearTimeout(interestRateTimeoutReference.current);
      }

      interestRateTimeoutReference.current = setTimeout(() => {
        // Only update Redux if value is valid (> 0)
        if (value > 0 && value <= 20) {
          dispatch(updateLoanParameters({ interestRate: value }));
        }
      }, 300); // Longer delay for Redux updates since calculations are immediate
    },
    [dispatch]
  );

  const debouncedUpdateAmortizationRate = useCallback(
    (value: number) => {
      if (amortizationRateTimeoutReference.current) {
        clearTimeout(amortizationRateTimeoutReference.current);
      }

      amortizationRateTimeoutReference.current = setTimeout(() => {
        // Only update Redux if value is valid (> 0)
        if (value > 0 && value <= 10) {
          dispatch(updateLoanParameters({ amortizationRate: value }));
        }
      }, 300); // Longer delay for Redux updates since calculations are immediate
    },
    [dispatch]
  );

  // Handle rate changes - immediate calculation, debounced Redux updates
  const handleInterestRateChange = (value: number) => {
    setInterestRate(value); // Immediate update for slider and calculations
    debouncedUpdateInterestRate(value); // Debounced Redux update
  };

  const handleAmortizationRateChange = (value: number) => {
    setAmortizationRate(value); // Immediate update for slider and calculations
    debouncedUpdateAmortizationRate(value); // Debounced Redux update
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (interestRateTimeoutReference.current) {
        clearTimeout(interestRateTimeoutReference.current);
      }
      if (amortizationRateTimeoutReference.current) {
        clearTimeout(amortizationRateTimeoutReference.current);
      }
    };
  }, []);

  return (
    <>
      <ResultCard
        HEAD_CELLS={HEAD_CELLS}
        isBest={false}
        isWorst={false}
        result={result}
        showTooltips={true}
      />

      {/* Loan Rate Adjustment Section - Only show if user has loan */}
      {calculatorState.loanParameters.hasLoan &&
        calculatorState.loanParameters.amount > 0 && (
          <div className="mt-0 pt-6">
            <Box className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Settings2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("adjust_rates_title")}
                </h3>
              </div>
              <Text className="text-sm text-muted-foreground">
                {t("adjust_rates_description")}
              </Text>
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Box className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-primary" />
                    {tLoan("interest_rate")}
                  </FormLabel>
                  <div className="space-y-3">
                    <SliderInput
                      max={20}
                      min={0.01}
                      step={0.01}
                      suffix="%"
                      value={interestRate || 3.5}
                      onChange={handleInterestRateChange}
                    />
                  </div>
                </Box>
                <Box className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary" />
                    {tLoan("amortization_rate")}
                  </FormLabel>
                  <div className="space-y-3">
                    <SliderInput
                      max={10}
                      min={0.01}
                      step={0.01}
                      suffix="%"
                      value={amortizationRate || 2}
                      onChange={handleAmortizationRateChange}
                    />
                  </div>
                </Box>
              </Box>
            </Box>
          </div>
        )}
    </>
  );
};
