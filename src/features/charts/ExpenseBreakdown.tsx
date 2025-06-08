"use client";

import { PieChart as PieChartIcon, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

import { Box } from "@/components/ui/Box";
import { FinancialCard } from "@/components/ui/FinancialCard";
import { Text } from "@/components/ui/Text";
import { expenseCategories } from "@/data/expenseCategories";
import { formatCurrencyNoDecimals } from "@/lib/formatting";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import type { ExpensesByCategory, ChartDataPoint } from "@/lib/types";

interface ExpenseBreakdownProps {
  expenses: ExpensesByCategory;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const chartColors = [
  "#3b82f6", // blue-500
  "#8b5cf6", // purple-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#10b981", // emerald-500
  "#f97316", // orange-500
  "#06b6d4", // cyan-500
  "#ec4899", // pink-500
  "#84cc16", // lime-500
  "#6366f1", // indigo-500
];

export const ExpenseBreakdown = ({ expenses }: ExpenseBreakdownProps) => {
  const t = useTranslations("expense_categories");
  const expenseBreakdownT = useTranslations("expense_breakdown");
  const isMobile = useIsTouchDevice();

  const chartData: ChartDataPoint[] = expenseCategories
    .map((category, idx) => {
      const categoryTotal = Number(expenses[category.id]) || 0;
      return {
        name: t(`${category.id}.name`),
        value: categoryTotal,
        color: chartColors[idx % chartColors.length],
      };
    })
    .filter((data) => data.value > 0)
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <FinancialCard
        animate={!isMobile}
        ariaLabel={expenseBreakdownT("aria.title")}
        delay={0.3}
        icon={PieChartIcon}
        iconColor="text-indigo-400"
        title={expenseBreakdownT("title")}
      >
        <Box className="flex h-[300px] items-center justify-center">
          <div className="text-center">
            <TrendingDown className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">{expenseBreakdownT("no_expenses")}</p>
          </div>
        </Box>
      </FinancialCard>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="glass p-3 rounded-lg border border-gray-700">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-sm text-gray-300">
            {expenseBreakdownT("legend_label", {
              name: data.name,
              amount: formatCurrencyNoDecimals(data.value),
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
  }: LabelProps) => {
    if (percent < 0.05) return null; // Don't show labels for small slices

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        className="text-sm font-medium"
        dominantBaseline="central"
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        x={x}
        y={y}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <FinancialCard
      animate={!isMobile}
      ariaLabel={expenseBreakdownT("aria.title")}
      delay={0.3}
      description={expenseBreakdownT("total", {
        amount: formatCurrencyNoDecimals(total),
      })}
      icon={PieChartIcon}
      iconColor="text-indigo-400"
      title={expenseBreakdownT("title")}
    >
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <Box className="flex items-center justify-center h-[300px]">
          <PieChart height={300} width={300}>
            <Pie
              animationBegin={0}
              animationDuration={800}
              cx="50%"
              cy="50%"
              data={chartData}
              dataKey="value"
              fill="#8884d8"
              label={renderCustomizedLabel}
              labelLine={false}
              outerRadius={100}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </Box>

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
                  amount: formatCurrencyNoDecimals(item.value),
                })}
              </Text>
            </div>
          ))}
        </Box>
      </Box>
    </FinancialCard>
  );
};
