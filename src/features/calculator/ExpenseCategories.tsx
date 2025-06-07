"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/ModernCard";
import { CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { expenseCategories } from "@/data/expenseCategories";
import type { ExpensesByCategory } from "@/lib/types";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  updateExpenseViewMode,
  updateTotalExpenses,
} from "@/store/slices/calculatorSlice";
import {
  List,
  TrendingDown,
  Home,
  Car,
  ShoppingBag,
  Heart,
  Baby,
  Umbrella,
  PiggyBank,
  Plane,
  GraduationCap,
  Pizza,
  FileQuestion,
  Volleyball,
  DollarSign,
  Menu,
  Minus,
  Sigma,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusOnMount } from "@/lib/hooks/use-focus-management";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";

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
  const titleRef = useFocusOnMount();
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
    return Object.values(expenses).reduce((sum, amount) => {
      const numericAmount = Number(amount) || 0;
      return sum + numericAmount;
    }, 0);
  };

  const getCurrentTotal = () => {
    return expenseViewMode === "simple" ? totalExpenses : calculateGrandTotal();
  };

  const grandTotal = calculateGrandTotal();

  return (
    <Card gradient glass delay={0.2} animate={!isMobile} hover={false}>
      <CardHeader className="flex-col sm:flex-row">
        <Box className="flex items-start gap-4 flex-1 w-full sm:w-auto">
          <CardIcon>
            <List className="w-6 h-6 text-red-400" />
          </CardIcon>
          <Box className="flex-1">
            <CardTitle
              ref={titleRef}
              tabIndex={0}
              aria-label={t("aria.title")}
              className="focus:outline-none"
            >
              {t("title")}
            </CardTitle>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-300 mt-1"
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
              onCheckedChange={handleViewModeToggle}
              size="sm"
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
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl border-0 overflow-hidden p-4"
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
                      htmlFor="total-expenses-input"
                      className="text-sm font-medium text-gray-200 cursor-pointer"
                    >
                      {t("view_toggle.simple_description")}
                    </label>
                  </Box>
                  <Input
                    id="total-expenses-input"
                    type="number"
                    min={0}
                    className="w-full modern-input text-right"
                    value={
                      totalExpenses && totalExpenses !== 0 ? totalExpenses : ""
                    }
                    placeholder="0"
                    onChange={(e) => handleTotalExpenseChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    aria-label={t("view_toggle.simple_description")}
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
                      htmlFor="total-expenses-input-desktop"
                      className="text-sm font-medium text-gray-200 cursor-pointer"
                    >
                      {t("view_toggle.simple_description")}
                    </label>
                  </Box>
                  <Input
                    id="total-expenses-input-desktop"
                    type="number"
                    min={0}
                    className="w-40 modern-input text-right"
                    value={
                      totalExpenses && totalExpenses !== 0 ? totalExpenses : ""
                    }
                    placeholder="0"
                    onChange={(e) => handleTotalExpenseChange(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    aria-label={t("view_toggle.simple_description")}
                  />
                </Box>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="detailed-view"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 w-full"
            >
              {expenseCategories.map((category, index) => {
                const categoryAmount = getCategoryAmount(category.id);
                const categoryPercentage =
                  grandTotal > 0 ? (categoryAmount / grandTotal) * 100 : 0;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`
                      glass rounded-xl border-0 overflow-hidden
                      p-4 transition-all duration-300
                      hover:bg-white/5
                    `}
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
                        id={`${category.id}-input`}
                        type="number"
                        min={0}
                        className="w-full modern-input text-right"
                        value={
                          categoryAmount && categoryAmount !== 0
                            ? categoryAmount
                            : ""
                        }
                        placeholder="0"
                        onChange={(e) =>
                          handleExpenseChange(category.id, e.target.value)
                        }
                        onFocus={(e) => e.target.select()}
                        aria-label={t(`${category.id}.name`)}
                      />
                      {categoryAmount > 0 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden w-full"
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${categoryPercentage}%` }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
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
                            initial={{ width: 0 }}
                            animate={{ width: 60 }}
                            className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden"
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${categoryPercentage}%` }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                            />
                          </motion.div>
                        )}
                        <Input
                          id={`${category.id}-input-desktop`}
                          type="number"
                          min={0}
                          className="w-40 modern-input text-right"
                          value={
                            categoryAmount && categoryAmount !== 0
                              ? categoryAmount
                              : ""
                          }
                          placeholder="0"
                          onChange={(e) =>
                            handleExpenseChange(category.id, e.target.value)
                          }
                          onFocus={(e) => e.target.select()}
                          aria-label={t(`${category.id}.name`)}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 glass rounded-xl"
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
              variant={getCurrentTotal() > 0 ? "negative" : "neutral"}
              size="xl"
              showDecimals={false}
              className="text-lg font-bold"
              data-testid="grand-total"
            />
          </Box>
        </motion.div>
      </CardContent>
    </Card>
  );
};
