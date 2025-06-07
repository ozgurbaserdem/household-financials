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

/**
 * Loan calculation service for Swedish mortgage and lending scenarios.
 *
 * Provides comprehensive loan calculations including:
 * - Monthly payment calculations (interest + amortization)
 * - Scenario modeling with different rates
 * - Total loan cost projections over time
 * - Loan parameter validation
 * - Optimal and worst-case scenario analysis
 *
 * Follows Swedish lending practices where loans typically include
 * both interest payments and mandatory amortization.
 */
export class LoanCalculationService {
  private readonly defaultOptions: LoanCalculationOptions = {
    roundToDecimals: 2,
  };

  /**
   * Calculates loan scenarios based on given parameters.
   *
   * Handles both active loans and no-loan scenarios. For active loans,
   * calculates monthly payments split between interest and amortization.
   *
   * @param loanParameters - Loan configuration including amount and rates
   * @param options - Optional calculation settings (e.g., decimal precision)
   * @returns Array of loan scenarios (single scenario for current implementation)
   *
   * @example
   * ```typescript
   * const scenarios = service.calculateLoanScenarios({
   *   amount: 3000000,
   *   interestRate: 3.5,
   *   amortizationRate: 2.0,
   *   hasLoan: true
   * });
   * console.log(scenarios[0].totalMonthlyPayment); // 13750
   * ```
   */
  calculateLoanScenarios = (
    loanParameters: LoanParameters,
    options: LoanCalculationOptions = {}
  ): LoanScenario[] => {
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
  };

  /**
   * Calculates a single loan scenario with specified rates.
   *
   * Computes monthly interest and amortization payments separately,
   * which is important for Swedish loan analysis where amortization
   * requirements are regulated.
   *
   * @param amount - Loan amount in SEK
   * @param interestRate - Annual interest rate as percentage
   * @param amortizationRate - Annual amortization rate as percentage
   * @param roundToDecimals - Number of decimal places for rounding
   * @returns Complete loan scenario with payment breakdown
   *
   * @private
   */
  private calculateSingleScenario = (
    amount: number,
    interestRate: number,
    amortizationRate: number,
    roundToDecimals: number
  ): LoanScenario => {
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
  };

  /**
   * Finds the loan scenario with the lowest total monthly payment.
   *
   * Useful for comparing multiple scenarios to find the most
   * affordable option from a cash flow perspective.
   *
   * @param loanParameters - Loan configuration
   * @returns Scenario with lowest monthly payment, or null if no scenarios
   *
   * @example
   * ```typescript
   * const optimal = service.getOptimalScenario(loanParams);
   * console.log(optimal?.totalMonthlyPayment); // 12500
   * ```
   */
  getOptimalScenario = (
    loanParameters: LoanParameters
  ): LoanScenario | null => {
    const scenarios = this.calculateLoanScenarios(loanParameters);

    if (scenarios.length === 0) return null;

    return scenarios.reduce((optimal, current) =>
      current.totalMonthlyPayment < optimal.totalMonthlyPayment
        ? current
        : optimal
    );
  };

  /**
   * Finds the loan scenario with the highest total monthly payment.
   *
   * Useful for stress testing and understanding maximum payment obligations.
   *
   * @param loanParameters - Loan configuration
   * @returns Scenario with highest monthly payment, or null if no scenarios
   *
   * @example
   * ```typescript
   * const worstCase = service.getWorstCaseScenario(loanParams);
   * console.log(worstCase?.totalMonthlyPayment); // 15750
   * ```
   */
  getWorstCaseScenario = (
    loanParameters: LoanParameters
  ): LoanScenario | null => {
    const scenarios = this.calculateLoanScenarios(loanParameters);

    if (scenarios.length === 0) return null;

    return scenarios.reduce((worst, current) =>
      current.totalMonthlyPayment > worst.totalMonthlyPayment ? current : worst
    );
  };

  /**
   * Calculates total monthly payment for a specific set of loan parameters.
   *
   * Simple utility function that combines interest and amortization
   * into a single monthly payment amount.
   *
   * @param amount - Loan amount in SEK
   * @param interestRate - Annual interest rate as percentage
   * @param amortizationRate - Annual amortization rate as percentage
   * @returns Total monthly payment amount
   *
   * @example
   * ```typescript
   * const payment = service.calculateMonthlyPayment(3000000, 3.5, 2.0);
   * console.log(payment); // 13750
   * ```
   */
  calculateMonthlyPayment = (
    amount: number,
    interestRate: number,
    amortizationRate: number
  ): number => {
    if (amount <= 0) return 0;

    const monthlyInterest = (amount * (interestRate / 100)) / 12;
    const monthlyAmortization = (amount * (amortizationRate / 100)) / 12;

    return monthlyInterest + monthlyAmortization;
  };

  /**
   * Calculates comprehensive loan costs over a specified time period.
   *
   * Provides detailed analysis of loan costs including total interest paid,
   * total amortization, and remaining principal balance. Useful for
   * long-term financial planning.
   *
   * @param amount - Loan amount in SEK
   * @param interestRate - Annual interest rate as percentage
   * @param amortizationRate - Annual amortization rate as percentage
   * @param years - Number of years to calculate costs for
   * @returns Comprehensive cost breakdown over the specified period
   *
   * @example
   * ```typescript
   * const costs = service.calculateTotalLoanCost(3000000, 3.5, 2.0, 10);
   * console.log(costs.totalInterest); // 1050000
   * console.log(costs.remainingPrincipal); // 2400000
   * ```
   */
  calculateTotalLoanCost = (
    amount: number,
    interestRate: number,
    amortizationRate: number,
    years: number
  ): {
    totalInterest: number;
    totalAmortization: number;
    totalPayments: number;
    remainingPrincipal: number;
  } => {
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
  };

  /**
   * Validates loan parameters for correctness and business rules.
   *
   * Checks for common validation issues including:
   * - Negative amounts or rates
   * - Rates outside reasonable bounds (0-100%)
   * - Missing required parameters when loan is active
   *
   * @param loanParameters - Loan parameters to validate
   * @returns Validation result with boolean flag and error messages
   *
   * @example
   * ```typescript
   * const validation = service.validateLoanParameters(params);
   * if (!validation.isValid) {
   *   console.error(validation.errors);
   * }
   * ```
   */
  validateLoanParameters = (
    loanParameters: LoanParameters
  ): {
    isValid: boolean;
    errors: string[];
  } => {
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
  };

  /**
   * Rounds numbers to specified decimal places for consistent formatting.
   *
   * @param value - Number to round
   * @param decimals - Number of decimal places
   * @returns Rounded number
   *
   * @private
   */
  private roundToDecimals = (value: number, decimals: number): number => {
    return Number(value.toFixed(decimals));
  };
}

// Export singleton instance
export const loanCalculationService = new LoanCalculationService();
