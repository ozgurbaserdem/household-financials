"use client";

import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { expenseCategories } from "@/data/expenseCategories";
import { formatCurrencyNoDecimals } from "@/lib/formatting";
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
      <Box className="flex h-[300px] items-center justify-center">
        <div className="text-center">
          <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {expenseBreakdownT("no_expenses")}
          </p>
        </div>
      </Box>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/30 backdrop-blur-md p-4 rounded-lg border border-gray-600 shadow-lg space-y-2"
          initial={{ opacity: 0, scale: 0.9 }}
        >
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-sm text-gray-300">
            {expenseBreakdownT("legend_label", {
              name: data.name,
              amount: formatCurrencyNoDecimals(data.value),
              percentage,
            })}
          </p>
        </motion.div>
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
    <div className="space-y-6">
      <Text className="text-sm text-muted-foreground">
        {expenseBreakdownT("total", {
          amount: formatCurrencyNoDecimals(total),
        })}
      </Text>
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
                <Text className="text-sm text-foreground">{item.name}</Text>
              </Box>
              <Text className="text-sm font-medium text-foreground">
                {expenseBreakdownT("legend_amount", {
                  amount: formatCurrencyNoDecimals(item.value),
                })}
              </Text>
            </div>
          ))}
        </Box>
      </Box>
    </div>
  );
};
