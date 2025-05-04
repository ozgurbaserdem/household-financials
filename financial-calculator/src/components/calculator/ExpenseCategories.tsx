'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { expenseCategories } from '@/data/expenseCategories'
import { formatCurrency } from '@/lib/calculations'
import type { ExpensesByCategory } from '@/lib/types'

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
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          value={expandedCategories}
          onValueChange={setExpandedCategories}
          className="space-y-4"
        >
          {expenseCategories.map(category => {
            const categoryTotal = calculateCategoryTotal(category.id)
            return (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="flex items-center justify-between">
                  <span className="truncate flex-1">{category.name}</span>
                  <span className="text-sm text-muted-foreground text-right w-24 flex-shrink-0">
                    {formatCurrency(categoryTotal)}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-4">
                    {category.subcategories.map(subcategory => (
                      <div key={subcategory.id} className="flex items-center justify-between gap-4">
                        <label className="text-sm">{subcategory.name}</label>
                        <Input
                          type="number"
                          className="w-32"
                          value={expenses[category.id]?.[subcategory.id] || 0}
                          onChange={e => handleExpenseChange(category.id, subcategory.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Expenses</span>
            <span className="text-lg font-semibold">
              {formatCurrency(calculateGrandTotal())}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 