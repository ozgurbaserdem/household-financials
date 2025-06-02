import type {
  CalculatorState,
  CalculationResult,
  ExpensesByCategory,
  FinancialHealthScore,
  IncomeState,
} from "../types";
import { getFirstInterestRate } from "../types";
import {
  TaxCalculationService,
  taxCalculationService,
} from "./TaxCalculationService";
import {
  LoanCalculationService,
  loanCalculationService,
} from "./LoanCalculationService";

export interface IncomeCalculationResult {
  gross: number;
  net: number;
}

export interface ExpenseCalculationResult {
  totalExpenses: number;
  housingExpenses: number;
  otherExpenses: number;
}

export class FinancialCalculationService {
  constructor(
    private taxService: TaxCalculationService = taxCalculationService,
    private loanService: LoanCalculationService = loanCalculationService
  ) {}

  /**
   * Calculate total net income from all sources
   */
  calculateTotalIncome(incomeState: IncomeState): IncomeCalculationResult {
    const { selectedKommun, includeChurchTax } = incomeState;

    // Calculate primary incomes (subject to kommun tax)
    const income1Result = this.taxService.calculateNetIncome(
      incomeState.income1,
      false,
      selectedKommun,
      includeChurchTax
    );

    const income2Result = this.taxService.calculateNetIncome(
      incomeState.income2,
      false,
      selectedKommun,
      includeChurchTax
    );

    // Calculate secondary incomes (different tax rules)
    const secondaryIncome1Result = this.taxService.calculateNetIncome(
      incomeState.secondaryIncome1,
      true
    );

    const secondaryIncome2Result = this.taxService.calculateNetIncome(
      incomeState.secondaryIncome2,
      true
    );

    // Non-taxable incomes
    const nonTaxableIncome =
      incomeState.childBenefits +
      incomeState.otherBenefits +
      incomeState.otherIncomes;

    const grossTotal =
      incomeState.income1 +
      incomeState.income2 +
      incomeState.secondaryIncome1 +
      incomeState.secondaryIncome2 +
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
  }

  /**
   * Calculate total expenses broken down by category
   */
  calculateExpenses(
    expenses: ExpensesByCategory,
    state?: CalculatorState
  ): ExpenseCalculationResult {
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
  }

  /**
   * Calculate all loan scenarios with comprehensive results
   */
  calculateLoanScenarios(
    calculatorState: CalculatorState
  ): CalculationResult[] {
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
  }

  /**
   * Calculate financial health score
   */
  calculateFinancialHealthScore(
    calculatorState: CalculatorState
  ): FinancialHealthScore {
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
    const savingsRate = safeDiv(
      totalIncomeResult.net - totalExpenses,
      totalIncomeResult.net
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
      savingsRate,
      housingCostRatio,
      discretionaryIncomeRatio,
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      debtToIncomeRatio,
      emergencyFundCoverage,
      savingsRate,
      housingCostRatio,
      discretionaryIncomeRatio,
    });

    return {
      overallScore,
      metrics: {
        debtToIncomeRatio,
        emergencyFundCoverage,
        savingsRate,
        housingCostRatio,
        discretionaryIncomeRatio,
      },
      recommendations,
    };
  }

  /**
   * Calculate housing expenses from expense categories
   */
  private calculateHousingExpenses(expenses: ExpensesByCategory): number {
    // In the simplified version, we just return the home category total
    return Number(expenses["home"]) || 0;
  }

  /**
   * Calculate total expenses from all categories
   */
  private calculateTotalExpenses(expenses: ExpensesByCategory): number {
    return Object.values(expenses).reduce((total, amount) => {
      const numericAmount = Number(amount) || 0;
      return total + numericAmount;
    }, 0);
  }

  /**
   * Get effective total expenses based on view mode
   */
  private getEffectiveTotalExpenses(state: CalculatorState): number {
    if (state.expenseViewMode === "simple") {
      return Number(state.totalExpenses) || 0;
    }
    return this.calculateTotalExpenses(state.expenses);
  }

  /**
   * Get main loan costs using primary rates
   */
  private getMainLoanCosts(state: CalculatorState): {
    monthlyAmortization: number;
    monthlyInterest: number;
  } {
    const { amount, amortizationRates } = state.loanParameters;
    const interestRate = getFirstInterestRate(state.loanParameters);
    const amortizationRate = amortizationRates[0] ?? 0;

    return {
      monthlyInterest: (amount * (interestRate / 100)) / 12,
      monthlyAmortization: (amount * (amortizationRate / 100)) / 12,
    };
  }

  /**
   * Calculate emergency fund coverage
   */
  private calculateEmergencyFundCoverage(
    state: CalculatorState,
    totalExpenses?: number
  ): number {
    const monthlyExpenses =
      totalExpenses ?? this.getEffectiveTotalExpenses(state);
    const emergencyFund = state.income.currentBuffer || 0;
    return monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
  }

  /**
   * Calculate overall financial health score
   */
  private calculateOverallScore(metrics: {
    debtToIncomeRatio: number;
    emergencyFundCoverage: number;
    savingsRate: number;
    housingCostRatio: number;
    discretionaryIncomeRatio: number;
  }): number {
    const weights = {
      debtToIncomeRatio: 0.25,
      emergencyFundCoverage: 0.25,
      savingsRate: 0.2,
      housingCostRatio: 0.15,
      discretionaryIncomeRatio: 0.15,
    };

    const scores = {
      debtToIncomeRatio: Math.max(
        0,
        100 * (1 - Math.min(metrics.debtToIncomeRatio, 2) / 2)
      ),
      emergencyFundCoverage: Math.min(100, metrics.emergencyFundCoverage * 100),
      savingsRate: Math.min(100, metrics.savingsRate * 200),
      housingCostRatio: Math.max(0, 100 * (1 - metrics.housingCostRatio / 0.3)),
      discretionaryIncomeRatio: Math.min(
        100,
        metrics.discretionaryIncomeRatio * 200
      ),
    };

    // Handle NaN values
    Object.keys(scores).forEach((key) => {
      if (!Number.isFinite(scores[key as keyof typeof scores])) {
        scores[key as keyof typeof scores] = 0;
      }
    });

    const total = Object.entries(weights).reduce((total, [key, weight]) => {
      return total + scores[key as keyof typeof scores] * weight;
    }, 0);

    return Math.round(total);
  }

  /**
   * Generate financial recommendations
   */
  private generateRecommendations(metrics: {
    debtToIncomeRatio: number;
    emergencyFundCoverage: number;
    savingsRate: number;
    housingCostRatio: number;
    discretionaryIncomeRatio: number;
  }): string[] {
    const recommendations: string[] = [];

    if (metrics.debtToIncomeRatio > 4.3) {
      recommendations.push("recommendation_reduce_dti");
    }
    if (metrics.emergencyFundCoverage < 3) {
      recommendations.push("recommendation_emergency_fund");
    }
    if (metrics.savingsRate < 0.2) {
      recommendations.push("recommendation_savings_rate");
    }
    if (metrics.housingCostRatio > 0.3) {
      recommendations.push("recommendation_housing_cost");
    }
    if (metrics.discretionaryIncomeRatio < 0.2) {
      recommendations.push("recommendation_discretionary_income");
    }

    return recommendations;
  }
}

// Export singleton instance
export const financialCalculationService = new FinancialCalculationService();
