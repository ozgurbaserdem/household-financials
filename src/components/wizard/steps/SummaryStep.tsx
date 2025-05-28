import React, { useState } from "react";
import { useWizard } from "../WizardLayout";
import { useAppSelector } from "@/store/hooks";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import {
  BadgeDollarSign,
  HandCoins,
  List,
  Edit3,
  ChevronDown,
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  PiggyBank,
  Users,
  Baby,
  Briefcase,
  Home,
  MoreHorizontal,
} from "lucide-react";
import { formatCurrency, getNetIncome } from "@/lib/calculations";
import { expenseCategories } from "@/data/expenseCategories";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Row {
  label: string;
  value: number;
  net?: number;
  icon: React.ReactNode;
}

export function SummaryStep() {
  const { setStepIndex } = useWizard();
  const income = useAppSelector((state) => state.income);
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const expenses = useAppSelector((state) => state.expenses);
  const tSummary = useTranslations("summary");
  const tCategories = useTranslations("expense_categories");
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

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
      net: getNetIncome(income.income1),
      icon: incomeIcons.income1,
    },
    income.numberOfAdults === "2"
      ? {
          label: tSummary("income2"),
          value: income.income2,
          net: getNetIncome(income.income2),
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

  const loanRows: Row[] = [
    {
      label: tSummary("loanAmount"),
      value: loanParameters.amount,
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: tSummary("interestRates"),
      value: loanParameters.interestRates[0] ?? 0,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: tSummary("amortizationRates"),
      value: loanParameters.amortizationRates[0] ?? 0,
      icon: <Receipt className="w-4 h-4" />,
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
  const totalIncome = incomeRows
    .filter((row) => row.label !== tSummary("currentBuffer"))
    .reduce((sum, row) => sum + (row.net || row.value), 0);
  const monthlyPayment =
    loanParameters.amount *
    ((loanParameters.interestRates[0] + loanParameters.amortizationRates[0]) /
      100 /
      12);

  const nonZeroExpenses = expenseTotals.filter((e) => e.total > 0);
  const topExpenses = nonZeroExpenses
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
  const showExpand = nonZeroExpenses.length > 3;

  const SectionCard = ({
    title,
    icon,
    color,
    children,
    onEdit,
    sectionKey,
    stats,
  }: {
    title: string;
    icon: React.ReactNode;
    color: string;
    children: React.ReactNode;
    onEdit: () => void;
    sectionKey: string;
    stats?: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.includes(sectionKey);

    return (
      <div className="glass rounded-xl overflow-hidden">
        <Box
          className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => toggleSection(sectionKey)}
        >
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <Box className={cn("p-2 rounded-lg", color)}>{icon}</Box>
              <Box>
                <Text className="font-semibold text-white">{title}</Text>
                {stats}
              </Box>
            </Box>
            <Box className="flex items-center gap-2">
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-gray-300 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            </Box>
          </Box>
        </Box>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Box className="p-4 pt-0 border-t border-gray-800">
                {children}
                <Button
                  size="sm"
                  variant="gradient2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="mt-4 w-full font-medium group transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {tSummary("edit")}
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Card gradient glass>
      <CardHeader>
        <CardIcon>
          <List className="w-6 h-6 text-purple-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle tabIndex={0} aria-label={tSummary("aria.title")}>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Box className="p-4 glass rounded-xl border border-green-500/20">
            <Box className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-green-400" />
              <Text className="text-sm text-gray-300">
                {tSummary("net_income")}
              </Text>
            </Box>
            <Text className="text-2xl font-bold text-green-400">
              {formatCurrency(totalIncome)}
            </Text>
            <Text className="text-base text-gray-200 font-medium mt-1">
              {tSummary("per_month")}
            </Text>
          </Box>

          <Box className="p-4 glass rounded-xl border border-orange-500/20">
            <Box className="flex items-center gap-3 mb-2">
              <HandCoins className="w-5 h-5 text-orange-400" />
              <Text className="text-sm text-gray-300">
                {tSummary("loan_payment")}
              </Text>
            </Box>
            <Text className="text-2xl font-bold text-orange-400">
              {formatCurrency(monthlyPayment)}
            </Text>
            <Text className="text-base text-gray-200 font-medium mt-1">
              {tSummary("per_month")}
            </Text>
          </Box>

          <Box className="p-4 glass rounded-xl border border-red-500/20">
            <Box className="flex items-center gap-3 mb-2">
              <Receipt className="w-5 h-5 text-red-400" />
              <Text className="text-sm text-gray-300">
                {tSummary("totalExpenses")}
              </Text>
            </Box>
            <Text className="text-2xl font-bold text-red-400">
              {formatCurrency(totalExpenses)}
            </Text>
            <Text className="text-base text-gray-200 font-medium mt-1">
              {tSummary("per_month")}
            </Text>
          </Box>
        </motion.div>

        {/* Sections */}
        <Box className="space-y-4">
          {/* Income Section */}
          <SectionCard
            title={tSummary("incomeTitle")}
            icon={<BadgeDollarSign className="w-5 h-5 text-green-400" />}
            color="bg-gradient-to-br from-green-600/20 to-emerald-600/20"
            onEdit={() => setStepIndex(0)}
            sectionKey="income"
            stats={
              <Text className="text-xs text-gray-300">
                {income.numberOfAdults === "2" ? (
                  <Box className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>2 {tSummary("adults")}</span>
                  </Box>
                ) : (
                  `1 ${tSummary("adult")}`
                )}
              </Text>
            }
          >
            <Box className="space-y-3">
              {incomeRows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Box className="flex items-center gap-3">
                    <Box className="p-1.5 rounded-md bg-gray-800/50">
                      {row.icon}
                    </Box>
                    <Text className="text-sm text-gray-300">{row.label}</Text>
                  </Box>
                  <Box className="flex flex-col items-end">
                    <Text className="font-medium text-white text-right">
                      {formatCurrency(row.value)}
                    </Text>
                    {row.net && (
                      <Text className="text-xs text-gray-300 font-medium mt-0.5 text-right">
                        {tSummary("net")}: {formatCurrency(row.net)}
                      </Text>
                    )}
                  </Box>
                </motion.div>
              ))}
            </Box>
          </SectionCard>

          {/* Loans Section */}
          <SectionCard
            title={tSummary("loansTitle")}
            icon={<HandCoins className="w-5 h-5 text-orange-400" />}
            color="bg-gradient-to-br from-orange-500/20 to-amber-600/20"
            onEdit={() => setStepIndex(1)}
            sectionKey="loans"
          >
            <Box className="space-y-3">
              {loanRows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Box className="flex items-center gap-3">
                    <Box className="p-1.5 rounded-md bg-gray-800/50">
                      {row.icon}
                    </Box>
                    <Text className="text-sm text-gray-300">{row.label}</Text>
                  </Box>
                  <Text className="font-medium text-white">
                    {row.label === tSummary("loanAmount")
                      ? formatCurrency(row.value)
                      : `${row.value}%`}
                  </Text>
                </motion.div>
              ))}
            </Box>
          </SectionCard>

          {/* Expenses Section */}
          <SectionCard
            title={tSummary("expensesTitle")}
            icon={<List className="w-5 h-5 text-red-400" />}
            color="bg-gradient-to-br from-orange-600/20 to-red-600/20"
            onEdit={() => setStepIndex(2)}
            sectionKey="expenses"
          >
            <Box className="space-y-3">
              {(showAllExpenses ? nonZeroExpenses : topExpenses).map(
                (row, i) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Text className="text-sm text-gray-300">{row.name}</Text>
                    <Box className="flex items-center gap-3">
                      <Box className="w-16 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(row.total / totalExpenses) * 100}%`,
                          }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                        />
                      </Box>
                      <Text className="font-medium text-white min-w-[80px] text-right">
                        {formatCurrency(row.total)}
                      </Text>
                    </Box>
                  </motion.div>
                )
              )}

              {showExpand && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-gray-300 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllExpenses((v) => !v);
                  }}
                >
                  {showAllExpenses ? tSummary("showLess") : tSummary("showAll")}
                </Button>
              )}

              <Box className="flex justify-between items-center pt-3 border-t border-gray-800">
                <Text className="font-semibold text-gray-300">
                  {tSummary("totalExpenses")}
                </Text>
                <Text className="font-bold text-xl gradient-text">
                  {formatCurrency(totalExpenses)}
                </Text>
              </Box>
            </Box>
          </SectionCard>
        </Box>

        {/* Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 glass rounded-xl border border-blue-500/20"
        >
          <Box className="flex items-center gap-4 justify-between">
            <Box
              className={cn(
                "p-4 rounded-full",
                totalIncome - monthlyPayment - totalExpenses >= 0
                  ? "bg-green-500/10"
                  : "bg-red-500/10"
              )}
            >
              {totalIncome - monthlyPayment - totalExpenses >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-400" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-400" />
              )}
            </Box>
            <Text className="text-base text-gray-200 font-medium">
              {totalIncome - monthlyPayment - totalExpenses >= 0
                ? tSummary("estimated_monthly_surplus")
                : tSummary("estimated_monthly_deficit")}
            </Text>
            <Text
              className={cn(
                "text-3xl font-bold ml-auto",
                totalIncome - monthlyPayment - totalExpenses >= 0
                  ? "text-green-400"
                  : "text-red-400"
              )}
              style={{ minWidth: 0 }}
            >
              {formatCurrency(totalIncome - monthlyPayment - totalExpenses)}
            </Text>
          </Box>
        </motion.div>
      </CardContent>
    </Card>
  );
}
