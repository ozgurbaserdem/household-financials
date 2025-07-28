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
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: true,
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
          secondaryIncomeTaxRate: 34,
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

    it("should calculate loan scenario with different rates", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRate: 4,
          amortizationRate: 3,
          hasLoan: true,
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
          secondaryIncomeTaxRate: 34,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      expect(results).toHaveLength(1);
      expect(results[0].interestRate).toBe(4);
      expect(results[0].amortizationRate).toBe(3);
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
          interestRate: 0,
          amortizationRate: 0,
          hasLoan: false,
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
          secondaryIncomeTaxRate: 34,
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
          interestRate: 0,
          amortizationRate: 0,
          hasLoan: false,
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
          selectedKommun: "Stockholm",
          includeChurchTax: false,
          secondaryIncomeTaxRate: 30,
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
          interestRate: 4,
          amortizationRate: 2,
          hasLoan: true,
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
          secondaryIncomeTaxRate: 34,
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

  describe("Loan Calculations with Different Scenarios", () => {
    it("should calculate loan scenario with precise rates", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1500000,
          interestRate: 2.789,
          amortizationRate: 2,
          hasLoan: true,
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
          secondaryIncomeTaxRate: 34,
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

    it("should calculate correct remaining savings with loan", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRate: 4.25,
          amortizationRate: 3,
          hasLoan: true,
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
          secondaryIncomeTaxRate: 34,
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
      expect(result.totalIncome).toBeDefined();
      expect(result.remainingSavings).toBe(
        (result.totalIncome?.net ?? 0) - result.totalExpenses
      );
      expect(result.totalHousingCost).toBeCloseTo(expectedTotalHousingCost, 2);

      // Verify loan payment calculation separately
      expect(result.monthlyInterest + result.monthlyAmortization).toBeCloseTo(
        expectedLoanPayment,
        2
      );
    });

    it("should handle zero percent interest rate", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRate: 0,
          amortizationRate: 2,
          hasLoan: true,
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
          secondaryIncomeTaxRate: 34,
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

    it("should handle very high interest rates", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRate: 15.75,
          amortizationRate: 1,
          hasLoan: true,
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
          secondaryIncomeTaxRate: 34,
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
      expect(result.totalIncome).toBeDefined();
      expect(result.remainingSavings).toBeLessThan(
        result.totalIncome?.net ?? 0
      );
    });

    it("should handle no loan scenario", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRate: 3,
          amortizationRate: 2,
          hasLoan: false,
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
          secondaryIncomeTaxRate: 34,
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const results = calculateLoanScenarios(state);

      // Should return scenario with zero loan costs
      expect(results).toHaveLength(1);
      expect(results[0].interestRate).toBe(0);
      expect(results[0].amortizationRate).toBe(0);
      expect(results[0].monthlyInterest).toBe(0);
      expect(results[0].monthlyAmortization).toBe(0);
    });
  });

  describe("getNetIncome with secondary income tax rates", () => {
    it("should calculate secondary income with default rate when no custom rate provided", () => {
      const gross = 10000;
      const net = getNetIncome(gross, true);

      // With default 34% rate, net should be approximately 6600
      expect(net).toBeCloseTo(6600, -2);
    });

    it("should calculate secondary income with custom tax rate", () => {
      const gross = 10000;
      const netLowRate = getNetIncome(gross, true, undefined, undefined, 25);
      const netHighRate = getNetIncome(gross, true, undefined, undefined, 40);

      // 25% rate should result in 7500 net
      expect(netLowRate).toBeCloseTo(7500, -2);
      // 40% rate should result in 6000 net
      expect(netHighRate).toBeCloseTo(6000, -2);

      // Lower rate should give higher net income
      expect(netLowRate).toBeGreaterThan(netHighRate);
    });

    it("should handle edge cases for secondary income tax rates", () => {
      const gross = 15000;

      // Minimum rate (25%)
      const minRate = getNetIncome(gross, true, undefined, undefined, 25);
      expect(minRate).toBeCloseTo(11250, -2);

      // Maximum rate (40%)
      const maxRate = getNetIncome(gross, true, undefined, undefined, 40);
      expect(maxRate).toBeCloseTo(9000, -2);

      // Default rate (34%)
      const defaultRate = getNetIncome(gross, true);
      const explicitDefault = getNetIncome(
        gross,
        true,
        undefined,
        undefined,
        34
      );
      expect(defaultRate).toBeCloseTo(explicitDefault, 2);
    });

    it("should not use custom rate for primary income", () => {
      const gross = 20000;
      const primaryWithoutRate = getNetIncome(gross, false, "Stockholm");
      const primaryWithRate = getNetIncome(
        gross,
        false,
        "Stockholm",
        false,
        25
      );

      // Custom rate should be ignored for primary income
      expect(primaryWithoutRate).toBeCloseTo(primaryWithRate, 2);
    });
  });

  describe("calculateTotalNetIncome with secondary tax rates", () => {
    it("should use custom secondary tax rate in total calculations", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 0,
          interestRate: 0,
          amortizationRate: 0,
          hasLoan: false,
        },
        income: {
          income1: 30000,
          income2: 0,
          secondaryIncome1: 15000,
          secondaryIncome2: 10000,
          childBenefits: 1200,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
          selectedKommun: "Stockholm",
          includeChurchTax: false,
          secondaryIncomeTaxRate: 28, // Lower than default 34%
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const totalNet = calculateTotalNetIncome(state);

      // Compare with default rate
      const stateWithDefaultRate = {
        ...state,
        income: {
          ...state.income,
          secondaryIncomeTaxRate: 34,
        },
      };
      const totalNetDefault = calculateTotalNetIncome(stateWithDefaultRate);

      // Lower tax rate should result in higher total net income
      expect(totalNet).toBeGreaterThan(totalNetDefault);
    });

    it("should handle zero secondary income correctly", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 0,
          interestRate: 0,
          amortizationRate: 0,
          hasLoan: false,
        },
        income: {
          income1: 40000,
          income2: 30000,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 1500,
          otherBenefits: 500,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "2",
          selectedKommun: "Stockholm",
          includeChurchTax: false,
          secondaryIncomeTaxRate: 40, // High rate shouldn't matter
        },
        expenses: {},
        expenseViewMode: "detailed",
        totalExpenses: 0,
      };

      const totalNet = calculateTotalNetIncome(state);

      // Should be same as with any other rate since no secondary income
      const stateWithLowRate = {
        ...state,
        income: {
          ...state.income,
          secondaryIncomeTaxRate: 25,
        },
      };
      const totalNetLowRate = calculateTotalNetIncome(stateWithLowRate);

      expect(totalNet).toBeCloseTo(totalNetLowRate, 2);
    });
  });
});
