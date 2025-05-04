'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/calculations'
import { expenseCategories } from '@/data/expenseCategories'
import type { ExpensesByCategory } from '@/lib/types'

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
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No expenses to display
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 