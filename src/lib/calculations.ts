import { taxCalculationService, financialCalculationService } from "./services";
import type {
  CalculatorState,
  CalculationResult,
  ExpensesByCategory,
  FinancialHealthScore,
} from "./types";

/**
 * Calculates net income from gross income after Swedish taxes.
 *
 * @param gross - The gross income amount in SEK
 * @param isSecondary - Whether this is secondary income (different tax rules)
 * @param selectedKommun - The kommun for municipal tax calculation
 * @param includeChurchTax - Whether to include church tax in calculations
 * @returns The net income after all applicable taxes
 *
 * @example
 * ```typescript
 * const netIncome = getNetIncome(50000, false, "Stockholm", true);
 * console.log(netIncome); // 38500 (approximate)
 * ```
 */
export const getNetIncome = (
  gross: number,
  isSecondary = false,
  selectedKommun?: string,
  includeChurchTax?: boolean
): number => {
  const result = taxCalculationService.calculateNetIncome(
    gross,
    isSecondary,
    selectedKommun,
    includeChurchTax
  );
  return result.net;
};

/**
 * Returns an object containing both gross and net income.
 *
 * @param gross - The gross income amount in SEK
 * @param isSecondary - Whether this is secondary income (different tax rules)
 * @param selectedKommun - The kommun for municipal tax calculation
 * @param includeChurchTax - Whether to include church tax in calculations
 * @returns Object with gross and net income values
 *
 * @example
 * ```typescript
 * const income = getIncomeWithNet(60000, false, "Göteborg");
 * console.log(income); // { gross: 60000, net: 45200 }
 * ```
 */
export const getIncomeWithNet = (
  gross: number,
  isSecondary = false,
  selectedKommun?: string,
  includeChurchTax?: boolean
) => {
  return {
    gross,
    net: getNetIncome(gross, isSecondary, selectedKommun, includeChurchTax),
  };
};

/**
 * Calculates the total net income from all income sources in the calculator state.
 *
 * @param state - The complete calculator state containing all income information
 * @returns The total net income from all sources combined
 *
 * @example
 * ```typescript
 * const totalNet = calculateTotalNetIncome(calculatorState);
 * console.log(totalNet); // 85000
 * ```
 */
export const calculateTotalNetIncome = (state: CalculatorState): number => {
  const totalIncome = financialCalculationService.calculateTotalIncome(
    state.income
  );
  return totalIncome.net;
};

/**
 * Calculates multiple loan scenarios with different interest and amortization rates.
 *
 * Generates a matrix of loan scenarios by combining different interest rates
 * (typically 3) with different amortization rates (typically 3), resulting
 * in 9 total scenarios for comprehensive comparison.
 *
 * @param state - The complete calculator state with loan parameters and financial data
 * @returns Array of calculation results for each loan scenario
 *
 * @example
 * ```typescript
 * const scenarios = calculateLoanScenarios(state);
 * console.log(scenarios.length); // 9 scenarios
 * console.log(scenarios[0].interestRate); // 2.5
 * ```
 */
export const calculateLoanScenarios = (
  state: CalculatorState
): CalculationResult[] => {
  return financialCalculationService.calculateLoanScenarios(state);
};

/**
 * Calculates the total monthly expenses from all expense categories.
 *
 * @param expenses - Object containing expenses by category (home, food, transport, etc.)
 * @returns The sum of all monthly expenses
 *
 * @example
 * ```typescript
 * const expenses = { home: 15000, food: 5000, transport: 3000 };
 * const total = calculateTotalExpenses(expenses);
 * console.log(total); // 23000
 * ```
 */
export const calculateTotalExpenses = (
  expenses: ExpensesByCategory
): number => {
  const amounts = Object.values(expenses).map((amount) => Number(amount) || 0);

  return amounts.reduce((total, amount) => total + amount, 0);
};

/**
 * Formats a number as Swedish currency (SEK) with proper localization.
 *
 * Uses Swedish locale formatting with space as thousand separator
 * and no decimal places for currency display.
 *
 * @param amount - The amount to format in SEK
 * @returns Formatted currency string in Swedish format
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(123456);
 * console.log(formatted); // "123 456 kr"
 * ```
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a number as a percentage with Swedish localization.
 *
 * @param value - The percentage value (e.g., 5.5 for 5.5%)
 * @returns Formatted percentage string with 2 decimal places
 *
 * @example
 * ```typescript
 * const formatted = formatPercentage(5.5);
 * console.log(formatted); // "5,50 %"
 * ```
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("sv-SE", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

/**
 * Calculates housing-related expenses from the expense categories.
 *
 * Currently returns the 'home' category total. In future versions,
 * this could be expanded to include other housing-related categories.
 *
 * @param expenses - Object containing expenses by category
 * @returns The total housing expenses
 *
 * @example
 * ```typescript
 * const expenses = { home: 15000, food: 5000 };
 * const housing = calculateSelectedHousingExpenses(expenses);
 * console.log(housing); // 15000
 * ```
 */
export const calculateSelectedHousingExpenses = (
  expenses: ExpensesByCategory
): number => {
  // In the simplified version, we just return the home category total
  return Number(expenses["home"]) || 0;
};

/**
 * Calculates both gross and net total income from all sources.
 *
 * @param state - The complete calculator state containing income information
 * @returns Object with gross and net income totals
 *
 * @example
 * ```typescript
 * const income = calculateTotalIncome(state);
 * console.log(income); // { gross: 120000, net: 85000 }
 * ```
 */
export const calculateTotalIncome = (
  state: CalculatorState
): {
  gross: number;
  net: number;
} => {
  return financialCalculationService.calculateTotalIncome(state.income);
};

/**
 * Calculates a comprehensive financial health score (0-100) based on multiple metrics.
 *
 * The score considers:
 * - Debt-to-income ratio (30% weight)
 * - Emergency fund coverage (30% weight)
 * - Housing cost ratio (20% weight)
 * - Discretionary income ratio (20% weight)
 *
 * @param state - The complete calculator state with financial data
 * @returns Financial health score object with overall score, metrics, and recommendations
 *
 * @example
 * ```typescript
 * const health = calculateFinancialHealthScore(state);
 * console.log(health.overallScore); // 75
 * console.log(health.recommendations); // ["recommendation_emergency_fund"]
 * ```
 */
export const calculateFinancialHealthScore = (
  state: CalculatorState
): FinancialHealthScore => {
  return financialCalculationService.calculateFinancialHealthScore(state);
};

/**
 * Calculates financial health score for a specific loan scenario result.
 *
 * This specialized function calculates the financial health score based on
 * a specific loan calculation result rather than the full calculator state.
 * It reconstructs the necessary metrics from the result data.
 *
 * @param result - A specific loan calculation result
 * @returns Financial health score object for this specific scenario
 *
 * @example
 * ```typescript
 * const scenarios = calculateLoanScenarios(state);
 * const health = calculateFinancialHealthScoreForResult(scenarios[0]);
 * console.log(health.overallScore); // 82
 * ```
 */
export const calculateFinancialHealthScoreForResult = (
  result: CalculationResult
): FinancialHealthScore => {
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
  const housingCostRatio = safeDiv(housingCost, totalIncome);
  const discretionaryIncomeRatio = safeDiv(
    totalIncome - totalExpenses,
    totalIncome
  );

  // Use same scoring and recommendation logic as service
  const weights = {
    debtToIncomeRatio: 0.3,
    emergencyFundCoverage: 0.3,
    housingCostRatio: 0.2,
    discretionaryIncomeRatio: 0.2,
  };

  const scores = {
    debtToIncomeRatio: Math.max(
      0,
      100 * (1 - Math.min(debtToIncomeRatio, 2) / 2)
    ),
    emergencyFundCoverage: Math.min(100, emergencyFundCoverage * 100),
    housingCostRatio: Math.max(0, 100 * (1 - housingCostRatio / 0.3)),
    discretionaryIncomeRatio: Math.min(100, discretionaryIncomeRatio * 200),
  };

  // Handle NaN values
  Object.keys(scores).map((key) => {
    if (!Number.isFinite(scores[key as keyof typeof scores])) {
      scores[key as keyof typeof scores] = 0;
    }
    return key;
  });

  // Calculate weighted total score

  const weightedTotal = Object.entries(weights).reduce(
    (total, [key, weight]) => {
      return total + scores[key as keyof typeof scores] * weight;
    },
    0
  );
  const overallScore = Math.round(weightedTotal);

  // Generate recommendations
  const recommendations: string[] = [];
  if (debtToIncomeRatio > 4.3) {
    recommendations.push("recommendation_reduce_dti");
  }
  if (emergencyFundCoverage < 3) {
    recommendations.push("recommendation_emergency_fund");
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
      housingCostRatio,
      discretionaryIncomeRatio,
    },
    recommendations,
  };
};
