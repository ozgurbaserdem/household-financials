"use client";

import { TrendingUp } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { ChartContainer, ChartLegend } from "@/components/ui/chart-container";
import { formatCurrencyNoDecimals } from "@/lib/formatting";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  ReferenceLine,
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

export const CompoundInterestChart = ({
  data,
  isVisible = true,
}: CompoundInterestChartProps) => {
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
            {data.userAge && (
              <span className="text-gray-300 text-sm ml-2">
                (Ålder: {data.userAge} år)
              </span>
            )}
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
            {data.withdrawal && data.withdrawal > 0 && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-300">Uttag:</span>
                <span className="text-red-400 font-medium">
                  -{formatCurrencyNoDecimals(data.withdrawal)}
                </span>
              </div>
            )}
            {data.currentMonthlySavings !== undefined && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-300">Månadssparande:</span>
                <span
                  className={`font-medium ${data.currentMonthlySavings === 0 ? "text-red-400" : "text-gray-400"}`}
                >
                  {data.currentMonthlySavings === 0
                    ? "Inga nya sparanden (uttag pågår)"
                    : `${formatCurrencyNoDecimals(data.currentMonthlySavings)}/mån`}
                </span>
              </div>
            )}
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

  // Check if there's a withdrawal in the data
  const withdrawalYear = data.find(
    (d) => d.withdrawal && d.withdrawal > 0
  )?.year;

  const legendItems = [
    { color: "#3B82F6", label: t("legend.start_sum") },
    { color: "#10B981", label: t("legend.accumulated_savings") },
    { color: "#8B5CF6", label: t("legend.compound_returns") },
  ];

  return (
    <ChartContainer
      title={t("chart.title")}
      description={t("chart.description")}
      icon={TrendingUp}
      iconColor="text-purple-400"
      height={400}
      testId="compound-interest-chart"
      ariaLabel={t("chart.aria_title")}
      delay={0.3}
      legend={<ChartLegend items={legendItems} />}
    >
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: -20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
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
          tickFormatter={(value: number) => {
            if (value >= 1000000) {
              return `${Math.round(value / 1000000)}m`;
            }
            if (value >= 1000) {
              return `${Math.round(value / 1000)}k`;
            }
            return value.toString();
          }}
          domain={[0, yAxisMax]}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(107, 114, 128, 0.2)" }}
        />

        {/* Stacked bars for accumulation phase, single bars for withdrawal phase */}
        <Bar
          dataKey="chartStartSum"
          stackId="portfolio"
          fill="#3B82F6"
          name={t("legend.start_sum")}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="chartSavings"
          stackId="portfolio"
          fill="#10B981"
          name={t("legend.accumulated_savings")}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="chartReturns"
          stackId="portfolio"
          fill="#8B5CF6"
          name={t("legend.compound_returns")}
          radius={[4, 4, 0, 0]}
        />
        {/* Single bar for withdrawal phase - overlays the stacked bars */}
        <Bar
          dataKey="withdrawalPhaseValue"
          fill="#F87171"
          name="Portföljvärde"
          radius={[4, 4, 0, 0]}
        />

        {/* Reference line for withdrawal year */}
        {withdrawalYear && (
          <ReferenceLine
            x={withdrawalYear}
            stroke="#EF4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ value: "Uttag", position: "top", fill: "#EF4444" }}
          />
        )}
      </BarChart>
    </ChartContainer>
  );
};
