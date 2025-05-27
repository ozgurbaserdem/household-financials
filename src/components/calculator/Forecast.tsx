"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins } from "lucide-react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useMemo } from "react";
import type { CalculatorState } from "@/lib/types";
import { formatCurrency, calculateTotalNetIncome } from "@/lib/calculations";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const LineChart = dynamic(() =>
  import("recharts").then((mod) => ({ default: mod.LineChart }))
);
const ResponsiveContainer = dynamic(() =>
  import("recharts").then((mod) => ({ default: mod.ResponsiveContainer }))
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
  const { resolvedTheme } = useTheme();

  const axisColor = resolvedTheme === "dark" ? "#d1d5db" : "#4b5563";

  const forecastData = useMemo(() => {
    if (!calculatorState.loanParameters.amount) return [];

    const initialLoan = calculatorState.loanParameters.amount;
    const amortizationRate = 0.03; // 3%
    const interestRate = 0.03; // 3%
    const salaryIncreaseRate = 0.025; // 2.5%

    // Use utility to calculate net monthly income
    const netMonthlyIncome = calculateTotalNetIncome(calculatorState);
    // Net yearly income for year 0
    const netYearlyIncome0 = netMonthlyIncome * 12;

    const data: ForecastData[] = [];
    let remainingLoan = initialLoan;
    let currentYear = 0;

    while (remainingLoan > 0 && currentYear < 50) {
      const yearlyAmortization = initialLoan * amortizationRate;
      const yearlyInterest = remainingLoan * interestRate;
      const yearlyCost = yearlyAmortization + yearlyInterest;
      const monthlyCost = yearlyCost / 12;
      // Apply 2.5% increase to yearly net income
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

  if (!calculatorState.loanParameters.amount) {
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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold mb-2">{t("year", { year: data.year })}</p>
          <p className="text-sm">
            {t("tooltip.remaining_loan")}: {formatCurrency(data.remainingLoan)}
          </p>
          <p className="text-sm">
            {t("tooltip.yearly_cost")}: {formatCurrency(data.yearlyCost)}
          </p>
          <p className="text-sm">
            {t("tooltip.monthly_cost")}: {formatCurrency(data.monthlyCost)}
          </p>
          <p className="text-sm">
            {t("tooltip.monthly_income")}: {formatCurrency(data.monthlyIncome)}
          </p>
          <p className="text-sm">
            {t("tooltip.monthly_savings")}:{" "}
            {formatCurrency(data.monthlySavings)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="section-card">
      <CardHeader>
        <HandCoins className="icon-primary" />
        <CardTitle tabIndex={0} aria-label={t("aria.title")}>
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={isMobile ? "h-[250px] w-full" : "h-[400px] w-full"}
          aria-label={t("aria.graph")}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={
                isMobile
                  ? { top: 10, right: 5, left: 60, bottom: 10 }
                  : { top: 20, right: 30, left: 60, bottom: 20 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                interval={isMobile ? undefined : 0}
                label={{
                  value: "Years",
                  position: "insideBottom",
                  offset: -5,
                  fill: axisColor,
                }}
                tick={{ fill: axisColor }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                label={{
                  value: "Loan Amount",
                  angle: -90,
                  dx: isMobile ? -85 : -85,
                  fill: axisColor,
                }}
                tick={{ fill: axisColor }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="remainingLoan"
                stroke="#0284c7"
                strokeWidth={2}
                dot={false}
                data-points={JSON.stringify(forecastData)}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
