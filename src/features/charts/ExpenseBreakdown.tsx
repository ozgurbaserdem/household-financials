/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import { PieChart as PieChartIcon, TrendingDown } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { formatCurrency } from "@/lib/calculations";
import { expenseCategories } from "@/data/expenseCategories";
import type { ExpensesByCategory } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ExpenseBreakdownProps {
  expenses: ExpensesByCategory;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const colors = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ef4444", // red
  "#10b981", // emerald
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
  "#6366f1", // indigo
];

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
        color: colors[idx % colors.length],
      };
    })
    .filter((data) => data.value > 0)
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <Card gradient glass delay={0.3}>
        <CardHeader>
          <CardIcon>
            <PieChartIcon className="w-6 h-6 text-indigo-400" />
          </CardIcon>
          <CardTitle tabIndex={0} aria-label={expenseBreakdownT("aria.title")}>
            {expenseBreakdownT("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Box className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <TrendingDown className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                {expenseBreakdownT("no_expenses")}
              </p>
            </div>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="glass p-3 rounded-lg border border-gray-700">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-sm text-gray-300">
            {expenseBreakdownT("legend_label", {
              name: data.name,
              amount: formatCurrency(data.value),
              percentage,
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for small slices

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card gradient glass delay={0.3}>
      <CardHeader>
        <CardIcon>
          <PieChartIcon className="w-6 h-6 text-indigo-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle tabIndex={0} aria-label={expenseBreakdownT("aria.title")}>
            {expenseBreakdownT("title")}
          </CardTitle>
          <p className="text-sm text-gray-300 mt-1">
            {expenseBreakdownT("total", { amount: formatCurrency(total) })}
          </p>
        </Box>
      </CardHeader>

      <CardContent>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <Box className="flex flex-col justify-center space-y-2">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Box className="flex items-center gap-3">
                  <Box
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <Text className="text-sm text-gray-200">{item.name}</Text>
                </Box>
                <Text className="text-sm font-medium text-gray-200">
                  {expenseBreakdownT("legend_amount", {
                    amount: formatCurrency(item.value),
                  })}
                </Text>
              </div>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
