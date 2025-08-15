import { describe, it, expect } from "vitest";

import { getNetIncome } from "@/lib/calculations/";
import { financialCalculationService } from "@/lib/services";
import type { CalculatorState, IncomeState } from "@/lib/types";

describe("Secondary Income Tax Rate Integration Tests", () => {
  const createTestIncomeState = (
    overrides: Partial<IncomeState> = {}
  ): IncomeState => ({
    income1: 35000,
    income2: 30000,
    secondaryIncome1: 12000,
    secondaryIncome2: 8000,
    childBenefits: 1300,
    otherBenefits: 600,
    otherIncomes: 1500,
    currentBuffer: 75000,
    numberOfAdults: "2",
    selectedKommun: "Stockholm",
    includeChurchTax: false,
    secondaryIncomeTaxRate: 32,
    ...overrides,
  });

  const createTestCalculatorState = (
    incomeOverrides: Partial<IncomeState> = {}
  ): CalculatorState => ({
    loanParameters: {
      amount: 2500000,
      interestRate: 4.2,
      amortizationRate: 2.5,
      hasLoan: true,
    },
    income: createTestIncomeState(incomeOverrides),
    expenses: {
      food: 8500,
      housing: 12000,
      transport: 6000,
      entertainment: 3000,
      insurance: 2500,
    },
    expenseViewMode: "detailed",
    totalExpenses: 32000,
  });

  describe("End-to-end calculation consistency", () => {
    it("should maintain consistency across all calculation layers", () => {
      const state = createTestCalculatorState({
        secondaryIncome1: 15000,
        secondaryIncome2: 10000,
        secondaryIncomeTaxRate: 29,
      });

      // Test individual helper function
      const secondaryIncome1Net = getNetIncome(
        15000,
        true,
        undefined,
        undefined,
        29
      );
      const secondaryIncome2Net = getNetIncome(
        10000,
        true,
        undefined,
        undefined,
        29
      );

      // Test loan scenarios
      const loanScenarios =
        financialCalculationService.calculateLoanScenarios(state);

      // Verify consistency between individual calculations and total
      expect(loanScenarios[0].secondaryIncome1Net).toBeCloseTo(
        secondaryIncome1Net,
        2
      );
      expect(loanScenarios[0].secondaryIncome2Net).toBeCloseTo(
        secondaryIncome2Net,
        2
      );

      // Verify that loan scenarios use the correct tax rate
      expect(loanScenarios[0].secondaryIncome1Net).toBeCloseTo(10650, -2); // 15000 * 0.71
      expect(loanScenarios[0].secondaryIncome2Net).toBeCloseTo(7100, -2); // 10000 * 0.71
    });

    it("should show measurable difference between different tax rates", () => {
      const lowRateState = createTestCalculatorState({
        secondaryIncome1: 20000,
        secondaryIncome2: 15000,
        secondaryIncomeTaxRate: 26, // Low rate
      });

      const highRateState = createTestCalculatorState({
        secondaryIncome1: 20000,
        secondaryIncome2: 15000,
        secondaryIncomeTaxRate: 38, // High rate
      });

      const lowRateResults =
        financialCalculationService.calculateLoanScenarios(lowRateState);
      const highRateResults =
        financialCalculationService.calculateLoanScenarios(highRateState);

      // Secondary income net should be significantly different
      const lowRateSecondaryTotal =
        lowRateResults[0].secondaryIncome1Net +
        lowRateResults[0].secondaryIncome2Net;
      const highRateSecondaryTotal =
        highRateResults[0].secondaryIncome1Net +
        highRateResults[0].secondaryIncome2Net;

      const difference = lowRateSecondaryTotal - highRateSecondaryTotal;

      // With 35k secondary income and 12% rate difference, should be ~4200 SEK difference
      expect(difference).toBeGreaterThan(4000);
      expect(difference).toBeLessThan(5000);

      // This should translate to higher remaining savings
      expect(lowRateResults[0].remainingSavings).toBeGreaterThan(
        highRateResults[0].remainingSavings
      );
    });

    it("should handle edge case scenarios correctly", () => {
      // Test with minimum tax rate
      const minRateState = createTestCalculatorState({
        secondaryIncome1: 10000,
        secondaryIncome2: 0,
        secondaryIncomeTaxRate: 25,
      });

      // Test with maximum tax rate
      const maxRateState = createTestCalculatorState({
        secondaryIncome1: 10000,
        secondaryIncome2: 0,
        secondaryIncomeTaxRate: 40,
      });

      const minResults =
        financialCalculationService.calculateLoanScenarios(minRateState);
      const maxResults =
        financialCalculationService.calculateLoanScenarios(maxRateState);

      // Minimum rate: 10000 * 0.75 = 7500
      expect(minResults[0].secondaryIncome1Net).toBeCloseTo(7500, -1);

      // Maximum rate: 10000 * 0.60 = 6000
      expect(maxResults[0].secondaryIncome1Net).toBeCloseTo(6000, -1);

      // Difference should be 1500
      const netDifference =
        minResults[0].secondaryIncome1Net - maxResults[0].secondaryIncome1Net;
      expect(netDifference).toBeCloseTo(1500, -1);
    });

    it("should not affect primary income calculations", () => {
      const state1 = createTestCalculatorState({
        income1: 40000,
        income2: 35000,
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        secondaryIncomeTaxRate: 25, // Should not affect primary income
      });

      const state2 = createTestCalculatorState({
        income1: 40000,
        income2: 35000,
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        secondaryIncomeTaxRate: 40, // Should not affect primary income
      });

      const results1 =
        financialCalculationService.calculateLoanScenarios(state1);
      const results2 =
        financialCalculationService.calculateLoanScenarios(state2);

      // Primary income net should be identical regardless of secondary tax rate
      expect(results1[0].income1Net).toBeCloseTo(results2[0].income1Net, 2);
      expect(results1[0].income2Net).toBeCloseTo(results2[0].income2Net, 2);

      // Total remaining savings should also be identical since no secondary income
      expect(results1[0].remainingSavings).toBeCloseTo(
        results2[0].remainingSavings,
        2
      );
    });
  });

  describe("Real-world scenarios", () => {
    it("should calculate realistic Swedish household scenario", () => {
      // Typical Swedish household with secondary income from consulting
      const realisticState = createTestCalculatorState({
        income1: 45000, // Full-time job
        income2: 38000, // Partner's full-time job
        secondaryIncome1: 18000, // Consulting income
        secondaryIncome2: 0,
        childBenefits: 2500, // Two children
        secondaryIncomeTaxRate: 31, // Reasonable secondary rate
      });

      const results =
        financialCalculationService.calculateLoanScenarios(realisticState);
      const scenario = results[0];

      // Verify calculations are reasonable
      expect(scenario.income1Net).toBeGreaterThan(30000); // After taxes
      expect(scenario.income2Net).toBeGreaterThan(25000);
      expect(scenario.secondaryIncome1Net).toBeCloseTo(12420, -2); // 18000 * 0.69

      // Total net income should be reasonable for Swedish household
      const totalNet =
        scenario.income1Net +
        scenario.income2Net +
        scenario.secondaryIncome1Net +
        scenario.childBenefits +
        scenario.otherBenefits +
        scenario.otherIncomes;

      expect(totalNet).toBeGreaterThan(70000);
      expect(totalNet).toBeLessThan(90000);
    });

    it("should show impact of tax rate optimization", () => {
      // Scenario: consultant considering different income structures
      const consultantBase = {
        income1: 35000, // Base salary
        income2: 0,
        secondaryIncome1: 25000, // High consulting income
        secondaryIncome2: 0,
        childBenefits: 1300,
        otherBenefits: 0,
        otherIncomes: 0,
      };

      // Conservative approach with higher tax rate
      const conservativeState = createTestCalculatorState({
        ...consultantBase,
        secondaryIncomeTaxRate: 37,
      });

      // Optimized approach with lower tax rate
      const optimizedState = createTestCalculatorState({
        ...consultantBase,
        secondaryIncomeTaxRate: 28,
      });

      const conservativeResults =
        financialCalculationService.calculateLoanScenarios(conservativeState);
      const optimizedResults =
        financialCalculationService.calculateLoanScenarios(optimizedState);

      // Calculate monthly savings difference
      const savingsDifference =
        optimizedResults[0].remainingSavings -
        conservativeResults[0].remainingSavings;

      // With 25k secondary income and 9% rate difference, should save ~2250 SEK/month
      expect(savingsDifference).toBeGreaterThan(2000);
      expect(savingsDifference).toBeLessThan(2500);

      // Annual savings difference would be significant
      const annualSavingsDifference = savingsDifference * 12;
      expect(annualSavingsDifference).toBeGreaterThan(24000); // Over 24,000 SEK per year
    });

    it("should handle multiple secondary income sources correctly", () => {
      const multiIncomeState = createTestCalculatorState({
        income1: 42000,
        income2: 36000,
        secondaryIncome1: 12000, // Freelance work
        secondaryIncome2: 8000, // Partner's side business
        childBenefits: 1300,
        secondaryIncomeTaxRate: 33,
      });

      const results =
        financialCalculationService.calculateLoanScenarios(multiIncomeState);
      const scenario = results[0];

      // Both secondary incomes should use the same tax rate
      expect(scenario.secondaryIncome1Net).toBeCloseTo(8040, -2); // 12000 * 0.67
      expect(scenario.secondaryIncome2Net).toBeCloseTo(5360, -2); // 8000 * 0.67

      // Total secondary income net should be sum of both
      const totalSecondaryNet =
        scenario.secondaryIncome1Net + scenario.secondaryIncome2Net;
      expect(totalSecondaryNet).toBeCloseTo(13400, -2);
    });
  });

  describe("Validation and error handling", () => {
    it("should gracefully handle undefined tax rate", () => {
      const stateWithUndefinedRate = {
        ...createTestCalculatorState(),
        income: {
          ...createTestIncomeState(),
          secondaryIncomeTaxRate: undefined,
        } as unknown as IncomeState,
      } as CalculatorState;

      // Should not throw and should use default behavior
      expect(() =>
        financialCalculationService.calculateLoanScenarios(
          stateWithUndefinedRate
        )
      ).not.toThrow();
    });

    it("should handle zero secondary income gracefully", () => {
      const zeroSecondaryState = createTestCalculatorState({
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        secondaryIncomeTaxRate: 35, // Should not matter
      });

      const results =
        financialCalculationService.calculateLoanScenarios(zeroSecondaryState);

      expect(results[0].secondaryIncome1Net).toBe(0);
      expect(results[0].secondaryIncome2Net).toBe(0);
    });

    it("should maintain calculation precision across different rates", () => {
      const testRates = [25, 28, 31, 34, 37, 40];
      const testIncome = 15000;

      testRates.map((rate) => {
        const state = createTestCalculatorState({
          secondaryIncome1: testIncome,
          secondaryIncome2: 0,
          secondaryIncomeTaxRate: rate,
        });

        const results =
          financialCalculationService.calculateLoanScenarios(state);
        const expectedNet = testIncome * (1 - rate / 100);

        return expect(results[0].secondaryIncome1Net).toBeCloseTo(
          expectedNet,
          2
        );
      });
    });
  });
});
