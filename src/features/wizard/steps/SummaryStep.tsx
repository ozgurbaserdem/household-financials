import {
  Baby,
  BadgeDollarSign,
  Briefcase,
  Edit3,
  HandCoins,
  Home,
  List,
  ListChecks,
  MoreHorizontal,
  PiggyBank,
  Receipt,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { StepHeader } from "@/components/ui/StepHeader";
import { Text } from "@/components/ui/Text";
import { expenseCategories } from "@/data/expenseCategories";
import { getNetIncome } from "@/lib/calculations";
import { formatCurrencyNoDecimals, formatPercentage } from "@/lib/formatting";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { hasValidLoan } from "@/lib/types";
import { cn } from "@/lib/utils/general";
import { useAppSelector } from "@/store/hooks";

import { useWizard } from "../WizardLayout";

interface Row {
  label: string;
  value: number;
  net?: number;
  icon: React.ReactNode;
}

export const SummaryStep = () => {
  const { setStepIndex } = useWizard();
  const income = useAppSelector((state) => state.income);
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const expenses = useAppSelector((state) => state.expenses);
  const expenseViewMode = useAppSelector((state) => state.expenseViewMode);
  const totalExpenses = useAppSelector((state) => state.totalExpenses);
  const tSummary = useTranslations("summary");
  const tCategories = useTranslations("expense_categories");
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const isMobile = useIsTouchDevice();

  const incomeIcons: Record<string, React.ReactNode> = {
    income1: <Briefcase className="w-4 h-4" />,
    income2: <Briefcase className="w-4 h-4" />,
    secondaryIncome1: <TrendingUp className="w-4 h-4" />,
    secondaryIncome2: <TrendingUp className="w-4 h-4" />,
    childBenefits: <Baby className="w-4 h-4" />,
    otherBenefits: <Receipt className="w-4 h-4" />,
    otherIncomes: <MoreHorizontal className="w-4 h-4" />,
    currentBuffer: <PiggyBank className="w-4 h-4" />,
  };

  const incomeRows: Row[] = [
    {
      label: tSummary("income1"),
      value: income.income1,
      net: getNetIncome(
        income.income1,
        false,
        income.selectedKommun,
        income.includeChurchTax
      ),
      icon: incomeIcons.income1,
    },
    income.numberOfAdults === "2"
      ? {
          label: tSummary("income2"),
          value: income.income2,
          net: getNetIncome(
            income.income2,
            false,
            income.selectedKommun,
            income.includeChurchTax
          ),
          icon: incomeIcons.income2,
        }
      : undefined,
    income.secondaryIncome1 > 0
      ? {
          label: tSummary("secondaryIncome1"),
          value: income.secondaryIncome1,
          net: getNetIncome(income.secondaryIncome1, true),
          icon: incomeIcons.secondaryIncome1,
        }
      : undefined,
    income.numberOfAdults === "2" && income.secondaryIncome2 > 0
      ? {
          label: tSummary("secondaryIncome2"),
          value: income.secondaryIncome2,
          net: getNetIncome(income.secondaryIncome2, true),
          icon: incomeIcons.secondaryIncome2,
        }
      : undefined,
    income.childBenefits > 0
      ? {
          label: tSummary("childBenefits"),
          value: income.childBenefits,
          icon: incomeIcons.childBenefits,
        }
      : undefined,
    income.otherBenefits > 0
      ? {
          label: tSummary("otherBenefits"),
          value: income.otherBenefits,
          icon: incomeIcons.otherBenefits,
        }
      : undefined,
    income.otherIncomes > 0
      ? {
          label: tSummary("otherIncomes"),
          value: income.otherIncomes,
          icon: incomeIcons.otherIncomes,
        }
      : undefined,
    income.currentBuffer > 0
      ? {
          label: tSummary("currentBuffer"),
          value: income.currentBuffer,
          icon: incomeIcons.currentBuffer,
        }
      : undefined,
  ].filter((row): row is Row => row !== undefined);

  // Get current interest and amortization rates
  const interestRate = loanParameters.interestRate;
  const amortizationRate = loanParameters.amortizationRate;

  const loanRows: Row[] = [
    {
      label: tSummary("loanAmount"),
      value: loanParameters.amount,
      icon: <Home className="w-4 h-4" />,
    },
  ];

  const expenseTotals = expenseCategories.map((cat) => {
    const total = Number(expenses[cat.id]) || 0;
    return {
      id: cat.id,
      name: tCategories(`${cat.id}.name`, { default: cat.name }),
      total,
    };
  });

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
    ? loanParameters.amount * ((interestRate + amortizationRate) / 100 / 12)
    : 0;

  const nonZeroExpenses = expenseTotals.filter((e) => e.total > 0);
  const topExpenses = nonZeroExpenses
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
  const showExpand = nonZeroExpenses.length > 3;

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
          <Box
            aria-label={tSummary("aria.net_income_card", {
              amount: formatCurrencyNoDecimals(totalIncome),
            })}
            className="p-4 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring shadow-sm"
            role="group"
            tabIndex={0}
          >
            <Box className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-foreground" />
              <Text
                className="text-sm text-muted-foreground"
                id="net-income-label"
              >
                {tSummary("net_income")}
              </Text>
            </Box>
            <CurrencyDisplay
              amount={totalIncome}
              className="text-lg font-bold"
              showDecimals={false}
              size="xl"
              variant="neutral"
            />
            <Text className="text-base text-foreground font-medium mt-1">
              {tSummary("per_month")}
            </Text>
          </Box>

          <Box
            aria-label={
              hasLoan
                ? tSummary("aria.loan_payment_card", {
                    amount: formatCurrencyNoDecimals(monthlyPayment),
                  })
                : `${tSummary("loan_payment")}: ${tSummary("no_loan")}`
            }
            className="p-4 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring shadow-sm"
            role="group"
            tabIndex={0}
          >
            <Box className="flex items-center gap-3 mb-2">
              <HandCoins className="w-5 h-5 text-foreground" />
              <Text
                className="text-sm text-muted-foreground"
                id="loan-payment-label"
              >
                {tSummary("loan_payment")}
              </Text>
            </Box>
            {hasLoan ? (
              <>
                <CurrencyDisplay
                  amount={monthlyPayment}
                  className="text-lg font-bold text-foreground"
                  showDecimals={false}
                  size="xl"
                  variant="neutral"
                />
                <Text className="text-base text-foreground font-medium mt-1">
                  {tSummary("per_month")}
                </Text>
              </>
            ) : (
              <>
                <Text className="text-lg font-bold text-muted-foreground">
                  {tSummary("no_loan")}
                </Text>
                <Text className="text-base text-muted-foreground font-medium mt-1">
                  {/* Empty space to maintain layout consistency */}
                  &nbsp;
                </Text>
              </>
            )}
          </Box>

          <Box
            aria-label={tSummary("aria.total_expenses_card", {
              amount: formatCurrencyNoDecimals(currentExpensesTotal),
            })}
            className="p-4 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring shadow-sm"
            role="group"
            tabIndex={0}
          >
            <Box className="flex items-center gap-3 mb-2">
              <Receipt className="w-5 h-5 text-foreground" />
              <Text
                className="text-sm text-muted-foreground"
                id="total-expenses-label"
              >
                {tSummary("totalExpenses")}
              </Text>
            </Box>
            <CurrencyDisplay
              amount={currentExpensesTotal}
              className="text-lg font-bold"
              showDecimals={false}
              size="xl"
              variant="neutral"
            />
            <Text className="text-base text-foreground font-medium mt-1">
              {tSummary("per_month")}
            </Text>
          </Box>
        </div>

        {/* Sections */}
        <Accordion
          className="space-y-4"
          type="multiple"
          value={expandedSections}
          onValueChange={setExpandedSections}
        >
          {/* Income Section */}
          <AccordionItem
            className="bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm"
            value="income"
          >
            <AccordionTrigger
              aria-label={tSummary("aria.income_section", {
                state: expandedSections.includes("income")
                  ? tSummary("aria.expanded")
                  : tSummary("aria.collapsed"),
                action: expandedSections.includes("income")
                  ? tSummary("aria.collapse")
                  : tSummary("aria.expand"),
              })}
              className="px-4 py-4 hover:bg-muted/50 transition-colors"
            >
              <Box className="flex items-center justify-between w-full">
                <Box className="flex items-center gap-3">
                  <Box className="p-2 rounded-lg bg-primary/10">
                    <BadgeDollarSign className="w-5 h-5 text-primary" />
                  </Box>
                  <Box>
                    <Text className="font-semibold text-foreground">
                      {tSummary("incomeTitle")}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      <Box className="flex items-center gap-1">
                        {income.numberOfAdults === "2" ? (
                          <Users className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        <span>
                          {tSummary("adults_count", {
                            count: Number.parseInt(income.numberOfAdults),
                          })}
                        </span>
                      </Box>
                    </Text>
                  </Box>
                </Box>
              </Box>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <Box className="space-y-3 pt-2" data-testid="income-content">
                {incomeRows.map((row, i) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Box className="flex items-center gap-3">
                      <Box className="p-2 rounded-md bg-muted/50">
                        {row.icon}
                      </Box>
                      <Text className="text-sm text-muted-foreground">
                        {row.label}
                      </Text>
                    </Box>
                    <Box className="flex flex-col items-end">
                      <CurrencyDisplay
                        amount={row.value}
                        className="font-medium text-foreground text-right"
                        showDecimals={false}
                        variant="neutral"
                      />
                      {row.net && (
                        <Text className="text-xs text-muted-foreground font-medium mt-0.5 text-right">
                          {tSummary("net")}:{" "}
                          <CurrencyDisplay
                            amount={row.net}
                            className="inline"
                            showDecimals={false}
                            variant="neutral"
                          />
                        </Text>
                      )}
                    </Box>
                  </div>
                ))}
                <Button
                  aria-label={tSummary("aria.edit_income")}
                  className="mt-6 w-full font-medium group transition-colors"
                  size="sm"
                  variant="secondary"
                  onClick={() => setStepIndex(0)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {tSummary("edit")}
                </Button>
              </Box>
            </AccordionContent>
          </AccordionItem>

          {/* Loans Section */}
          <AccordionItem
            className="bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm"
            value="loans"
          >
            <AccordionTrigger
              aria-label={tSummary("aria.loans_section", {
                state: expandedSections.includes("loans")
                  ? tSummary("aria.expanded")
                  : tSummary("aria.collapsed"),
                action: expandedSections.includes("loans")
                  ? tSummary("aria.collapse")
                  : tSummary("aria.expand"),
              })}
              className="px-4 py-4 hover:bg-muted/50 transition-colors"
            >
              <Box className="flex items-center justify-between w-full">
                <Box className="flex items-center gap-3">
                  <Box className="p-2 rounded-lg bg-primary/10">
                    <HandCoins className="w-5 h-5 text-primary" />
                  </Box>
                  <Box>
                    <Text className="font-semibold text-foreground">
                      {tSummary("loansTitle")}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <Box className="space-y-3 pt-2">
                {hasLoan ? (
                  <>
                    {/* Loan Amount */}
                    {loanRows.map((row, i) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Box className="flex items-center gap-3">
                          <Box className="p-2 rounded-md bg-muted/50">
                            {row.icon}
                          </Box>
                          <Text className="text-sm text-muted-foreground">
                            {row.label}
                          </Text>
                        </Box>
                        <CurrencyDisplay
                          amount={row.value}
                          className="font-medium text-foreground"
                          showDecimals={false}
                          variant="neutral"
                        />
                      </div>
                    ))}

                    {/* Interest Rates */}
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                      <Box className="flex items-center gap-3">
                        <Box className="p-2 rounded-md bg-muted/50">
                          <TrendingUp className="w-4 h-4" />
                        </Box>
                        <Text className="text-sm text-muted-foreground">
                          {tSummary("interestRates")}
                        </Text>
                      </Box>
                      <Text className="text-sm text-foreground font-medium">
                        {formatPercentage(interestRate)}
                      </Text>
                    </div>

                    {/* Amortization Rates */}
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                      <Box className="flex items-center gap-3">
                        <Box className="p-2 rounded-md bg-muted/50">
                          <Receipt className="w-4 h-4" />
                        </Box>
                        <Text className="text-sm text-muted-foreground">
                          {tSummary("amortizationRates")}
                        </Text>
                      </Box>
                      <Text className="text-sm text-foreground font-medium">
                        {formatPercentage(amortizationRate)}
                      </Text>
                    </div>
                  </>
                ) : (
                  <Text className="text-sm text-muted-foreground text-center py-4">
                    {tSummary("no_loan")}
                  </Text>
                )}
                <Button
                  aria-label={tSummary("aria.edit_loans")}
                  className="mt-6 w-full font-medium group transition-colors"
                  size="sm"
                  variant="secondary"
                  onClick={() => setStepIndex(1)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {tSummary("edit")}
                </Button>
              </Box>
            </AccordionContent>
          </AccordionItem>

          {/* Expenses Section */}
          <AccordionItem
            className="bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm"
            value="expenses"
          >
            <AccordionTrigger
              aria-label={tSummary("aria.expenses_section", {
                state: expandedSections.includes("expenses")
                  ? tSummary("aria.expanded")
                  : tSummary("aria.collapsed"),
                action: expandedSections.includes("expenses")
                  ? tSummary("aria.collapse")
                  : tSummary("aria.expand"),
              })}
              className="px-4 py-4 hover:bg-muted/50 transition-colors"
            >
              <Box className="flex items-center justify-between w-full">
                <Box className="flex items-center gap-3">
                  <Box className="p-2 rounded-lg bg-primary/10">
                    <List className="w-5 h-5 text-primary" />
                  </Box>
                  <Box>
                    <Text className="font-semibold text-foreground">
                      {tSummary("expensesTitle")}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <Box className="space-y-3 pt-2">
                {(showAllExpenses ? nonZeroExpenses : topExpenses).map(
                  (row, i) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Text className="text-sm text-muted-foreground">
                        {row.name}
                      </Text>
                      <Box className="flex items-center gap-3">
                        <Box className="w-16 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(row.total / currentExpensesTotal) * 100}%`,
                            }}
                          />
                        </Box>
                        <CurrencyDisplay
                          amount={row.total}
                          className="font-medium text-foreground min-w-[80px] text-right"
                          showDecimals={false}
                          variant="neutral"
                        />
                      </Box>
                    </div>
                  )
                )}

                {showExpand && (
                  <Button
                    className="w-full text-muted-foreground hover:text-foreground"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAllExpenses((v) => !v)}
                  >
                    {showAllExpenses
                      ? tSummary("showLess")
                      : tSummary("showAll")}
                  </Button>
                )}

                <Box className="flex justify-between items-center pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                  <Text className="font-semibold text-muted-foreground">
                    {tSummary("totalExpenses")}
                  </Text>
                  <CurrencyDisplay
                    amount={currentExpensesTotal}
                    className="font-bold text-lg text-foreground"
                    showDecimals={false}
                    variant="neutral"
                  />
                </Box>

                <Button
                  aria-label={tSummary("aria.edit_expenses")}
                  className="mt-6 w-full font-medium group transition-colors"
                  size="sm"
                  variant="secondary"
                  onClick={() => setStepIndex(2)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {tSummary("edit")}
                </Button>
              </Box>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Summary Box */}
        <div
          aria-label={
            totalIncome - monthlyPayment - currentExpensesTotal >= 0
              ? tSummary("aria.monthly_surplus_summary", {
                  amount: formatCurrencyNoDecimals(
                    totalIncome - monthlyPayment - currentExpensesTotal
                  ),
                })
              : tSummary("aria.monthly_deficit_summary", {
                  amount: formatCurrencyNoDecimals(
                    totalIncome - monthlyPayment - currentExpensesTotal
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
                totalIncome - monthlyPayment - currentExpensesTotal >= 0
                  ? "bg-muted"
                  : "bg-muted"
              )}
            >
              {totalIncome - monthlyPayment - currentExpensesTotal >= 0 ? (
                <TrendingUp className="w-5 h-5 text-foreground" />
              ) : (
                <TrendingDown className="w-5 h-5 text-foreground" />
              )}
            </Box>
            <Box className="flex-1 text-left">
              <Text className="text-base text-foreground font-medium">
                {totalIncome - monthlyPayment - currentExpensesTotal >= 0
                  ? tSummary("estimated_monthly_surplus")
                  : tSummary("estimated_monthly_deficit")}
              </Text>
            </Box>
            <Box className="flex-shrink-0">
              <CurrencyDisplay
                amount={totalIncome - monthlyPayment - currentExpensesTotal}
                className="text-lg font-semibold"
                showDecimals={false}
                variant={
                  totalIncome - monthlyPayment - currentExpensesTotal >= 0
                    ? "neutral"
                    : "neutral"
                }
              />
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};
