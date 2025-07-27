import { TrendingDown, TrendingUp, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useMemo, useCallback } from "react";

import { Accordion } from "@/components/ui/Accordion";
import { Box } from "@/components/ui/Box";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { StepHeader } from "@/components/ui/StepHeader";
import { Text } from "@/components/ui/Text";
import { expenseCategories } from "@/data/expenseCategories";
import { getNetIncome } from "@/lib/calculations";
import { formatCurrencyNoDecimals, formatPercentage } from "@/lib/formatting";
import type { CalculatorState, ExpensesByCategory } from "@/lib/types";
import { hasValidLoan } from "@/lib/types";
import { cn } from "@/lib/utils/general";

import { AccordionSection } from "./AccordionSection";
import {
  safeCalculation,
  withCalculationErrorBoundary,
} from "./CalculationErrorBoundary";
import { INCOME_ICONS, SECTION_ICONS } from "./constants";
import { DataRow } from "./DataRow";
import { StatCard } from "./StatCard";

interface Row {
  id: string;
  label: string;
  value: number;
  net?: number;
  icon: React.ReactNode;
}

interface SummaryProps {
  income: CalculatorState["income"];
  loanParameters: CalculatorState["loanParameters"];
  expenses: ExpensesByCategory;
  expenseViewMode: CalculatorState["expenseViewMode"];
  totalExpenses: number;
  onEditStep: (stepIndex: number) => void;
}

const SummaryComponent = ({
  income,
  loanParameters,
  expenses,
  expenseViewMode,
  totalExpenses,
  onEditStep,
}: SummaryProps) => {
  const tSummary = useTranslations("summary");
  const tCategories = useTranslations("expense_categories");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const onEditStepCallback = useCallback(
    (stepIndex: number) => onEditStep(stepIndex),
    [onEditStep]
  );

  const incomeRows: Row[] = useMemo(() => {
    const createIncomeRowIfValid = (
      condition: boolean,
      id: string,
      label: string,
      value: number,
      iconKey: keyof typeof INCOME_ICONS,
      net?: number
    ): Row | undefined => {
      return condition
        ? {
            id,
            label,
            value,
            net,
            icon: INCOME_ICONS[iconKey],
          }
        : undefined;
    };

    return [
      createIncomeRowIfValid(
        true,
        "income1",
        tSummary("income1"),
        income.income1,
        "income1",
        safeCalculation(
          () =>
            getNetIncome(
              income.income1,
              false,
              income.selectedKommun,
              income.includeChurchTax
            ),
          0
        )
      ),
      createIncomeRowIfValid(
        income.numberOfAdults === "2",
        "income2",
        tSummary("income2"),
        income.income2,
        "income2",
        safeCalculation(
          () =>
            getNetIncome(
              income.income2,
              false,
              income.selectedKommun,
              income.includeChurchTax
            ),
          0
        )
      ),
      createIncomeRowIfValid(
        income.secondaryIncome1 > 0,
        "secondaryIncome1",
        tSummary("secondaryIncome1"),
        income.secondaryIncome1,
        "secondaryIncome1",
        safeCalculation(
          () =>
            getNetIncome(
              income.secondaryIncome1,
              true,
              undefined,
              undefined,
              income.secondaryIncomeTaxRate
            ),
          0
        )
      ),
      createIncomeRowIfValid(
        income.numberOfAdults === "2" && income.secondaryIncome2 > 0,
        "secondaryIncome2",
        tSummary("secondaryIncome2"),
        income.secondaryIncome2,
        "secondaryIncome2",
        safeCalculation(
          () =>
            getNetIncome(
              income.secondaryIncome2,
              true,
              undefined,
              undefined,
              income.secondaryIncomeTaxRate
            ),
          0
        )
      ),
      createIncomeRowIfValid(
        income.childBenefits > 0,
        "childBenefits",
        tSummary("childBenefits"),
        income.childBenefits,
        "childBenefits"
      ),
      createIncomeRowIfValid(
        income.otherBenefits > 0,
        "otherBenefits",
        tSummary("otherBenefits"),
        income.otherBenefits,
        "otherBenefits"
      ),
      createIncomeRowIfValid(
        income.otherIncomes > 0,
        "otherIncomes",
        tSummary("otherIncomes"),
        income.otherIncomes,
        "otherIncomes"
      ),
      createIncomeRowIfValid(
        income.currentBuffer > 0,
        "currentBuffer",
        tSummary("currentBuffer"),
        income.currentBuffer,
        "currentBuffer"
      ),
    ].filter((row): row is Row => row !== undefined);
  }, [income, tSummary]);

  const loanRows: Row[] = useMemo(
    () => [
      {
        id: "loanAmount",
        label: tSummary("loanAmount"),
        value: loanParameters.amount,
        icon: SECTION_ICONS.home,
      },
    ],
    [loanParameters.amount, tSummary]
  );

  const expenseTotals = useMemo(
    () =>
      expenseCategories.map((cat) => {
        const total = Number(expenses[cat.id]) || 0;
        return {
          id: cat.id,
          name: tCategories(`${cat.id}.name`, { default: cat.name }),
          total,
        };
      }),
    [expenses, tCategories]
  );

  const calculatedValues = useMemo(() => {
    const detailedExpensesTotal = expenseTotals.reduce(
      (sum, c) => sum + c.total,
      0
    );
    const currentExpensesTotal =
      expenseViewMode === "simple" ? totalExpenses : detailedExpensesTotal;
    const totalIncome = incomeRows
      .filter((row) => row.label !== tSummary("currentBuffer"))
      .reduce((sum, row) => sum + (row.net || row.value), 0);
    const hasLoan = hasValidLoan(loanParameters);
    const monthlyPayment = hasLoan
      ? loanParameters.amount *
        ((loanParameters.interestRate + loanParameters.amortizationRate) /
          100 /
          12)
      : 0;
    const monthlyBalance = totalIncome - monthlyPayment - currentExpensesTotal;

    return {
      detailedExpensesTotal,
      currentExpensesTotal,
      totalIncome,
      hasLoan,
      monthlyPayment,
      monthlyBalance,
    };
  }, [
    expenseTotals,
    expenseViewMode,
    totalExpenses,
    incomeRows,
    tSummary,
    loanParameters,
  ]);

  return (
    <div>
      <StepHeader step="summary">
        <div className="text-sm text-muted-foreground">
          {tSummary("review_before_calculating")}
        </div>
      </StepHeader>

      <div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            ariaLabel={tSummary("aria.net_income_card", {
              amount: formatCurrencyNoDecimals(calculatedValues.totalIncome),
            })}
            colorScheme="success"
            icon={SECTION_ICONS.wallet}
            label={tSummary("net_income")}
            periodText={tSummary("per_month")}
            value={calculatedValues.totalIncome}
            variant="success"
          />

          <StatCard
            ariaLabel={
              calculatedValues.hasLoan
                ? tSummary("aria.loan_payment_card", {
                    amount: formatCurrencyNoDecimals(
                      calculatedValues.monthlyPayment
                    ),
                  })
                : `${tSummary("loan_payment")}: ${tSummary("no_loan")}`
            }
            colorScheme="warning"
            displayText={
              calculatedValues.hasLoan ? undefined : tSummary("no_loan")
            }
            icon={SECTION_ICONS.handCoins}
            label={tSummary("loan_payment")}
            periodText={tSummary("per_month")}
            value={
              calculatedValues.hasLoan
                ? calculatedValues.monthlyPayment
                : undefined
            }
            variant="warning"
          />

          <StatCard
            ariaLabel={tSummary("aria.total_expenses_card", {
              amount: formatCurrencyNoDecimals(
                calculatedValues.currentExpensesTotal
              ),
            })}
            colorScheme="destructive"
            icon={SECTION_ICONS.receipt}
            label={tSummary("totalExpenses")}
            periodText={tSummary("per_month")}
            value={calculatedValues.currentExpensesTotal}
            variant="destructive"
          />
        </div>

        {/* Sections */}
        <Accordion
          className="space-y-4"
          type="multiple"
          value={expandedSections}
          onValueChange={setExpandedSections}
        >
          {/* Income Section */}
          <AccordionSection
            colorScheme="success"
            expandedSections={expandedSections}
            icon={SECTION_ICONS.badgeDollarSign}
            id="income"
            subtitle={
              <Box className="flex items-center gap-1">
                {income.numberOfAdults === "2" ? (
                  <Users className="w-3 h-3" />
                ) : (
                  SECTION_ICONS.user
                )}
                <span>
                  {tSummary("adults_count", {
                    count: Number.parseInt(income.numberOfAdults, 10),
                  })}
                </span>
              </Box>
            }
            title={tSummary("incomeTitle")}
            onEdit={() => onEditStepCallback(0)}
          >
            {incomeRows.map((row) => (
              <DataRow
                key={row.id}
                icon={row.icon}
                id={row.id}
                label={row.label}
                netLabel={tSummary("net")}
                netValue={row.net}
                showNet={row.net !== undefined}
                value={row.value}
              />
            ))}
          </AccordionSection>

          {/* Loans Section */}
          <AccordionSection
            colorScheme="warning"
            expandedSections={expandedSections}
            icon={SECTION_ICONS.handCoins}
            id="loans"
            title={tSummary("loansTitle")}
            onEdit={() => onEditStepCallback(1)}
          >
            {calculatedValues.hasLoan ? (
              <>
                {loanRows.map((row) => (
                  <DataRow
                    key={row.id}
                    icon={row.icon}
                    id={row.id}
                    label={row.label}
                    value={row.value}
                  />
                ))}
                <DataRow
                  displayValue={formatPercentage(loanParameters.interestRate)}
                  icon={SECTION_ICONS.trendingUp}
                  id="interestRate"
                  label={tSummary("interestRates")}
                />
                <DataRow
                  displayValue={formatPercentage(
                    loanParameters.amortizationRate
                  )}
                  icon={SECTION_ICONS.receipt}
                  id="amortizationRate"
                  label={tSummary("amortizationRates")}
                />
              </>
            ) : (
              <Text className="text-sm text-muted-foreground text-center py-4">
                {tSummary("no_loan")}
              </Text>
            )}
          </AccordionSection>

          {/* Expenses Section */}
          <AccordionSection
            colorScheme="destructive"
            expandedSections={expandedSections}
            icon={SECTION_ICONS.list}
            id="expenses"
            title={tSummary("expensesTitle")}
            onEdit={() => onEditStepCallback(2)}
          >
            {expenseTotals.map((row) => (
              <DataRow
                key={row.id}
                showProgressBar
                icon={null}
                id={row.id}
                label={row.name}
                progressPercentage={
                  (row.total / calculatedValues.currentExpensesTotal) * 100
                }
                value={row.total}
              />
            ))}

            <Box className="flex justify-between items-center pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <Text className="font-semibold text-muted-foreground">
                {tSummary("totalExpenses")}
              </Text>
              <CurrencyDisplay
                amount={calculatedValues.currentExpensesTotal}
                className="font-bold text-lg text-foreground"
                showDecimals={false}
                variant="neutral"
              />
            </Box>
          </AccordionSection>
        </Accordion>

        {/* Summary Box */}
        <div
          aria-label={
            calculatedValues.monthlyBalance >= 0
              ? tSummary("aria.monthly_surplus_summary", {
                  amount: formatCurrencyNoDecimals(
                    calculatedValues.monthlyBalance
                  ),
                })
              : tSummary("aria.monthly_deficit_summary", {
                  amount: formatCurrencyNoDecimals(
                    calculatedValues.monthlyBalance
                  ),
                })
          }
          className="mt-6 p-3 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring shadow-sm"
          role="group"
          tabIndex={0}
        >
          <Box className="flex items-center gap-3">
            <Box
              className={cn(
                "p-2 rounded-lg flex-shrink-0",
                calculatedValues.monthlyBalance >= 0
                  ? "bg-green-500/10"
                  : "bg-red-500/10"
              )}
            >
              {calculatedValues.monthlyBalance >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
            </Box>
            <Box className="flex-1 text-left">
              <Text className="text-base text-foreground font-medium">
                {calculatedValues.monthlyBalance >= 0
                  ? tSummary("estimated_monthly_surplus")
                  : tSummary("estimated_monthly_deficit")}
              </Text>
            </Box>
            <Box className="flex-shrink-0">
              <CurrencyDisplay
                amount={calculatedValues.monthlyBalance}
                className="text-lg font-semibold"
                showDecimals={false}
                variant={
                  calculatedValues.monthlyBalance >= 0
                    ? "success"
                    : "destructive"
                }
              />
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export const Summary = React.memo(
  withCalculationErrorBoundary(SummaryComponent)
);
Summary.displayName = "Summary";
