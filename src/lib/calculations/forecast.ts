/**
 * Loan Forecast Calculation Utilities
 *
 * Pure business logic functions for calculating loan amortization,
 * income projections, and savings forecasts over time.
 */

import { calculateTotalNetIncome } from "@/lib/calculations/";
import type { CalculatorState } from "@/lib/types";

/**
 * Interface representing forecast data for a single year.
 */
export interface ForecastData {
  year: number;
  remainingLoan: number;
  yearlyCost: number;
  monthlyCost: number;
  monthlyIncome: number;
  monthlySavings: number;
}

/**
 * Default forecast calculation parameters.
 */
export const FORECAST_DEFAULTS = {
  SALARY_INCREASE_RATE: 0.025, // 2.5% annual salary increase
  MAX_FORECAST_YEARS: 50, // Maximum years to calculate
} as const;

/**
 * Calculates loan amortization and income forecast over time.
 *
 * Projects loan balance, monthly costs, income growth, and savings potential
 * over the loan term, assuming a fixed annual salary increase rate.
 *
 * @param calculatorState - Current calculator state with loan and income data
 * @param salaryIncreaseRate - Annual salary increase rate (default: 2.5%)
 * @param maxYears - Maximum years to calculate (default: 50)
 * @returns Array of forecast data for each year
 *
 * @example
 * ```typescript
 * const forecast = calculateForecast(state);
 * console.log(forecast[0]); // First year data
 * ```
 */
export const calculateForecast = (
  calculatorState: CalculatorState,
  salaryIncreaseRate: number = FORECAST_DEFAULTS.SALARY_INCREASE_RATE,
  maxYears: number = FORECAST_DEFAULTS.MAX_FORECAST_YEARS
): ForecastData[] => {
  if (!calculatorState.loanParameters.amount) {
    return [];
  }

  const initialLoan = calculatorState.loanParameters.amount;
  const amortizationRate =
    calculatorState.loanParameters.amortizationRate / 100 || 0.03;
  const interestRate =
    calculatorState.loanParameters.interestRate / 100 || 0.03;

  const netMonthlyIncome = calculateTotalNetIncome(calculatorState);
  const netYearlyIncome0 = netMonthlyIncome * 12;

  const generateYearData = (
    year: number,
    remainingLoan: number
  ): { data: ForecastData; newRemainingLoan: number } => {
    const yearlyAmortization = initialLoan * amortizationRate;
    const yearlyInterest = remainingLoan * interestRate;
    const yearlyCost = yearlyAmortization + yearlyInterest;
    const monthlyCost = yearlyCost / 12;
    const currentYearNetYearlyIncome =
      netYearlyIncome0 * Math.pow(1 + salaryIncreaseRate, year);
    const monthlyIncome = currentYearNetYearlyIncome / 12;
    const monthlySavings = monthlyIncome - monthlyCost;

    return {
      data: {
        year,
        remainingLoan,
        yearlyCost,
        monthlyCost,
        monthlyIncome,
        monthlySavings,
      },
      newRemainingLoan: remainingLoan - yearlyAmortization,
    };
  };

  // Generate forecast data using functional approach
  const { data } = Array.from({ length: maxYears }, (_, index) => index)
    .map((year) => ({ year, remainingLoan: initialLoan }))
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce(
      (acc, { year }) => {
        if (acc.remainingLoan <= 0) {
          return acc;
        }

        const yearResult = generateYearData(year, acc.remainingLoan);
        return {
          data: [...acc.data, yearResult.data],
          remainingLoan: yearResult.newRemainingLoan,
        };
      },
      { data: [] as ForecastData[], remainingLoan: initialLoan }
    );

  return data;
};

/**
 * Calculates the year when the loan will be fully paid off.
 *
 * @param calculatorState - Current calculator state
 * @returns Number of years until loan payoff, or 0 if no loan
 *
 * @example
 * ```typescript
 * const payoffYears = calculateLoanPayoffYears(state); // 25
 * ```
 */
export const calculateLoanPayoffYears = (
  calculatorState: CalculatorState
): number => {
  const forecast = calculateForecast(calculatorState);
  return forecast.length;
};

/**
 * Calculates total interest paid over the loan term.
 *
 * @param calculatorState - Current calculator state
 * @returns Total interest amount to be paid
 *
 * @example
 * ```typescript
 * const totalInterest = calculateTotalInterest(state); // 450000
 * ```
 */
export const calculateTotalInterest = (
  calculatorState: CalculatorState
): number => {
  const forecast = calculateForecast(calculatorState);
  const annualAmortization =
    calculatorState.loanParameters.amount *
    (calculatorState.loanParameters.amortizationRate / 100);

  return forecast.reduce(
    (total, year) => total + (year.yearlyCost - annualAmortization),
    0
  );
};

/**
 * Calculates average monthly savings over the loan term.
 *
 * @param calculatorState - Current calculator state
 * @returns Average monthly savings amount
 *
 * @example
 * ```typescript
 * const avgSavings = calculateAverageMonthlySavings(state); // 5500
 * ```
 */
export const calculateAverageMonthlySavings = (
  calculatorState: CalculatorState
): number => {
  const forecast = calculateForecast(calculatorState);
  if (forecast.length === 0) return 0;

  const totalSavings = forecast.reduce(
    (total, year) => total + year.monthlySavings * 12,
    0
  );
  return totalSavings / (forecast.length * 12);
};

/**
 * Validates forecast input parameters.
 *
 * @param calculatorState - Calculator state to validate
 * @returns True if state contains valid loan parameters
 *
 * @example
 * ```typescript
 * const isValid = validateForecastInputs(state); // true
 * ```
 */
export const validateForecastInputs = (
  calculatorState: CalculatorState
): boolean => {
  return !!(
    calculatorState.loanParameters.amount &&
    calculatorState.loanParameters.amount > 0 &&
    calculatorState.loanParameters.amortizationRate > 0 &&
    calculatorState.loanParameters.interestRate > 0
  );
};
