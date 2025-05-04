'use client'

import React from 'react'
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
		<main className='min-h-screen bg-gray-100 flex flex-col items-center'>
			<div className='w-full max-w-7xl px-4 py-10'>
				<h1 className='text-5xl font-extrabold text-gray-900 mb-10 text-center tracking-tight'>
					Financial Calculator
				</h1>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<section className='col-span-1 bg-white rounded-2xl shadow-lg p-8 border border-gray-200'>
						<CalculatorForm onSubmit={handleFormSubmit} />
					</section>
					<section className='col-span-2 flex flex-col gap-8'>
						<div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-200'>
							<ResultsTable results={results} totalIncome={calculatorState.totalIncome} />
						</div>
						<div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-200'>
							<ExpenseBreakdown expenses={calculatorState.expenses} />
						</div>
					</section>
				</div>
				<section className='mt-10 bg-white rounded-2xl shadow-lg p-8 border border-gray-200'>
					<ExpenseCategories
						expenses={calculatorState.expenses}
						onChange={handleExpensesChange}
					/>
				</section>
			</div>
		</main>
	)
} 