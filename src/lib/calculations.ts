import type {
  CalculatorState,
  CalculationResult,
  ExpensesByCategory,
  IncomeCalculation,
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
