import React, { useState } from "react";
import { useWizard } from "../WizardLayout";
import { useAppSelector } from "@/store/hooks";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/ModernCard";
import { CardContent } from "@/components/ui/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import {
  BadgeDollarSign,
  HandCoins,
  List,
  Edit3,
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  PiggyBank,
  Users,
  User,
  Baby,
  Briefcase,
  Home,
  MoreHorizontal,
  ListChecks,
} from "lucide-react";
import { getNetIncome } from "@/lib/calculations";
import { formatPercentage, formatCurrencyNoDecimals } from "@/lib/formatting";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { expenseCategories } from "@/data/expenseCategories";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/general";
import { useFocusOnMount } from "@/lib/hooks/use-focus-management";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { hasValidLoan } from "@/lib/types";

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
  const titleRef = useFocusOnMount();
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
    <>
      <Card gradient glass animate={!isMobile} hover={false}>
        <CardHeader>
          <CardIcon>
            <ListChecks className="w-6 h-6 text-purple-400" />
          </CardIcon>
          <Box className="flex-1">
            <CardTitle
              ref={titleRef}
              tabIndex={0}
              aria-label={tSummary("aria.title")}
              className="focus:outline-none"
            >
              {tSummary("title")}
            </CardTitle>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-300 mt-1"
            >
              {tSummary("review_before_calculating")}
            </motion.p>
          </Box>
        </CardHeader>

        <CardContent>
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <Box
              className="p-4 glass rounded-xl border border-green-500/20 focus-within:ring-2 focus-within:ring-green-400/50 focus-within:border-green-400/50"
              tabIndex={0}
              role="group"
              aria-label={tSummary("aria.net_income_card", {
                amount: formatCurrencyNoDecimals(totalIncome),
              })}
            >
              <Box className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-green-400" />
                <Text id="net-income-label" className="text-sm text-gray-300">
                  {tSummary("net_income")}
                </Text>
              </Box>
              <CurrencyDisplay
                amount={totalIncome}
                variant="positive"
                size="xl"
                showDecimals={false}
                className="text-lg font-bold"
              />
              <Text className="text-base text-gray-200 font-medium mt-1">
                {tSummary("per_month")}
              </Text>
            </Box>

            <Box
              className="p-4 glass rounded-xl border border-orange-500/20 focus-within:ring-2 focus-within:ring-orange-400/50 focus-within:border-orange-400/50"
              tabIndex={0}
              role="group"
              aria-label={
                hasLoan
                  ? tSummary("aria.loan_payment_card", {
                      amount: formatCurrencyNoDecimals(monthlyPayment),
                    })
                  : `${tSummary("loan_payment")}: ${tSummary("no_loan")}`
              }
            >
              <Box className="flex items-center gap-3 mb-2">
                <HandCoins className="w-5 h-5 text-orange-400" />
                <Text id="loan-payment-label" className="text-sm text-gray-300">
                  {tSummary("loan_payment")}
                </Text>
              </Box>
              {hasLoan ? (
                <>
                  <CurrencyDisplay
                    amount={monthlyPayment}
                    variant="neutral"
                    size="xl"
                    showDecimals={false}
                    className="text-lg font-bold text-orange-400"
                  />
                  <Text className="text-base text-gray-200 font-medium mt-1">
                    {tSummary("per_month")}
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-lg font-bold text-gray-400">
                    {tSummary("no_loan")}
                  </Text>
                  <Text className="text-base text-gray-400 font-medium mt-1">
                    {/* Empty space to maintain layout consistency */}
                    &nbsp;
                  </Text>
                </>
              )}
            </Box>

            <Box
              className="p-4 glass rounded-xl border border-red-500/20 focus-within:ring-2 focus-within:ring-red-400/50 focus-within:border-red-400/50"
              tabIndex={0}
              role="group"
              aria-label={tSummary("aria.total_expenses_card", {
                amount: formatCurrencyNoDecimals(currentExpensesTotal),
              })}
            >
              <Box className="flex items-center gap-3 mb-2">
                <Receipt className="w-5 h-5 text-red-400" />
                <Text
                  id="total-expenses-label"
                  className="text-sm text-gray-300"
                >
                  {tSummary("totalExpenses")}
                </Text>
              </Box>
              <CurrencyDisplay
                amount={currentExpensesTotal}
                variant="negative"
                size="xl"
                showDecimals={false}
                className="text-lg font-bold"
              />
              <Text className="text-base text-gray-200 font-medium mt-1">
                {tSummary("per_month")}
              </Text>
            </Box>
          </motion.div>

          {/* Sections */}
          <Accordion
            type="multiple"
            value={expandedSections}
            onValueChange={setExpandedSections}
            className="space-y-4"
          >
            {/* Income Section */}
            <AccordionItem
              value="income"
              className="glass rounded-xl border-0 overflow-hidden"
            >
              <AccordionTrigger
                className="px-4 py-4 hover:bg-white/5 transition-colors"
                aria-label={tSummary("aria.income_section", {
                  state: expandedSections.includes("income")
                    ? tSummary("aria.expanded")
                    : tSummary("aria.collapsed"),
                  action: expandedSections.includes("income")
                    ? tSummary("aria.collapse")
                    : tSummary("aria.expand"),
                })}
              >
                <Box className="flex items-center justify-between w-full">
                  <Box className="flex items-center gap-3">
                    <Box className="p-2 rounded-lg bg-gradient-to-br from-green-600/20 to-emerald-600/20">
                      <BadgeDollarSign className="w-5 h-5 text-green-400" />
                    </Box>
                    <Box>
                      <Text className="font-semibold text-white">
                        {tSummary("incomeTitle")}
                      </Text>
                      <Text className="text-xs text-gray-300">
                        <Box className="flex items-center gap-1">
                          {income.numberOfAdults === "2" ? (
                            <Users className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          <span>
                            {tSummary("adults_count", {
                              count: parseInt(income.numberOfAdults),
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
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Box className="flex items-center gap-3">
                        <Box className="p-2 rounded-md bg-gray-800/50">
                          {row.icon}
                        </Box>
                        <Text className="text-sm text-gray-300">
                          {row.label}
                        </Text>
                      </Box>
                      <Box className="flex flex-col items-end">
                        <CurrencyDisplay
                          amount={row.value}
                          variant="neutral"
                          showDecimals={false}
                          className="font-medium text-white text-right"
                        />
                        {row.net && (
                          <Text className="text-xs text-gray-300 font-medium mt-0.5 text-right">
                            {tSummary("net")}:{" "}
                            <CurrencyDisplay
                              amount={row.net}
                              variant="neutral"
                              showDecimals={false}
                              className="inline"
                            />
                          </Text>
                        )}
                      </Box>
                    </motion.div>
                  ))}
                  <Button
                    size="sm"
                    variant="gradientSecondary"
                    onClick={() => setStepIndex(0)}
                    className="mt-6 w-full font-medium group transition-colors"
                    aria-label={tSummary("aria.edit_income")}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {tSummary("edit")}
                  </Button>
                </Box>
              </AccordionContent>
            </AccordionItem>

            {/* Loans Section */}
            <AccordionItem
              value="loans"
              className="glass rounded-xl border-0 overflow-hidden"
            >
              <AccordionTrigger
                className="px-4 py-4 hover:bg-white/5 transition-colors"
                aria-label={tSummary("aria.loans_section", {
                  state: expandedSections.includes("loans")
                    ? tSummary("aria.expanded")
                    : tSummary("aria.collapsed"),
                  action: expandedSections.includes("loans")
                    ? tSummary("aria.collapse")
                    : tSummary("aria.expand"),
                })}
              >
                <Box className="flex items-center justify-between w-full">
                  <Box className="flex items-center gap-3">
                    <Box className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-600/20">
                      <HandCoins className="w-5 h-5 text-orange-400" />
                    </Box>
                    <Box>
                      <Text className="font-semibold text-white">
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
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <Box className="flex items-center gap-3">
                            <Box className="p-2 rounded-md bg-gray-800/50">
                              {row.icon}
                            </Box>
                            <Text className="text-sm text-gray-300">
                              {row.label}
                            </Text>
                          </Box>
                          <CurrencyDisplay
                            amount={row.value}
                            variant="neutral"
                            showDecimals={false}
                            className="font-medium text-white"
                          />
                        </motion.div>
                      ))}

                      {/* Interest Rates */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Box className="flex items-center gap-3">
                          <Box className="p-2 rounded-md bg-gray-800/50">
                            <TrendingUp className="w-4 h-4" />
                          </Box>
                          <Text className="text-sm text-gray-300">
                            {tSummary("interestRates")}
                          </Text>
                        </Box>
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30"
                        >
                          {formatPercentage(interestRate)}
                        </motion.span>
                      </motion.div>

                      {/* Amortization Rates */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Box className="flex items-center gap-3">
                          <Box className="p-2 rounded-md bg-gray-800/50">
                            <Receipt className="w-4 h-4" />
                          </Box>
                          <Text className="text-sm text-gray-300">
                            {tSummary("amortizationRates")}
                          </Text>
                        </Box>
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 }}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/30"
                        >
                          {formatPercentage(amortizationRate)}
                        </motion.span>
                      </motion.div>
                    </>
                  ) : (
                    <Text className="text-sm text-gray-400 text-center py-4">
                      {tSummary("no_loan")}
                    </Text>
                  )}
                  <Button
                    size="sm"
                    variant="gradientSecondary"
                    onClick={() => setStepIndex(1)}
                    className="mt-6 w-full font-medium group transition-colors"
                    aria-label={tSummary("aria.edit_loans")}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {tSummary("edit")}
                  </Button>
                </Box>
              </AccordionContent>
            </AccordionItem>

            {/* Expenses Section */}
            <AccordionItem
              value="expenses"
              className="glass rounded-xl border-0 overflow-hidden"
            >
              <AccordionTrigger
                className="px-4 py-4 hover:bg-white/5 transition-colors"
                aria-label={tSummary("aria.expenses_section", {
                  state: expandedSections.includes("expenses")
                    ? tSummary("aria.expanded")
                    : tSummary("aria.collapsed"),
                  action: expandedSections.includes("expenses")
                    ? tSummary("aria.collapse")
                    : tSummary("aria.expand"),
                })}
              >
                <Box className="flex items-center justify-between w-full">
                  <Box className="flex items-center gap-3">
                    <Box className="p-2 rounded-lg bg-gradient-to-br from-orange-600/20 to-red-600/20">
                      <List className="w-5 h-5 text-red-400" />
                    </Box>
                    <Box>
                      <Text className="font-semibold text-white">
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
                      <motion.div
                        key={row.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Text className="text-sm text-gray-300">
                          {row.name}
                        </Text>
                        <Box className="flex items-center gap-3">
                          <Box className="w-16 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(row.total / currentExpensesTotal) * 100}%`,
                              }}
                              transition={{ delay: 0.3 + i * 0.05 }}
                              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                            />
                          </Box>
                          <CurrencyDisplay
                            amount={row.total}
                            variant="neutral"
                            showDecimals={false}
                            className="font-medium text-white min-w-[80px] text-right"
                          />
                        </Box>
                      </motion.div>
                    )
                  )}

                  {showExpand && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-gray-300 hover:text-white"
                      onClick={() => setShowAllExpenses((v) => !v)}
                    >
                      {showAllExpenses
                        ? tSummary("showLess")
                        : tSummary("showAll")}
                    </Button>
                  )}

                  <Box className="flex justify-between items-center pt-3 border-t border-gray-800">
                    <Text className="font-semibold text-gray-300">
                      {tSummary("totalExpenses")}
                    </Text>
                    <CurrencyDisplay
                      amount={currentExpensesTotal}
                      variant="neutral"
                      showDecimals={false}
                      className="font-bold text-lg text-white"
                    />
                  </Box>

                  <Button
                    size="sm"
                    variant="gradientSecondary"
                    onClick={() => setStepIndex(2)}
                    className="mt-6 w-full font-medium group transition-colors"
                    aria-label={tSummary("aria.edit_expenses")}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {tSummary("edit")}
                  </Button>
                </Box>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Summary Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-3 glass rounded-xl border border-blue-500/20 focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:border-blue-400/50"
            tabIndex={0}
            role="group"
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
          >
            <Box className="flex items-center gap-3">
              <Box
                className={cn(
                  "p-2 rounded-lg flex-shrink-0",
                  totalIncome - monthlyPayment - currentExpensesTotal >= 0
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                )}
              >
                {totalIncome - monthlyPayment - currentExpensesTotal >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </Box>
              <Box className="flex-1 text-left">
                <Text className="text-base text-gray-200 font-medium">
                  {totalIncome - monthlyPayment - currentExpensesTotal >= 0
                    ? tSummary("estimated_monthly_surplus")
                    : tSummary("estimated_monthly_deficit")}
                </Text>
              </Box>
              <Box className="flex-shrink-0">
                <CurrencyDisplay
                  amount={totalIncome - monthlyPayment - currentExpensesTotal}
                  variant={
                    totalIncome - monthlyPayment - currentExpensesTotal >= 0
                      ? "positive"
                      : "negative"
                  }
                  showDecimals={false}
                  className="text-lg font-semibold"
                />
              </Box>
            </Box>
          </motion.div>
        </CardContent>
      </Card>
    </>
  );
};
