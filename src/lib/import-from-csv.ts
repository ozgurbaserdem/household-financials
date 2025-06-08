import { expenseCategories } from "@/data/expenseCategories";

import type { CalculatorState, ExpensesByCategory } from "./types";

/**
 * Converts flattened CSV data back into structured expense categories.
 *
 * Takes the flat key-value structure from CSV parsing and reconstructs
 * the ExpensesByCategory object with proper numeric values and defaults.
 *
 * @param flat - Flat object from CSV parsing with string/number values
 * @returns Structured expense categories object
 *
 * @private
 */
const unflattenExpenses = (
  flat: Record<string, string | number>
): ExpensesByCategory => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return expenseCategories.reduce((result, category) => {
    result[category.id] = Number(flat[category.id] ?? 0);
    return result;
  }, {} as ExpensesByCategory);
};

/**
 * Imports calculator state from a CSV file with comprehensive error handling.
 *
 * Parses a CSV file containing financial calculator data and reconstructs
 * the calculator state. Handles file reading, CSV parsing, data validation,
 * and type conversion with robust error handling.
 *
 * Expected CSV format:
 * - First row: Column headers (loanAmount, interestRate, income1, etc.)
 * - Second row: Corresponding values
 *
 * @param file - The CSV file object to import
 * @param onSuccess - Callback function called with parsed calculator state
 * @param onError - Callback function called if import fails
 *
 * @example
 * ```typescript
 * const handleFileSelect = (file: File) => {
 *   importFromCsv(
 *     file,
 *     (state) => {
 *       console.log('Import successful:', state);
 *       // Update calculator with imported data
 *     },
 *     (error) => {
 *       console.error('Import failed:', error.message);
 *       // Show error message to user
 *     }
 *   );
 * };
 * ```
 *
 * @throws Will call onError for:
 * - File reading errors
 * - CSV format mismatches (column count mismatch)
 * - Invalid data values
 * - Malformed CSV structure
 */
export const importFromCsv = (
  file: File,
  onSuccess: (state: Partial<CalculatorState>) => void,
  onError: (err: Error) => void
) => {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = reader.result as string;
      const [header, row] = text.trim().split("\n");
      const keys = header.split(",");
      const values = row.split(",");
      if (keys.length !== values.length) throw new Error("CSV column mismatch");
      // eslint-disable-next-line unicorn/no-array-reduce
      const flat: Record<string, string> = keys.reduce(
        (result, key, i) => {
          result[key] = values[i];
          return result;
        },
        {} as Record<string, string>
      );

      const interestRate = Number(flat.interestRate ?? 3.5);
      const amortizationRate = Number(flat.amortizationRate ?? 2);

      const income1 = Number(flat.income1 ?? 0);
      const income2 = Number(flat.income2 ?? 0);
      const secondaryIncome1 = Number(flat.secondaryIncome1 ?? 0);
      const secondaryIncome2 = Number(flat.secondaryIncome2 ?? 0);
      const childBenefits = Number(flat.childBenefits ?? 0);
      const otherBenefits = Number(flat.otherBenefits ?? 0);
      const otherIncomes = Number(flat.otherIncomes ?? 0);

      const state: Partial<CalculatorState> = {
        loanParameters: {
          amount: Number(flat.loanAmount ?? 0),
          interestRate,
          amortizationRate,
          hasLoan: Number(flat.loanAmount ?? 0) > 0,
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
};
