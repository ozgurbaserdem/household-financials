import { describe, it, expect } from "vitest";
import { calculateLoanScenarios } from "@/lib/calculations";
import type {
  CalculatorState,
  ExpensesByCategory,
  CalculationResult,
} from "@/lib/types";

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
    expenseViewMode: "detailed",
    totalExpenses: 0,
  });

  const getTestExpenses = (): ExpensesByCategory => ({
    home: 6000,
    food: 5000,
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
      home: 6000,
      food: 5000,
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
      home: 0,
      food: 0,
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
      home: 19999998,
      food: 19999998,
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

    // Set decimal expenses (simplified structure)
    const decimalExpenses: ExpensesByCategory = {
      home: 2023.68, // 1234.56 + 789.12
      food: 1358.01, // 456.78 + 901.23
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
      home: 1000,
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
      food: 500,
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
      home: 1300, // Updated home expenses
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

  it("should use simple view total expenses when in simple mode", () => {
    const initialState = getInitialState();

    // Set up state with simple view mode and total expenses
    const simpleViewState: CalculatorState = {
      ...initialState,
      expenseViewMode: "simple",
      totalExpenses: 10000,
      expenses: {
        home: 5000, // This should be ignored in simple mode
        food: 3000, // This should be ignored in simple mode
      },
    };

    const simpleResults = calculateLoanScenarios(simpleViewState);

    // Set up state with detailed view mode using same individual expenses
    const detailedViewState: CalculatorState = {
      ...initialState,
      expenseViewMode: "detailed",
      totalExpenses: 0, // This should be ignored in detailed mode
      expenses: {
        home: 5000,
        food: 3000,
      },
    };

    const detailedResults = calculateLoanScenarios(detailedViewState);

    // Simple view uses totalExpenses (10000), detailed view uses sum of categories (8000)
    expect(simpleResults[0].remainingSavings).toBeLessThan(
      detailedResults[0].remainingSavings
    );
  });

  it("should use detailed view expenses when in detailed mode", () => {
    const initialState = getInitialState();

    // Test with detailed mode
    const detailedState: CalculatorState = {
      ...initialState,
      expenseViewMode: "detailed",
      totalExpenses: 15000, // This should be ignored
      expenses: {
        home: 6000,
        food: 4000,
        leisure: 2000,
      },
    };

    const detailedResults = calculateLoanScenarios(detailedState);

    // Should use sum of detailed expenses (12000), not totalExpenses (15000)
    const expectedExpenseTotal = 6000 + 4000 + 2000; // 12000

    // Compare with a state that has the same totalExpenses in simple mode
    const simpleState: CalculatorState = {
      ...initialState,
      expenseViewMode: "simple",
      totalExpenses: expectedExpenseTotal,
      expenses: {}, // Should be ignored
    };

    const simpleResults = calculateLoanScenarios(simpleState);

    // Results should be the same when using equivalent expense amounts
    expect(detailedResults[0].remainingSavings).toBe(
      simpleResults[0].remainingSavings
    );
  });
});
