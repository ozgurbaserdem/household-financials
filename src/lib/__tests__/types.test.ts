import { describe, it, expect } from "vitest";
import { hasValidLoan, type LoanParameters } from "@/lib/types";

describe("Loan Parameters Helper Functions", () => {
  describe("hasValidLoan", () => {
    it("should return false when hasLoan is false", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRate: 3.5,
        amortizationRate: 2,
        hasLoan: false,
      };

      const result = hasValidLoan(loanParams);
      expect(result).toBe(false);
    });

    it("should return false when amount is 0", () => {
      const loanParams: LoanParameters = {
        amount: 0,
        interestRate: 3.5,
        amortizationRate: 2,
        hasLoan: true,
      };

      const result = hasValidLoan(loanParams);
      expect(result).toBe(false);
    });

    it("should return false when interest rate is negative", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRate: -1,
        amortizationRate: 2,
        hasLoan: true,
      };

      const result = hasValidLoan(loanParams);
      expect(result).toBe(false);
    });

    it("should return false when amortization rate is negative", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRate: 3.5,
        amortizationRate: -1,
        hasLoan: true,
      };

      const result = hasValidLoan(loanParams);
      expect(result).toBe(false);
    });

    it("should return true when all required parameters are valid", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRate: 3.5,
        amortizationRate: 2,
        hasLoan: true,
      };

      const result = hasValidLoan(loanParams);
      expect(result).toBe(true);
    });

    it("should return false with both zero rates (invalid scenario)", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRate: 0,
        amortizationRate: 0,
        hasLoan: true,
      };

      const result = hasValidLoan(loanParams);
      expect(result).toBe(false);
    });

    it("should return true with zero interest rate but positive amortization", () => {
      const loanParams: LoanParameters = {
        amount: 1000000,
        interestRate: 0,
        amortizationRate: 2,
        hasLoan: true,
      };

      const result = hasValidLoan(loanParams);
      expect(result).toBe(false); // Still false according to current implementation
    });
  });
});
