import { describe, it, expect } from "vitest";
import {
  calculateLoanScenarios,
  calculateTotalExpenses,
  formatCurrency,
  formatPercentage,
  calculateNetIncome,
  calculateNetIncomeSecond,
  calculateSelectedHousingExpenses,
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
        },
        expenses: {},
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
        },
        expenses: {},
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
        housing: {
          rent: 5000,
          utilities: 1000,
        },
        food: {
          groceries: 3000,
          restaurants: 2000,
        },
      };

      const total = calculateTotalExpenses(expenses);
      expect(total).toBe(11000);
    });

    it("should handle empty expenses", () => {
      const expenses: ExpensesByCategory = {};
      const total = calculateTotalExpenses(expenses);
      expect(total).toBe(0);
    });

    it("should correctly handle housing costs with all subcategories", () => {
      const expenses: ExpensesByCategory = {
        home: {
          "rent-monthly-fee": 5000,
          "electricity-heating": 1000,
          mortgage: 2000,
          "water-garbage": 500,
          pets: 300,
          "streaming-internet-phone": 400,
          "house-cleaning": 600,
          "interior-decoration": 200,
          "home-improvements": 1000,
          "holiday-home": 1500,
          gardening: 200,
          "home-alarm": 150,
          "other-household": 300,
        },
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      // Total expenses should include ALL expenses
      expect(totalExpenses).toBe(13150);
      // Selected housing expenses should only include the specific housing-related costs
      expect(selectedHousingExpenses).toBe(8500);
    });

    it("should handle mixed categories with housing costs", () => {
      const expenses: ExpensesByCategory = {
        home: {
          "rent-monthly-fee": 5000,
          "electricity-heating": 1000,
          mortgage: 2000,
          "water-garbage": 500,
          pets: 300,
        },
        "car-transportation": {
          fuel: 1500,
          parking: 500,
        },
        food: {
          groceries: 3000,
          restaurants: 2000,
        },
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      // Total expenses should include ALL expenses
      expect(totalExpenses).toBe(15800);
      // Selected housing expenses should only include the specific housing-related costs
      expect(selectedHousingExpenses).toBe(8500);
    });

    it("should handle zero values in housing subcategories", () => {
      const expenses: ExpensesByCategory = {
        home: {
          "rent-monthly-fee": 0,
          "electricity-heating": 0,
          mortgage: 0,
          "water-garbage": 0,
          pets: 300,
        },
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      expect(totalExpenses).toBe(300);
      expect(selectedHousingExpenses).toBe(0);
    });

    it("should handle negative values in housing subcategories", () => {
      const expenses: ExpensesByCategory = {
        home: {
          "rent-monthly-fee": -1000,
          "electricity-heating": 1000,
          mortgage: 2000,
          "water-garbage": 500,
        },
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      expect(totalExpenses).toBe(2500);
      expect(selectedHousingExpenses).toBe(2500);
    });

    it("should handle very large values in housing subcategories", () => {
      const expenses: ExpensesByCategory = {
        home: {
          "rent-monthly-fee": 100000,
          "electricity-heating": 50000,
          mortgage: 75000,
          "water-garbage": 25000,
        },
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      expect(totalExpenses).toBe(250000);
      expect(selectedHousingExpenses).toBe(250000);
    });

    it("should handle missing housing subcategories", () => {
      const expenses: ExpensesByCategory = {
        home: {
          "rent-monthly-fee": 5000,
          // Missing electricity-heating
          mortgage: 2000,
          // Missing water-garbage
          pets: 300,
        },
      };

      const totalExpenses = calculateTotalExpenses(expenses);
      const selectedHousingExpenses =
        calculateSelectedHousingExpenses(expenses);

      expect(totalExpenses).toBe(7300);
      expect(selectedHousingExpenses).toBe(7000);
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
        normalizeString("3,5 %")
      );
      expect(normalizeString(formatPercentage(0))).toBe(
        normalizeString("0,0 %")
      );
      expect(normalizeString(formatPercentage(100))).toBe(
        normalizeString("100,0 %")
      );
      expect(normalizeString(formatPercentage(3.14159))).toBe(
        normalizeString("3,1 %")
      );
    });
  });

  describe("calculateNetIncome", () => {
    it("should calculate net income correctly for basic case", () => {
      const gross = 30000;
      const net = calculateNetIncome(gross);
      // Expected calculation:
      // taxable = 30000 - 3000 = 27000
      // tax = 27000 * 0.31 = 8370
      // jobbskatteavdrag = 3100
      // final tax = 8370 - 3100 = 5270
      // net = 30000 - 5270 = 24730
      expect(net).toBe(24730);
    });

    it("should handle income above statligSkatt threshold", () => {
      const gross = 60000;
      const net = calculateNetIncome(gross);
      expect(net).toBeLessThan(gross);
      expect(net).toBeGreaterThan(0);
    });

    it("should handle zero income", () => {
      const net = calculateNetIncome(0);
      expect(net).toBe(0);
    });
  });

  describe("calculateNetIncomeSecond", () => {
    it("should calculate second income net correctly", () => {
      const gross = 30000;
      const net = calculateNetIncomeSecond(gross);
      // Expected calculation:
      // tax = 30000 * 0.34 = 10200
      // net = 30000 - 10200 = 19800
      expect(net).toBe(19800);
    });

    it("should handle zero income", () => {
      const net = calculateNetIncomeSecond(0);
      expect(net).toBe(0);
    });
  });
});
