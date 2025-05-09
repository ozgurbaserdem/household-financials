"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/calculations";
import { expenseCategories } from "@/data/expenseCategories";
import type { ExpensesByCategory } from "@/lib/types";
import { PieChartIcon } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";

interface ExpenseBreakdownProps {
  expenses: ExpensesByCategory;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const getColor = (index: number, total: number) =>
  `hsl(${(index * 360) / total}, 70%, 60%)`;

const CustomTooltip = ({
  payload,
}: {
  payload?: { value: number; name: string }[];
}) => {
  if (!payload || !payload.length) return null;
  return (
    <Box className="rounded-md px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {payload[0].name}: {formatCurrency(payload[0].value)}
      </p>
    </Box>
  );
};

export function ExpenseBreakdown({ expenses }: ExpenseBreakdownProps) {
  const t = useTranslations("expense_categories");
  const expenseBreakdownT = useTranslations("expense_breakdown");

  const chartData: ChartData[] = expenseCategories
    .map((category, idx) => {
      const categoryTotal = Object.values(expenses[category.id] || {}).reduce(
        (sum, amount) => sum + amount,
        0
      );
      return {
        name: t(`${category.id}.name`),
        value: categoryTotal,
        color: getColor(idx, expenseCategories.length),
      };
    })
    .filter((data) => data.value > 0);

  if (chartData.length === 0) {
    return (
      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center gap-3 pb-2 dark:bg-gray-900">
          <PieChartIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {expenseBreakdownT("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Box className="flex h-[300px] items-center justify-center text-muted-foreground dark:text-gray-400">
            {expenseBreakdownT("no_expenses")}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
      <CardHeader className="flex flex-row items-center gap-3 pb-2 dark:bg-gray-900">
        <PieChartIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {expenseBreakdownT("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Box className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  paddingTop: 12,
                  fontSize: 14,
                  color: "var(--tw-prose-body, #555)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
