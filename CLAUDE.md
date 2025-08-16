# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Financial Calculator - A Next.js 15 application for Swedish household budget calculations with internationalization support (Swedish/English).

## Essential Commands
```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Create production build (Vercel optimized)
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint (functional programming enforced)
npm run format       # Format code with Prettier
npm run prepare      # Setup Husky git hooks

# Testing
npm run test         # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run Playwright tests with UI
npm run test:e2e:debug # Debug Playwright tests

# Analysis
npm run analyze      # Analyze bundle size
npm run analyze:server  # Server bundle analysis
npm run analyze:browser # Browser bundle analysis
```

## Architecture Overview

### Tech Stack
- **Next.js 15.3.1** with App Router (Vercel deployment optimized)
- **React 19** with TypeScript (strict mode)
- **Redux Toolkit** for state management with Redux Persist
- **Tailwind CSS v4** for styling with custom design tokens
- **next-intl** for i18n (Swedish default, English secondary)
- **React Hook Form + Zod** for form validation
- **Radix UI** primitives for accessible components
- **Recharts** for data visualization
- **Playwright** for E2E testing with accessibility checks
- **Vitest** for unit testing with jsdom environment
- **next-themes** for dark/light theme management
- **Framer Motion** for animations
- **Vercel Analytics** for performance monitoring

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
   - Comprehensive business logic documented in `/src/lib/BUSINESS_LOGIC.md`

5. **Service Layer Architecture**
   - Business logic separated in `/src/lib/services/`
   - Feature-based organization in `/src/features/`
   - Shared utilities in `/src/shared/` for cross-cutting concerns

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

3. **Deployment Configuration**
   - **Vercel deployment** with optimized configuration
   - Vercel Analytics and Speed Insights for performance monitoring
   - Theme switching with next-themes (dark/light mode)
   - Static export available but commented out for Vercel

### Development Workflow

1. **Adding New Features**
   - Update Redux state shape if needed
   - Add translations to both language files
   - Follow existing component patterns
   - Ensure mobile-first responsive design

2. **Testing Requirements**
   - **Unit Testing**: Vitest with @testing-library/react
   - **E2E Testing**: Playwright with accessibility testing (axe-playwright)
   - **Test Environment**: jsdom with comprehensive Next.js mocking
   - **Coverage**: Maintained above 80% with detailed reporting

3. **Code Quality & Style**
   - **ESLint**: Functional programming patterns enforced (no for loops, prefer array methods)
   - **Prettier**: Automated code formatting
   - **Husky**: Git hooks for quality gates
   - **lint-staged**: Pre-commit file processing
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

## MCP Tools Integration

### Available MCP Servers

1. **Context7** - Up-to-date Documentation Provider
   - **Purpose**: Fetches real-time, version-specific documentation directly into prompts
   - **Installation**: `claude mcp add --transport http context7 https://mcp.context7.com/mcp`
   - **Usage**: Include "use context7" in prompts when needing current documentation

### Context7 Usage Guidelines

**When to Use Context7:**
- Working with **Next.js 15** features (App Router, Server Components, Server Actions)
- Implementing **React 19** patterns (new hooks, Suspense boundaries, concurrent features)
- Using **Tailwind CSS v4** syntax (new color system, CSS variables, modern utilities)
- Configuring **TypeScript 5.x** strict mode features
- Setting up **Playwright** testing with latest accessibility features
- Working with **Vitest** configuration and modern testing patterns
- Implementing **Vercel** deployment optimizations
- Using **next-intl** for internationalization
- Configuring **next-themes** for theme management
- Working with **Framer Motion** animations
- Setting up **Radix UI** primitives with latest patterns

**Example Usage Patterns:**
```
"use context7 for Next.js 15 - help me implement Server Actions for form submission"
"use context7 for React 19 - show me the new useActionState hook pattern"
"use context7 for Tailwind CSS v4 - help me configure custom design tokens"
"use context7 for Playwright - set up accessibility testing with axe"
"use context7 for TypeScript 5.x - configure strict mode for React components"
```

**When NOT to Use Context7:**
- Basic JavaScript/TypeScript syntax questions
- Well-established patterns already documented in this CLAUDE.md
- Simple HTML/CSS styling
- General programming concepts
- Business logic specific to this financial calculator

**Best Practices:**
- Be specific about versions when using Context7 (e.g., "Next.js 15", "React 19")
- Combine Context7 with specific implementation requests
- Use when encountering deprecated patterns or outdated examples
- Essential for staying current with rapidly evolving frameworks