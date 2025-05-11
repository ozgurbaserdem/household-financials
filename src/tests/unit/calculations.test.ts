import { describe, it, expect } from "vitest";
import {
  calculateLoanScenarios,
  calculateTotalExpenses,
  formatCurrency,
  formatPercentage,
  calculateNetIncome,
  calculateNetIncomeSecond,
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
        income1: 30000,
        income2: 25000,
        income3: 0,
        income4: 0,
        grossIncome1: 30000,
        grossIncome2: 25000,
        grossIncome3: 0,
        grossIncome4: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        expenses: {},
      };

      const results = calculateLoanScenarios(state);

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        interestRate: 3.5,
        amortizationRate: 2,
        monthlyInterest: 2916.67,
        monthlyAmortization: 1666.67,
        totalHousingCost: 4583.34,
        totalExpenses: 4583.34,
        remainingSavings: 50416.66,
        income1: 30000,
        income2: 25000,
        income3: 0,
        income4: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
      });
    });

    it("should handle multiple interest and amortization rates", () => {
      const state: CalculatorState = {
        loanParameters: {
          amount: 1000000,
          interestRates: [3.5, 4],
          amortizationRates: [2, 3],
        },
        income1: 30000,
        income2: 25000,
        income3: 0,
        income4: 0,
        grossIncome1: 30000,
        grossIncome2: 25000,
        grossIncome3: 0,
        grossIncome4: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
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
      // tax = 30000 * 0.33 = 9900
      // net = 30000 - 9900 = 20100
      expect(net).toBe(20100);
    });

    it("should handle zero income", () => {
      const net = calculateNetIncomeSecond(0);
      expect(net).toBe(0);
    });
  });
});
