import { describe, it, expect } from "vitest";
import { calculateCompoundInterest } from "@/lib/compound-interest";
import type { CompoundInterestInputs } from "@/lib/compound-interest";

describe("calculateCompoundInterest", () => {
  it("should calculate correct values for basic scenario", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 10000,
      monthlySavings: 1000,
      yearlyReturn: 0.07, // 7%
      investmentHorizon: 10,
    };

    const result = calculateCompoundInterest(inputs);

    // Basic validations
    expect(result).toHaveLength(10); // Year 1 to 10
    expect(result[0].year).toBe(1);
    expect(result[9].year).toBe(10);

    // First year should have some savings and returns
    expect(result[0].startSum).toBe(10000);
    expect(result[0].accumulatedSavings).toBe(12000); // 1000 * 12
    expect(result[0].compoundReturns).toBeGreaterThan(0);
    expect(result[0].totalValue).toBeGreaterThan(22000);

    // Final year calculations
    const finalYear = result[9]; // Index 9 for year 10
    expect(finalYear.startSum).toBe(10000);
    expect(finalYear.accumulatedSavings).toBe(120000); // 1000 * 12 * 10

    // Total value should be greater than simple sum due to compound interest
    expect(finalYear.totalValue).toBeGreaterThan(130000);
    expect(finalYear.compoundReturns).toBeGreaterThan(0);

    // Verify the math more precisely
    expect(finalYear.totalValue).toBeCloseTo(190723.24, 0);
    expect(finalYear.compoundReturns).toBeCloseTo(60723.24, 0);
  });

  it("should handle zero start sum", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 0,
      monthlySavings: 1000,
      yearlyReturn: 0.05,
      investmentHorizon: 5,
    };

    const result = calculateCompoundInterest(inputs);

    expect(result[0].startSum).toBe(0);
    expect(result[0].totalValue).toBeGreaterThan(0); // Should have savings from first year

    const finalYear = result[4]; // Index 4 for year 5
    expect(finalYear.startSum).toBe(0);
    expect(finalYear.accumulatedSavings).toBe(60000);
    expect(finalYear.totalValue).toBeGreaterThan(60000);
  });

  it("should handle zero monthly savings", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 50000,
      monthlySavings: 0,
      yearlyReturn: 0.08,
      investmentHorizon: 20,
    };

    const result = calculateCompoundInterest(inputs);

    const finalYear = result[19]; // Index 19 for year 20
    expect(finalYear.accumulatedSavings).toBe(0);
    expect(finalYear.startSum).toBe(50000);

    // Should grow purely from compound interest
    expect(finalYear.totalValue).toBeCloseTo(233047.86, 0);
    expect(finalYear.compoundReturns).toBeCloseTo(183047.86, 0);
  });

  it("should handle zero return rate", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 10000,
      monthlySavings: 500,
      yearlyReturn: 0,
      investmentHorizon: 10,
    };

    const result = calculateCompoundInterest(inputs);

    const finalYear = result[9]; // Index 9 for year 10
    expect(finalYear.compoundReturns).toBe(0);
    expect(finalYear.totalValue).toBe(70000); // 10000 + (500 * 12 * 10)
  });

  it("should handle high return rates", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 1000,
      monthlySavings: 100,
      yearlyReturn: 0.15, // 15%
      investmentHorizon: 30,
    };

    const result = calculateCompoundInterest(inputs);

    const finalYear = result[29]; // Index 29 for year 30
    expect(finalYear.totalValue).toBeGreaterThan(600000); // Should grow significantly
    // More precise check
    expect(finalYear.totalValue).toBeCloseTo(622867.64, 0);
  });

  it("should handle single year investment", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 10000,
      monthlySavings: 1000,
      yearlyReturn: 0.1,
      investmentHorizon: 1,
    };

    const result = calculateCompoundInterest(inputs);

    expect(result).toHaveLength(1); // Year 1 only
    const finalYear = result[0]; // Index 0 for year 1
    expect(finalYear.accumulatedSavings).toBe(12000);
    expect(finalYear.totalValue).toBeGreaterThan(22000);
  });

  it("should calculate monthly compound interest correctly", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 100000,
      monthlySavings: 5000,
      yearlyReturn: 0.12, // 12% annual
      investmentHorizon: 1,
    };

    const result = calculateCompoundInterest(inputs);
    const finalYear = result[0]; // Index 0 for year 1

    // Monthly rate should be approximately 0.9489%
    const monthlyRate = Math.pow(1.12, 1 / 12) - 1;

    // Manual calculation for verification
    let manualTotal = 100000;
    for (let month = 0; month < 12; month++) {
      manualTotal = manualTotal * (1 + monthlyRate) + 5000;
    }

    expect(finalYear.totalValue).toBeCloseTo(manualTotal, 0);
  });

  it("should maintain consistency across years", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 50000,
      monthlySavings: 2000,
      yearlyReturn: 0.06,
      investmentHorizon: 5,
    };

    const result = calculateCompoundInterest(inputs);

    // Verify year-over-year growth
    for (let i = 1; i < result.length; i++) {
      const prevYear = result[i - 1];
      const currYear = result[i];

      // Start sum should remain constant
      expect(currYear.startSum).toBe(prevYear.startSum);

      // Accumulated savings should increase by yearly amount
      expect(currYear.accumulatedSavings).toBe(
        prevYear.accumulatedSavings + 24000
      );

      // Total value should always increase
      expect(currYear.totalValue).toBeGreaterThan(prevYear.totalValue);

      // Compound returns should increase
      expect(currYear.compoundReturns).toBeGreaterThan(
        prevYear.compoundReturns
      );
    }
  });

  it("should handle maximum values", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 10000000, // 10 million
      monthlySavings: 100000, // 100k monthly
      yearlyReturn: 0.15, // 15%
      investmentHorizon: 50,
    };

    const result = calculateCompoundInterest(inputs);

    const finalYear = result[49]; // Index 49 for year 50
    expect(finalYear.totalValue).toBeGreaterThan(20000000000); // Should exceed 20 billion
    expect(isFinite(finalYear.totalValue)).toBe(true);
    expect(finalYear.totalValue).not.toBeNaN();
  });

  it("should handle decimal precision correctly", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 12345.67,
      monthlySavings: 1234.56,
      yearlyReturn: 0.0789,
      investmentHorizon: 7,
    };

    const result = calculateCompoundInterest(inputs);

    // All values should be finite numbers
    result.forEach((year) => {
      expect(isFinite(year.totalValue)).toBe(true);
      expect(isFinite(year.compoundReturns)).toBe(true);
      expect(year.totalValue).not.toBeNaN();
      expect(year.compoundReturns).not.toBeNaN();
    });
  });

  it("should stop monthly savings from withdrawal year onwards and withdraw every year", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 50000, // Start with more money to support withdrawals
      monthlySavings: 1000,
      yearlyReturn: 0.07,
      investmentHorizon: 5,
      withdrawalType: "amount",
      withdrawalYear: 3,
      withdrawalAmount: 5000, // Smaller withdrawal amount
    };

    const result = calculateCompoundInterest(inputs);

    // Years 1-2: Should have monthly savings
    expect(result[0].currentMonthlySavings).toBe(1000);
    expect(result[1].currentMonthlySavings).toBe(1000);

    // Years 3-5: Should have no monthly savings (withdrawal phase)
    expect(result[2].currentMonthlySavings).toBe(0);
    expect(result[3].currentMonthlySavings).toBe(0);
    expect(result[4].currentMonthlySavings).toBe(0);

    // Years 3-5: Should have withdrawals every year
    expect(result[2].withdrawal).toBe(5000);
    expect(result[3].withdrawal).toBe(5000);
    expect(result[4].withdrawal).toBe(5000);
  });

  it("should handle percentage withdrawal with stopped savings every year", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 100000,
      monthlySavings: 5000,
      yearlyReturn: 0.07,
      investmentHorizon: 3,
      withdrawalType: "percentage",
      withdrawalYear: 2,
      withdrawalPercentage: 10,
    };

    const result = calculateCompoundInterest(inputs);

    // Year 1: Normal savings
    expect(result[0].currentMonthlySavings).toBe(5000);

    // Years 2-3: No more savings
    expect(result[1].currentMonthlySavings).toBe(0);
    expect(result[2].currentMonthlySavings).toBe(0);

    // Years 2-3: Should have withdrawals every year
    expect(result[1].withdrawal).toBeGreaterThan(0);
    expect(result[2].withdrawal).toBeGreaterThan(0);

    // The second year withdrawal should be less than the first (smaller portfolio)
    expect(result[2].withdrawal).toBeLessThan(result[1].withdrawal!);
  });

  it("should continue annual savings increase until withdrawal year", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 0,
      monthlySavings: 1000,
      yearlyReturn: 0.05,
      investmentHorizon: 5,
      withdrawalType: "amount",
      withdrawalYear: 4,
      withdrawalAmount: 5000,
      annualSavingsIncrease: 10, // 10% increase per year
    };

    const result = calculateCompoundInterest(inputs);

    // Year 1: 1000/month
    expect(result[0].currentMonthlySavings).toBe(1000);

    // Year 2: 1100/month (10% increase)
    expect(result[1].currentMonthlySavings).toBe(1100);

    // Year 3: 1210/month (10% increase)
    expect(result[2].currentMonthlySavings).toBe(1210);

    // Years 4-5: 0/month (withdrawal phase, no more increases)
    expect(result[3].currentMonthlySavings).toBe(0);
    expect(result[4].currentMonthlySavings).toBe(0);
  });

  it("should handle the specific scenario: 1M portfolio, 100k annual withdrawals", () => {
    const inputs: CompoundInterestInputs = {
      startSum: 1000000, // Start with 1M
      monthlySavings: 0, // No monthly savings
      yearlyReturn: 0.07, // 7% annual return
      investmentHorizon: 3,
      withdrawalType: "amount",
      withdrawalYear: 1, // Start withdrawing immediately
      withdrawalAmount: 100000, // 100k per year
    };

    const result = calculateCompoundInterest(inputs);

    // Year 1: Start with 1M, withdraw 100k, left with 900k, grow to ~963k
    expect(result[0].withdrawal).toBe(100000);
    expect(result[0].totalValue).toBeCloseTo(963000, -1); // Within ~1000

    // Year 2: Start with ~963k, withdraw 100k, left with ~863k, grow to ~923k
    expect(result[1].withdrawal).toBe(100000);
    expect(result[1].totalValue).toBeCloseTo(923410, 0); // More precise value

    // Year 3: Start with ~923k, withdraw 100k, left with ~823k, grow to ~881k
    expect(result[2].withdrawal).toBe(100000);
    expect(result[2].totalValue).toBeCloseTo(881049, 0); // More precise value
  });
});
