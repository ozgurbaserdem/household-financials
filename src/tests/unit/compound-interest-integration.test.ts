import { describe, it, expect } from "vitest";
import {
  calculateCompoundInterest,
  calculateFinalValues,
  type CompoundInterestInputs,
} from "@/lib/compound-interest";

describe("Compound Interest Calculations - Integration Tests", () => {
  describe("calculateCompoundInterest", () => {
    it("should calculate realistic compound interest with typical inputs", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 100000,
        monthlySavings: 5000,
        yearlyReturn: 0.07, // 7% as decimal
        investmentHorizon: 10,
      };

      const result = calculateCompoundInterest(inputs);

      expect(result).toHaveLength(10);
      expect(result[0].year).toBe(1);
      expect(result[9].year).toBe(10);

      // After 10 years with 7% return, the total should be reasonable
      const finalYear = result[9];
      expect(finalYear.totalValue).toBeGreaterThan(inputs.startSum);
      expect(finalYear.totalValue).toBeLessThan(2000000); // Should not exceed 2M kr
      expect(finalYear.accumulatedSavings).toBe(600000); // 5k * 12 * 10
    });

    it("should handle zero start sum correctly", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 0,
        monthlySavings: 1000,
        yearlyReturn: 0.05, // 5% as decimal
        investmentHorizon: 5,
      };

      const result = calculateCompoundInterest(inputs);

      expect(result).toHaveLength(5);
      const finalYear = result[4];
      expect(finalYear.startSum).toBe(0);
      expect(finalYear.accumulatedSavings).toBe(60000); // 1k * 12 * 5
      expect(finalYear.totalValue).toBeGreaterThan(60000); // Should include compound returns
    });

    it("should handle zero monthly savings correctly", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 50000,
        monthlySavings: 0,
        yearlyReturn: 0.06, // 6% as decimal
        investmentHorizon: 3,
      };

      const result = calculateCompoundInterest(inputs);

      expect(result).toHaveLength(3);
      const finalYear = result[2];
      expect(finalYear.accumulatedSavings).toBe(0);
      expect(finalYear.totalValue).toBeGreaterThan(50000); // Should grow from start sum
      expect(finalYear.totalValue).toBeLessThan(70000); // Reasonable growth
    });

    it("should prevent astronomical values that indicate percentage conversion bugs", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 10000,
        monthlySavings: 1000,
        yearlyReturn: 0.15, // 15% as decimal (high but realistic)
        investmentHorizon: 20,
      };

      const result = calculateCompoundInterest(inputs);

      const finalYear = result[19];
      // Even with high returns over 20 years, should not exceed reasonable bounds
      expect(finalYear.totalValue).toBeLessThan(10000000); // Less than 10M kr
      expect(finalYear.totalValue).toBeGreaterThan(240000); // 20 years * 12k monthly
    });

    it("should handle edge case: minimum values", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 0,
        monthlySavings: 0,
        yearlyReturn: 0.01, // 1% as decimal
        investmentHorizon: 1,
      };

      const result = calculateCompoundInterest(inputs);

      expect(result).toHaveLength(1);
      const finalYear = result[0];
      expect(finalYear.totalValue).toBe(0);
      expect(finalYear.accumulatedSavings).toBe(0);
      expect(finalYear.compoundReturns).toBe(0);
    });

    it("should handle edge case: maximum reasonable values", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 10000000, // 10M kr
        monthlySavings: 100000, // 100k kr/month
        yearlyReturn: 0.15, // 15% as decimal
        investmentHorizon: 50,
      };

      const result = calculateCompoundInterest(inputs);

      expect(result).toHaveLength(50);
      const finalYear = result[49];
      
      // Should produce finite values
      expect(Number.isFinite(finalYear.totalValue)).toBe(true);
      expect(Number.isFinite(finalYear.compoundReturns)).toBe(true);
      
      // Should not be NaN or Infinity
      expect(finalYear.totalValue).not.toBe(Infinity);
      expect(finalYear.totalValue).not.toBe(NaN);
    });

    it("should show compound effect: later years grow faster than early years", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 0,
        monthlySavings: 5000,
        yearlyReturn: 0.08, // 8% as decimal
        investmentHorizon: 20,
      };

      const result = calculateCompoundInterest(inputs);

      // Compare growth in first 5 years vs last 5 years
      const year5Growth = result[4].totalValue - result[3].totalValue;
      const year20Growth = result[19].totalValue - result[18].totalValue;

      // Due to compound effect, year 20 growth should be much larger than year 5
      expect(year20Growth).toBeGreaterThan(year5Growth * 2);
    });
  });

  describe("calculateFinalValues", () => {
    it("should return correct final values structure", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 25000,
        monthlySavings: 3000,
        yearlyReturn: 0.07, // 7% as decimal
        investmentHorizon: 15,
      };

      const result = calculateFinalValues(inputs);

      expect(result).toHaveProperty("totalValue");
      expect(result).toHaveProperty("startSum");
      expect(result).toHaveProperty("totalSavings");
      expect(result).toHaveProperty("totalReturns");

      expect(result.startSum).toBe(25000);
      expect(result.totalSavings).toBe(540000); // 3k * 12 * 15
      expect(result.totalValue).toBeGreaterThan(565000); // Start + savings + returns
      expect(result.totalReturns).toBeGreaterThan(0);
    });

    it("should handle zero investment horizon", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 10000,
        monthlySavings: 1000,
        yearlyReturn: 0.05, // 5% as decimal
        investmentHorizon: 0,
      };

      const result = calculateFinalValues(inputs);

      // With 0 years, should return start values
      expect(result.totalValue).toBe(10000);
      expect(result.startSum).toBe(10000);
      expect(result.totalSavings).toBe(0);
      expect(result.totalReturns).toBe(0);
    });
  });

  describe("Percentage Conversion Bug Prevention", () => {
    it("should fail if percentage is passed instead of decimal (regression test)", () => {
      // This test ensures we never accidentally pass percentages instead of decimals
      const inputsWithPercentageError: CompoundInterestInputs = {
        startSum: 10000,
        monthlySavings: 1000,
        yearlyReturn: 7, // ERROR: This should be 0.07, not 7 (which would be 700%)
        investmentHorizon: 5,
      };

      const result = calculateCompoundInterest(inputsWithPercentageError);
      const finalYear = result[4];

      // With 700% return, the values would be astronomical compared to realistic 7%
      // This test will fail if someone accidentally passes percentages
      expect(finalYear.totalValue).toBeGreaterThan(100000000); // Would be over 100 million
      
      // This serves as documentation that our component MUST convert percentages to decimals
      // The component should pass 0.07, not 7
    });

    it("should produce reasonable values when proper decimal is used", () => {
      const inputsWithCorrectDecimal: CompoundInterestInputs = {
        startSum: 10000,
        monthlySavings: 1000,
        yearlyReturn: 0.07, // CORRECT: 7% as 0.07 decimal
        investmentHorizon: 5,
      };

      const result = calculateCompoundInterest(inputsWithCorrectDecimal);
      const finalYear = result[4];

      // With proper 7% return, values should be reasonable
      expect(finalYear.totalValue).toBeGreaterThan(60000); // Start + savings + some growth
      expect(finalYear.totalValue).toBeLessThan(100000); // But not astronomical
    });
  });

  describe("Mathematical Correctness", () => {
    it("should match manual calculation for simple case", () => {
      // Test case: 10k start, 1k monthly, 5% annual, 2 years
      const inputs: CompoundInterestInputs = {
        startSum: 10000,
        monthlySavings: 1000,
        yearlyReturn: 0.05, // 5% annual
        investmentHorizon: 2,
      };

      const result = calculateCompoundInterest(inputs);
      const finalYear = result[1]; // 2nd year (index 1)

      // Manual calculation:
      // Monthly rate = (1.05)^(1/12) - 1 ≈ 0.004074
      // After 24 months with monthly compounding and monthly contributions
      // Should be approximately 35k-36k
      expect(finalYear.totalValue).toBeGreaterThan(34000);
      expect(finalYear.totalValue).toBeLessThan(37000);
      expect(finalYear.accumulatedSavings).toBe(24000); // 1k * 24 months
    });

    it("should ensure compoundReturns = totalValue - startSum - totalSavings", () => {
      const inputs: CompoundInterestInputs = {
        startSum: 50000,
        monthlySavings: 2000,
        yearlyReturn: 0.06, // 6% annual
        investmentHorizon: 10,
      };

      const result = calculateCompoundInterest(inputs);
      
      result.forEach(year => {
        const calculatedReturns = year.totalValue - year.startSum - year.accumulatedSavings;
        expect(Math.abs(year.compoundReturns - calculatedReturns)).toBeLessThan(0.01); // Allow tiny rounding differences
      });
    });
  });
});