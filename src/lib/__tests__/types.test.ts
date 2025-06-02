import { describe, it, expect } from "vitest";
import {
  getAllInterestRates,
  hasInterestRates,
  getFirstInterestRate,
  hasValidLoan,
  type LoanParameters,
} from "@/lib/types";

describe("Loan Parameters Helper Functions", () => {
  describe("getAllInterestRates", () => {
    it("should return empty array when both arrays are empty", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [],
      };

      const result = getAllInterestRates(loanParams);
      expect(result).toEqual([]);
    });

    it("should return only predefined rates when custom rates are empty", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3, 3.5, 4],
        amortizationRates: [2],
        customInterestRates: [],
      };

      const result = getAllInterestRates(loanParams);
      expect(result).toEqual([3, 3.5, 4]);
    });

    it("should return only custom rates when predefined rates are empty", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [2.74, 5.25],
      };

      const result = getAllInterestRates(loanParams);
      expect(result).toEqual([2.74, 5.25]);
    });

    it("should return combined rates with predefined first when both exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3, 4],
        amortizationRates: [2],
        customInterestRates: [2.74, 5.25],
      };

      const result = getAllInterestRates(loanParams);
      expect(result).toEqual([3, 4, 2.74, 5.25]);
    });

    it("should handle undefined customInterestRates gracefully", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3, 4],
        amortizationRates: [2],
        customInterestRates: [],
      };

      const result = getAllInterestRates(loanParams);
      expect(result).toEqual([3, 4]);
    });

    it("should preserve decimal precision in rates", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3.123],
        amortizationRates: [2],
        customInterestRates: [2.789, 4.567],
      };

      const result = getAllInterestRates(loanParams);
      expect(result).toEqual([3.123, 2.789, 4.567]);
    });
  });

  describe("hasInterestRates", () => {
    it("should return false when both arrays are empty", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasInterestRates(loanParams)).toBe(false);
    });

    it("should return true when only predefined rates exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasInterestRates(loanParams)).toBe(true);
    });

    it("should return true when only custom rates exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [2.74],
      };

      expect(hasInterestRates(loanParams)).toBe(true);
    });

    it("should return true when both predefined and custom rates exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3],
        amortizationRates: [2],
        customInterestRates: [2.74],
      };

      expect(hasInterestRates(loanParams)).toBe(true);
    });

    it("should return false when customInterestRates is undefined", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasInterestRates(loanParams)).toBe(false);
    });

    it("should return true when customInterestRates is undefined but predefined rates exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3.5],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasInterestRates(loanParams)).toBe(true);
    });
  });

  describe("getFirstInterestRate", () => {
    it("should return 0 when no rates exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(getFirstInterestRate(loanParams)).toBe(0);
    });

    it("should return first predefined rate when only predefined rates exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3.5, 4, 4.5],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(getFirstInterestRate(loanParams)).toBe(3.5);
    });

    it("should return first custom rate when only custom rates exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [2.74, 5.25],
      };

      expect(getFirstInterestRate(loanParams)).toBe(2.74);
    });

    it("should prioritize predefined rate over custom rate when both exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3.5, 4],
        amortizationRates: [2],
        customInterestRates: [2.74, 5.25],
      };

      expect(getFirstInterestRate(loanParams)).toBe(3.5);
    });

    it("should handle undefined customInterestRates", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [4.2],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(getFirstInterestRate(loanParams)).toBe(4.2);
    });

    it("should return 0 when both arrays are empty or undefined", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(getFirstInterestRate(loanParams)).toBe(0);
    });

    it("should preserve decimal precision", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [2.789],
      };

      expect(getFirstInterestRate(loanParams)).toBe(2.789);
    });
  });

  describe("hasValidLoan", () => {
    it("should return false when loan amount is 0", () => {
      const loanParams: LoanParameters = {
        amount: 0,
        interestRates: [3],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(false);
    });

    it("should return false when loan amount is negative", () => {
      const loanParams: LoanParameters = {
        amount: -1000000,
        interestRates: [3],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(false);
    });

    it("should return false when amount > 0 but no interest rates", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(false);
    });

    it("should return false when amount > 0 and interest rates but no amortization rates", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3],
        amortizationRates: [],
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(false);
    });

    it("should return true when amount > 0, has predefined interest rates, and has amortization rates", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(true);
    });

    it("should return true when amount > 0, has custom interest rates, and has amortization rates", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [2.74],
      };

      expect(hasValidLoan(loanParams)).toBe(true);
    });

    it("should return true when amount > 0, has both types of interest rates, and has amortization rates", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3],
        amortizationRates: [2],
        customInterestRates: [2.74, 5.25],
      };

      expect(hasValidLoan(loanParams)).toBe(true);
    });

    it("should return false when customInterestRates is undefined and no predefined rates", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(false);
    });

    it("should return true when customInterestRates is undefined but predefined rates exist", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [3.5],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(true);
    });

    it("should handle large loan amounts correctly", () => {
      const loanParams: LoanParameters = {
        amount: 50000000, // 50 million
        interestRates: [2.5],
        amortizationRates: [1],
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(true);
    });

    it("should handle small loan amounts correctly", () => {
      const loanParams: LoanParameters = {
        amount: 1, // 1 krona
        interestRates: [3],
        amortizationRates: [2],
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(true);
    });

    it("should handle multiple rates correctly", () => {
      const loanParams: LoanParameters = {
        amount: 2000000,
        interestRates: [2, 3, 4, 5],
        amortizationRates: [1, 2, 3],
        customInterestRates: [2.74, 3.89, 4.12],
      };

      expect(hasValidLoan(loanParams)).toBe(true);
    });
  });

  describe("Edge Cases and Integration", () => {
    it("should handle zero values in rate arrays", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [0], // 0% interest rate
        amortizationRates: [0], // 0% amortization rate
        customInterestRates: [],
      };

      expect(hasValidLoan(loanParams)).toBe(true);
      expect(getFirstInterestRate(loanParams)).toBe(0);
      expect(hasInterestRates(loanParams)).toBe(true);
    });

    it("should handle very high precision custom rates", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [],
        amortizationRates: [2],
        customInterestRates: [2.123456789],
      };

      expect(hasValidLoan(loanParams)).toBe(true);
      expect(getFirstInterestRate(loanParams)).toBe(2.123456789);
    });

    it("should maintain order when merging arrays", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRates: [1, 2, 3],
        amortizationRates: [1],
        customInterestRates: [4, 5, 6],
      };

      const result = getAllInterestRates(loanParams);
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should handle realistic Swedish mortgage scenarios", () => {
      // Typical Swedish mortgage: 3-5 million SEK, 2-5% interest, 1-3% amortization
      const loanParams: LoanParameters = {
        amount: 3500000, // 3.5 million SEK
        interestRates: [3.5, 4.0, 4.5], // Common Swedish rates
        amortizationRates: [1, 2, 3], // Common amortization rates
        customInterestRates: [2.74, 3.89], // Custom negotiated rates
      };

      expect(hasValidLoan(loanParams)).toBe(true);
      expect(getFirstInterestRate(loanParams)).toBe(3.5); // Should prioritize predefined
      expect(getAllInterestRates(loanParams)).toEqual([
        3.5, 4.0, 4.5, 2.74, 3.89,
      ]);
    });
  });
});
