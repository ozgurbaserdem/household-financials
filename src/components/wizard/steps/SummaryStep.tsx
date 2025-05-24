import React, { useState } from "react";
import { useWizard } from "../WizardLayout";
import { useAppSelector } from "@/store/hooks";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, HandCoins, List } from "lucide-react";
import { formatCurrency, getNetIncome } from "@/lib/calculations";
import { expenseCategories } from "@/data/expenseCategories";
import { useTranslations } from "next-intl";

interface Row {
  label: string;
  value: number;
  net?: number;
}

export function SummaryStep() {
  const { setStepIndex } = useWizard();
  const income = useAppSelector((state) => state.income);
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const expenses = useAppSelector((state) => state.expenses);
  const tSummary = useTranslations("summary");
  const tCategories = useTranslations("expense_categories");
  const [showAllExpenses, setShowAllExpenses] = useState(false);

  const incomeRows: Row[] = [
    {
      label: tSummary("income1"),
      value: income.income1,
      net: getNetIncome(income.income1),
    },
    income.numberOfAdults === "2"
      ? {
          label: tSummary("income2"),
          value: income.income2,
          net: getNetIncome(income.income2),
        }
      : undefined,
    income.secondaryIncome1 > 0
      ? {
          label: tSummary("secondaryIncome1"),
          value: income.secondaryIncome1,
          net: getNetIncome(income.secondaryIncome1, true),
        }
      : undefined,
    income.numberOfAdults === "2" && income.secondaryIncome2 > 0
      ? {
          label: tSummary("secondaryIncome2"),
          value: income.secondaryIncome2,
          net: getNetIncome(income.secondaryIncome2, true),
        }
      : undefined,
    income.childBenefits > 0
      ? {
          label: tSummary("childBenefits"),
          value: income.childBenefits,
        }
      : undefined,
    income.otherBenefits > 0
      ? {
          label: tSummary("otherBenefits"),
          value: income.otherBenefits,
        }
      : undefined,
    income.otherIncomes > 0
      ? {
          label: tSummary("otherIncomes"),
          value: income.otherIncomes,
        }
      : undefined,
    income.currentBuffer > 0
      ? {
          label: tSummary("currentBuffer"),
          value: income.currentBuffer,
        }
      : undefined,
  ].filter((row): row is Row => row !== undefined);

  const loanRows: Row[] = [
    { label: tSummary("loanAmount"), value: loanParameters.amount },
    {
      label: tSummary("interestRates"),
      value: loanParameters.interestRates[0] ?? 0,
    },
    {
      label: tSummary("amortizationRates"),
      value: loanParameters.amortizationRates[0] ?? 0,
    },
  ];

  const expenseTotals = expenseCategories.map((cat) => {
    const total = Object.values(expenses[cat.id] || {}).reduce(
      (sum, v) => sum + v,
      0
    );
    return {
      id: cat.id,
      name: tCategories(`${cat.id}.name`, { default: cat.name }),
      total,
    };
  });
  const totalExpenses = expenseTotals.reduce((sum, c) => sum + c.total, 0);
  const nonZeroExpenses = expenseTotals.filter((e) => e.total > 0);
  const topExpenses = nonZeroExpenses
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
  const showExpand = nonZeroExpenses.length > 3;

  return (
    <Card>
      <CardHeader>
        <List className="icon-primary" />
        <CardTitle tabIndex={0} aria-label={tSummary("aria.title")}>
          {tSummary("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center gap-2">
              <BadgeDollarSign className="icon-primary" />
              <CardTitle>{tSummary("incomeTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Box className="space-y-2">
                <ul>
                  {incomeRows.map((row, i) => (
                    <li key={i} className="flex justify-between">
                      <Text className="text-gray-600 dark:text-gray-300">
                        {row.label}
                      </Text>
                      <Text className="font-medium">
                        {formatCurrency(row.value)}
                      </Text>
                    </li>
                  ))}
                </ul>
              </Box>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => setStepIndex(0)}
              >
                {tSummary("edit")}
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center gap-2">
              <HandCoins className="icon-primary" />
              <CardTitle>{tSummary("loansTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Box className="space-y-2">
                <ul>
                  {loanRows.map((row, i) => (
                    <li key={i} className="flex justify-between">
                      <Text className="text-gray-600 dark:text-gray-300">
                        {row.label}
                      </Text>
                      <Text className="font-medium">
                        {row.label === tSummary("loanAmount")
                          ? formatCurrency(row.value)
                          : `${row.value}%`}
                      </Text>
                    </li>
                  ))}
                </ul>
              </Box>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => setStepIndex(1)}
              >
                {tSummary("edit")}
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center gap-2">
              <List className="icon-primary" />
              <CardTitle>{tSummary("expensesTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Box className="space-y-2">
                <ul>
                  {(showAllExpenses ? nonZeroExpenses : topExpenses).map(
                    (row) => (
                      <li key={row.id} className="flex justify-between">
                        <Text className="text-gray-600 dark:text-gray-300">
                          {row.name}
                        </Text>
                        <Text className="font-medium">
                          {formatCurrency(row.total)}
                        </Text>
                      </li>
                    )
                  )}
                </ul>
                {showExpand && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowAllExpenses((v) => !v)}
                  >
                    {showAllExpenses
                      ? tSummary("showLess")
                      : tSummary("showAll")}
                  </Button>
                )}
                <Box className="flex justify-between border-t pt-2 mt-2">
                  <Text className="font-semibold">
                    {tSummary("totalExpenses")}
                  </Text>
                  <Text className="font-semibold">
                    {formatCurrency(totalExpenses)}
                  </Text>
                </Box>
              </Box>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => setStepIndex(2)}
              >
                {tSummary("edit")}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </CardContent>
    </Card>
  );
}
