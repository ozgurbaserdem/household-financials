import { saveAs } from "file-saver";
import type { CalculatorState, ExpensesByCategory } from "./types";
import { expenseCategories } from "@/data/expenseCategories";

/**
 * Flattens expense categories into a flat key-value structure for CSV export.
 *
 * Converts the nested expense structure into a simple object where
 * each expense category becomes a direct property with its numeric value.
 * Missing categories are filled with 0 to ensure consistent CSV structure.
 *
 * @param expenses - Expense data organized by category
 * @returns Flat object with category IDs as keys and amounts as values
 *
 * @private
 */
const flattenExpenses = (
  expenses: ExpensesByCategory
): Record<string, number> => {
  const flat: Record<string, number> = {};
  for (const category of expenseCategories) {
    flat[category.id] = expenses?.[category.id] ?? 0;
  }
  return flat;
};

/**
 * Exports the complete calculator state to a CSV file for download.
 *
 * Creates a comprehensive CSV export containing:
 * - Loan parameters (amount, interest rate, amortization rate)
 * - All income sources (primary, secondary, benefits)
 * - All expense categories with their amounts
 *
 * The CSV is automatically downloaded with filename "financial-data.csv".
 * Uses file-saver library for cross-browser download compatibility.
 *
 * @param state - Complete calculator state to export
 *
 * @example
 * ```typescript
 * const calculatorState = {
 *   loanParameters: { amount: 3000000, interestRate: 3.5, amortizationRate: 2.0 },
 *   income: { income1: 50000, income2: 30000, ... },
 *   expenses: { home: 15000, food: 5000, ... }
 * };
 *
 * exportToCsv(calculatorState);
 * // Downloads "financial-data.csv" with all calculator data
 * ```
 */
export const exportToCsv = (state: CalculatorState) => {
  const { loanParameters, expenses, income } = state;
  const flatExpenses = flattenExpenses(expenses);
  const columns = [
    "loanAmount",
    "interestRate",
    "amortizationRate",
    "income1",
    "income2",
    "secondaryIncome1",
    "secondaryIncome2",
    "childBenefits",
    "otherBenefits",
    "otherIncomes",
    ...Object.keys(flatExpenses),
  ];
  const values = [
    loanParameters.amount,
    loanParameters.interestRate,
    loanParameters.amortizationRate,
    income.income1 ?? 0,
    income.income2 ?? 0,
    income.secondaryIncome1 ?? 0,
    income.secondaryIncome2 ?? 0,
    income.childBenefits ?? 0,
    income.otherBenefits ?? 0,
    income.otherIncomes ?? 0,
    ...Object.values(flatExpenses),
  ];
  const csv = [columns.join(","), values.join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, "financial-data.csv");
};
