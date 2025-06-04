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
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { motion } from "framer-motion";
import { ResultCard } from "./ResultCard";
import { useFocusOnMount } from "@/lib/hooks/use-focus-management";

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

export function ResultsTable({ calculatorState }: ResultsTableProps) {
  const t = useTranslations("results");
  const titleRef = useFocusOnMount();
  const results = useMemo(
    () => calculateLoanScenarios(calculatorState),
    [calculatorState]
  );

  // Check if there's only one scenario
  const isSingleScenario = results.length === 1;

  // Calculate summary statistics
  const bestScenario = results.reduce(
    (best, current) =>
      current.remainingSavings > best.remainingSavings ? current : best,
    results[0]
  );

  const worstScenario = results.reduce(
    (worst, current) =>
      current.remainingSavings < worst.remainingSavings ? current : worst,
    results[0]
  );

  // For single scenario, just show the one result
  // For multiple scenarios, show best first, worst second, then the rest
  const sortedResults = isSingleScenario
    ? results
    : [
        bestScenario,
        worstScenario,
        ...results.filter((r) => r !== bestScenario && r !== worstScenario),
      ];

  return (
    <Card gradient glass delay={0.3}>
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
            {t("comparing_scenarios", { count: results.length })}
          </motion.p>
        </Box>
      </CardHeader>

      <CardContent>
        {/* Summary Stats - Only show when there are multiple scenarios */}
        {!isSingleScenario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <Box className="p-4 glass rounded-xl border border-green-500/20">
              <Box className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <Text className="text-sm text-gray-300">
                  {t("best_option")}
                </Text>
              </Box>
              <Text className="text-2xl font-bold text-green-400 mt-2">
                {formatCurrency(bestScenario.remainingSavings)}
              </Text>
              <Text className="text-xs text-gray-300 mt-1">
                {t("at_interest_amortization", {
                  interest: formatPercentage(bestScenario.interestRate),
                  amortization: formatPercentage(bestScenario.amortizationRate),
                })}
              </Text>
            </Box>

            <Box className="p-4 glass rounded-xl border border-red-500/20">
              <Box className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <Text className="text-sm text-gray-300">
                  {t("worst_option")}
                </Text>
              </Box>
              <Text className="text-2xl font-bold text-red-400 mt-2">
                {formatCurrency(worstScenario.remainingSavings)}
              </Text>
              <Text className="text-xs text-gray-300 mt-1">
                {t("at_interest_amortization", {
                  interest: formatPercentage(worstScenario.interestRate),
                  amortization: formatPercentage(
                    worstScenario.amortizationRate
                  ),
                })}
              </Text>
            </Box>
          </motion.div>
        )}

        {/* Results Grid */}
        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <ResultCard
                result={result}
                showTooltips={index === 0}
                HEAD_CELLS={HEAD_CELLS}
                isBest={!isSingleScenario && result === bestScenario}
                isWorst={!isSingleScenario && result === worstScenario}
              />
            </motion.div>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
