"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { expenseCategories } from "@/data/expenseCategories";
import { formatCurrency } from "@/lib/calculations";
import type { ExpensesByCategory } from "@/lib/types";
import { List } from "lucide-react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface ExpenseCategoriesProps {
  expenses: ExpensesByCategory;
  onChange: (expenses: ExpensesByCategory) => void;
}

export function ExpenseCategories({
  expenses,
  onChange,
}: ExpenseCategoriesProps) {
  const t = useTranslations("expense_categories");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleExpenseChange = (
    categoryId: string,
    subcategoryId: string,
    value: string
  ) => {
    const newExpenses = {
      ...expenses,
      [categoryId]: {
        ...(expenses[categoryId] || {}),
        [subcategoryId]: Number(value) || 0,
      },
    };
    onChange(newExpenses);
  };

  const calculateCategoryTotal = (categoryId: string) => {
    const categoryExpenses = expenses[categoryId] || {};
    return Object.values(categoryExpenses).reduce(
      (sum, amount) => sum + amount,
      0
    );
  };

  const calculateGrandTotal = () => {
    return Object.values(expenses).reduce((sum, category) => {
      return (
        sum +
        Object.values(category).reduce((catSum, amount) => catSum + amount, 0)
      );
    }, 0);
  };

  return (
    <Card>
      <CardHeader>
        <List className="icon-primary" />
        <CardTitle tabIndex={0} aria-label={t("aria.title")}>
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Accordion
          type="multiple"
          value={expandedCategories}
          onValueChange={setExpandedCategories}
          className="space-y-4 w-full"
        >
          {expenseCategories.map((category) => {
            const categoryTotal = calculateCategoryTotal(category.id);
            return (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                aria-label={`${t(`${category.id}.name`)} category`}
              >
                <AccordionTrigger
                  className={`flex items-center justify-between px-4 py-3 rounded-t-lg ${
                    expandedCategories.includes(category.id)
                      ? "rounded-b-none"
                      : "rounded-b-lg"
                  } hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors`}
                >
                  <Text className="font-medium text-gray-800 dark:text-gray-100 truncate whitespace-normal sm:truncate flex-1">
                    {t(`${category.id}.name`)}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-300 text-right w-24 flex-shrink-0">
                    {formatCurrency(categoryTotal)}
                  </Text>
                </AccordionTrigger>
                <AccordionContent className="transition-all duration-200">
                  <Box className="space-y-4 px-4 pb-0">
                    {category.subcategories.map((subcategory) => (
                      <Box
                        key={subcategory.id}
                        className={`
                          flex items-center justify-between gap-4
                          py-2 px-2 group
                          even:bg-gray-50 odd:bg-white
                          dark:even:bg-gray-900 dark:odd:bg-gray-800
                          transition-colors
                          focus-within:bg-blue-100 dark:focus-within:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-500
                          hover:bg-blue-50 dark:hover:bg-blue-900/10 -mx-4 pl-4 mb-0 ${
                            expandedCategories.includes(category.id) &&
                            subcategory.id ===
                              category.subcategories[
                                category.subcategories.length - 1
                              ].id
                              ? "rounded-b-lg"
                              : "rounded-b-none"
                          }
                        `}
                      >
                        <label
                          className="
                            text-sm text-gray-700 dark:text-gray-300
                            group-focus-within:text-blue-400 group-hover:text-blue-300
                            transition-colors
                          "
                          htmlFor={`${category.id}-${subcategory.id}-input`}
                        >
                          {t(`${category.id}.${subcategory.id}`)}
                        </label>
                        <Input
                          id={`${category.id}-${subcategory.id}-input`}
                          type="number"
                          min={0}
                          className="w-32 bg-white border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-150 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                          value={expenses[category.id]?.[subcategory.id] || 0}
                          onChange={(e) =>
                            handleExpenseChange(
                              category.id,
                              subcategory.id,
                              e.target.value
                            )
                          }
                          onFocus={(e) => e.target.select()}
                          aria-label={`${t(`${category.id}.${subcategory.id}`)} in ${t(`${category.id}.name`)}`}
                        />
                      </Box>
                    ))}
                  </Box>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <Box className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Box className="flex items-center justify-between flex-wrap gap-2">
            <Text className="font-medium text-gray-800 dark:text-gray-100">
              {t("total_expenses")}
            </Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(calculateGrandTotal())}
            </Text>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
