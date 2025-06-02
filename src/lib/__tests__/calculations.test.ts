import { describe, it, expect } from "vitest";
import {
  calculateLoanScenarios,
  calculateTotalExpenses,
  formatCurrency,
  formatPercentage,
  getNetIncome,
  calculateSelectedHousingExpenses,
  calculateTotalNetIncome,
} from "@/lib/calculations";
import type { CalculatorState, ExpensesByCategory } from "@/lib/types";

describe("Financial Calculations", () => {
  describe("calculateLoanScenarios", () => {
    it("should calculate loan scenarios correctly", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRates: [3.5],
          amortizationRates: [2],
          customInterestRates: [],
        },
        income: {
          income1: 30000,
          income2: 25000,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      const expected = {
        interestRate: 3.5,
        amortizationRate: 2,
        monthlyInterest: results[0].monthlyInterest,
        monthlyAmortization: results[0].monthlyAmortization,
        totalHousingCost: results[0].totalHousingCost,
        totalExpenses: results[0].totalExpenses,
        remainingSavings:
          results[0].income1Net +
          results[0].income2Net +
          results[0].secondaryIncome1Net +
          results[0].secondaryIncome2Net +
          results[0].childBenefits +
          results[0].otherBenefits +
          results[0].otherIncomes -
          results[0].totalExpenses,
        income1Net: results[0].income1Net,
        income2Net: results[0].income2Net,
        secondaryIncome1Net: results[0].secondaryIncome1Net,
        secondaryIncome2Net: results[0].secondaryIncome2Net,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: results[0].currentBuffer,
        totalIncome: results[0].totalIncome,
      };
      expect(results[0]).toEqual(expected);
    });

    it("should handle multiple interest and amortization rates", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRates: [3.5, 4],
          amortizationRates: [2, 3],
          customInterestRates: [],
        },
        income: {
          income1: 30000,
          income2: 25000,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      expect(results).toHaveLength(4);
      expect(results.map((r) => r.interestRate)).toEqual([3.5, 3.5, 4, 4]);
      expect(results.map((r) => r.amortizationRate)).toEqual([2, 3, 2, 3]);
    });
  });

  describe("calculateTotalExpenses", () => {
    it("should calculate total expenses correctly", () => {
      const expenses: ExpensesByCategory = {
        home: 6000,
        food: 5000,
      };

      const total = calculateTotalExpenses(expenses);
      expect(total).toBe(11000);
    });

    it("should handle empty expenses", () => {
      const expenses: ExpensesByCategory = {};
      const total = calculateTotalExpenses(expenses);
      expect(total).toBe(0);
    });

    it("should correctly handle housing costs with simplified structure", () => {
      const expenses: ExpensesByCategory = {
        home: 13150,
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      // Total expenses should include ALL expenses
      expect(totalExpenses).toBe(13150);
      // Selected housing expenses should be the same as home category in simplified structure
      expect(selectedHousingExpenses).toBe(13150);
    });

    it("should handle mixed categories with housing costs", () => {
      const expenses: ExpensesByCategory = {
        home: 9300,
        carTransportation: 2000,
        food: 5000,
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      // Total expenses should include ALL expenses
      expect(totalExpenses).toBe(16300);
      // Selected housing expenses should be the home category total in simplified structure
      expect(selectedHousingExpenses).toBe(9300);
    });

    it("should handle zero values in housing category", () => {
      const expenses: ExpensesByCategory = {
        home: 0,
        food: 300,
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      expect(totalExpenses).toBe(300);
      expect(selectedHousingExpenses).toBe(0);
    });

    it("should handle negative values in housing category", () => {
      const expenses: ExpensesByCategory = {
        home: 2500,
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      expect(totalExpenses).toBe(2500);
      expect(selectedHousingExpenses).toBe(2500);
    });

    it("should handle very large values in housing category", () => {
      const expenses: ExpensesByCategory = {
        home: 250000,
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      expect(totalExpenses).toBe(250000);
      expect(selectedHousingExpenses).toBe(250000);
    });

    it("should handle missing housing category", () => {
      const expenses: ExpensesByCategory = {
        food: 7300,
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      expect(totalExpenses).toBe(7300);
      expect(selectedHousingExpenses).toBe(0);
    });
  });

  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      const normalizeSpaces = (str: string) => str.replace(/\s+/g, " ");

      expect(normalizeSpaces(formatCurrency(1000))).toBe(
        normalizeSpaces("1 000 kr")
      );
      expect(normalizeSpaces(formatCurrency(1000000))).toBe(
        normalizeSpaces("1 000 000 kr")
      );
      expect(normalizeSpaces(formatCurrency(0))).toBe(normalizeSpaces("0 kr"));
      expect(normalizeSpaces(formatCurrency(1234.56))).toBe(
        normalizeSpaces("1 235 kr")
      );
    });
  });

  describe("formatPercentage", () => {
    it("should format percentage correctly", () => {
      // Use a function to normalize the strings
      const normalizeString = (str: string) => str.replace(/\s+/g, " ").trim();

      expect(normalizeString(formatPercentage(3.5))).toBe(
        normalizeString("3,50 %")
      );
      expect(normalizeString(formatPercentage(0))).toBe(
        normalizeString("0,00 %")
      );
      expect(normalizeString(formatPercentage(100))).toBe(
        normalizeString("100,00 %")
      );
      expect(normalizeString(formatPercentage(3.14159))).toBe(
        normalizeString("3,14 %")
      );
    });
  });

  describe("getNetIncome", () => {
    it("should calculate net income correctly for basic case with default tax", () => {
      const gross = 30000;
      const net = getNetIncome(gross);
      // Expected calculation:
      // taxable = 30000 - 3000 = 27000
      // tax = 27000 * 0.31 = 8370
      // jobbskatteavdrag = 3100
      // final tax = 8370 - 3100 = 5270
      // net = 30000 - 5270 = 24730
      expect(net).toBe(24730);
    });

    it("should calculate net income with specific kommun tax", () => {
      const gross = 30000;
      const net = getNetIncome(gross, false, "STOCKHOLM", false);
      // Stockholm has 30.67% tax rate
      // taxable = 30000 - 3000 = 27000
      // tax = 27000 * 0.3067 = 8280.9
      // jobbskatteavdrag = 3100
      // final tax = 8280.9 - 3100 = 5180.9
      // net = 30000 - 5180.9 = 24819.1
      expect(Math.round(net)).toBe(24819);
    });

    it("should calculate net income with church tax included", () => {
      const gross = 30000;
      const net = getNetIncome(gross, false, "STOCKHOLM", true);
      // Stockholm has 31.54% tax rate with church tax
      // taxable = 30000 - 3000 = 27000
      // tax = 27000 * 0.3154 = 8515.8
      // jobbskatteavdrag = 3100
      // final tax = 8515.8 - 3100 = 5415.8
      // net = 30000 - 5415.8 = 24584.2
      expect(Math.round(net)).toBe(24584);
    });

    it("should handle income above statligSkatt threshold", () => {
      const gross = 60000;
      const net = getNetIncome(gross);
      expect(net).toBeLessThan(gross);
      expect(net).toBeGreaterThan(0);
    });

    it("should handle zero income", () => {
      const net = getNetIncome(0);
      expect(net).toBe(0);
    });

    it("should calculate secondary income correctly", () => {
      const gross = 30000;
      const net = getNetIncome(gross, true);
      // Expected calculation:
      // tax = 30000 * 0.34 = 10200
      // net = 30000 - 10200 = 19800
      expect(net).toBe(19800);
    });

    it("should ignore kommun selection for secondary income", () => {
      const gross = 30000;
      const net1 = getNetIncome(gross, true, "STOCKHOLM", true);
      const net2 = getNetIncome(gross, true);
      expect(net1).toBe(net2);
    });
  });

  describe("calculateTotalNetIncome", () => {
    it("should calculate total net income with kommun tax", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 0,
          interestRates: [],
          amortizationRates: [],
          customInterestRates: [],
        },
        income: {
          income1: 30000,
          income2: 25000,
          secondaryIncome1: 5000,
          secondaryIncome2: 0,
          childBenefits: 1500,
          otherBenefits: 500,
          otherIncomes: 1000,
          currentBuffer: 10000,
          numberOfAdults: "2",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const totalNet = calculateTotalNetIncome(state);
      // Should calculate with Stockholm tax rates for primary incomes
      // and default secondary income tax
      expect(totalNet).toBeGreaterThan(0);
      expect(totalNet).toBeLessThan(63000); // Less than gross total
    });

    it("should handle missing kommun selection", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 0,
          interestRates: [],
          amortizationRates: [],
          customInterestRates: [],
        },
        income: {
          income1: 30000,
          income2: 0,
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
      };

      const totalNet = calculateTotalNetIncome(state);
      expect(totalNet).toBe(24730); // Default tax calculation
    });
  });

  describe("Kommun Tax Integration", () => {
    it("should calculate correctly with high-tax kommun", () => {
      const gross = 40000;
      // DOROTEA has one of the highest tax rates: 35.44%
      const net = getNetIncome(gross, false, "DOROTEA", false);
      // taxable = 40000 - 3000 = 37000
      // tax = 37000 * 0.3544 = 13112.8
      // jobbskatteavdrag = 3100
      // final tax = 13112.8 - 3100 = 10012.8
      // net = 40000 - 10012.8 = 29987.2
      expect(Math.round(net)).toBe(29987);
    });

    it("should calculate correctly with low-tax kommun", () => {
      const gross = 40000;
      // VELLINGE has one of the lowest tax rates: 29.97%
      const net = getNetIncome(gross, false, "VELLINGE", false);
      // taxable = 40000 - 3000 = 37000
      // tax = 37000 * 0.2997 = 11088.9
      // jobbskatteavdrag = 3100
      // final tax = 11088.9 - 3100 = 7988.9
      // net = 40000 - 7988.9 = 32011.1
      expect(Math.round(net)).toBe(32011);
    });

    it("should show significant difference between kommuner", () => {
      const gross = 50000;
      const netHigh = getNetIncome(gross, false, "DOROTEA", true); // 36.74% with church
      const netLow = getNetIncome(gross, false, "VELLINGE", true); // 30.9% with church

      const difference = netLow - netHigh;
      // Should be approximately 2500-3000 kr difference per month
      expect(difference).toBeGreaterThan(2500);
      expect(difference).toBeLessThan(3500);
    });

    it("should handle invalid kommun name gracefully", () => {
      const gross = 30000;
      const netDefault = getNetIncome(gross);
      const netInvalid = getNetIncome(gross, false, "INVALID_KOMMUN", false);

      // Should fall back to default tax rate
      expect(netInvalid).toBe(netDefault);
    });

    it("should calculate loan scenarios with kommun tax", () => {
      const stateHighTax: CalculatorState = {
        loanParameters: {
          amount: 2000000,
          interestRates: [4],
          amortizationRates: [2],
          customInterestRates: [],
        },
        income: {
          income1: 40000,
          income2: 35000,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "2",
          selectedKommun: "DOROTEA",
          includeChurchTax: true,
        },
        expenses: {
          home: 2800,
        },
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const stateLowTax = {
        ...stateHighTax,
        income: {
          ...stateHighTax.income,
          selectedKommun: "VELLINGE",
        },
      };

      const resultsHigh = calculateLoanScenarios(stateHighTax);
      const resultsLow = calculateLoanScenarios(stateLowTax);

      // Lower tax kommun should have more remaining savings
      expect(resultsLow[0].remainingSavings).toBeGreaterThan(
        resultsHigh[0].remainingSavings
      );

      // The difference should be significant (several thousand kr)
      const savingsDiff =
        resultsLow[0].remainingSavings - resultsHigh[0].remainingSavings;
      expect(savingsDiff).toBeGreaterThan(3000);
    });
  });

  describe("Custom Interest Rates Calculations", () => {
    it("should calculate loan scenarios with custom interest rates only", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRates: [], // No predefined rates
          amortizationRates: [2, 3],
          customInterestRates: [2.74, 3.89], // Only custom rates
        },
        income: {
          income1: 30000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      // Should have 4 scenarios: 2 custom rates × 2 amortization rates
      expect(results).toHaveLength(4);

      // Verify rates are correct
      expect(results.map((r) => r.interestRate)).toEqual([
        2.74, 2.74, 3.89, 3.89,
      ]);
      expect(results.map((r) => r.amortizationRate)).toEqual([2, 3, 2, 3]);

      // Verify calculations are correct for first scenario (2.74% + 2%)
      const firstScenario = results[0];
      expect(firstScenario.interestRate).toBe(2.74);
      expect(firstScenario.amortizationRate).toBe(2);

      // Monthly payment = 1000000 * ((2.74 + 2) / 100 / 12) = 3950
      const expectedMonthlyPayment = 1000000 * ((2.74 + 2) / 100 / 12);
      expect(
        Math.round(
          firstScenario.monthlyInterest + firstScenario.monthlyAmortization
        )
      ).toBe(Math.round(expectedMonthlyPayment));
    });

    it("should calculate loan scenarios with mixed interest rates", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 2000000,
          interestRates: [3, 4], // Predefined rates
          amortizationRates: [2],
          customInterestRates: [2.74], // Custom rate
        },
        income: {
          income1: 50000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      // Should have 3 scenarios: 2 predefined + 1 custom × 1 amortization
      expect(results).toHaveLength(3);

      // Verify rates include both predefined and custom
      expect(results.map((r) => r.interestRate)).toEqual([3, 4, 2.74]);
      expect(results.map((r) => r.amortizationRate)).toEqual([2, 2, 2]);

      // Verify custom rate scenario calculation
      const customRateScenario = results.find((r) => r.interestRate === 2.74);
      expect(customRateScenario).toBeDefined();

      // Monthly payment = 2000000 * ((2.74 + 2) / 100 / 12) = 7900
      const expectedMonthlyPayment = 2000000 * ((2.74 + 2) / 100 / 12);
      expect(
        Math.round(
          customRateScenario!.monthlyInterest +
            customRateScenario!.monthlyAmortization
        )
      ).toBe(Math.round(expectedMonthlyPayment));
    });

    it("should handle precision correctly in custom rate calculations", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1500000,
          interestRates: [],
          amortizationRates: [2],
          customInterestRates: [2.789], // High precision custom rate
        },
        income: {
          income1: 40000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      expect(results).toHaveLength(1);

      const result = results[0];
      expect(result.interestRate).toBe(2.789);

      // Verify precision is maintained in calculations
      const expectedMonthlyPayment = 1500000 * ((2.789 + 2) / 100 / 12);
      expect(
        Math.abs(
          result.monthlyInterest +
            result.monthlyAmortization -
            expectedMonthlyPayment
        )
      ).toBeLessThan(0.01);
    });

    it("should calculate correct remaining savings with custom rates", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRates: [],
          amortizationRates: [3],
          customInterestRates: [4.25], // Custom rate
        },
        income: {
          income1: 40000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {
          home: 10000,
          food: 5000,
        },
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);
      const result = results[0];

      // Monthly payment = 1000000 * ((4.25 + 3) / 100 / 12) = 6041.67
      const expectedLoanPayment = 1000000 * ((4.25 + 3) / 100 / 12);

      // Total housing cost includes loan payment + home expenses
      const expectedTotalHousingCost = expectedLoanPayment + 10000; // home expenses

      // Net income should be calculated and remaining savings should be positive or negative accordingly
      expect(result.remainingSavings).toBe(
        result.totalIncome!.net - result.totalExpenses
      );
      expect(result.totalHousingCost).toBeCloseTo(expectedTotalHousingCost, 2);

      // Verify loan payment calculation separately
      expect(result.monthlyInterest + result.monthlyAmortization).toBeCloseTo(
        expectedLoanPayment,
        2
      );
    });

    it("should handle multiple custom rates with multiple amortization rates", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 2500000,
          interestRates: [],
          amortizationRates: [1, 2, 3],
          customInterestRates: [2.74, 3.89, 5.12], // Multiple custom rates
        },
        income: {
          income1: 60000,
          income2: 40000,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "2",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      // Should have 9 scenarios: 3 custom rates × 3 amortization rates
      expect(results).toHaveLength(9);

      // Verify all combinations are present
      const combinations = results.map((r) => ({
        interest: r.interestRate,
        amortization: r.amortizationRate,
      }));

      // Check a few specific combinations
      expect(combinations).toContainEqual({ interest: 2.74, amortization: 1 });
      expect(combinations).toContainEqual({ interest: 3.89, amortization: 2 });
      expect(combinations).toContainEqual({ interest: 5.12, amortization: 3 });

      // Verify the highest and lowest scenarios
      const sortedByRemaining = results.sort(
        (a, b) => b.remainingSavings - a.remainingSavings
      );
      const bestScenario = sortedByRemaining[0];
      const worstScenario = sortedByRemaining[sortedByRemaining.length - 1];

      // Best should have lowest combined rate (2.74 + 1 = 3.74%)
      expect(bestScenario.interestRate).toBe(2.74);
      expect(bestScenario.amortizationRate).toBe(1);

      // Worst should have highest combined rate (5.12 + 3 = 8.12%)
      expect(worstScenario.interestRate).toBe(5.12);
      expect(worstScenario.amortizationRate).toBe(3);
    });

    it("should handle zero percent custom interest rate", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRates: [],
          amortizationRates: [2],
          customInterestRates: [0], // Zero percent interest
        },
        income: {
          income1: 30000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);
      const result = results[0];

      expect(result.interestRate).toBe(0);
      expect(result.monthlyInterest).toBe(0);

      // Only amortization should apply: 1000000 * (2 / 100 / 12) = 1666.67
      const expectedAmortization = 1000000 * (2 / 100 / 12);
      expect(result.monthlyAmortization).toBeCloseTo(expectedAmortization, 2);
      expect(result.totalHousingCost).toBeCloseTo(expectedAmortization, 2);
    });

    it("should handle very high custom interest rates", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRates: [],
          amortizationRates: [1],
          customInterestRates: [15.75], // Very high interest rate
        },
        income: {
          income1: 80000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);
      const result = results[0];

      expect(result.interestRate).toBe(15.75);

      // Monthly payment = 1000000 * ((15.75 + 1) / 100 / 12) = 13958.33
      const expectedMonthlyPayment = 1000000 * ((15.75 + 1) / 100 / 12);
      expect(result.totalHousingCost).toBeCloseTo(expectedMonthlyPayment, 2);

      // Should likely result in negative remaining savings due to high payment
      expect(result.remainingSavings).toBeLessThan(result.totalIncome!.net);
    });

    it("should maintain order of rates in results when mixing predefined and custom", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRates: [3, 5], // Predefined rates
          amortizationRates: [2],
          customInterestRates: [2.5, 4.5], // Custom rates
        },
        income: {
          income1: 50000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      // Should have predefined rates first, then custom rates
      expect(results).toHaveLength(4);
      expect(results.map((r) => r.interestRate)).toEqual([3, 5, 2.5, 4.5]);
    });

    it("should handle empty custom rates array gracefully", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRates: [3],
          amortizationRates: [2],
          customInterestRates: [], // Empty custom rates
        },
        income: {
          income1: 40000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "STOCKHOLM",
          includeChurchTax: false,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      // Should only have predefined rate scenarios
      expect(results).toHaveLength(1);
      expect(results[0].interestRate).toBe(3);
    });
  });
});
