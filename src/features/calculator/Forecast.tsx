"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";

import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import {
  calculateForecast,
  calculateLoanPayoffYears,
  validateForecastInputs,
  type ForecastData,
} from "@/lib/forecast";
import { formatCompactCurrency } from "@/lib/formatting";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import type { CalculatorState } from "@/lib/types";

const AreaChart = dynamic(() =>
  import("recharts").then((mod) => ({ default: mod.AreaChart }))
);

interface ForecastProps {
  calculatorState: CalculatorState;
}

export const Forecast = ({ calculatorState }: ForecastProps) => {
  const t = useTranslations("forecast");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const forecastData = useMemo(() => {
    return calculateForecast(calculatorState);
  }, [calculatorState]);

  const payoffYears = useMemo(() => {
    return calculateLoanPayoffYears(calculatorState);
  }, [calculatorState]);

  if (!validateForecastInputs(calculatorState) || forecastData.length === 0) {
    return null;
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: ForecastData }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ForecastData;
      return (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-200/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-lg p-4 space-y-2"
          initial={{ opacity: 0, scale: 0.9 }}
        >
          <p className="font-semibold mb-2 text-foreground">
            {t("year", { year: data.year })}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              {t("tooltip.remaining_loan")}:{" "}
              <CurrencyDisplay
                amount={data.remainingLoan}
                className="text-primary font-semibold"
                showDecimals={false}
                variant="neutral"
              />
            </p>
            <p className="text-muted-foreground">
              {t("tooltip.yearly_cost")}:{" "}
              <CurrencyDisplay
                amount={data.yearlyCost}
                className="text-warning font-semibold"
                showDecimals={false}
                variant="neutral"
              />
            </p>
            <p className="text-muted-foreground">
              {t("tooltip.monthly_cost")}:{" "}
              <CurrencyDisplay
                amount={data.monthlyCost}
                className="text-warning font-semibold"
                showDecimals={false}
                variant="neutral"
              />
            </p>
            <p className="text-muted-foreground">
              {t("tooltip.monthly_income")}:{" "}
              <CurrencyDisplay
                amount={data.monthlyIncome}
                className="text-success font-semibold"
                showDecimals={false}
                variant="neutral"
              />
            </p>
            <p className="text-muted-foreground">
              {t("tooltip.monthly_savings")}:{" "}
              <CurrencyDisplay
                amount={data.monthlySavings}
                className="font-semibold"
                showDecimals={false}
                variant={data.monthlySavings >= 0 ? "positive" : "negative"}
              />
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const gradientOffset = () => {
    const dataMax = Math.max(...forecastData.map((i) => i.remainingLoan));
    const dataMin = Math.min(...forecastData.map((i) => i.remainingLoan));
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <div className="space-y-6">
      <motion.p
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.6 }}
      >
        {t("loan_payoff_in_years", { years: payoffYears })}
      </motion.p>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        aria-label={t("aria.graph")}
        className={isMobile ? "h-[300px] w-full" : "h-[400px] w-full"}
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: 0.5 }}
      >
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={forecastData}
            margin={
              isMobile
                ? { top: 10, right: 5, left: 0, bottom: 10 }
                : { top: 20, right: 10, left: 0, bottom: 20 }
            }
          >
            <defs>
              <linearGradient id="loanGradient" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset={off}
                  stopColor="rgb(59 130 246)"
                  stopOpacity={0.8}
                />
                <stop
                  offset={off}
                  stopColor="rgb(147 197 253)"
                  stopOpacity={0.4}
                />
              </linearGradient>
              <linearGradient id="gridGradient">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--border))"
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--border))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              opacity={0.3}
              stroke="rgb(148 163 184)"
              strokeDasharray="3 3"
            />

            <XAxis
              axisLine={{ stroke: "rgb(148 163 184)" }}
              dataKey="year"
              interval={isMobile ? "preserveStartEnd" : 5}
              tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
              tickLine={{ stroke: "rgb(148 163 184)" }}
            />

            <YAxis
              axisLine={{ stroke: "rgb(148 163 184)" }}
              tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
              tickFormatter={formatCompactCurrency}
              tickLine={{ stroke: "rgb(148 163 184)" }}
              width={35}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              animationDuration={1500}
              animationEasing="ease-out"
              dataKey="remainingLoan"
              fill="url(#loanGradient)"
              stroke="rgb(59 130 246)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
