import type {
  CalculationResult,
  CalculatorState,
  ExpensesByCategory,
  FinancialHealthScore,
  IncomeState,
} from "../types";

import type { LoanCalculationService } from "./LoanCalculationService";
import { loanCalculationService } from "./LoanCalculationService";
import type { TaxCalculationService } from "./TaxCalculationService";
import { taxCalculationService } from "./TaxCalculationService";

export interface IncomeCalculationResult {
  gross: number;
  net: number;
}

export interface ExpenseCalculationResult {
  totalExpenses: number;
  housingExpenses: number;
  otherExpenses: number;
}

/**
 * Comprehensive financial calculation service for Swedish household budget analysis.
 *
 * This service handles all core financial calculations including:
 * - Income calculations with Swedish tax rules
 * - Expense analysis and categorization
 * - Loan scenario modeling with multiple interest/amortization rates
 * - Financial health scoring and recommendations
 *
 * The service integrates with tax and loan calculation services to provide
 * complete financial analysis for Swedish households.
 */
export class FinancialCalculationService {
  constructor(
    private taxService: TaxCalculationService = taxCalculationService,
    private loanService: LoanCalculationService = loanCalculationService
  ) {}

  /**
   * Calculates total net income from all income sources.
   *
   * Handles multiple income types with different tax treatments:
   * - Primary incomes (subject to municipal tax)
   * - Secondary incomes (different tax rules)
   * - Non-taxable incomes (benefits, allowances)
   *
   * @param incomeState - Complete income state with all income sources
   * @returns Object containing gross and net income totals
   *
   * @example
   * ```typescript
   * const result = service.calculateTotalIncome(incomeState);
   * console.log(result); // { gross: 120000, net: 85000 }
   * ```
   */
  calculateTotalIncome = (
    incomeState: IncomeState
  ): IncomeCalculationResult => {
    const { selectedKommun, includeChurchTax } = incomeState;

    const {
      income1,
      income2,
      secondaryIncome1,
      secondaryIncome2,
      childBenefits,
      otherBenefits,
      otherIncomes,
    } = incomeState;

    // Calculate primary incomes (subject to kommun tax)
    const income1Result = this.taxService.calculateNetIncome(
      income1,
      false,
      selectedKommun,
      includeChurchTax
    );

    const income2Result = this.taxService.calculateNetIncome(
      income2,
      false,
      selectedKommun,
      includeChurchTax
    );

    // Calculate secondary incomes (different tax rules)
    const secondaryIncome1Result = this.taxService.calculateNetIncome(
      secondaryIncome1,
      true
    );

    const secondaryIncome2Result = this.taxService.calculateNetIncome(
      secondaryIncome2,
      true
    );

    // Non-taxable incomes
    const nonTaxableIncome = childBenefits + otherBenefits + otherIncomes;

    const grossTotal =
      income1 +
      income2 +
      secondaryIncome1 +
      secondaryIncome2 +
      nonTaxableIncome;

    const netTotal =
      income1Result.net +
      income2Result.net +
      secondaryIncome1Result.net +
      secondaryIncome2Result.net +
      nonTaxableIncome;

    return {
      gross: grossTotal,
      net: netTotal,
    };
  };

  /**
   * Calculates total expenses with detailed breakdown by category.
   *
   * Provides comprehensive expense analysis including:
   * - Total monthly expenses
   * - Housing-specific expenses
   * - All other expense categories
   *
   * @param expenses - Expenses organized by category
   * @param state - Optional calculator state for context-aware calculations
   * @returns Detailed expense breakdown object
   *
   * @example
   * ```typescript
   * const result = service.calculateExpenses(expenses, state);
   * console.log(result); // { totalExpenses: 25000, housingExpenses: 15000, otherExpenses: 10000 }
   * ```
   */
  calculateExpenses = (
    expenses: ExpensesByCategory,
    state?: CalculatorState
  ): ExpenseCalculationResult => {
    const housingExpenses = this.calculateHousingExpenses(expenses);
    const totalExpenses = state
      ? this.getEffectiveTotalExpenses(state)
      : this.calculateTotalExpenses(expenses);
    const otherExpenses = totalExpenses - housingExpenses;

    return {
      totalExpenses,
      housingExpenses,
      otherExpenses,
    };
  };

  /**
   * Calculates comprehensive loan scenarios with multiple rate combinations.
   *
   * Generates a matrix of loan scenarios by combining different interest rates
   * with different amortization rates. Each scenario includes:
   * - Monthly payment calculations
   * - Total housing costs including base expenses
   * - Remaining savings after all expenses
   * - Detailed income breakdown
   *
   * @param calculatorState - Complete calculator state with all financial data
   * @returns Array of detailed calculation results for each scenario
   *
   * @example
   * ```typescript
   * const scenarios = service.calculateLoanScenarios(state);
   * console.log(scenarios.length); // 9 scenarios (3x3 matrix)
   * console.log(scenarios[0].remainingSavings); // 12000
   * ```
   */
  calculateLoanScenarios = (
    calculatorState: CalculatorState
  ): CalculationResult[] => {
    const { loanParameters, expenses, income } = calculatorState;

    const totalIncomeResult = this.calculateTotalIncome(income);
    const expenseResult = this.calculateExpenses(expenses, calculatorState);
    const loanScenarios =
      this.loanService.calculateLoanScenarios(loanParameters);

    return loanScenarios.map((loanScenario) => {
      const totalHousingCost =
        Number(loanScenario.totalMonthlyPayment) +
        Number(expenseResult.housingExpenses);
      const totalExpenses =
        Number(totalHousingCost) + Number(expenseResult.otherExpenses);
      const remainingSavings =
        Number(totalIncomeResult.net) - Number(totalExpenses);

      // Calculate individual income components for detailed breakdown
      const income1Net = this.taxService.calculateNetIncome(
        income.income1,
        false,
        income.selectedKommun,
        income.includeChurchTax
      ).net;

      const income2Net = this.taxService.calculateNetIncome(
        income.income2,
        false,
        income.selectedKommun,
        income.includeChurchTax
      ).net;

      const secondaryIncome1Net = this.taxService.calculateNetIncome(
        income.secondaryIncome1,
        true
      ).net;

      const secondaryIncome2Net = this.taxService.calculateNetIncome(
        income.secondaryIncome2,
        true
      ).net;

      return {
        interestRate: loanScenario.interestRate,
        amortizationRate: loanScenario.amortizationRate,
        monthlyInterest: loanScenario.monthlyInterest,
        monthlyAmortization: loanScenario.monthlyAmortization,
        totalHousingCost: Number(totalHousingCost.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        remainingSavings: Number(remainingSavings.toFixed(2)),
        income1Net,
        income2Net,
        secondaryIncome1Net,
        secondaryIncome2Net,
        childBenefits: income.childBenefits,
        otherBenefits: income.otherBenefits,
        otherIncomes: income.otherIncomes,
        currentBuffer: income.currentBuffer,
        totalIncome: totalIncomeResult,
      };
    });
  };

  /**
   * Calculates comprehensive financial health score with actionable insights.
   *
   * The financial health score (0-100) is calculated using weighted metrics:
   * - Debt-to-income ratio (30% weight): Lower ratios score higher
   * - Emergency fund coverage (30% weight): More months of coverage score higher
   * - Housing cost ratio (20% weight): Lower housing cost percentage scores higher
   * - Discretionary income ratio (20% weight): More leftover income scores higher
   *
   * Also generates personalized recommendations based on metric thresholds.
   *
   * @param calculatorState - Complete financial state for analysis
   * @returns Financial health score with metrics and recommendations
   *
   * @example
   * ```typescript
   * const health = service.calculateFinancialHealthScore(state);
   * console.log(health.overallScore); // 75
   * console.log(health.recommendations); // ["recommendation_emergency_fund"]
   * ```
   */
  calculateFinancialHealthScore = (
    calculatorState: CalculatorState
  ): FinancialHealthScore => {
    const totalIncomeResult = this.calculateTotalIncome(calculatorState.income);
    const expenseResult = this.calculateExpenses(
      calculatorState.expenses,
      calculatorState
    );
    const loanAmount = calculatorState.loanParameters.amount;

    // Get main loan costs using the first rates as primary scenario
    const mainLoanCosts = this.getMainLoanCosts(calculatorState);
    const totalLoanCost =
      mainLoanCosts.monthlyAmortization + mainLoanCosts.monthlyInterest;
    const totalExpenses = expenseResult.totalExpenses + totalLoanCost;
    const totalHousingCost = expenseResult.housingExpenses + totalLoanCost;

    // Guard against division by zero
    const safeDiv = (num: number, denom: number) =>
      denom > 0 ? num / denom : 0;

    // Calculate metrics
    const debtToIncomeRatio = safeDiv(loanAmount, totalIncomeResult.gross * 12);
    const emergencyFundCoverage = this.calculateEmergencyFundCoverage(
      calculatorState,
      totalExpenses
    );
    const housingCostRatio = safeDiv(totalHousingCost, totalIncomeResult.net);
    const discretionaryIncomeRatio = safeDiv(
      totalIncomeResult.net - totalExpenses,
      totalIncomeResult.net
    );

    // Calculate overall score (0-100)
    const overallScore = this.calculateOverallScore({
      debtToIncomeRatio,
      emergencyFundCoverage,
      housingCostRatio,
      discretionaryIncomeRatio,
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      debtToIncomeRatio,
      emergencyFundCoverage,
      housingCostRatio,
      discretionaryIncomeRatio,
    });

    return {
      overallScore,
      metrics: {
        debtToIncomeRatio,
        emergencyFundCoverage,
        housingCostRatio,
        discretionaryIncomeRatio,
      },
      recommendations,
    };
  };

  /**
   * Extracts housing-related expenses from expense categories.
   *
   * Currently focuses on the 'home' category but designed to be
   * extensible for more granular housing expense tracking.
   *
   * @param expenses - All expense categories
   * @returns Total housing expenses in SEK
   *
   * @private
   */
  private calculateHousingExpenses = (expenses: ExpensesByCategory): number => {
    // In the simplified version, we just return the home category total
    return Number(expenses["home"]) || 0;
  };

  /**
   * Sums all expenses across all categories.
   *
   * Safely handles string and number inputs, treating invalid
   * values as zero to prevent calculation errors.
   *
   * @param expenses - Expenses by category object
   * @returns Total monthly expenses in SEK
   *
   * @private
   */
  private calculateTotalExpenses = (expenses: ExpensesByCategory): number => {
    // eslint-disable-next-line unicorn/no-array-reduce
    return Object.values(expenses).reduce((total, amount) => {
      const numericAmount = Number(amount) || 0;
      return total + numericAmount;
    }, 0);
  };

  /**
   * Determines total expenses based on the current expense view mode.
   *
   * Supports different expense input modes:
   * - Simple mode: Uses single total expense value
   * - Detailed mode: Calculates from individual categories
   *
   * @param state - Calculator state with expense mode and data
   * @returns Effective total expenses for calculations
   *
   * @private
   */
  private getEffectiveTotalExpenses = (state: CalculatorState): number => {
    if (state.expenseViewMode === "simple") {
      return Number(state.totalExpenses) || 0;
    }
    return this.calculateTotalExpenses(state.expenses);
  };

  /**
   * Calculates loan costs using the primary interest and amortization rates.
   *
   * Used for financial health calculations where a single representative
   * loan cost is needed rather than multiple scenarios.
   *
   * @param state - Calculator state with loan parameters
   * @returns Monthly interest and amortization amounts
   *
   * @private
   */
  private getMainLoanCosts = (
    state: CalculatorState
  ): {
    monthlyAmortization: number;
    monthlyInterest: number;
  } => {
    const { amount, interestRate, amortizationRate } = state.loanParameters;

    return {
      monthlyInterest: (amount * (interestRate / 100)) / 12,
      monthlyAmortization: (amount * (amortizationRate / 100)) / 12,
    };
  };

  /**
   * Calculates how many months of expenses the emergency fund covers.
   *
   * Emergency fund coverage is a key financial health metric,
   * with 3+ months generally considered healthy.
   *
   * @param state - Calculator state with emergency fund amount
   * @param totalExpenses - Optional pre-calculated total expenses
   * @returns Number of months of expense coverage
   *
   * @private
   */
  private calculateEmergencyFundCoverage = (
    state: CalculatorState,
    totalExpenses?: number
  ): number => {
    const monthlyExpenses =
      totalExpenses ?? this.getEffectiveTotalExpenses(state);
    const emergencyFund = state.income.currentBuffer || 0;
    return monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
  };

  /**
   * Calculates weighted overall financial health score (0-100).
   *
   * Uses scientifically-backed financial health metrics with
   * appropriate weightings. Handles edge cases like NaN values
   * to ensure robust scoring.
   *
   * @param metrics - Individual financial health metrics
   * @returns Overall score from 0-100
   *
   * @private
   */
  private calculateOverallScore = (metrics: {
    debtToIncomeRatio: number;
    emergencyFundCoverage: number;
    housingCostRatio: number;
    discretionaryIncomeRatio: number;
  }): number => {
    const weights = {
      debtToIncomeRatio: 0.3,
      emergencyFundCoverage: 0.3,
      housingCostRatio: 0.2,
      discretionaryIncomeRatio: 0.2,
    };

    const scores = {
      debtToIncomeRatio: Math.max(
        0,
        100 * (1 - Math.min(metrics.debtToIncomeRatio, 2) / 2)
      ),
      emergencyFundCoverage: Math.min(100, metrics.emergencyFundCoverage * 100),
      housingCostRatio: Math.max(0, 100 * (1 - metrics.housingCostRatio / 0.3)),
      discretionaryIncomeRatio: Math.min(
        100,
        metrics.discretionaryIncomeRatio * 200
      ),
    };

    // Handle NaN values
    Object.keys(scores).map((key) => {
      if (!Number.isFinite(scores[key as keyof typeof scores])) {
        scores[key as keyof typeof scores] = 0;
      }
      return key;
    });

    const total = Object.entries(weights).reduce((total, [key, weight]) => {
      return total + scores[key as keyof typeof scores] * weight;
    }, 0);

    return Math.round(total);
  };

  /**
   * Generates personalized financial recommendations based on metrics.
   *
   * Analyzes each financial health metric against established thresholds
   * and provides specific, actionable recommendations for improvement.
   *
   * @param metrics - Calculated financial health metrics
   * @returns Array of recommendation keys for internationalization
   *
   * @private
   */
  private generateRecommendations = (metrics: {
    debtToIncomeRatio: number;
    emergencyFundCoverage: number;
    housingCostRatio: number;
    discretionaryIncomeRatio: number;
  }): string[] => {
    const recommendations: string[] = [];

    if (metrics.debtToIncomeRatio > 4.3) {
      recommendations.push("recommendation_reduce_dti");
    }
    if (metrics.emergencyFundCoverage < 3) {
      recommendations.push("recommendation_emergency_fund");
    }
    if (metrics.housingCostRatio > 0.3) {
      recommendations.push("recommendation_housing_cost");
    }
    if (metrics.discretionaryIncomeRatio < 0.2) {
      recommendations.push("recommendation_discretionary_income");
    }

    return recommendations;
  };
}

// Export singleton instance
export const financialCalculationService = new FinancialCalculationService();
