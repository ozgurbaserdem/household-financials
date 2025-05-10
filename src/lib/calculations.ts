import type {
  CalculatorState,
  CalculationResult,
  ExpensesByCategory,
} from "./types";

export function calculateLoanScenarios(
  state: CalculatorState
): CalculationResult[] {
  const {
    loanParameters,
    income1,
    income2,
    income3,
    income4,
    childBenefits,
    otherBenefits,
    otherIncomes,
    runningCosts,
    expenses,
  } = state;
  const totalIncome = income1 + income2 + income3 + income4;
  const { amount, interestRates, amortizationRates } = loanParameters;

  // Calculate sum of all other expenses (from categories)
  const totalOtherExpenses = calculateTotalExpenses(expenses);

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
      const totalHousingCost = Number(
        (monthlyInterest + monthlyAmortization + runningCosts).toFixed(2)
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
        income1,
        income2,
        income3,
        income4,
        childBenefits,
        otherBenefits,
        otherIncomes,
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
  const kommunalskatt = 0.33; // higher tax, no deductions
  const taxable = Math.max(0, gross);
  const tax = taxable * kommunalskatt;

  return gross - tax;
}
