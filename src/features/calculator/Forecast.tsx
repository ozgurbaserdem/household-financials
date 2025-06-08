"use client";

import { motion } from "framer-motion";
import { HandCoins, TrendingUp } from "lucide-react";
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

import { Box } from "@/components/ui/Box";
import { CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/ModernCard";
import {
  calculateForecast,
  calculateLoanPayoffYears,
  validateForecastInputs,
  type ForecastData,
} from "@/lib/forecast";
import { formatCompactCurrency } from "@/lib/formatting";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
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
  const isTouchDevice = useIsTouchDevice();

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
          className="bg-gray-800/30 backdrop-blur-md p-4 rounded-lg border border-gray-600 shadow-lg space-y-2"
          initial={{ opacity: 0, scale: 0.9 }}
        >
          <p className="font-semibold mb-2 text-white">
            {t("year", { year: data.year })}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-300">
              {t("tooltip.remaining_loan")}:{" "}
              <CurrencyDisplay
                amount={data.remainingLoan}
                className="text-blue-400 font-semibold"
                showDecimals={false}
                variant="neutral"
              />
            </p>
            <p className="text-gray-300">
              {t("tooltip.yearly_cost")}:{" "}
              <CurrencyDisplay
                amount={data.yearlyCost}
                className="text-orange-400 font-semibold"
                showDecimals={false}
                variant="neutral"
              />
            </p>
            <p className="text-gray-300">
              {t("tooltip.monthly_cost")}:{" "}
              <CurrencyDisplay
                amount={data.monthlyCost}
                className="text-orange-300 font-semibold"
                showDecimals={false}
                variant="neutral"
              />
            </p>
            <p className="text-gray-300">
              {t("tooltip.monthly_income")}:{" "}
              <CurrencyDisplay
                amount={data.monthlyIncome}
                className="text-green-300 font-semibold"
                showDecimals={false}
                variant="neutral"
              />
            </p>
            <p className="text-gray-300">
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
    <Card glass gradient animate={!isTouchDevice} delay={0.4}>
      <CardHeader>
        <CardIcon>
          <HandCoins className="w-6 h-6 text-purple-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle aria-label={t("aria.title")} tabIndex={0}>
            {t("title")}
          </CardTitle>
          <motion.p
            animate={{ opacity: 1 }}
            className="text-sm text-gray-300 mt-1"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            {t("loan_payoff_in_years", { years: payoffYears })}
          </motion.p>
        </Box>
        <TrendingUp className="w-8 h-8 text-purple-400" />
      </CardHeader>

      <CardContent>
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
                  <stop offset={off} stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset={off} stopColor="#3b82f6" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gridGradient">
                  <stop offset="0%" stopColor="#374151" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#374151" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="url(#gridGradient)"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />

              <XAxis
                dataKey="year"
                interval={isMobile ? "preserveStartEnd" : 5}
                stroke="#374151"
                tick={{ fill: "#9CA3AF" }}
              />

              <YAxis
                stroke="#374151"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={formatCompactCurrency}
                width={35}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                animationDuration={1500}
                animationEasing="ease-out"
                dataKey="remainingLoan"
                fill="url(#loanGradient)"
                stroke="#8b5cf6"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
};
