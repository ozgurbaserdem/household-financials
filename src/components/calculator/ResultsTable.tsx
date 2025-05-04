'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatPercentage } from '@/lib/calculations'
import type { CalculationResult } from '@/lib/types'
import { BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'
import { cn } from '@/lib/utils'

interface ResultsTableProps {
	results: CalculationResult[]
}

interface HeadCell {
	key: string
	tooltipKey: string
	className?: string
	render?: (result: CalculationResult) => React.ReactNode
}

const HEAD_CELLS: HeadCell[] = [
	{
		key: 'interest_rate',
		tooltipKey: 'interest_rate_tooltip',
		render: result => formatPercentage(result.interestRate),
	},
	{
		key: 'amortization',
		tooltipKey: 'amortization_tooltip',
		render: result => formatPercentage(result.amortizationRate),
	},
	{
		key: 'housing_cost',
		tooltipKey: 'housing_cost_tooltip',
		render: result => formatCurrency(result.totalHousingCost),
	},
	{
		key: 'total_expenses',
		tooltipKey: 'total_expenses_tooltip',
		render: result => formatCurrency(result.totalExpenses),
	},
	{
		key: 'total_income',
		tooltipKey: 'total_income_tooltip',
		render: result => formatCurrency(result.income1 + result.income2),
	},
	{
		key: 'remaining_savings',
		tooltipKey: 'remaining_savings_tooltip',
		className: 'font-bold',
		render: result => formatCurrency(result.remainingSavings),
	},
]

function ResultsTableHead() {
	const { t } = useTranslation()
	return (
		<TableHeader className='bg-gray-50 dark:bg-gray-800 sticky top-0 z-10'>
			<TableRow>
				{HEAD_CELLS.map(cell => (
					<TableHead
						key={cell.key}
						className={`font-semibold text-gray-700 dark:text-gray-200 ${cell.className ?? ''}`}
					>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span>{t(`results.${cell.key}`)}</span>
								</TooltipTrigger>
								<TooltipContent>
									{t(`results.${cell.tooltipKey}`)}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
	)
}

function ResultsTableRow({ result }: { result: CalculationResult }) {
	return (
		<TableRow className='hover:bg-blue-50/40 transition-colors'>
			{HEAD_CELLS.map(cell => (
				<TableCell
					key={cell.key}
					className={cn(
						cell.className,
						cell.key === 'remaining_savings' && {
							'text-green-600 font-bold': result.remainingSavings >= 0,
							'text-red-600 font-bold': result.remainingSavings < 0
						}
					)}
				>
					{cell.render ? cell.render(result) : null}
				</TableCell>
			))}
		</TableRow>
	)
}

export function ResultsTable({ results }: ResultsTableProps) {
	const { t } = useTranslation()

	return (
		<Card className='shadow-lg rounded-2xl border border-gray-200'>
			<CardHeader className='flex flex-row items-center gap-3 pb-2'>
				<BarChart3 className='w-7 h-7 text-blue-600' />
				<CardTitle className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
					{t('results.title')}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='overflow-x-auto'>
					<Table className='min-w-full text-sm'>
						<ResultsTableHead />
						<TableBody>
							{results.map((result, index) => (
								<ResultsTableRow key={index} result={result} />
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}