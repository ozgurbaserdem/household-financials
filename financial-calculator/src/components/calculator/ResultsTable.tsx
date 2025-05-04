'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatPercentage } from '@/lib/calculations'
import type { CalculationResult } from '@/lib/types'

interface ResultsTableProps {
  results: CalculationResult[]
  totalIncome: number
}

export function ResultsTable({ results, totalIncome }: ResultsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Amortization</TableHead>
                <TableHead>Housing Cost</TableHead>
                <TableHead>Total Expenses</TableHead>
                <TableHead>Total Income</TableHead>
                <TableHead>Remaining Savings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{formatPercentage(result.interestRate)}</TableCell>
                  <TableCell>{formatPercentage(result.amortizationRate)}</TableCell>
                  <TableCell>{formatCurrency(result.totalHousingCost)}</TableCell>
                  <TableCell>{formatCurrency(result.totalExpenses)}</TableCell>
                  <TableCell>{formatCurrency(totalIncome)}</TableCell>
                  <TableCell
                    className={
                      result.remainingSavings >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {formatCurrency(result.remainingSavings)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 