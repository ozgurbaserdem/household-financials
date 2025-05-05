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
  income1: number
  income2: number
  income3: number
  income4: number
}

export interface CalculatorState {
  loanParameters: LoanParameters
  income1: number
  income2: number
  income3: number
  income4: number
  grossIncome1: number
  grossIncome2: number
  grossIncome3: number
  grossIncome4: number
  runningCosts: number
  expenses: ExpensesByCategory
}

export interface ExpensesByCategory {
  [categoryId: string]: {
    [subcategoryId: string]: number
  }
} 