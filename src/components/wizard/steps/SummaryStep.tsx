import React, { useState } from "react";
import { useWizard } from "../WizardLayout";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, HandCoins, List } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";
import { expenseCategories } from "@/data/expenseCategories";
import { useTranslations } from "next-intl";

interface Row {
  label: string;
  value: number;
}

export function SummaryStep() {
  const { formData, setStepIndex } = useWizard();
  const tSummary = useTranslations("summary");
  const tCategories = useTranslations("expense_categories");
  const [showAllExpenses, setShowAllExpenses] = useState(false);

  const incomeRows: Row[] = [
    { label: tSummary("income1"), value: formData.income1.gross },
    formData.numberOfAdults === "2"
      ? { label: tSummary("income2"), value: formData.income2.gross }
      : undefined,
    formData.secondaryIncome1.gross > 0
      ? {
          label: tSummary("secondaryIncome1"),
          value: formData.secondaryIncome1.gross,
        }
      : undefined,
    formData.numberOfAdults === "2" && formData.secondaryIncome2.gross > 0
      ? {
          label: tSummary("secondaryIncome2"),
          value: formData.secondaryIncome2.gross,
        }
      : undefined,
    formData.childBenefits > 0
      ? { label: tSummary("childBenefits"), value: formData.childBenefits }
      : undefined,
    formData.otherBenefits > 0
      ? { label: tSummary("otherBenefits"), value: formData.otherBenefits }
      : undefined,
    formData.otherIncomes > 0
      ? { label: tSummary("otherIncomes"), value: formData.otherIncomes }
      : undefined,
    formData.currentBuffer > 0
      ? { label: tSummary("currentBuffer"), value: formData.currentBuffer }
      : undefined,
  ].filter((row): row is Row => row !== undefined);

  const loanRows: Row[] = [
    { label: tSummary("loanAmount"), value: formData.loanParameters.amount },
    {
      label: tSummary("interestRates"),
      value: formData.loanParameters.interestRates[0] ?? 0,
    },
    {
      label: tSummary("amortizationRates"),
      value: formData.loanParameters.amortizationRates[0] ?? 0,
    },
  ];

  const expenseTotals = expenseCategories.map((cat) => {
    const total = Object.values(formData.expenses[cat.id] || {}).reduce(
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
    <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <BadgeDollarSign className="icon-primary" />
          <CardTitle>{tSummary("incomeTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Box className="space-y-2">
            <ul>
              {incomeRows.map((row, i) => (
                <li key={i} className="flex justify-between">
                  <Text className="text-gray-600">{row.label}</Text>
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
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <HandCoins className="icon-primary" />
          <CardTitle>{tSummary("loansTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Box className="space-y-2">
            <ul>
              {loanRows.map((row, i) => (
                <li key={i} className="flex justify-between">
                  <Text className="text-gray-600">{row.label}</Text>
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
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <List className="icon-primary" />
          <CardTitle>{tSummary("expensesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Box className="space-y-2">
            <ul>
              {(showAllExpenses ? nonZeroExpenses : topExpenses).map((row) => (
                <li key={row.id} className="flex justify-between">
                  <Text className="text-gray-600">{row.name}</Text>
                  <Text className="font-medium">
                    {formatCurrency(row.total)}
                  </Text>
                </li>
              ))}
            </ul>
            {showExpand && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setShowAllExpenses((v) => !v)}
              >
                {showAllExpenses ? tSummary("showLess") : tSummary("showAll")}
              </Button>
            )}
            <Box className="flex justify-between border-t pt-2 mt-2">
              <Text className="font-semibold">{tSummary("totalExpenses")}</Text>
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
  );
}
