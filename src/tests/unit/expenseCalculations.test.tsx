import { describe, it, expect, vi } from "vitest";
import { calculateLoanScenarios } from "@/lib/calculations";
import type {
  CalculatorState,
  ExpensesByCategory,
  CalculationResult,
} from "@/lib/types";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

describe("Expense Calculations and Net Income", () => {
  const getInitialState = (): CalculatorState => ({
    loanParameters: {
      amount: 5000000,
      interestRates: [3.5],
      amortizationRates: [2],
    },
    income: {
      income1: 50000,
      income2: 30000,
      secondaryIncome1: 0,
      secondaryIncome2: 0,
      childBenefits: 0,
      otherBenefits: 0,
      otherIncomes: 0,
      currentBuffer: 0,
      numberOfAdults: "1",
    },
    expenses: {},
  });

  const getTestExpenses = (): ExpensesByCategory => ({
    home: {
      "rent-monthly-fee": 5000,
      "electricity-heating": 1000,
    },
    food: {
      groceries: 3000,
      "restaurants-cafes": 2000,
    },
  });

  const calculateTotalIncome = (result: CalculationResult): number => {
    return (
      result.income1 +
      result.income2 +
      result.secondaryIncome1 +
      result.secondaryIncome2 +
      (result.childBenefits ?? 0) +
      (result.otherBenefits ?? 0) +
      (result.otherIncomes ?? 0)
    );
  };

  it("should maintain net income when expenses change", () => {
    const initialState = getInitialState();
    const initialResults = calculateLoanScenarios(initialState);
    const initialTotalIncome = calculateTotalIncome(initialResults[0]);

    // Update expenses
    const newState = {
      ...initialState,
      income: { ...initialState.income },
      expenses: getTestExpenses(),
    };
    const updatedResults = calculateLoanScenarios(newState);
    const updatedTotalIncome = calculateTotalIncome(updatedResults[0]);

    expect(updatedTotalIncome).toBe(initialTotalIncome);
    expect(updatedResults[0].remainingSavings).not.toBe(
      initialResults[0].remainingSavings
    );
  });

  it("should handle zero expense values", () => {
    const initialState = getInitialState();
    const initialResults = calculateLoanScenarios(initialState);
    const initialTotalIncome = calculateTotalIncome(initialResults[0]);

    // First add some expenses
    const withExpenses: ExpensesByCategory = {
      home: {
        "rent-monthly-fee": 5000,
        "electricity-heating": 1000,
      },
      food: {
        groceries: 3000,
        "restaurants-cafes": 2000,
      },
    };

    const stateWithExpenses = {
      ...initialState,
      income: { ...initialState.income },
      expenses: withExpenses,
    };
    const resultsWithExpenses = calculateLoanScenarios(stateWithExpenses);
    const totalIncomeWithExpenses = calculateTotalIncome(
      resultsWithExpenses[0]
    );

    // Then set all expenses to zero
    const zeroExpenses: ExpensesByCategory = {
      home: {
        "rent-monthly-fee": 0,
        "electricity-heating": 0,
      },
      food: {
        groceries: 0,
        "restaurants-cafes": 0,
      },
    };

    const stateWithZeroExpenses = {
      ...initialState,
      income: { ...initialState.income },
      expenses: zeroExpenses,
    };
    const resultsWithZeroExpenses = calculateLoanScenarios(
      stateWithZeroExpenses
    );
    const totalIncomeWithZeroExpenses = calculateTotalIncome(
      resultsWithZeroExpenses[0]
    );

    // Verify total income remains constant
    expect(totalIncomeWithExpenses).toBe(initialTotalIncome);
    expect(totalIncomeWithZeroExpenses).toBe(initialTotalIncome);

    // Verify remaining savings changes appropriately
    expect(resultsWithExpenses[0].remainingSavings).toBeLessThan(
      resultsWithZeroExpenses[0].remainingSavings
    );
    expect(resultsWithZeroExpenses[0].remainingSavings).toBe(
      initialResults[0].remainingSavings
    );
  });

  it("should handle very large expense values", () => {
    const initialState = getInitialState();
    const initialResults = calculateLoanScenarios(initialState);
    const initialTotalIncome = calculateTotalIncome(initialResults[0]);

    // Set very large expenses
    const largeExpenses: ExpensesByCategory = {
      home: {
        "rent-monthly-fee": 9999999,
        "electricity-heating": 9999999,
      },
      food: {
        groceries: 9999999,
        "restaurants-cafes": 9999999,
      },
    };

    const newState = {
      ...initialState,
      income: { ...initialState.income },
      expenses: largeExpenses,
    };
    const updatedResults = calculateLoanScenarios(newState);
    const updatedTotalIncome = calculateTotalIncome(updatedResults[0]);

    expect(updatedTotalIncome).toBe(initialTotalIncome);
    expect(updatedResults[0].remainingSavings).toBeLessThan(
      initialResults[0].remainingSavings
    );
  });

  it("should handle decimal expense values", () => {
    const initialState = getInitialState();
    const initialResults = calculateLoanScenarios(initialState);
    const initialTotalIncome = calculateTotalIncome(initialResults[0]);

    // Set decimal expenses
    const decimalExpenses: ExpensesByCategory = {
      home: {
        "rent-monthly-fee": 1234.56,
        "electricity-heating": 789.12,
      },
      food: {
        groceries: 456.78,
        "restaurants-cafes": 901.23,
      },
    };

    const newState = {
      ...initialState,
      income: { ...initialState.income },
      expenses: decimalExpenses,
    };
    const updatedResults = calculateLoanScenarios(newState);
    const updatedTotalIncome = calculateTotalIncome(updatedResults[0]);

    expect(updatedTotalIncome).toBe(initialTotalIncome);
    expect(updatedResults[0].remainingSavings).not.toBe(
      initialResults[0].remainingSavings
    );
  });

  it("should handle multiple expense changes in sequence", () => {
    const initialState = getInitialState();
    const initialResults = calculateLoanScenarios(initialState);
    const initialTotalIncome = calculateTotalIncome(initialResults[0]);

    // First change
    const firstChange: ExpensesByCategory = {
      home: {
        "rent-monthly-fee": 1000,
        "electricity-heating": 0,
      },
    };
    const firstState = {
      ...initialState,
      income: { ...initialState.income },
      expenses: firstChange,
    };
    const firstResults = calculateLoanScenarios(firstState);
    expect(calculateTotalIncome(firstResults[0])).toBe(initialTotalIncome);

    // Second change
    const secondChange: ExpensesByCategory = {
      ...firstChange,
      food: {
        groceries: 500,
        "restaurants-cafes": 0,
      },
    };
    const secondState = {
      ...initialState,
      income: { ...initialState.income },
      expenses: secondChange,
    };
    const secondResults = calculateLoanScenarios(secondState);
    expect(calculateTotalIncome(secondResults[0])).toBe(initialTotalIncome);

    // Third change
    const thirdChange: ExpensesByCategory = {
      ...secondChange,
      home: {
        ...secondChange.home,
        "electricity-heating": 300,
      },
    };
    const thirdState = {
      ...initialState,
      income: { ...initialState.income },
      expenses: thirdChange,
    };
    const thirdResults = calculateLoanScenarios(thirdState);
    expect(calculateTotalIncome(thirdResults[0])).toBe(initialTotalIncome);
    expect(thirdResults[0].remainingSavings).not.toBe(
      initialResults[0].remainingSavings
    );
  });
});
