import type { CalculatorState, CalculationResult, ExpensesByCategory } from './types'

export function calculateLoanScenarios(state: CalculatorState): CalculationResult[] {
  const { loanParameters, totalIncome, runningCosts, expenses } = state
  const { amount, interestRates, amortizationRates } = loanParameters

  // Calculate sum of all other expenses (from categories)
  const totalOtherExpenses = calculateTotalExpenses(expenses)

  const scenarios: CalculationResult[] = []

  for (const interestRate of interestRates) {
    for (const amortizationRate of amortizationRates) {
      const monthlyInterest = (amount * (interestRate / 100)) / 12
      const monthlyAmortization = (amount * (amortizationRate / 100)) / 12
      const totalHousingCost = monthlyInterest + monthlyAmortization + runningCosts
      const totalExpenses = totalHousingCost + totalOtherExpenses
      const remainingSavings = totalIncome - totalExpenses

      scenarios.push({
        interestRate,
        amortizationRate,
        monthlyInterest,
        monthlyAmortization,
        totalHousingCost,
        totalExpenses,
        remainingSavings
      })
    }
  }

  return scenarios
}

export function calculateTotalExpenses(expenses: ExpensesByCategory): number {
  let total = 0

  for (const category of Object.values(expenses)) {
    for (const amount of Object.values(category)) {
      total += amount
    }
  }

  return total
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100)
}

export const calculateExpenses = () => {
  // TODO: Implement expense calculation logic
}

export const calculateSavings = () => {
  // TODO: Implement savings calculation logic
}

// Swedish net income calculation
export function calculateNetIncome(gross: number): number {
  const kommunalskatt = 0.306
  const statligSkatt = 0.20
  const threshold = 53592 // kr/month for 2025

  if (gross <= threshold) {
    return gross * (1 - kommunalskatt)
  } else {
    // Below threshold: kommunalskatt only
    // Above threshold: kommunalskatt + statlig skatt
    return (
      threshold * (1 - kommunalskatt) +
      (gross - threshold) * (1 - kommunalskatt - statligSkatt)
    )
  }
} 