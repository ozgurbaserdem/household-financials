import type { CalculatorState, ExpensesByCategory } from "./types";
import { expenseCategories } from "@/data/expenseCategories";
import { calculateNetIncome, calculateNetIncomeSecond } from "./calculations";

function unflattenExpenses(
  flat: Record<string, string | number>
): ExpensesByCategory {
  const result: ExpensesByCategory = {};
  for (const category of expenseCategories) {
    result[category.id] = {};
    for (const sub of category.subcategories) {
      const key = `${category.id}.${sub.id}`;
      result[category.id][sub.id] = Number(flat[key] ?? 0);
    }
  }
  return result;
}

export function importFromCsv(
  file: File,
  onSuccess: (state: Partial<CalculatorState>) => void,
  onError: (err: Error) => void
) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = reader.result as string;
      const [header, row] = text.trim().split("\n");
      const keys = header.split(",");
      const values = row.split(",");
      if (keys.length !== values.length) throw new Error("CSV column mismatch");
      const flat: Record<string, string> = {};
      keys.forEach((key, i) => {
        flat[key] = values[i];
      });

      const interestRatesRaw = flat.interestRates ?? flat.interestRate ?? "";
      const amortizationRatesRaw =
        flat.amortizationRates ?? flat.amortizationRate ?? "";

      const grossIncome1 = Number(flat.grossIncome1 ?? flat.income1);
      const grossIncome2 = Number(flat.grossIncome2 ?? flat.income2);
      const grossIncome3 = Number(flat.grossIncome3 ?? flat.income3);
      const grossIncome4 = Number(flat.grossIncome4 ?? flat.income4);
      const childBenefits = Number(flat.childBenefits ?? 0);
      const otherBenefits = Number(flat.otherBenefits ?? 0);
      const otherIncomes = Number(flat.otherIncomes ?? 0);

      const state: Partial<CalculatorState> = {
        loanParameters: {
          amount: Number(flat.loanAmount),
          interestRates: interestRatesRaw
            ? interestRatesRaw.split("|").map(Number)
            : [],
          amortizationRates: amortizationRatesRaw
            ? amortizationRatesRaw.split("|").map(Number)
            : [],
        },
        grossIncome1,
        grossIncome2,
        grossIncome3,
        grossIncome4,
        income1: calculateNetIncome(grossIncome1),
        income2: calculateNetIncome(grossIncome2),
        income3: calculateNetIncomeSecond(grossIncome3),
        income4: calculateNetIncomeSecond(grossIncome4),
        childBenefits,
        otherBenefits,
        otherIncomes,
        expenses: unflattenExpenses(flat),
      };
      onSuccess(state);
    } catch (err) {
      onError(err as Error);
    }
  };
  reader.onerror = () => onError(new Error("File read error"));
  reader.readAsText(file);
}
