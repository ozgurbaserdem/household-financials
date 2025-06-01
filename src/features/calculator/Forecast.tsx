"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import { HandCoins, TrendingUp } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import type { CalculatorState } from "@/lib/types";
import { formatCurrency, calculateTotalNetIncome } from "@/lib/calculations";
import { useMediaQuery } from "@/lib/useMediaQuery";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Box } from "@/components/ui/box";

const AreaChart = dynamic(() =>
  import("recharts").then((mod) => ({ default: mod.AreaChart }))
);

interface ForecastProps {
  calculatorState: CalculatorState;
}

interface ForecastData {
  year: number;
  remainingLoan: number;
  yearlyCost: number;
  monthlyCost: number;
  monthlyIncome: number;
  monthlySavings: number;
}

export function Forecast({ calculatorState }: ForecastProps) {
  const t = useTranslations("forecast");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}m`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    }
    return value.toString();
  };

  const forecastData = useMemo(() => {
    if (!calculatorState.loanParameters.amount) return [];

    const initialLoan = calculatorState.loanParameters.amount;
    const amortizationRate =
      calculatorState.loanParameters.amortizationRates[0] / 100 || 0.03;
    const interestRate =
      calculatorState.loanParameters.interestRates[0] / 100 || 0.03;
    const salaryIncreaseRate = 0.025;

    const netMonthlyIncome = calculateTotalNetIncome(calculatorState);
    const netYearlyIncome0 = netMonthlyIncome * 12;

    const data: ForecastData[] = [];
    let remainingLoan = initialLoan;
    let currentYear = 0;

    while (remainingLoan > 0 && currentYear < 50) {
      const yearlyAmortization = initialLoan * amortizationRate;
      const yearlyInterest = remainingLoan * interestRate;
      const yearlyCost = yearlyAmortization + yearlyInterest;
      const monthlyCost = yearlyCost / 12;
      const currentYearNetYearlyIncome =
        netYearlyIncome0 * Math.pow(1 + salaryIncreaseRate, currentYear);
      const monthlyIncome = currentYearNetYearlyIncome / 12;
      const monthlySavings = monthlyIncome - monthlyCost;

      data.push({
        year: currentYear,
        remainingLoan,
        yearlyCost,
        monthlyCost,
        monthlyIncome,
        monthlySavings,
      });

      remainingLoan -= yearlyAmortization;
      currentYear++;
    }

    return data;
  }, [calculatorState]);

  if (!calculatorState.loanParameters.amount || forecastData.length === 0) {
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/30 backdrop-blur-md p-4 rounded-lg border border-gray-600 shadow-lg space-y-2"
        >
          <p className="font-semibold mb-2 text-white">
            {t("year", { year: data.year })}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-300">
              {t("tooltip.remaining_loan")}:{" "}
              <span className="text-blue-400 font-semibold">
                {formatCurrency(data.remainingLoan)}
              </span>
            </p>
            <p className="text-gray-300">
              {t("tooltip.yearly_cost")}:{" "}
              <span className="text-orange-400 font-semibold">
                {formatCurrency(data.yearlyCost)}
              </span>
            </p>
            <p className="text-gray-300">
              {t("tooltip.monthly_cost")}:{" "}
              <span className="text-orange-300 font-semibold">
                {formatCurrency(data.monthlyCost)}
              </span>
            </p>
            <p className="text-gray-300">
              {t("tooltip.monthly_income")}:{" "}
              <span className="text-green-300 font-semibold">
                {formatCurrency(data.monthlyIncome)}
              </span>
            </p>
            <p className="text-gray-300">
              {t("tooltip.monthly_savings")}:{" "}
              <span
                className={`font-semibold ${data.monthlySavings >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {formatCurrency(data.monthlySavings)}
              </span>
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
    <Card gradient glass delay={0.4}>
      <CardHeader>
        <CardIcon>
          <HandCoins className="w-6 h-6 text-purple-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle tabIndex={0} aria-label={t("aria.title")}>
            {t("title")}
          </CardTitle>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-300 mt-1"
          >
            {t("loan_payoff_in_years", { years: forecastData.length })}
          </motion.p>
        </Box>
        <TrendingUp className="w-8 h-8 text-purple-400" />
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={isMobile ? "h-[300px] w-full" : "h-[400px] w-full"}
          aria-label={t("aria.graph")}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={forecastData}
              margin={
                isMobile
                  ? { top: 10, right: 5, left: 0, bottom: 10 }
                  : { top: 20, right: 10, left: 0, bottom: 20 }
              }
            >
              <defs>
                <linearGradient id="loanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset={off} stopColor="#3b82f6" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gridGradient">
                  <stop offset="0%" stopColor="#374151" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#374151" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="url(#gridGradient)"
                strokeOpacity={0.5}
              />

              <XAxis
                dataKey="year"
                interval={isMobile ? "preserveStartEnd" : 5}
                tick={{ fill: "#9CA3AF" }}
                stroke="#374151"
              />

              <YAxis
                tickFormatter={formatCompactCurrency}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                stroke="#374151"
                width={35}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="remainingLoan"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#loanGradient)"
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
