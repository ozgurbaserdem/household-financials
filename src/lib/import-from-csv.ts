import type { CalculatorState, ExpensesByCategory } from "./types";
import { expenseCategories } from "@/data/expenseCategories";

function unflattenExpenses(
  flat: Record<string, string | number>
): ExpensesByCategory {
  const result: ExpensesByCategory = {};
  for (const category of expenseCategories) {
    result[category.id] = Number(flat[category.id] ?? 0);
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

      const income1 = Number(flat.income1 ?? 0);
      const income2 = Number(flat.income2 ?? 0);
      const secondaryIncome1 = Number(flat.secondaryIncome1 ?? 0);
      const secondaryIncome2 = Number(flat.secondaryIncome2 ?? 0);
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
          customInterestRates: [],
        },
        income: {
          income1,
          income2,
          secondaryIncome1,
          secondaryIncome2,
          childBenefits,
          otherBenefits,
          otherIncomes,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
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
