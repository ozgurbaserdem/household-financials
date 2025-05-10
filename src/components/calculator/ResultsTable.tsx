"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import React from "react";
import { cn } from "@/lib/utils";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface ResultsTableProps {
  results: CalculationResult[];
}

interface HeadCell {
  key: string;
  tooltipKey: string;
  className?: string;
  render?: (result: CalculationResult) => React.ReactNode;
  priority?: number; // Higher number = higher priority, will show on smaller screens
}

const HEAD_CELLS: HeadCell[] = [
  {
    key: "interest_rate",
    tooltipKey: "interest_rate_tooltip",
    render: (result) => formatPercentage(result.interestRate),
    priority: 1,
  },
  {
    key: "amortization",
    tooltipKey: "amortization_tooltip",
    render: (result) => formatPercentage(result.amortizationRate),
    priority: 2,
  },
  {
    key: "housing_cost",
    tooltipKey: "housing_cost_tooltip",
    render: (result) => formatCurrency(result.totalHousingCost),
    priority: 3,
  },
  {
    key: "total_expenses",
    tooltipKey: "total_expenses_tooltip",
    render: (result) => formatCurrency(result.totalExpenses),
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
          (result.income4 ?? 0)
      ),
    priority: 5,
  },
  {
    key: "remaining_savings",
    tooltipKey: "remaining_savings_tooltip",
    className: "font-bold",
    render: (result) => formatCurrency(result.remainingSavings),
    priority: 6,
  },
];

function ResultsTableHead() {
  const t = useTranslations("results");
  return (
    <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
      <TableRow>
        {HEAD_CELLS.map((cell) => (
          <TableHead
            key={cell.key}
            className={`font-semibold text-gray-700 dark:text-gray-200 ${
              cell.className ?? ""
            }`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Text>{t(cell.key)}</Text>
                </TooltipTrigger>
                <TooltipContent>{t(cell.tooltipKey)}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

function ResultsTableRow({ result }: { result: CalculationResult }) {
  return (
    <TableRow className="hover:bg-blue-50/40 transition-colors font-semibold">
      {HEAD_CELLS.map((cell) => (
        <TableCell
          key={cell.key}
          className={cn(
            cell.className,
            cell.key === "remaining_savings" && {
              "text-green-600 font-bold": result.remainingSavings >= 0,
              "text-red-600 font-bold": result.remainingSavings < 0,
            }
          )}
        >
          {cell.render ? cell.render(result) : null}
        </TableCell>
      ))}
    </TableRow>
  );
}

function MobileResultCard({ result }: { result: CalculationResult }) {
  const t = useTranslations("results");

  return (
    <Box className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
      <Box className="grid grid-cols-2 gap-3">
        {HEAD_CELLS.map((cell) => (
          <Box key={cell.key} className="flex flex-col">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {t(cell.key)}
            </Text>
            <Text
              className={cn(
                "font-medium",
                cell.key === "remaining_savings" && {
                  "text-green-600 font-bold": result.remainingSavings >= 0,
                  "text-red-600 font-bold": result.remainingSavings < 0,
                }
              )}
            >
              {cell.render ? cell.render(result) : null}
            </Text>
          </Box>
        ))}
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
        {/* Mobile view - card layout */}
        <Box className="md:hidden space-y-4">
          {results.map((result, index) => (
            <MobileResultCard key={index} result={result} />
          ))}
        </Box>

        {/* Desktop view - table layout */}
        <Box className="hidden md:block overflow-x-auto">
          <Table className="w-full text-sm">
            <ResultsTableHead />
            <TableBody>
              {results.map((result, index) => (
                <ResultsTableRow key={index} result={result} />
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}
