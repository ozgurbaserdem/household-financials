"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/calculations";
import type { CalculationResult } from "@/lib/types";
import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { AnimatedScramble } from "@/components/bubba-ui/animated-scramble";

interface ResultsTableProps {
  results: CalculationResult[];
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
    render: (result) =>
      formatCurrency(
        result.income1 +
          result.income2 +
          (result.income3 ?? 0) +
          (result.income4 ?? 0) +
          (result.childBenefits ?? 0) +
          (result.otherBenefits ?? 0) +
          (result.otherIncomes ?? 0)
      ),
    getRawValue: (result) =>
      result.income1 +
      result.income2 +
      (result.income3 ?? 0) +
      (result.income4 ?? 0) +
      (result.childBenefits ?? 0) +
      (result.otherBenefits ?? 0) +
      (result.otherIncomes ?? 0),
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

function ResultCard({
  result,
  showTooltips,
}: {
  result: CalculationResult;
  showTooltips: boolean;
}) {
  const t = useTranslations("results");
  const [showAnimation, setShowAnimation] = useState(false);
  const gridOrder = [
    "interest_rate",
    "amortization",
    "housing_cost",
    "total_expenses",
    "total_income",
    "remaining_savings",
  ];

  // Tooltip open state for click (only for first card)
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  useEffect(() => {
    // Trigger animation after component mounts
    setShowAnimation(true);
  }, []);

  const renderValue = (cell: HeadCell, result: CalculationResult) => {
    if (!cell.render) return null;
    if (!cell.getRawValue || !cell.format) return cell.render(result);
    const rawValue = cell.getRawValue(result);
    if (typeof rawValue !== "number" || isNaN(rawValue))
      return cell.render(result);
    if (showAnimation) {
      return (
        <AnimatedScramble
          value={rawValue}
          className={cn(
            cell.key === "remaining_savings" && {
              "text-green-600 dark:text-green-400":
                result.remainingSavings >= 0,
              "text-red-600 dark:text-red-400": result.remainingSavings < 0,
            }
          )}
          format={cell.format}
        />
      );
    }
    return cell.format(rawValue);
  };

  return (
    <Box className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
      <Box className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
        {gridOrder.map((key, idx) => {
          const cell = HEAD_CELLS.find((c) => c.key === key);
          if (!cell) return null;
          return (
            <Box key={cell.key} className="flex flex-col">
              {showTooltips ? (
                <TooltipProvider>
                  <Tooltip
                    open={openIndex === idx}
                    onOpenChange={(o) => setOpenIndex(o ? idx : null)}
                  >
                    <TooltipTrigger asChild>
                      <Text
                        className="text-sm text-gray-500 dark:text-gray-400 cursor-help"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenIndex(openIndex === idx ? null : idx);
                        }}
                        onMouseLeave={() => setOpenIndex(null)}
                        onBlur={() => setOpenIndex(null)}
                      >
                        {t(cell.key)}
                      </Text>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      sideOffset={-12}
                      className={`w-48 ${idx === 0 ? "translate-x-[-70px]" : "translate-x-[-40px]"}`}
                    >
                      {t(cell.tooltipKey)}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {t(cell.key)}
                </Text>
              )}
              <Text
                className={cn(
                  "font-medium",
                  cell.key === "remaining_savings" && {
                    "text-green-600 dark:text-green-400 font-bold":
                      result.remainingSavings >= 0,
                    "text-red-600 dark:text-red-400 font-bold":
                      result.remainingSavings < 0,
                  }
                )}
              >
                {renderValue(cell, result)}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export function ResultsTable({ results }: ResultsTableProps) {
  const t = useTranslations("results");

  return (
    <Card>
      <CardHeader>
        <BarChart3 className="icon-primary" />
        <CardTitle tabIndex={0} aria-label={t("aria.title")}>
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Responsive grid of cards for all screen sizes, 2 per row on desktop */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, index) => (
            <ResultCard
              key={index}
              result={result}
              showTooltips={index === 0}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
