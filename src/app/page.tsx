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
import ExportImportButtons from '@/components/export-import-buttons'
import { useTranslation } from 'react-i18next'

function getFormValuesFromState(state: CalculatorState) {
	return {
		loanAmount: state.loanParameters.amount,
		interestRates: state.loanParameters.interestRates,
		amortizationRates: state.loanParameters.amortizationRates,
		income1: state.grossIncome1 ?? state.income1,
		income2: state.grossIncome2 ?? state.income2,
		runningCosts: state.runningCosts
	}
}
export default function Home() {
	const [calculatorState, setCalculatorState] = useState<CalculatorState>({
		loanParameters: {
			amount: 5000000,
			interestRates: [3.5],
			amortizationRates: [2]
		},
		income1: 30000,
		income2: 30000,
		grossIncome1: 30000,
		grossIncome2: 30000,
		runningCosts: 5000,
		expenses: DEFAULT_EXPENSES
	})

	const [results, setResults] = useState<ReturnType<typeof calculateLoanScenarios>>([])
	const handleFormSubmit = (state: Partial<CalculatorState>) => {
		const newState: CalculatorState = {
			...calculatorState,
			...state,
			expenses: calculatorState.expenses
		}
		setCalculatorState(newState)
		setResults(calculateLoanScenarios(newState))
	}

	const handleExpensesChange = (expenses: ExpensesByCategory) => {
		const newState = {
			...calculatorState,
			expenses
		}
		setCalculatorState(newState)
		setResults(calculateLoanScenarios(newState))
	}

	const handleImport = (imported: Partial<CalculatorState>) => {
		// Merge imported state, fallback to current for missing fields
		const merged: CalculatorState = {
			loanParameters: imported.loanParameters ?? calculatorState.loanParameters,
			income1: imported.income1 ?? calculatorState.income1,
			income2: imported.income2 ?? calculatorState.income2,
			grossIncome1: imported.grossIncome1 ?? calculatorState.grossIncome1,
			grossIncome2: imported.grossIncome2 ?? calculatorState.grossIncome2,
			runningCosts: imported.runningCosts ?? calculatorState.runningCosts,
			expenses: imported.expenses ?? calculatorState.expenses
		}
		setCalculatorState(merged)
		setResults(calculateLoanScenarios(merged))
	}

	const { t } = useTranslation()

	return (
		<main className='min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center'>
			<div className='w-full max-w-7xl px-4 py-10'>
				<h1 className='text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-10 text-center tracking-tight'>
					{t('app.title')}
				</h1>
				<div className='mb-6 flex justify-end'>
					<ExportImportButtons
						state={calculatorState}
						onImport={handleImport}
					/>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<section className='col-span-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700'>
						<CalculatorForm
							onSubmit={handleFormSubmit}
							values={getFormValuesFromState(calculatorState)}
						/>
					</section>
					<section className='col-span-2 flex flex-col gap-8'>
						<div className='bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700'>
							<ResultsTable 
								results={results}
							/>
						</div>
						<div className='bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700'>
							<ExpenseBreakdown expenses={calculatorState.expenses} />
						</div>
					</section>
				</div>
				<section className='mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700'>
					<ExpenseCategories
						expenses={calculatorState.expenses}
						onChange={handleExpensesChange}
					/>
				</section>
			</div>
		</main>
	)
} 