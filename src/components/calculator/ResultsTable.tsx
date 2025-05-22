"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/calculations";
import type { CalculationResult, CalculatorState } from "@/lib/types";
import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Box } from "@/components/ui/box";
import { ResultCard } from "./ResultCard";
import { useDebouncedCalculation } from "@/lib/hooks/useDebouncedCalculation";

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
  priority?: number; // Higher number = higher priority, will show on smaller screens
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
  const { results } = useDebouncedCalculation({
    calculatorState,
    debounceMs: 300,
  });

  return (
    <Card>
      <CardHeader>
        <Box className="flex items-center gap-2">
          <BarChart3 className="icon-primary" />
          <CardTitle tabIndex={0} aria-label={t("aria.title")}>
            {t("title")}
          </CardTitle>
        </Box>
      </CardHeader>
      <CardContent>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, index) => (
            <ResultCard
              key={index}
              result={result}
              showTooltips={index === 0}
              HEAD_CELLS={HEAD_CELLS}
              currentBuffer={calculatorState.currentBuffer}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
