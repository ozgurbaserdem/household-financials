export interface LoanParameters {
  amount: number
  interestRates: number[]
  amortizationRates: number[]
}

export interface IncomeRange {
  min: number
  max: number
}

export interface ExpenseCategory {
  id: string
  name: string
  subcategories: ExpenseSubcategory[]
}

export interface ExpenseSubcategory {
  id: string
  name: string
}

export interface CalculationResult {
  interestRate: number
  amortizationRate: number
  monthlyInterest: number
  monthlyAmortization: number
  totalHousingCost: number
  totalExpenses: number
  remainingSavings: number
}

export interface CalculatorState {
  loanParameters: LoanParameters
  totalIncome: number
  runningCosts: number
  expenses: ExpensesByCategory
}

export interface ExpensesByCategory {
  [categoryId: string]: {
    [subcategoryId: string]: number
  }
} 