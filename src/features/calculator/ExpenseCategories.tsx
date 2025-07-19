"use client";

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
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Input } from "@/components/ui/Input";
import { StepHeader } from "@/components/ui/StepHeader";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import { expenseCategories } from "@/data/expenseCategories";
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
    <div>
      <StepHeader
        rightContent={
          <>
            <Box className="flex items-center gap-2">
              <Text className="text-sm text-muted-foreground">
                {t("view_toggle.detailed")}
              </Text>
              <Switch
                checked={expenseViewMode === "simple"}
                size="sm"
                onCheckedChange={handleViewModeToggle}
              />
              <Text className="text-sm text-muted-foreground">
                {t("view_toggle.simple")}
              </Text>
            </Box>
            <div className="relative w-8 h-8">
              <Minus
                className={`absolute inset-0 w-8 h-8 text-foreground transition-all duration-300 ease-in-out transform ${
                  expenseViewMode === "simple"
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-90 scale-90"
                }`}
              />
              <Menu
                className={`absolute inset-0 w-8 h-8 text-foreground transition-all duration-300 ease-in-out transform ${
                  expenseViewMode === "detailed"
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-90"
                }`}
              />
            </div>
          </>
        }
        step="expenses"
      >
        <div className="text-sm text-muted-foreground">
          {t("track_expenses")}
        </div>
      </StepHeader>

      <div className="pb-6">
        {expenseViewMode === "simple" ? (
          <div className="space-y-4">
            <div className="p-4 transition-all duration-300 hover:bg-muted card-base">
              {/* Mobile layout - stacked */}
              <Box className="flex flex-col gap-3 sm:hidden">
                <Box className="flex items-center gap-3">
                  <Box
                    className={`
                      p-2 rounded-lg bg-muted transition-colors duration-300
                    `}
                  >
                    <Sigma
                      className={`w-4 h-4 transition-colors duration-300`}
                    />
                  </Box>
                  <label
                    className="text-sm font-medium text-foreground cursor-pointer"
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
                      p-2 rounded-lg bg-muted transition-colors duration-300
                    `}
                  >
                    <Sigma
                      className={`w-4 h-4 transition-colors duration-300`}
                    />
                  </Box>
                  <label
                    className="text-sm font-medium text-foreground cursor-pointer"
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
            </div>
          </div>
        ) : (
          <div className="space-y-3 w-full">
            {expenseCategories.map((category) => {
              const categoryAmount = getCategoryAmount(category.id);
              const categoryPercentage =
                grandTotal > 0 ? (categoryAmount / grandTotal) * 100 : 0;

              return (
                <div
                  key={category.id}
                  className="p-4 transition-all duration-300 hover:bg-muted card-base"
                >
                  {/* Mobile layout */}
                  <Box className="flex flex-col w-full gap-3 sm:hidden">
                    <Box className="flex items-center justify-between w-full gap-2">
                      <Box className="flex items-center gap-3 min-w-0 flex-1">
                        <Box
                          className={`
                              p-2 rounded-lg bg-muted
                              transition-colors duration-300
                            `}
                        >
                          {categoryIcons[category.id] || (
                            <List className="w-4 h-4" />
                          )}
                        </Box>
                        <label
                          className="font-medium text-foreground whitespace-normal break-words min-w-0 cursor-pointer"
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
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden w-full">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${categoryPercentage}%` }}
                        />
                      </div>
                    )}
                  </Box>

                  {/* Desktop layout */}
                  <Box className="hidden sm:flex items-center justify-between w-full gap-4">
                    <Box className="flex items-center gap-3 flex-1">
                      <Box
                        className={`
                            p-2 rounded-lg bg-muted
                            transition-colors duration-300
                          `}
                      >
                        {categoryIcons[category.id] || (
                          <List className="w-4 h-4" />
                        )}
                      </Box>
                      <label
                        className="font-medium text-foreground cursor-pointer flex-1"
                        htmlFor={`${category.id}-input-desktop`}
                      >
                        {t(`${category.id}.name`)}
                      </label>
                    </Box>
                    <Box className="flex items-center gap-4">
                      {categoryAmount > 0 && (
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden w-[60px]">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${categoryPercentage}%` }}
                          />
                        </div>
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
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 p-4 card-base">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <Box className="p-2 rounded-lg bg-muted">
                <TrendingDown className="w-5 h-5 text-foreground" />
              </Box>
              <Text className="text-md font-medium text-foreground">
                {t("total_expenses")}
              </Text>
            </Box>
            <CurrencyDisplay
              amount={getCurrentTotal()}
              className="text-lg font-bold"
              data-testid="grand-total"
              showDecimals={false}
              size="xl"
              variant={getCurrentTotal() > 0 ? "destructive" : "neutral"}
            />
          </Box>
        </div>
      </div>
    </div>
  );
};
