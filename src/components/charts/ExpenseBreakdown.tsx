'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/calculations'
import { expenseCategories } from '@/data/expenseCategories'
import type { ExpensesByCategory } from '@/lib/types'
import { PieChart as PieChartIcon } from 'lucide-react'
import React from 'react'

interface ExpenseBreakdownProps {
  expenses: ExpensesByCategory
}

interface ChartData {
  name: string
  value: number
  color: string
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C43', '#A4DE6C', '#D0ED57',
  '#FFB6C1', '#87CEEB', '#DDA0DD', '#F0E68C', '#98FB98'
]

const CustomTooltip = ({
	payload,
}: {
	payload?: { value: number, name: string }[]
}) => {
	if (!payload || !payload.length) return null
	return (
		<div
			className='rounded-md px-3 py-2 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
		>
			<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
				{payload[0].name}: {formatCurrency(payload[0].value)}
			</p>
		</div>
	)
}

export function ExpenseBreakdown({ expenses }: ExpenseBreakdownProps) {
  const chartData: ChartData[] = expenseCategories
    .map(category => {
      const categoryTotal = Object.values(expenses[category.id] || {}).reduce(
        (sum, amount) => sum + amount,
        0
      )
      return {
        name: category.name,
        value: categoryTotal,
        color: COLORS[expenseCategories.indexOf(category) % COLORS.length]
      }
    })
    .filter(data => data.value > 0)

  if (chartData.length === 0) {
    return (
      <Card className='shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900'>
        <CardHeader className='flex flex-row items-center gap-3 pb-2 dark:bg-gray-900'>
          <PieChartIcon className='w-7 h-7 text-blue-600' />
          <CardTitle className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-[300px] items-center justify-center text-muted-foreground dark:text-gray-400'>
            No expenses to display
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900'>
      <CardHeader className='flex flex-row items-center gap-3 pb-2 dark:bg-gray-900'>
        <PieChartIcon className='w-7 h-7 text-blue-600' />
        <CardTitle className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType='circle'
                wrapperStyle={{
                  paddingTop: 12,
                  fontSize: 14,
                  color: 'var(--tw-prose-body, #555)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 