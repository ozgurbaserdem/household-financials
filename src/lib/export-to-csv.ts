import { saveAs } from "file-saver";
import type { CalculatorState, ExpensesByCategory } from "./types";
import { expenseCategories } from "@/data/expenseCategories";

function flattenExpenses(expenses: ExpensesByCategory): Record<string, number> {
  const flat: Record<string, number> = {};
  for (const category of expenseCategories) {
    for (const sub of category.subcategories) {
      flat[`${category.id}.${sub.id}`] = expenses?.[category.id]?.[sub.id] ?? 0;
    }
  }
  return flat;
}

export function exportToCsv(state: CalculatorState) {
  const { loanParameters, expenses, income } = state;
  const flatExpenses = flattenExpenses(expenses);
  const columns = [
    "loanAmount",
    "interestRates",
    "amortizationRates",
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
    loanParameters.interestRates.join("|"),
    loanParameters.amortizationRates.join("|"),
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
}
