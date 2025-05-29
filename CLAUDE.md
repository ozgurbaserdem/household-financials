# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Financial Calculator - A Next.js 15 application for Swedish household budget calculations with internationalization support (Swedish/English).

## Essential Commands
```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Create production build (static export)
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report

# Analysis
npm run analyze      # Analyze bundle size
```

## Architecture Overview

### Tech Stack
- **Next.js 15.3.1** with App Router and static export
- **React 19** with TypeScript (strict mode)
- **Redux Toolkit** for state management with Redux Persist
- **Tailwind CSS v4** for styling
- **next-intl** for i18n (Swedish default, English secondary)
- **React Hook Form + Zod** for form validation
- **Radix UI** primitives for accessible components
- **Recharts** for data visualization

### Core Architecture Patterns

1. **Multi-Step Wizard Pattern**
   - 5-step process: Income → Loans → Expenses → Summary → Results
   - URL-based navigation with query parameters (`?steg=inkomst`)
   - State persisted across steps via Redux + session storage

2. **State Management Flow**
   - Single Redux slice (`calculatorSlice`) manages all calculator state
   - Actions: `updateLoanParameters`, `updateIncome`, `updateExpenses`, `resetCalculator`
   - State shape: `{ loanParameters, income, expenses }`

3. **Internationalized Routing**
   - Dynamic `[locale]` routes for language switching
   - Messages stored in `/messages/{lang}.json`
   - Language context provider for component-level translations

4. **Swedish Tax Calculations**
   - Complex tax calculations in `src/lib/calculations.ts`
   - Handles kommunalskatt, statlig skatt, jobbskatteavdrag
   - Multiple loan scenarios with different interest/amortization rates

### Key Business Logic

1. **Financial Health Score Calculation**
   - Based on: debt-to-income ratio, savings rate, housing cost ratio
   - Score ranges from 0-100 with color-coded indicators

2. **Expense Categories**
   - 13 main categories with multiple subcategories
   - Defined in `src/data/expenseCategories.ts`
   - Each category has Swedish/English translations

3. **Loan Scenarios**
   - Calculates 9 scenarios (3 interest rates × 3 amortization rates)
   - Shows monthly payments and total remaining after expenses

### Component Organization
```
/components/
  /ui/          # Reusable UI primitives (Radix-based)
  /calculator/  # Domain-specific calculator components
  /wizard/      # Wizard layout and step components
  /charts/      # Data visualization components
```

### Critical Implementation Details

1. **Swedish Number Formatting**
   - Use space as thousand separator
   - Format currency as "X XXX kr"
   - Comma for decimal separator
   - Implemented in `src/lib/formatting.ts`

2. **Form Validation**
   - All forms use React Hook Form + Zod
   - Bilingual error messages required
   - Validation schemas in component files

3. **Static Export Configuration**
   - `output: 'export'` in next.config.ts
   - Trailing slashes enabled for static hosting
   - Optimized for GitHub Pages deployment

### Development Workflow

1. **Adding New Features**
   - Update Redux state shape if needed
   - Add translations to both language files
   - Follow existing component patterns
   - Ensure mobile-first responsive design

2. **Testing Requirements**
   - Unit tests for calculations and utilities
   - Component tests for user interactions
   - Coverage maintained above 80%

3. **Code Style**
   - Components: PascalCase with kebab-case files
   - Hooks: camelCase prefixed with 'use'
   - Event handlers: prefixed with 'handle'
   - Boolean variables: prefixed with verbs (is/has/can)

### Common Tasks

1. **Update Expense Categories**
   - Modify `src/data/expenseCategories.ts`
   - Update translations in `/messages/*.json`
   - Ensure TypeScript types are updated

2. **Modify Tax Calculations**
   - Edit `src/lib/calculations.ts`
   - Update tests in `src/tests/unit/calculations.test.ts`
   - Verify all scenarios calculate correctly

3. **Add New Wizard Step**
   - Create component in `/wizard/steps/`
   - Update `WizardLayout.tsx` navigation
   - Add Redux state if needed
   - Update progress stepper

### Performance Considerations
- Use `React.memo()` for expensive components
- Implement `useMemo` for calculation results
- Avoid inline functions in JSX
- Dynamic imports for heavy components (charts)