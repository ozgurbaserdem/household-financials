import type { LoanParameters } from "../types";

export interface LoanScenario {
  interestRate: number;
  amortizationRate: number;
  monthlyInterest: number;
  monthlyAmortization: number;
  totalMonthlyPayment: number;
}

export interface LoanCalculationOptions {
  roundToDecimals?: number;
}

export class LoanCalculationService {
  private readonly defaultOptions: LoanCalculationOptions = {
    roundToDecimals: 2,
  };

  /**
   * Calculate loan scenario from given parameters
   */
  calculateLoanScenarios(
    loanParameters: LoanParameters,
    options: LoanCalculationOptions = {}
  ): LoanScenario[] {
    const config = { ...this.defaultOptions, ...options };
    const { amount, interestRate, amortizationRate, hasLoan } = loanParameters;

    // Handle case where there are no loans
    if (!hasLoan || amount === 0) {
      return [
        {
          interestRate: 0,
          amortizationRate: 0,
          monthlyInterest: 0,
          monthlyAmortization: 0,
          totalMonthlyPayment: 0,
        },
      ];
    }

    const scenario = this.calculateSingleScenario(
      amount,
      interestRate,
      amortizationRate,
      config.roundToDecimals!
    );

    return [scenario];
  }

  /**
   * Calculate a single loan scenario
   */
  private calculateSingleScenario(
    amount: number,
    interestRate: number,
    amortizationRate: number,
    roundToDecimals: number
  ): LoanScenario {
    const monthlyInterest = this.roundToDecimals(
      (amount * (interestRate / 100)) / 12,
      roundToDecimals
    );

    const monthlyAmortization = this.roundToDecimals(
      (amount * (amortizationRate / 100)) / 12,
      roundToDecimals
    );

    const totalMonthlyPayment = this.roundToDecimals(
      monthlyInterest + monthlyAmortization,
      roundToDecimals
    );

    return {
      interestRate,
      amortizationRate,
      monthlyInterest,
      monthlyAmortization,
      totalMonthlyPayment,
    };
  }

  /**
   * Calculate the optimal loan scenario (lowest total monthly payment)
   */
  getOptimalScenario(loanParameters: LoanParameters): LoanScenario | null {
    const scenarios = this.calculateLoanScenarios(loanParameters);

    if (scenarios.length === 0) return null;

    return scenarios.reduce((optimal, current) =>
      current.totalMonthlyPayment < optimal.totalMonthlyPayment
        ? current
        : optimal
    );
  }

  /**
   * Calculate the worst-case scenario (highest total monthly payment)
   */
  getWorstCaseScenario(loanParameters: LoanParameters): LoanScenario | null {
    const scenarios = this.calculateLoanScenarios(loanParameters);

    if (scenarios.length === 0) return null;

    return scenarios.reduce((worst, current) =>
      current.totalMonthlyPayment > worst.totalMonthlyPayment ? current : worst
    );
  }

  /**
   * Calculate loan payment for a single set of parameters
   */
  calculateMonthlyPayment(
    amount: number,
    interestRate: number,
    amortizationRate: number
  ): number {
    if (amount <= 0) return 0;

    const monthlyInterest = (amount * (interestRate / 100)) / 12;
    const monthlyAmortization = (amount * (amortizationRate / 100)) / 12;

    return monthlyInterest + monthlyAmortization;
  }

  /**
   * Calculate total loan cost over time
   */
  calculateTotalLoanCost(
    amount: number,
    interestRate: number,
    amortizationRate: number,
    years: number
  ): {
    totalInterest: number;
    totalAmortization: number;
    totalPayments: number;
    remainingPrincipal: number;
  } {
    const monthlyPayment = this.calculateMonthlyPayment(
      amount,
      interestRate,
      amortizationRate
    );
    const months = years * 12;

    const monthlyInterest = (amount * (interestRate / 100)) / 12;
    const monthlyAmortization = (amount * (amortizationRate / 100)) / 12;

    const totalInterest = monthlyInterest * months;
    const totalAmortization = monthlyAmortization * months;
    const totalPayments = monthlyPayment * months;
    const remainingPrincipal = Math.max(0, amount - totalAmortization);

    return {
      totalInterest: this.roundToDecimals(totalInterest, 2),
      totalAmortization: this.roundToDecimals(totalAmortization, 2),
      totalPayments: this.roundToDecimals(totalPayments, 2),
      remainingPrincipal: this.roundToDecimals(remainingPrincipal, 2),
    };
  }

  /**
   * Validate loan parameters
   */
  validateLoanParameters(loanParameters: LoanParameters): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (loanParameters.amount < 0) {
      errors.push("Loan amount cannot be negative");
    }

    if (loanParameters.interestRate < 0 || loanParameters.interestRate > 100) {
      errors.push("Interest rate must be between 0 and 100");
    }

    if (
      loanParameters.amortizationRate < 0 ||
      loanParameters.amortizationRate > 100
    ) {
      errors.push("Amortization rate must be between 0 and 100");
    }

    if (loanParameters.hasLoan && loanParameters.amount > 0) {
      if (loanParameters.interestRate < 0) {
        errors.push("Interest rate is required when loan amount > 0");
      }

      if (loanParameters.amortizationRate < 0) {
        errors.push("Amortization rate is required when loan amount > 0");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Helper function to round numbers to specified decimal places
   */
  private roundToDecimals(value: number, decimals: number): number {
    return Number(value.toFixed(decimals));
  }
}

// Export singleton instance
export const loanCalculationService = new LoanCalculationService();
