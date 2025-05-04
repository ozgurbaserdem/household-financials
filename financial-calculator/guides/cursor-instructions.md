# Cursor Development Instructions

## Quick Start Guide

This document contains copy-paste instructions for Cursor to build the Financial Calculator application. Follow these in order.

## Project Setup

### 1. Create Project
```
Create a new Next.js project with the following configuration:
- Project name: financial-calculator
- TypeScript: Yes
- ESLint: Yes  
- Tailwind CSS: Yes
- App Router: Yes
- src/ directory: Yes
- Import alias: @/*
```

### 2. Install Dependencies
```
Install these packages:
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-slider @radix-ui/react-accordion class-variance-authority clsx tailwind-merge lucide-react recharts @hookform/resolvers zod react-hook-form
npm install -D @types/node
```

### 3. Setup Shadcn UI
```
Initialize Shadcn UI with default settings, then add these components:
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card form input label select table tabs accordion
```

## Core Files Creation

### 4. Create Types
```
Create src/lib/types.ts with TypeScript interfaces for:
- LoanParameters (amount: number, interestRates: number[], amortizationRates: number[])
- IncomeRange (min: number, max: number)
- ExpenseCategory and ExpenseSubcategory
- CalculationResult for loan scenarios
- CalculatorState for application state
- ExpensesByCategory for expense tracking
```

### 5. Create Expense Categories
```
Create src/data/expenseCategories.ts with all 13 expense categories and their subcategories:

Categories to include:
1. Home (13 subcategories)
2. Car and transportation (10 subcategories)
3. Leisure time (16 subcategories)
4. Shopping and services (12 subcategories)
5. Loans, tax and fees (5 subcategories)
6. Health and beauty (8 subcategories)
7. Children (9 subcategories)
8. Uncategorised expenses (5 subcategories)
9. Insurance (6 subcategories)
10. Savings and investments (5 subcategories)
11. Vacation and travelling (5 subcategories)
12. Education (4 subcategories)
13. Food (5 subcategories)

Include DEFAULT_EXPENSES object with all values set to 0.
```

### 6. Create Calculation Engine
```
Create src/lib/calculations.ts with these functions:

1. calculateLoanScenarios(state: CalculatorState): CalculationResult[]
   - Loop through interest rates and amortization rates
   - Calculate monthly interest: (loan * rate) / 12
   - Calculate monthly amortization: (loan * rate) / 12
   - Calculate total housing cost: interest + amortization + running costs
   - Calculate remaining savings: income - total expenses

2. calculateTotalExpenses(expenses: ExpensesByCategory): number
   - Sum all expense values across all categories

3. formatCurrency(amount: number): string
   - Format as Swedish krona: "X XXX kr"
   - Use space as thousand separator

4. formatPercentage(value: number): string
   - Format as "X.X%"
```

## Component Creation

### 7. Calculator Form Component
```
Create src/components/calculator/CalculatorForm.tsx:

1. Use React Hook Form with Zod validation
2. Include inputs for:
   - Loan amount (default: 9,000,000)
   - Interest rates (checkboxes: 3.5%, 4.0%, 4.5%, 5.0%, 5.5%)
   - Amortization rates (checkboxes: 2%, 3%)
   - Income min/max (defaults: 105,000/107,000)
   - Running costs (default: 6,000)
3. Add form validation
4. Submit handler to pass data to parent
```

### 8. Expense Categories Component
```
Create src/components/calculator/ExpenseCategories.tsx:

1. Use Shadcn Accordion component
2. Create accordion item for each main category
3. Add number inputs for each subcategory
4. Show category totals
5. Display grand total
6. Handle onChange for expense updates
7. Use Swedish currency formatting
```

### 9. Results Table Component
```
Create src/components/calculator/ResultsTable.tsx:

1. Use Shadcn Table component
2. Display columns: Interest Rate, Amortization, Housing Cost, Total Expenses, Remaining Savings
3. Format currency and percentages
4. Color code savings (green/red)
5. Make responsive for mobile
```

### 10. Expense Chart Component
```
Create src/components/charts/ExpenseBreakdown.tsx:

1. Use Recharts PieChart
2. Show expense distribution by category
3. Add interactive tooltips
4. Include legend
5. Make responsive
6. Only show non-zero categories
```

## Main Application

### 11. Create Main Page
```
Create src/app/page.tsx:

1. Import all components
2. Set up state management with useState
3. Initialize with default values
4. Handle form submission
5. Update calculations on expense changes
6. Use responsive grid layout
7. Connect all components together
```

## Final Steps

### 12. Add Swedish Formatting
```
Update src/lib/calculations.ts formatCurrency function:

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
```

### 13. Test and Deploy
```
1. Run npm run dev and test all features
2. Run npm run build to check for errors
3. Deploy to Vercel or your preferred platform
```

## Common Cursor Commands

### Creating a Component
```
Create a React component in [path] that [description] using TypeScript and Shadcn UI components
```

### Adding Features
```
Add [feature] to [component] that allows users to [functionality]
```

### Fixing Issues
```
Fix the issue in [component] where [problem description]
```

### Optimizing Performance
```
Optimize [component] by implementing React.memo and useMemo where appropriate
```

## Troubleshooting

### If Build Fails
```
Check for TypeScript errors and fix them. Common issues:
1. Missing type imports
2. Incorrect prop types
3. Undefined variables
```

### If Calculations Are Wrong
```
Verify the calculation logic in src/lib/calculations.ts matches the Python example provided
```

### If UI Components Don't Render
```
1. Check Shadcn UI is properly installed
2. Verify imports are correct
3. Check for console errors
```

Remember: Always test each component after creation before moving to the next one.