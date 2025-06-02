import type {
  CalculatorState,
  CalculationResult,
  ExpensesByCategory,
  FinancialHealthScore,
} from "./types";
import { taxCalculationService, financialCalculationService } from "./services";

export function getNetIncome(
  gross: number,
  isSecondary = false,
  selectedKommun?: string,
  includeChurchTax?: boolean
): number {
  const result = taxCalculationService.calculateNetIncome(
    gross,
    isSecondary,
    selectedKommun,
    includeChurchTax
  );
  return result.net;
}

export function getIncomeWithNet(
  gross: number,
  isSecondary = false,
  selectedKommun?: string,
  includeChurchTax?: boolean
) {
  return {
    gross,
    net: getNetIncome(gross, isSecondary, selectedKommun, includeChurchTax),
  };
}

export function calculateTotalNetIncome(state: CalculatorState): number {
  const totalIncome = financialCalculationService.calculateTotalIncome(
    state.income
  );
  return totalIncome.net;
}

export function calculateLoanScenarios(
  state: CalculatorState
): CalculationResult[] {
  return financialCalculationService.calculateLoanScenarios(state);
}

export function calculateTotalExpenses(expenses: ExpensesByCategory): number {
  return Object.values(expenses).reduce((total, amount) => {
    const numericAmount = Number(amount) || 0;
    return total + numericAmount;
  }, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function calculateSelectedHousingExpenses(
  expenses: ExpensesByCategory
): number {
  // In the simplified version, we just return the home category total
  return Number(expenses["home"]) || 0;
}

export function calculateTotalIncome(state: CalculatorState): {
  gross: number;
  net: number;
} {
  return financialCalculationService.calculateTotalIncome(state.income);
}

export function calculateFinancialHealthScore(
  state: CalculatorState
): FinancialHealthScore {
  return financialCalculationService.calculateFinancialHealthScore(state);
}

export function calculateFinancialHealthScoreForResult(
  result: CalculationResult
): FinancialHealthScore {
  // This function provides a specialized calculation for a specific result
  // For now, we'll create a temporary state object to use the service
  // In a future refactor, this could be moved to the service layer as well
  const totalIncome = result.totalIncome?.net ?? 0;
  const totalGrossIncome = result.totalIncome?.gross ?? 0;
  const totalExpenses = result.totalExpenses;
  const housingCost = result.totalHousingCost;
  const loanAmount =
    ((result.monthlyAmortization + result.monthlyInterest) * 12) /
      ((result.amortizationRate + result.interestRate) / 100) || 0;

  // Guard against division by zero
  const safeDiv = (num: number, denom: number) => (denom > 0 ? num / denom : 0);

  // Calculate metrics using the same logic as the service
  const debtToIncomeRatio = safeDiv(loanAmount, totalGrossIncome * 12);
  const emergencyFundCoverage =
    totalExpenses > 0 ? result.currentBuffer / totalExpenses : 0;
  const savingsRate = safeDiv(totalIncome - totalExpenses, totalIncome);
  const housingCostRatio = safeDiv(housingCost, totalIncome);
  const discretionaryIncomeRatio = safeDiv(
    totalIncome - totalExpenses,
    totalIncome
  );

  // Use same scoring and recommendation logic as service
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
      100 * (1 - Math.min(debtToIncomeRatio, 2) / 2)
    ),
    emergencyFundCoverage: Math.min(100, emergencyFundCoverage * 100),
    savingsRate: Math.min(100, savingsRate * 200),
    housingCostRatio: Math.max(0, 100 * (1 - housingCostRatio / 0.3)),
    discretionaryIncomeRatio: Math.min(100, discretionaryIncomeRatio * 200),
  };

  // Handle NaN values
  Object.keys(scores).forEach((key) => {
    if (!Number.isFinite(scores[key as keyof typeof scores])) {
      scores[key as keyof typeof scores] = 0;
    }
  });

  const overallScore = Math.round(
    Object.entries(weights).reduce((total, [key, weight]) => {
      return total + scores[key as keyof typeof scores] * weight;
    }, 0)
  );

  // Generate recommendations
  const recommendations: string[] = [];
  if (debtToIncomeRatio > 4.3) {
    recommendations.push("recommendation_reduce_dti");
  }
  if (emergencyFundCoverage < 3) {
    recommendations.push("recommendation_emergency_fund");
  }
  if (savingsRate < 0.2) {
    recommendations.push("recommendation_savings_rate");
  }
  if (housingCostRatio > 0.3) {
    recommendations.push("recommendation_housing_cost");
  }
  if (discretionaryIncomeRatio < 0.2) {
    recommendations.push("recommendation_discretionary_income");
  }

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
