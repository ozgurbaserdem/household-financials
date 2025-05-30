"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

const formatCurrencyNoDecimals = (amount: number): string => {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import type { CompoundInterestData } from "@/lib/compound-interest";

interface CompoundInterestChartProps {
  data: CompoundInterestData[];
  isVisible?: boolean;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    color: string;
    dataKey: string;
    fill: string;
    name: string;
    payload: CompoundInterestData;
    value: number;
  }>;
  label?: string;
}

export function CompoundInterestChart({
  data,
  isVisible = true,
}: CompoundInterestChartProps) {
  const t = useTranslations("compound_interest");

  if (!isVisible || data.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-gray-800/30 backdrop-blur-md p-4 rounded-lg border border-gray-600 shadow-lg space-y-2">
          <p className="text-white font-medium">
            {t("tooltip.year", { year: label || data.year })}
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-300">{t("tooltip.start_sum")}:</span>
              <span className="text-blue-400 font-medium">
                {formatCurrencyNoDecimals(data.startSum)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-300">
                {t("tooltip.accumulated_savings")}:
              </span>
              <span className="text-green-400 font-medium">
                {formatCurrencyNoDecimals(data.accumulatedSavings)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-300">
                {t("tooltip.compound_returns")}:
              </span>
              <span className="text-purple-400 font-medium">
                {formatCurrencyNoDecimals(data.compoundReturns)}
              </span>
            </div>
            <div className="border-t border-gray-600 pt-1 mt-2">
              <div className="flex justify-between items-center gap-4">
                <span className="text-white font-medium">
                  {t("tooltip.total_value")}:
                </span>
                <span className="text-white font-bold">
                  {formatCurrencyNoDecimals(data.totalValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(...data.map((d) => d.totalValue));
  const yAxisMax = Math.ceil((maxValue * 1.1) / 100000) * 100000;

  return (
    <Card gradient glass delay={0.3}>
      <CardHeader>
        <CardIcon>
          <TrendingUp className="w-6 h-6 text-purple-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle tabIndex={0} aria-label={t("chart.aria_title")}>
            {t("chart.title")}
          </CardTitle>
          <Text className="text-sm text-gray-300 mt-1">
            {t("chart.description")}
          </Text>
        </Box>
      </CardHeader>

      <CardContent>
        <div className="h-[400px] w-full" data-testid="compound-interest-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="year"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#6B7280" }}
                tickLine={{ stroke: "#6B7280" }}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#6B7280" }}
                tickLine={{ stroke: "#6B7280" }}
                tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                domain={[0, yAxisMax]}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(107, 114, 128, 0.2)" }}
              />

              {/* Start Sum (Bottom) */}
              <Bar
                dataKey="startSum"
                stackId="portfolio"
                fill="#3B82F6"
                name={t("legend.start_sum")}
                radius={[0, 0, 0, 0]}
              />

              {/* Accumulated Savings (Middle) */}
              <Bar
                dataKey="accumulatedSavings"
                stackId="portfolio"
                fill="#10B981"
                name={t("legend.accumulated_savings")}
                radius={[0, 0, 0, 0]}
              />

              {/* Compound Returns (Top) */}
              <Bar
                dataKey="compoundReturns"
                stackId="portfolio"
                fill="#8B5CF6"
                name={t("legend.compound_returns")}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <Box className="flex flex-wrap justify-center gap-6 mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <Text className="text-sm text-gray-300">
              {t("legend.start_sum")}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <Text className="text-sm text-gray-300">
              {t("legend.accumulated_savings")}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500"></div>
            <Text className="text-sm text-gray-300">
              {t("legend.compound_returns")}
            </Text>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
}
