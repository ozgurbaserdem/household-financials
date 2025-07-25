import { describe, it, expect } from "vitest";

import { FinancialCalculationService } from "@/lib/services/FinancialCalculationService";
import type { CalculatorState, IncomeState } from "@/lib/types";

describe("FinancialCalculationService", () => {
  const service = new FinancialCalculationService();

  const createMockIncomeState = (
    overrides: Partial<IncomeState> = {}
  ): IncomeState => ({
    income1: 30000,
    income2: 25000,
    secondaryIncome1: 10000,
    secondaryIncome2: 8000,
    childBenefits: 1200,
    otherBenefits: 500,
    otherIncomes: 2000,
    currentBuffer: 50000,
    numberOfAdults: "2",
    selectedKommun: "Stockholm",
    includeChurchTax: false,
    secondaryIncomeTaxRate: 34,
    ...overrides,
  });

  const createMockCalculatorState = (
    incomeOverrides: Partial<IncomeState> = {}
  ): CalculatorState => ({
    loanParameters: {
      amount: 2000000,
      interestRate: 3.5,
      amortizationRate: 2,
      hasLoan: true,
    },
    income: createMockIncomeState(incomeOverrides),
    expenses: {
      housing: 15000,
      food: 8000,
      transport: 5000,
    },
    expenseViewMode: "detailed",
    totalExpenses: 28000,
  });

  describe("calculateTotalIncome", () => {
    it("should calculate total income using custom secondary tax rate", () => {
      const incomeState = createMockIncomeState({
        secondaryIncome1: 15000,
        secondaryIncome2: 10000,
        secondaryIncomeTaxRate: 28, // Lower than default 34%
      });

      const result = service.calculateTotalIncome(incomeState);

      expect(result.gross).toBeGreaterThan(0);
      expect(result.net).toBeGreaterThan(0);
      expect(result.net).toBeLessThan(result.gross);

      // With lower tax rate, net should be higher than with default rate
      const defaultRateState = createMockIncomeState({
        secondaryIncome1: 15000,
        secondaryIncome2: 10000,
        secondaryIncomeTaxRate: 34,
      });
      const defaultResult = service.calculateTotalIncome(defaultRateState);

      expect(result.net).toBeGreaterThan(defaultResult.net);
    });

    it("should handle different secondary tax rates correctly", () => {
      const lowRateResult = service.calculateTotalIncome(
        createMockIncomeState({
          secondaryIncome1: 10000,
          secondaryIncome2: 0,
          secondaryIncomeTaxRate: 25, // Minimum rate
        })
      );

      const highRateResult = service.calculateTotalIncome(
        createMockIncomeState({
          secondaryIncome1: 10000,
          secondaryIncome2: 0,
          secondaryIncomeTaxRate: 40, // Maximum rate
        })
      );

      // Lower tax rate should result in higher net income
      expect(lowRateResult.net).toBeGreaterThan(highRateResult.net);
    });

    it("should calculate correctly with only primary income", () => {
      const incomeState = createMockIncomeState({
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        secondaryIncomeTaxRate: 30, // Should not affect calculation
      });

      const result = service.calculateTotalIncome(incomeState);

      expect(result.gross).toBeGreaterThan(0);
      expect(result.net).toBeGreaterThan(0);
    });

    it("should calculate correctly with only secondary income", () => {
      const incomeState = createMockIncomeState({
        income1: 0,
        income2: 0,
        secondaryIncome1: 20000,
        secondaryIncome2: 15000,
        secondaryIncomeTaxRate: 32,
      });

      const result = service.calculateTotalIncome(incomeState);

      expect(result.gross).toBe(20000 + 15000 + 1200 + 500 + 2000); // Including benefits
      expect(result.net).toBeLessThan(result.gross);
    });
  });

  describe("calculateLoanScenarios", () => {
    it("should use custom secondary tax rate in loan scenario calculations", () => {
      const state = createMockCalculatorState({
        secondaryIncome1: 12000,
        secondaryIncome2: 8000,
        secondaryIncomeTaxRate: 30,
      });

      const scenarios = service.calculateLoanScenarios(state);

      expect(scenarios.length).toBeGreaterThan(0);
      expect(scenarios[0].secondaryIncome1Net).toBeGreaterThan(0);
      expect(scenarios[0].secondaryIncome2Net).toBeGreaterThan(0);

      // Compare with higher tax rate
      const higherTaxState = createMockCalculatorState({
        secondaryIncome1: 12000,
        secondaryIncome2: 8000,
        secondaryIncomeTaxRate: 38,
      });

      const higherTaxScenarios = service.calculateLoanScenarios(higherTaxState);

      // Lower tax rate should result in higher net secondary income
      expect(scenarios[0].secondaryIncome1Net).toBeGreaterThan(
        higherTaxScenarios[0].secondaryIncome1Net
      );
      expect(scenarios[0].secondaryIncome2Net).toBeGreaterThan(
        higherTaxScenarios[0].secondaryIncome2Net
      );
    });

    it("should handle zero secondary income correctly", () => {
      const state = createMockCalculatorState({
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        secondaryIncomeTaxRate: 35,
      });

      const scenarios = service.calculateLoanScenarios(state);

      expect(scenarios[0].secondaryIncome1Net).toBe(0);
      expect(scenarios[0].secondaryIncome2Net).toBe(0);
    });

    it("should calculate remaining savings correctly with custom tax rates", () => {
      const state = createMockCalculatorState({
        secondaryIncome1: 15000,
        secondaryIncome2: 10000,
        secondaryIncomeTaxRate: 25, // Low tax rate
      });

      const scenarios = service.calculateLoanScenarios(state);

      // With lower tax rate, should have higher remaining savings
      expect(scenarios[0].remainingSavings).toBeGreaterThan(0);

      const higherTaxState = createMockCalculatorState({
        secondaryIncome1: 15000,
        secondaryIncome2: 10000,
        secondaryIncomeTaxRate: 40, // High tax rate
      });

      const higherTaxScenarios = service.calculateLoanScenarios(higherTaxState);

      expect(scenarios[0].remainingSavings).toBeGreaterThan(
        higherTaxScenarios[0].remainingSavings
      );
    });
  });

  describe("edge cases and validation", () => {
    it("should handle undefined secondary tax rate gracefully", () => {
      const incomeState = {
        ...createMockIncomeState(),
        secondaryIncomeTaxRate: undefined,
      } as unknown as IncomeState;

      // Should not throw error
      expect(() => service.calculateTotalIncome(incomeState)).not.toThrow();
    });

    it("should handle extreme tax rates within bounds", () => {
      const minRateState = createMockIncomeState({
        secondaryIncome1: 10000,
        secondaryIncomeTaxRate: 25,
      });

      const maxRateState = createMockIncomeState({
        secondaryIncome1: 10000,
        secondaryIncomeTaxRate: 40,
      });

      const minResult = service.calculateTotalIncome(minRateState);
      const maxResult = service.calculateTotalIncome(maxRateState);

      expect(minResult.net).toBeGreaterThan(maxResult.net);
      expect(minResult.gross).toBe(maxResult.gross);
    });

    it("should maintain consistency between calculateTotalIncome and calculateLoanScenarios", () => {
      const state = createMockCalculatorState({
        secondaryIncome1: 12000,
        secondaryIncome2: 8000,
        secondaryIncomeTaxRate: 32,
      });

      const scenarios = service.calculateLoanScenarios(state);

      // Both secondary incomes should use the same tax rate (32%)
      const expectedSecondary1Net = 12000 * (1 - 32 / 100);
      const expectedSecondary2Net = 8000 * (1 - 32 / 100);

      expect(scenarios[0].secondaryIncome1Net).toBeCloseTo(
        expectedSecondary1Net,
        -1
      );
      expect(scenarios[0].secondaryIncome2Net).toBeCloseTo(
        expectedSecondary2Net,
        -1
      );
    });
  });
});
