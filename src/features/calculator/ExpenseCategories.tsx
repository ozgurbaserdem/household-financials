"use client";

import {
  Baby,
  Car,
  DollarSign,
  FileQuestion,
  GraduationCap,
  Heart,
  Home,
  PiggyBank,
  Pizza,
  Plane,
  ShoppingBag,
  Umbrella,
  Volleyball,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { DetailedCategoryList } from "@/components/ui/DetailedCategoryList";
import { SimpleTotalInput } from "@/components/ui/SimpleTotalInput";
import { StepHeader } from "@/components/ui/StepHeader";
import { TotalSummary } from "@/components/ui/TotalSummary";
import { ViewModeToggle } from "@/components/ui/ViewModeToggle";
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

  // Memoized calculation using reduce instead of map
  const grandTotal = useMemo(() => {
    return Object.values(expenses).reduce(
      (sum, amount) => sum + (Number(amount) || 0),
      0
    );
  }, [expenses]);

  const handleTotalExpenseChange = useCallback(
    (value: string) => {
      const numericValue = Number(value) || 0;
      dispatch(updateTotalExpenses(numericValue));
    },
    [dispatch]
  );

  const handleViewModeToggle = useCallback(
    (isSimple: boolean) => {
      dispatch(updateExpenseViewMode(isSimple ? "simple" : "detailed"));
    },
    [dispatch]
  );

  const getCurrentTotal = useCallback(() => {
    return expenseViewMode === "simple" ? totalExpenses : grandTotal;
  }, [expenseViewMode, totalExpenses, grandTotal]);

  const isSimpleMode = expenseViewMode === "simple";

  return (
    <div>
      <StepHeader
        rightContent={
          <ViewModeToggle
            isSimple={isSimpleMode}
            onToggle={handleViewModeToggle}
          />
        }
        step="expenses"
      >
        <div className="text-sm text-muted-foreground">
          {t("track_expenses")}
        </div>
      </StepHeader>

      <div className="pb-6">
        {isSimpleMode ? (
          <SimpleTotalInput
            value={totalExpenses}
            onChange={handleTotalExpenseChange}
          />
        ) : (
          <DetailedCategoryList
            categoryIcons={categoryIcons}
            expenseCategories={expenseCategories}
            expenses={expenses}
            grandTotal={grandTotal}
            onChange={onChange}
          />
        )}

        <TotalSummary total={getCurrentTotal()} />
      </div>
    </div>
  );
};
