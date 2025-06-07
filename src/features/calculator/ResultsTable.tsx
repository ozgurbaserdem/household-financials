"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import {
  formatCurrency,
  formatPercentage,
  calculateLoanScenarios,
} from "@/lib/calculations";
import type { CalculationResult, CalculatorState } from "@/lib/types";
import { BarChart3, Percent, Calendar, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Box } from "@/components/ui/box";
import { motion } from "framer-motion";
import { ResultCard } from "./ResultCard";
import { useFocusOnMount } from "@/lib/hooks/use-focus-management";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { FormLabel } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { useAppDispatch } from "@/store/hooks";
import { updateLoanParameters } from "@/store/slices/calculatorSlice";

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
  const titleRef = useFocusOnMount();
  const isMobile = useIsTouchDevice();

  // Local state for rate adjustments
  const [interestRate, setInterestRate] = useState(
    calculatorState.loanParameters.interestRate
  );
  const [amortizationRate, setAmortizationRate] = useState(
    calculatorState.loanParameters.amortizationRate
  );

  // Refs for debounce timeouts (for Redux updates only)
  const interestRateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const amortizationRateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      if (interestRateTimeoutRef.current) {
        clearTimeout(interestRateTimeoutRef.current);
      }

      interestRateTimeoutRef.current = setTimeout(() => {
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
      if (amortizationRateTimeoutRef.current) {
        clearTimeout(amortizationRateTimeoutRef.current);
      }

      amortizationRateTimeoutRef.current = setTimeout(() => {
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
      if (interestRateTimeoutRef.current) {
        clearTimeout(interestRateTimeoutRef.current);
      }
      if (amortizationRateTimeoutRef.current) {
        clearTimeout(amortizationRateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card gradient glass delay={0.3} animate={!isMobile} hover={false}>
      <CardHeader>
        <CardIcon>
          <BarChart3 className="w-6 h-6 text-blue-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle
            ref={titleRef}
            tabIndex={0}
            aria-label={t("aria.title")}
            className="focus:outline-none"
          >
            {t("title")}
          </CardTitle>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-300 mt-1"
          >
            {t("current_scenario")}
          </motion.p>
        </Box>
      </CardHeader>

      <CardContent>
        {/* Single Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ResultCard
            result={result}
            showTooltips={true}
            HEAD_CELLS={HEAD_CELLS}
            isBest={false}
            isWorst={false}
          />
        </motion.div>

        {/* Loan Rate Adjustment Section - Only show if user has loan */}
        {calculatorState.loanParameters.hasLoan &&
          calculatorState.loanParameters.amount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-0 pt-6"
            >
              <Box className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Settings2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200">
                    {t("adjust_rates_title")}
                  </h3>
                </div>
                <Text className="text-sm text-gray-400">
                  {t("adjust_rates_description")}
                </Text>
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <Box className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-blue-400" />
                      {tLoan("interest_rate")}
                    </FormLabel>
                    <div className="space-y-3">
                      <div className="relative flex items-center gap-4">
                        <input
                          type="range"
                          min={0.01}
                          max={20}
                          step={0.01}
                          value={interestRate || 3.5}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            handleInterestRateChange(value);
                          }}
                          className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                          style={{
                            background: `linear-gradient(to right, 
                              rgb(59 130 246) 0%, 
                              rgb(147 51 234) ${(((interestRate || 3.5) - 0.01) / (20 - 0.01)) * 100}%, 
                              rgb(55 65 81) ${(((interestRate || 3.5) - 0.01) / (20 - 0.01)) * 100}%, 
                              rgb(55 65 81) 100%)`,
                          }}
                        />
                        <div className="flex-shrink-0">
                          <div className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 w-20 text-center">
                            <Text className="text-sm font-semibold text-white">
                              {(interestRate || 3.5).toFixed(2)}%
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Box>
                  <Box className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      {tLoan("amortization_rate")}
                    </FormLabel>
                    <div className="space-y-3">
                      <div className="relative flex items-center gap-4">
                        <input
                          type="range"
                          min={0.01}
                          max={10}
                          step={0.01}
                          value={amortizationRate || 2}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            handleAmortizationRateChange(value);
                          }}
                          className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                          style={{
                            background: `linear-gradient(to right, 
                              rgb(59 130 246) 0%, 
                              rgb(147 51 234) ${(((amortizationRate || 2) - 0.01) / (10 - 0.01)) * 100}%, 
                              rgb(55 65 81) ${(((amortizationRate || 2) - 0.01) / (10 - 0.01)) * 100}%, 
                              rgb(55 65 81) 100%)`,
                          }}
                        />
                        <div className="flex-shrink-0">
                          <div className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 w-20 text-center">
                            <Text className="text-sm font-semibold text-white">
                              {(amortizationRate || 2).toFixed(2)}%
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          )}
      </CardContent>
    </Card>
  );
};
