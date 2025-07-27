"use client";

import { List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { ResponsiveExpenseInput } from "@/components/ui/ResponsiveExpenseInput";
import type { ExpensesByCategory } from "@/lib/types";

interface CategoryData {
  id: string;
  amount: number;
  percentage: number;
}

interface DetailedCategoryListProps {
  expenses: ExpensesByCategory;
  onChange: (expenses: ExpensesByCategory) => void;
  grandTotal: number;
  expenseCategories: readonly { readonly id: string }[];
  categoryIcons: Record<string, React.ReactNode>;
}

export const DetailedCategoryList = ({
  expenses,
  onChange,
  grandTotal,
  expenseCategories,
  categoryIcons,
}: DetailedCategoryListProps) => {
  const t = useTranslations("expense_categories");

  const categoryData = useMemo(
    (): CategoryData[] =>
      expenseCategories.map((category) => ({
        id: category.id,
        amount: expenses[category.id] || 0,
        percentage:
          grandTotal > 0
            ? ((expenses[category.id] || 0) / grandTotal) * 100
            : 0,
      })),
    [expenses, grandTotal, expenseCategories]
  );

  const handleExpenseChange = useCallback(
    (categoryId: string, value: string) => {
      const newExpenses = {
        ...expenses,
        [categoryId]: Number(value) || 0,
      };
      onChange(newExpenses);
    },
    [expenses, onChange]
  );

  return (
    <div className="space-y-3 w-full">
      {categoryData.map((category) => (
        <ResponsiveExpenseInput
          key={category.id}
          ariaLabel={t(`${category.id}.name`)}
          icon={categoryIcons[category.id] || <List className="w-4 h-4" />}
          id={category.id}
          label={t(`${category.id}.name`)}
          progressPercentage={category.percentage}
          showProgressBar={true}
          value={category.amount}
          onChange={(value) => handleExpenseChange(category.id, value)}
        />
      ))}
    </div>
  );
};
