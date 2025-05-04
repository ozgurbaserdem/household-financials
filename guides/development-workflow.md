# Development Workflow for Cursor

## Overview
This document provides step-by-step instructions for using Cursor to develop the Financial Calculator application. Follow these instructions sequentially for the best results.

## Prerequisites
- Cursor IDE installed
- Node.js 18+ installed
- Git configured
- Basic familiarity with React and TypeScript

## Phase 1: Project Setup

### Step 1: Initialize Project
Tell Cursor:
```
Create a new Next.js project with TypeScript named "financial-calculator" using these options:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- src/ directory: Yes
- Import alias: @/*
```

### Step 2: Install Core Dependencies
Tell Cursor:
```
Install the following dependencies:
- @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-slider @radix-ui/react-accordion
- class-variance-authority clsx tailwind-merge
- lucide-react
- recharts
- @hookform/resolvers zod react-hook-form

Also install @types/node as a dev dependency.
```

### Step 3: Configure Shadcn UI
Tell Cursor:
```
Initialize Shadcn UI with default configuration and install these components:
- button
- card
- form
- input
- label
- select
- table
- tabs
- accordion
```

## Phase 2: Core Infrastructure

### Step 1: Create Type Definitions
Tell Cursor:
```
Create a comprehensive TypeScript type system in src/lib/types.ts with:
1. LoanParameters interface (amount, interestRates, amortizationRates)
2. IncomeRange interface (min, max)
3. ExpenseCategory and ExpenseSubcategory interfaces
4. CalculationResult interface for loan scenarios
5. CalculatorState interface for app state
6. ExpensesByCategory type for expense tracking
```

### Step 2: Create Expense Categories
Tell Cursor:
```
Create a complete expense categories data structure in src/data/expenseCategories.ts with:
1. All 13 main categories from the requirements
2. All subcategories for each main category
3. TypeScript interfaces for categories
4. Default expense values (all set to 0)
5. Export both the categories and default values
```

Provide the complete list of categories and subcategories if needed.

### Step 3: Build Calculation Engine
Tell Cursor:
```
Create the calculation engine in src/lib/calculations.ts based on this Python logic:

loan_amount = 9_000_000  # loan amount
monthly_interest = (loan_amount * interest_rate) / 12
monthly_amortization = (loan_amount * amortization_rate) / 12
total_housing_cost = monthly_interest + monthly_amortization + running_costs
total_expenses = total_housing_cost + other_expenses
remaining_savings = net_income - total_expenses

Include functions for:
1. calculateLoanScenarios - generate all combinations
2. calculateTotalExpenses - sum all expenses
3. formatCurrency - Swedish krona formatting
4. formatPercentage - percentage formatting
```

## Phase 3: UI Components

### Step 1: Create Calculator Form
Tell Cursor:
```
Create a calculator form component in src/components/calculator/CalculatorForm.tsx with:
1. Loan amount input (default: 9,000,000)
2. Interest rate checkboxes (3.5%, 4.0%, 4.5%, 5.0%, 5.5%)
3. Amortization rate checkboxes (2%, 3%)
4. Income range inputs (min: 105,000, max: 107,000)
5. Running costs input (default: 6,000)
6. Form validation using Zod
7. Submit handler that passes data to parent
```

### Step 2: Create Expense Categories Component
Tell Cursor:
```
Create an expense categories component in src/components/calculator/ExpenseCategories.tsx with:
1. Accordion UI for each main category
2. Input fields for each subcategory
3. Running totals per category
4. Grand total display
5. onChange handler for updating expense values
6. Use Shadcn Accordion component
7. Format all amounts as Swedish currency
```

### Step 3: Create Results Table
Tell Cursor:
```
Create a results table component in src/components/calculator/ResultsTable.tsx with:
1. Display all loan scenarios in a table
2. Columns: Interest Rate, Amortization, Housing Cost, Total Expenses, Remaining Savings
3. Format currency and percentages properly
4. Color code remaining savings (green for positive, red for negative)
5. Responsive design for mobile
6. Use Shadcn Table component
```

## Phase 4: Integration

### Step 1: Create Main Page
Tell Cursor:
```
Create the main application page in src/app/page.tsx that:
1. Integrates all components
2. Manages state using useState
3. Handles form submission
4. Updates calculations when expenses change
5. Displays results in real-time
6. Uses a responsive grid layout
7. Initializes with default values
```

### Step 2: Add Visualizations
Tell Cursor:
```
Create an expense breakdown chart in src/components/charts/ExpenseBreakdown.tsx:
1. Use Recharts PieChart component
2. Show expense distribution by category
3. Include tooltips with amounts
4. Add a legend
5. Make it responsive
6. Only show categories with non-zero values
```

## Phase 5: Polish and Localization

### Step 1: Add Swedish Formatting
Tell Cursor:
```
Update the formatting functions in src/lib/calculations.ts to:
1. Use Swedish number format (space as thousand separator)
2. Format currency as "X XXX kr"
3. Use comma for decimal separator in percentages
4. Handle proper locale formatting
```

### Step 2: Add Localization Support (Optional)
Tell Cursor:
```
Create a translation system in src/lib/translations.ts with:
1. Swedish and English translations
2. Translation function for easy access
3. Default to Swedish
4. Include all UI text strings
```

## Development Best Practices

### Code Organization
1. Keep components small and focused
2. Use TypeScript strictly
3. Follow React best practices
4. Comment complex calculations
5. Use meaningful variable names

### Testing During Development
1. Test each component in isolation
2. Verify calculations with known values
3. Check responsive design
4. Test form validation
5. Ensure accessibility compliance

### Performance Considerations
1. Use React.memo for expensive components
2. Implement useMemo for calculations
3. Avoid unnecessary re-renders
4. Optimize bundle size

## Common Issues and Solutions

### Issue: Form Not Updating State
Solution: Check that onChange handlers are properly bound and state updates are creating new objects/arrays

### Issue: Calculations Not Matching Expected Results
Solution: Verify the calculation logic matches the Python example, check for floating-point precision issues

### Issue: Accordion Not Working
Solution: Ensure Shadcn UI is properly configured and imported

### Issue: Charts Not Rendering
Solution: Check that data is in the correct format for Recharts

## Deployment Checklist

1. Run `npm run build` to check for errors
2. Fix any TypeScript compilation issues
3. Test the production build locally
4. Deploy to Vercel or preferred platform
5. Verify all features work in production

## Next Steps

After completing the basic application:
1. Add unit tests for calculations
2. Implement error boundaries
3. Add loading states
4. Improve accessibility
5. Add PDF export feature
6. Implement scenario saving