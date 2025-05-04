'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { expenseCategories } from '@/data/expenseCategories'
import { formatCurrency } from '@/lib/calculations'
import type { ExpensesByCategory } from '@/lib/types'
import { List } from 'lucide-react'

interface ExpenseCategoriesProps {
  expenses: ExpensesByCategory
  onChange: (expenses: ExpensesByCategory) => void
}

export function ExpenseCategories({ expenses, onChange }: ExpenseCategoriesProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const handleExpenseChange = (categoryId: string, subcategoryId: string, value: string) => {
    const newExpenses = { ...expenses }
    if (!newExpenses[categoryId]) {
      newExpenses[categoryId] = {}
    }
    newExpenses[categoryId][subcategoryId] = Number(value) || 0
    onChange(newExpenses)
  }

  const calculateCategoryTotal = (categoryId: string) => {
    const categoryExpenses = expenses[categoryId] || {}
    return Object.values(categoryExpenses).reduce((sum, amount) => sum + amount, 0)
  }

  const calculateGrandTotal = () => {
    return Object.values(expenses).reduce((sum, category) => {
      return sum + Object.values(category).reduce((catSum, amount) => catSum + amount, 0)
    }, 0)
  }

  return (
    <Card className='shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900'>
      <CardHeader className='flex flex-row items-center gap-3 pb-2'>
        <List className='w-7 h-7 text-blue-600' />
        <CardTitle className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type='multiple'
          value={expandedCategories}
          onValueChange={setExpandedCategories}
          className='space-y-4'
        >
          {expenseCategories.map(category => {
            const categoryTotal = calculateCategoryTotal(category.id)
            return (
              <AccordionItem key={category.id} value={category.id} className='rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'>
                <AccordionTrigger className='flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors'>
                  <span className='truncate flex-1 font-medium text-gray-800 dark:text-gray-100'>{category.name}</span>
                  <span className='text-sm text-gray-500 dark:text-gray-300 text-right w-24 flex-shrink-0'>
                    {formatCurrency(categoryTotal)}
                  </span>
                </AccordionTrigger>
                <AccordionContent className='transition-all duration-200'>
                  <div className='space-y-4 p-4'>
                    {category.subcategories.map(subcategory => (
                      <div
                        key={subcategory.id}
                        className='
                          flex items-center justify-between gap-4
                          py-2 px-2 rounded-md group
                          even:bg-gray-50 odd:bg-white
                          dark:even:bg-gray-900 dark:odd:bg-gray-800
                          transition-colors
                          focus-within:bg-blue-100 dark:focus-within:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-500
                          hover:bg-blue-50 dark:hover:bg-blue-900/10
                        '
                      >
                        <label
                          className='
                            text-sm text-gray-700 dark:text-gray-300
                            group-focus-within:text-blue-400 group-hover:text-blue-300
                            transition-colors
                          '
                        >
                          {subcategory.name}
                        </label>
                        <Input
                          type='number'
                          min={0}
                          className='w-32 bg-white border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-150 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500'
                          value={expenses[category.id]?.[subcategory.id] || 0}
                          onChange={e => handleExpenseChange(category.id, subcategory.id, e.target.value)}
                          onFocus={e => e.target.select()}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        <div className='mt-6 border-t border-gray-200 dark:border-gray-700 pt-4'>
          <div className='flex items-center justify-between'>
            <span className='font-medium text-gray-800 dark:text-gray-100'>Total Expenses</span>
            <span className='text-lg font-semibold text-blue-700 dark:text-blue-400'>
              {formatCurrency(calculateGrandTotal())}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 