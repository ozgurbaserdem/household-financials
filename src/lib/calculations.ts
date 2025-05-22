import type {
  CalculatorState,
  CalculationResult,
  ExpensesByCategory,
  IncomeCalculation,
  FinancialHealthScore,
} from "./types";

export function calculateTotalNetIncome(state: CalculatorState): number {
  return (
    state.income1.net +
    state.income2.net +
    state.secondaryIncome1.net +
    state.secondaryIncome2.net +
    state.childBenefits +
    state.otherBenefits +
    state.otherIncomes
  );
}

export function calculateIncomeWithTax(
  gross: number,
  isSecondIncome = false
): IncomeCalculation {
  const net = isSecondIncome
    ? calculateNetIncomeSecond(gross)
    : calculateNetIncome(gross);
  return { gross, net };
}

export function calculateLoanScenarios(
  state: CalculatorState
): CalculationResult[] {
  const { loanParameters, expenses } = state;

  const totalIncome = calculateTotalNetIncome(state);
  const totalIncomeObj = calculateTotalIncome(state);
  const { amount, interestRates, amortizationRates } = loanParameters;

  // Calculate sum of all other expenses (from categories)
  const selectedHousingExpenses = calculateSelectedHousingExpenses(expenses);
  const totalOtherExpenses =
    calculateTotalExpenses(expenses) - selectedHousingExpenses;

  const scenarios: CalculationResult[] = [];

  for (const interestRate of interestRates) {
    for (const amortizationRate of amortizationRates) {
      // Fix: Round the calculations to 2 decimal places
      const monthlyInterest = Number(
        ((amount * (interestRate / 100)) / 12).toFixed(2)
      );
      const monthlyAmortization = Number(
        ((amount * (amortizationRate / 100)) / 12).toFixed(2)
      );
      // Add selected housing expenses to total housing cost
      const totalHousingCost = Number(
        (
          monthlyInterest +
          monthlyAmortization +
          selectedHousingExpenses
        ).toFixed(2)
      );
      const totalExpenses = Number(
        (totalHousingCost + totalOtherExpenses).toFixed(2)
      );
      const remainingSavings = Number((totalIncome - totalExpenses).toFixed(2));

      scenarios.push({
        interestRate,
        amortizationRate,
        monthlyInterest,
        monthlyAmortization,
        totalHousingCost,
        totalExpenses,
        remainingSavings,
        income1: state.income1.net,
        income2: state.income2.net,
        secondaryIncome1: state.secondaryIncome1.net,
        secondaryIncome2: state.secondaryIncome2.net,
        childBenefits: state.childBenefits,
        otherBenefits: state.otherBenefits,
        otherIncomes: state.otherIncomes,
        totalIncome: totalIncomeObj,
      });
    }
  }

  return scenarios;
}

export function calculateTotalExpenses(expenses: ExpensesByCategory): number {
  let total = 0;

  for (const category of Object.values(expenses)) {
    for (const amount of Object.values(category)) {
      total += amount;
    }
  }

  return total;
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
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export const calculateExpenses = () => {
  // TODO: Implement expense calculation logic
};

export const calculateSavings = () => {
  // TODO: Implement savings calculation logic
};

// Swedish net income calculation
export function calculateNetIncome(gross: number): number {
  const kommunalskatt = 0.31; // average
  const statligSkatt = 0.2;
  const statligSkattThreshold = 53592; // kr/month for 2025
  const grundavdrag = 3000; // basic deduction per month (approx)
  const jobbskatteavdrag = 3100; // job tax deduction per month (approx)

  const taxable = Math.max(0, gross - grundavdrag);
  let tax = taxable * kommunalskatt;

  if (gross > statligSkattThreshold) {
    tax += (gross - statligSkattThreshold) * statligSkatt;
  }

  // Apply jobbskatteavdrag (cannot reduce tax below zero)
  tax = Math.max(0, tax - jobbskatteavdrag);

  return gross - tax;
}

export function calculateNetIncomeSecond(gross: number): number {
  const kommunalskatt = 0.34; // higher tax, no deductions
  const taxable = Math.max(0, gross);
  const tax = taxable * kommunalskatt;

  return gross - tax;
}

export function calculateSelectedHousingExpenses(
  expenses: ExpensesByCategory
): number {
  const pairs: [string, string][] = [
    ["home", "rent-monthly-fee"],
    ["home", "electricity-heating"],
    ["home", "mortgage"],
    ["home", "water-garbage"],
  ];
  let sum = 0;
  for (const [cat, sub] of pairs) {
    sum += expenses[cat]?.[sub] ?? 0;
  }
  return sum;
}

export function calculateTotalIncome(state: CalculatorState): {
  gross: number;
  net: number;
} {
  const gross =
    state.income1.gross +
    state.income2.gross +
    state.secondaryIncome1.gross +
    state.secondaryIncome2.gross +
    state.childBenefits +
    state.otherBenefits +
    state.otherIncomes;

  const net =
    state.income1.net +
    state.income2.net +
    state.secondaryIncome1.net +
    state.secondaryIncome2.net +
    state.childBenefits +
    state.otherBenefits +
    state.otherIncomes;

  return { gross, net };
}

function getMainLoanCosts(state: CalculatorState): {
  monthlyAmortization: number;
  monthlyInterest: number;
} {
  const { amount, interestRates, amortizationRates } = state.loanParameters;
  const interestRate = interestRates[0] ?? 0;
  const amortizationRate = amortizationRates[0] ?? 0;
  const monthlyInterest = (amount * (interestRate / 100)) / 12;
  const monthlyAmortization = (amount * (amortizationRate / 100)) / 12;
  return { monthlyAmortization, monthlyInterest };
}

export function calculateFinancialHealthScore(
  state: CalculatorState
): FinancialHealthScore {
  const totalIncome = calculateTotalNetIncome(state);
  const totalGrossIncome = calculateTotalIncome(state).gross;
  const baseExpenses = calculateTotalExpenses(state.expenses);
  const housingExpenses = calculateSelectedHousingExpenses(state.expenses);
  const loanAmount = state.loanParameters.amount;

  // Add loan costs to expenses
  const { monthlyAmortization, monthlyInterest } = getMainLoanCosts(state);
  const totalLoanCost = monthlyAmortization + monthlyInterest;
  const totalExpenses = baseExpenses + totalLoanCost;
  const totalHousingCost = housingExpenses + totalLoanCost;

  // Guard against division by zero
  const safeDiv = (num: number, denom: number) => (denom > 0 ? num / denom : 0);

  // Calculate metrics
  const debtToIncomeRatio = safeDiv(loanAmount, totalGrossIncome * 12); // Annual gross income
  const emergencyFundCoverage = calculateEmergencyFundCoverage(
    state,
    totalExpenses
  );

  const savingsRate = safeDiv(totalIncome - totalExpenses, totalIncome);
  const housingCostRatio = safeDiv(totalHousingCost, totalIncome);
  const discretionaryIncomeRatio = safeDiv(
    totalIncome - totalExpenses,
    totalIncome
  );

  // Calculate overall score (0-100)
  const overallScore = calculateOverallScore({
    debtToIncomeRatio,
    emergencyFundCoverage,
    savingsRate,
    housingCostRatio,
    discretionaryIncomeRatio,
  });

  // Generate recommendations
  const recommendations = generateRecommendations({
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

function calculateEmergencyFundCoverage(
  state: CalculatorState,
  totalExpenses?: number
): number {
  const monthlyExpenses =
    typeof totalExpenses === "number"
      ? totalExpenses
      : calculateTotalExpenses(state.expenses);
  const emergencyFund = state.currentBuffer || 0;
  return monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
}

function calculateOverallScore(metrics: {
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
    ), // 0x=100, 1x=50, 2x=0
    emergencyFundCoverage: Math.min(100, metrics.emergencyFundCoverage * 100),
    savingsRate: Math.min(100, metrics.savingsRate * 200), // 50% savings rate = 100 points
    housingCostRatio: Math.max(0, 100 * (1 - metrics.housingCostRatio / 0.3)), // 30% is max recommended
    discretionaryIncomeRatio: Math.min(
      100,
      metrics.discretionaryIncomeRatio * 200
    ), // 50% = 100 points
  };

  // If any score is NaN, treat as 0
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

function generateRecommendations(metrics: {
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

export function calculateFinancialHealthScoreForResult(
  result: CalculationResult,
  currentBuffer: number
): FinancialHealthScore {
  // Use the scenario's net income and expenses
  const totalIncome = result.totalIncome?.net ?? 0;
  const totalGrossIncome = result.totalIncome?.gross ?? 0;
  const totalExpenses = result.totalExpenses;
  const housingCost = result.totalHousingCost;
  const loanAmount =
    ((result.monthlyAmortization + result.monthlyInterest) * 12) /
      ((result.amortizationRate + result.interestRate) / 100) || 0;

  // Guard against division by zero
  const safeDiv = (num: number, denom: number) => (denom > 0 ? num / denom : 0);

  // Calculate metrics
  const debtToIncomeRatio = safeDiv(loanAmount, totalGrossIncome * 12);
  const emergencyFundCoverage =
    totalExpenses > 0 ? currentBuffer / totalExpenses : 0;
  const savingsRate = safeDiv(totalIncome - totalExpenses, totalIncome);
  const housingCostRatio = safeDiv(housingCost, totalIncome);
  const discretionaryIncomeRatio = safeDiv(
    totalIncome - totalExpenses,
    totalIncome
  );

  // Calculate overall score (0-100)
  const overallScore = calculateOverallScore({
    debtToIncomeRatio,
    emergencyFundCoverage,
    savingsRate,
    housingCostRatio,
    discretionaryIncomeRatio,
  });

  // Generate recommendations
  const recommendations = generateRecommendations({
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
