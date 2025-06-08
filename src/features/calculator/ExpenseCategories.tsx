"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Baby,
  Car,
  DollarSign,
  FileQuestion,
  GraduationCap,
  Heart,
  Home,
  List,
  Menu,
  Minus,
  PiggyBank,
  Pizza,
  Plane,
  ShoppingBag,
  Sigma,
  TrendingDown,
  Umbrella,
  Volleyball,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Box } from "@/components/ui/Box";
import { CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
} from "@/components/ui/ModernCard";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import { expenseCategories } from "@/data/expenseCategories";
import { useFocusOnMount } from "@/lib/hooks/use-focus-management";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import type { ExpensesByCategory } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateExpenseViewMode,
  updateTotalExpenses,
} from "@/store/slices/calculatorSlice";

interface ExpenseCategoriesProps {
  expenses: ExpensesByCategory;
  onChange: (expenses: ExpensesByCategory) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  home: <Home className="w-4 h-4" />,
  carTransportation: <Car className="w-4 h-4" />,
  shoppingServices: <ShoppingBag className="w-4 h-4" />,
  healthBeauty: <Heart className="w-4 h-4" />,
  children: <Baby className="w-4 h-4" />,
  insurance: <Umbrella className="w-4 h-4" />,
  savingsInvestments: <PiggyBank className="w-4 h-4" />,
  vacationTraveling: <Plane className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  food: <Pizza className="w-4 h-4" />,
  uncategorized: <FileQuestion className="w-4 h-4" />,
  leisure: <Volleyball className="w-4 h-4" />,
  loansTaxFees: <DollarSign className="w-4 h-4" />,
};

export const ExpenseCategories = ({
  expenses,
  onChange,
}: ExpenseCategoriesProps) => {
  const t = useTranslations("expense_categories");
  const titleReference = useFocusOnMount();
  const isMobile = useIsTouchDevice();
  const dispatch = useAppDispatch();
  const expenseViewMode = useAppSelector((state) => state.expenseViewMode);
  const totalExpenses = useAppSelector((state) => state.totalExpenses);

  const handleExpenseChange = (categoryId: string, value: string) => {
    const newExpenses = {
      ...expenses,
      [categoryId]: Number(value) || 0,
    };
    onChange(newExpenses);
  };

  const handleTotalExpenseChange = (value: string) => {
    const numericValue = Number(value) || 0;
    dispatch(updateTotalExpenses(numericValue));
  };

  const handleViewModeToggle = (isSimple: boolean) => {
    dispatch(updateExpenseViewMode(isSimple ? "simple" : "detailed"));
  };

  const getCategoryAmount = (categoryId: string) => {
    return expenses[categoryId] || 0;
  };

  const calculateGrandTotal = () => {
    let sum = 0;
    Object.values(expenses).map((amount) => {
      const numericAmount = Number(amount) || 0;
      sum += numericAmount;
      return numericAmount;
    });
    return sum;
  };

  const getCurrentTotal = () => {
    return expenseViewMode === "simple" ? totalExpenses : calculateGrandTotal();
  };

  const grandTotal = calculateGrandTotal();

  return (
    <Card glass gradient animate={!isMobile} delay={0.2} hover={false}>
      <CardHeader className="flex-col sm:flex-row">
        <Box className="flex items-start gap-4 flex-1 w-full sm:w-auto">
          <CardIcon>
            <List className="w-6 h-6 text-red-400" />
          </CardIcon>
          <Box className="flex-1">
            <CardTitle
              ref={titleReference}
              aria-label={t("aria.title")}
              className="focus:outline-none"
              tabIndex={0}
            >
              {t("title")}
            </CardTitle>
            <motion.p
              animate={{ opacity: 1 }}
              className="text-sm text-gray-300 mt-1"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t("track_expenses")}
            </motion.p>
          </Box>
        </Box>
        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
          <Box className="flex items-center gap-2">
            <Text className="text-sm text-gray-300">
              {t("view_toggle.detailed")}
            </Text>
            <Switch
              checked={expenseViewMode === "simple"}
              size="sm"
              onCheckedChange={handleViewModeToggle}
            />
            <Text className="text-sm text-gray-300">
              {t("view_toggle.simple")}
            </Text>
          </Box>
          <motion.div
            animate={{
              rotate: expenseViewMode === "simple" ? 0 : 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 0.3 }}
          >
            {expenseViewMode === "simple" ? (
              <Minus className="w-8 h-8 text-red-400" />
            ) : (
              <Menu className="w-8 h-8 text-red-400" />
            )}
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <AnimatePresence mode="wait">
          {expenseViewMode === "simple" ? (
            <motion.div
              key="simple-view"
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
              exit={{ opacity: 0, x: 30 }}
              initial={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ opacity: 1 }}
                className="glass rounded-xl border-0 overflow-hidden p-4"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Mobile layout - stacked */}
                <Box className="flex flex-col gap-3 sm:hidden">
                  <Box className="flex items-center gap-3">
                    <Box
                      className={`
                      p-2 rounded-lg bg-gradient-to-br transition-colors duration-300
                      ${totalExpenses > 0 ? "from-orange-600/20 to-red-600/20" : "from-gray-600/20 to-gray-700/20"}
                    `}
                    >
                      <Sigma
                        className={`w-4 h-4 transition-colors duration-300`}
                      />
                    </Box>
                    <label
                      className="text-sm font-medium text-gray-200 cursor-pointer"
                      htmlFor="total-expenses-input"
                    >
                      {t("view_toggle.simple_description")}
                    </label>
                  </Box>
                  <Input
                    aria-label={t("view_toggle.simple_description")}
                    className="w-full modern-input text-right"
                    id="total-expenses-input"
                    min={0}
                    placeholder="0"
                    type="number"
                    value={
                      totalExpenses && totalExpenses !== 0 ? totalExpenses : ""
                    }
                    onChange={(e) => handleTotalExpenseChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </Box>

                {/* Desktop layout - inline */}
                <Box className="hidden sm:flex items-center justify-between gap-4">
                  <Box className="flex items-center gap-3 flex-1">
                    <Box
                      className={`
                      p-2 rounded-lg bg-gradient-to-br transition-colors duration-300
                      ${totalExpenses > 0 ? "from-orange-600/20 to-red-600/20" : "from-gray-600/20 to-gray-700/20"}
                    `}
                    >
                      <Sigma
                        className={`w-4 h-4 transition-colors duration-300`}
                      />
                    </Box>
                    <label
                      className="text-sm font-medium text-gray-200 cursor-pointer"
                      htmlFor="total-expenses-input-desktop"
                    >
                      {t("view_toggle.simple_description")}
                    </label>
                  </Box>
                  <Input
                    aria-label={t("view_toggle.simple_description")}
                    className="w-40 modern-input text-right"
                    id="total-expenses-input-desktop"
                    min={0}
                    placeholder="0"
                    type="number"
                    value={
                      totalExpenses && totalExpenses !== 0 ? totalExpenses : ""
                    }
                    onChange={(e) => handleTotalExpenseChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </Box>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="detailed-view"
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3 w-full"
              exit={{ opacity: 0, x: -30 }}
              initial={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              {expenseCategories.map((category, index) => {
                const categoryAmount = getCategoryAmount(category.id);
                const categoryPercentage =
                  grandTotal > 0 ? (categoryAmount / grandTotal) * 100 : 0;

                return (
                  <motion.div
                    key={category.id}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                      glass rounded-xl border-0 overflow-hidden
                      p-4 transition-all duration-300
                      hover:bg-white/5
                    `}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {/* Mobile layout */}
                    <Box className="flex flex-col w-full gap-3 sm:hidden">
                      <Box className="flex items-center justify-between w-full gap-2">
                        <Box className="flex items-center gap-3 min-w-0 flex-1">
                          <Box
                            className={`
                              p-2 rounded-lg bg-gradient-to-br
                              ${categoryAmount > 0 ? "from-orange-600/20 to-red-600/20" : "from-gray-600/20 to-gray-700/20"}
                              transition-colors duration-300
                            `}
                          >
                            {categoryIcons[category.id] || (
                              <List className="w-4 h-4" />
                            )}
                          </Box>
                          <label
                            className="font-medium text-gray-200 whitespace-normal break-words min-w-0 cursor-pointer"
                            htmlFor={`${category.id}-input`}
                          >
                            {t(`${category.id}.name`)}
                          </label>
                        </Box>
                      </Box>
                      <Input
                        aria-label={t(`${category.id}.name`)}
                        className="w-full modern-input text-right"
                        id={`${category.id}-input`}
                        min={0}
                        placeholder="0"
                        type="number"
                        value={
                          categoryAmount && categoryAmount !== 0
                            ? categoryAmount
                            : ""
                        }
                        onChange={(e) =>
                          handleExpenseChange(category.id, e.target.value)
                        }
                        onFocus={(e) => e.target.select()}
                      />
                      {categoryAmount > 0 && (
                        <motion.div
                          animate={{ width: "100%" }}
                          className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden w-full"
                          initial={{ width: 0 }}
                        >
                          <motion.div
                            animate={{ width: `${categoryPercentage}%` }}
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                            initial={{ width: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                          />
                        </motion.div>
                      )}
                    </Box>

                    {/* Desktop layout */}
                    <Box className="hidden sm:flex items-center justify-between w-full gap-4">
                      <Box className="flex items-center gap-3 flex-1">
                        <Box
                          className={`
                            p-2 rounded-lg bg-gradient-to-br
                            ${categoryAmount > 0 ? "from-orange-600/20 to-red-600/20" : "from-gray-600/20 to-gray-700/20"}
                            transition-colors duration-300
                          `}
                        >
                          {categoryIcons[category.id] || (
                            <List className="w-4 h-4" />
                          )}
                        </Box>
                        <label
                          className="font-medium text-gray-200 cursor-pointer flex-1"
                          htmlFor={`${category.id}-input-desktop`}
                        >
                          {t(`${category.id}.name`)}
                        </label>
                      </Box>
                      <Box className="flex items-center gap-4">
                        {categoryAmount > 0 && (
                          <motion.div
                            animate={{ width: 60 }}
                            className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden"
                            initial={{ width: 0 }}
                          >
                            <motion.div
                              animate={{ width: `${categoryPercentage}%` }}
                              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                              initial={{ width: 0 }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                            />
                          </motion.div>
                        )}
                        <Input
                          aria-label={t(`${category.id}.name`)}
                          className="w-40 modern-input text-right"
                          id={`${category.id}-input-desktop`}
                          min={0}
                          placeholder="0"
                          type="number"
                          value={
                            categoryAmount && categoryAmount !== 0
                              ? categoryAmount
                              : ""
                          }
                          onChange={(e) =>
                            handleExpenseChange(category.id, e.target.value)
                          }
                          onFocus={(e) => e.target.select()}
                        />
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ opacity: 1 }}
          className="mt-4 p-4 glass rounded-xl"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <Box className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </Box>
              <Text className="text-md font-medium text-gray-200">
                {t("total_expenses")}
              </Text>
            </Box>
            <CurrencyDisplay
              amount={getCurrentTotal()}
              className="text-lg font-bold"
              data-testid="grand-total"
              showDecimals={false}
              size="xl"
              variant={getCurrentTotal() > 0 ? "negative" : "neutral"}
            />
          </Box>
        </motion.div>
      </CardContent>
    </Card>
  );
};
