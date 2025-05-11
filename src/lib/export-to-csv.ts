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
  const { loanParameters, expenses } = state;
  const flatExpenses = flattenExpenses(expenses);
  const columns = [
    "loanAmount",
    "interestRates",
    "amortizationRates",
    "income1",
    "income2",
    "income3",
    "income4",
    "grossIncome1",
    "grossIncome2",
    "grossIncome3",
    "grossIncome4",
    "childBenefits",
    "otherBenefits",
    "otherIncomes",
    ...Object.keys(flatExpenses),
  ];
  const values = [
    loanParameters.amount,
    loanParameters.interestRates.join("|"),
    loanParameters.amortizationRates.join("|"),
    state.grossIncome1 ?? state.income1,
    state.grossIncome2 ?? state.income2,
    state.grossIncome3 ?? state.income3,
    state.grossIncome4 ?? state.income4,
    state.grossIncome1 ?? state.income1,
    state.grossIncome2 ?? state.income2,
    state.grossIncome3 ?? state.income3,
    state.grossIncome4 ?? state.income4,
    state.childBenefits ?? 0,
    state.otherBenefits ?? 0,
    state.otherIncomes ?? 0,
    ...Object.values(flatExpenses),
  ];
  const csv = [columns.join(","), values.join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, "financial-data.csv");
}
