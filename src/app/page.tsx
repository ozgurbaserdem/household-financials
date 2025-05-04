'use client'

import { useState } from 'react'
import { CalculatorForm } from '@/components/calculator/CalculatorForm'
import { ExpenseCategories } from '@/components/calculator/ExpenseCategories'
import { ResultsTable } from '@/components/calculator/ResultsTable'
import { ExpenseBreakdown } from '@/components/charts/ExpenseBreakdown'
import { calculateLoanScenarios } from '@/lib/calculations'
import { DEFAULT_EXPENSES } from '@/data/expenseCategories'
import type { CalculatorState, ExpensesByCategory } from '@/lib/types'

export default function Home() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    loanParameters: {
      amount: 9000000,
      interestRates: [3.5],
      amortizationRates: [2]
    },
    incomeRange: {
      min: 105000,
      max: 107000
    },
    runningCosts: 6000,
    expenses: DEFAULT_EXPENSES
  })

  const [results, setResults] = useState<ReturnType<typeof calculateLoanScenarios>>([])

  const handleFormSubmit = (state: CalculatorState) => {
    setCalculatorState(prev => ({
      ...state,
      expenses: prev.expenses // Keep existing expenses
    }))
    setResults(calculateLoanScenarios(state))
  }

  const handleExpensesChange = (expenses: ExpensesByCategory) => {
    const newState = {
      ...calculatorState,
      expenses
    }
    setCalculatorState(newState)
    setResults(calculateLoanScenarios(newState))
  }

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Financial Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          <CalculatorForm onSubmit={handleFormSubmit} />
          <ExpenseCategories
            expenses={calculatorState.expenses}
            onChange={handleExpensesChange}
          />
        </div>
        
        <div className="space-y-6 lg:col-span-2">
          <ResultsTable results={results} totalIncome={calculatorState.totalIncome} />
          <ExpenseBreakdown expenses={calculatorState.expenses} />
        </div>
      </div>
    </main>
  )
} 