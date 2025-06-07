"use client";

import { PieChart as PieChartIcon, TrendingDown } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { formatCurrencyNoDecimals } from "@/lib/formatting";
import { expenseCategories } from "@/data/expenseCategories";
import type { ExpensesByCategory, ChartDataPoint } from "@/lib/types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { ChartContainer } from "@/components/ui/ChartContainer";
import { FinancialCard } from "@/components/ui/FinancialCard";

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
        color: colors[idx % colors.length],
      };
    })
    .filter((data) => data.value > 0)
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <FinancialCard
        title={expenseBreakdownT("title")}
        icon={PieChartIcon}
        iconColor="text-indigo-400"
        delay={0.3}
        animate={!isMobile}
        ariaLabel={expenseBreakdownT("aria.title")}
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
    <FinancialCard
      title={expenseBreakdownT("title")}
      description={expenseBreakdownT("total", {
        amount: formatCurrencyNoDecimals(total),
      })}
      icon={PieChartIcon}
      iconColor="text-indigo-400"
      delay={0.3}
      animate={!isMobile}
      ariaLabel={expenseBreakdownT("aria.title")}
    >
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <ChartContainer
          title=""
          icon={PieChartIcon}
          height={300}
          animate={false}
        >
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
        </ChartContainer>

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
