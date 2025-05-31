"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusOnMount } from "@/lib/hooks/use-focus-management";

interface ExpenseCategoriesProps {
  expenses: ExpensesByCategory;
  onChange: (expenses: ExpensesByCategory) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  home: <Home className="w-4 h-4" />,
  "car-transportation": <Car className="w-4 h-4" />,
  "shopping-services": <ShoppingBag className="w-4 h-4" />,
  "health-beauty": <Heart className="w-4 h-4" />,
  children: <Baby className="w-4 h-4" />,
  insurance: <Umbrella className="w-4 h-4" />,
  "savings-investments": <PiggyBank className="w-4 h-4" />,
  "vacation-traveling": <Plane className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  food: <Pizza className="w-4 h-4" />,
  uncategorized: <FileQuestion className="w-4 h-4" />,
  leisure: <Volleyball className="w-4 h-4" />,
  "loans-tax-fees": <DollarSign className="w-4 h-4" />,
};

export function ExpenseCategories({
  expenses,
  onChange,
}: ExpenseCategoriesProps) {
  const t = useTranslations("expense_categories");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);
  const titleRef = useFocusOnMount();

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

  const grandTotal = calculateGrandTotal();

  return (
    <Card gradient glass delay={0.2}>
      <CardHeader>
        <CardIcon>
          <List className="w-6 h-6 text-red-400" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle ref={titleRef} tabIndex={0} aria-label={t("aria.title")}>
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <TrendingDown className="w-8 h-8 text-red-400" />
        </motion.div>
      </CardHeader>

      <CardContent className="pb-6">
        <Accordion
          type="multiple"
          value={expandedCategories}
          onValueChange={setExpandedCategories}
          className="space-y-3 w-full"
        >
          {expenseCategories.map((category, index) => {
            const categoryTotal = calculateCategoryTotal(category.id);
            const isExpanded = expandedCategories.includes(category.id);
            const categoryPercentage =
              grandTotal > 0 ? (categoryTotal / grandTotal) * 100 : 0;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <AccordionItem
                  value={category.id}
                  className={`
                    glass rounded-xl border-0 overflow-hidden
                    ${focusedCategory === category.id ? "ring-2 ring-blue-500/50" : ""}
                    transition-all duration-300
                  `}
                  onFocus={() => setFocusedCategory(category.id)}
                  onBlur={() => setFocusedCategory(null)}
                >
                  <AccordionTrigger className="px-4 py-4 hover:bg-white/5 transition-colors">
                    {/* Mobile layout: flex-col, stacked, visible on mobile only */}
                    <Box className="flex flex-col w-full gap-2 sm:hidden">
                      <Box className="flex items-center justify-between w-full gap-2">
                        <Box className="flex items-center gap-3 min-w-0">
                          <Box
                            className={`
                              p-2 rounded-lg bg-gradient-to-br
                              ${categoryTotal > 0 ? "from-orange-600/20 to-red-600/20" : "from-gray-600/20 to-gray-700/20"}
                              transition-colors duration-300
                            `}
                          >
                            {categoryIcons[category.id] || (
                              <List className="w-4 h-4" />
                            )}
                          </Box>
                          <Text className="font-medium text-gray-200 whitespace-normal break-words min-w-0">
                            {t(`${category.id}.name`)}
                          </Text>
                        </Box>
                        <Text
                          className={`
                            text-sm font-semibold min-w-[70px] text-right
                            ${categoryTotal > 0 ? "text-orange-400" : "text-gray-500"}
                          `}
                        >
                          {formatCurrency(categoryTotal)}
                        </Text>
                      </Box>
                      {categoryTotal > 0 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden w-full mt-2"
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
                    {/* Desktop layout: flex-row, inline, visible on desktop only */}
                    <Box className="hidden sm:flex items-center justify-between w-full">
                      <Box className="flex items-center gap-3">
                        <Box
                          className={`
                            p-2 rounded-lg bg-gradient-to-br
                            ${categoryTotal > 0 ? "from-orange-600/20 to-red-600/20" : "from-gray-600/20 to-gray-700/20"}
                            transition-colors duration-300
                          `}
                        >
                          {categoryIcons[category.id] || (
                            <List className="w-4 h-4" />
                          )}
                        </Box>
                        <Text className="font-medium text-gray-200">
                          {t(`${category.id}.name`)}
                        </Text>
                      </Box>
                      <Box className="flex items-center gap-4">
                        {categoryTotal > 0 && (
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
                        <Text
                          className={`
                            text-sm font-semibold min-w-[100px] text-right
                            ${categoryTotal > 0 ? "text-orange-400" : "text-gray-500"}
                          `}
                        >
                          {formatCurrency(categoryTotal)}
                        </Text>
                      </Box>
                    </Box>
                  </AccordionTrigger>

                  <AnimatePresence>
                    {isExpanded && (
                      <AccordionContent className="px-4 pb-4">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2 pt-2"
                        >
                          {category.subcategories.map(
                            (subcategory, subIndex) => (
                              <motion.div
                                key={subcategory.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIndex * 0.03 }}
                                className={`
                                flex items-center justify-between gap-4
                                p-3 rounded-lg glass
                                hover:bg-white/5 transition-all duration-200
                                group
                              `}
                              >
                                <label
                                  className="text-sm text-gray-200 group-hover:text-white transition-colors cursor-pointer flex-1"
                                  htmlFor={`${category.id}-${subcategory.id}-input`}
                                >
                                  {t(`${category.id}.${subcategory.id}`)}
                                </label>
                                <Input
                                  id={`${category.id}-${subcategory.id}-input`}
                                  type="number"
                                  min={0}
                                  className="w-32 modern-input text-right"
                                  value={
                                    expenses[category.id]?.[subcategory.id] || 0
                                  }
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
                              </motion.div>
                            )
                          )}
                        </motion.div>
                      </AccordionContent>
                    )}
                  </AnimatePresence>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-6 glass rounded-xl"
        >
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <Box className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-pink-600/20">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </Box>
              <Text className="text-lg font-medium text-gray-200">
                {t("total_expenses")}
              </Text>
            </Box>
            <Text
              className={`text-2xl font-bold ${grandTotal > 0 ? "text-red-400" : "text-gray-500"}`}
              data-testid="grand-total"
            >
              {formatCurrency(grandTotal)}
            </Text>
          </Box>
        </motion.div>
      </CardContent>
    </Card>
  );
}
