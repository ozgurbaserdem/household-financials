"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import type { CalculatorState } from "@/lib/types";
import {
  calculateNetIncome,
  calculateNetIncomeSecond,
  formatCurrency,
} from "@/lib/calculations";
import { useMediaQuery } from "@/lib/useMediaQuery";

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

  const forecastData = useMemo(() => {
    if (!calculatorState.loanParameters.amount) return [];

    const initialLoan = calculatorState.loanParameters.amount;
    const amortizationRate = 0.03; // 3%
    const interestRate = 0.03; // 3%
    const salaryIncreaseRate = 0.03; // 3%

    // Calculate net monthly income for each person
    const netIncome1 = calculateNetIncome(calculatorState.grossIncome1 || 0);
    const netIncome2 = calculateNetIncome(calculatorState.grossIncome2 || 0);
    const netIncome3 = calculateNetIncomeSecond(
      calculatorState.grossIncome3 || 0
    );
    const netIncome4 = calculateNetIncomeSecond(
      calculatorState.grossIncome4 || 0
    );
    // Add child/other benefits and incomes (already net)
    const netMonthlyIncome =
      netIncome1 +
      netIncome2 +
      netIncome3 +
      netIncome4 +
      (calculatorState.childBenefits || 0) +
      (calculatorState.otherBenefits || 0) +
      (calculatorState.otherIncomes || 0);
    // Net yearly income for year 0
    const netYearlyIncome0 = netMonthlyIncome * 12;

    const data: ForecastData[] = [];
    let remainingLoan = initialLoan;
    let currentYear = 0;

    while (remainingLoan > 0 && currentYear < 50) {
      const yearlyCost = remainingLoan * (amortizationRate + interestRate);
      const monthlyCost = yearlyCost / 12;
      // Apply 3% increase to yearly net income
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

      remainingLoan -= remainingLoan * amortizationRate;
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
          <p className="font-semibold mb-2">Year {data.year}</p>
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
                }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                label={{
                  value: "Loan Amount",
                  angle: -90,
                  dx: isMobile ? -85 : -85,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="remainingLoan"
                stroke="#0284c7"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
