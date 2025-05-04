'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatPercentage } from '@/lib/calculations'
import type { CalculationResult } from '@/lib/types'
import { BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ResultsTableProps {
  results: CalculationResult[]
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
            <TableHeader className='bg-gray-50 dark:bg-gray-800 sticky top-0 z-10'>
              <TableRow>
                <TableHead className='font-semibold text-gray-700 dark:text-gray-200'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{t('results.interest_rate')}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('results.interest_rate_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className='font-semibold text-gray-700 dark:text-gray-200'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{t('results.amortization')}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('results.amortization_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className='font-semibold text-gray-700 dark:text-gray-200'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{t('results.housing_cost')}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('results.housing_cost_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className='font-semibold text-gray-700 dark:text-gray-200'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{t('results.total_expenses')}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('results.total_expenses_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className='font-semibold text-gray-700 dark:text-gray-200'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{t('results.total_income')}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('results.total_income_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className='font-semibold text-gray-700 dark:text-gray-200'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{t('results.remaining_savings')}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('results.remaining_savings_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => {
                const totalIncome = result.income1 + result.income2
                return (
                  <TableRow key={index} className='hover:bg-blue-50/40 transition-colors'>
                    <TableCell>{formatPercentage(result.interestRate)}</TableCell>
                    <TableCell>{formatPercentage(result.amortizationRate)}</TableCell>
                    <TableCell>{formatCurrency(result.totalHousingCost)}</TableCell>
                    <TableCell>{formatCurrency(result.totalExpenses)}</TableCell>
                    <TableCell>{formatCurrency(totalIncome)}</TableCell>
                    <TableCell
                      className={
                        result.remainingSavings >= 0
                          ? 'text-green-600 font-bold'
                          : 'text-red-600 font-bold'
                      }
                    >
                      {formatCurrency(result.remainingSavings)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 