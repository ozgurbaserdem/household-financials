# Project Structure

## Directory Structure
```
financial-calculator/
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Main calculator page
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   │
│   │   ├── calculator/          # Calculator-specific components
│   │   │   ├── CalculatorForm.tsx
│   │   │   ├── ExpenseCategories.tsx
│   │   │   ├── ResultsTable.tsx
│   │   │   └── RunningCosts.tsx
│   │   │
│   │   ├── charts/              # Visualization components
│   │   │   ├── ExpenseBreakdown.tsx
│   │   │   ├── LoanComparison.tsx
│   │   │   └── SavingsProjection.tsx
│   │   │
│   │   └── layout/              # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── LanguageToggle.tsx
│   │
│   ├── lib/                     # Utility functions and types
│   │   ├── calculations.ts      # Core calculation logic
│   │   ├── constants.ts         # Application constants
│   │   ├── formatting.ts        # Number and currency formatting
│   │   ├── translations.ts      # i18n translations
│   │   ├── types.ts            # TypeScript interfaces
│   │   └── validations.ts      # Form validation schemas
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useCalculator.ts    # Calculator state management
│   │   ├── useLocalStorage.ts  # Persistent storage hook
│   │   └── useTranslation.ts   # Translation hook
│   │
│   ├── contexts/                # React contexts
│   │   ├── LanguageContext.tsx  # Language management
│   │   └── ThemeContext.tsx     # Theme management (future)
│   │
│   └── data/                    # Static data
│       └── expenseCategories.ts # Expense category definitions
│
├── public/                      # Static assets
│   ├── images/
│   └── fonts/
│
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                        # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .github/                     # GitHub configuration
│   └── workflows/
│       └── ci.yml
│
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Key Files Description

### Application Entry Points
- `src/app/layout.tsx` - Root layout with providers and global configuration
- `src/app/page.tsx` - Main calculator application page
- `src/app/globals.css` - Global styles and Tailwind directives

### Core Components
- `src/components/calculator/CalculatorForm.tsx` - Main form for loan inputs
- `src/components/calculator/ExpenseCategories.tsx` - Expense category management
- `src/components/calculator/ResultsTable.tsx` - Results display table
- `src/components/charts/ExpenseBreakdown.tsx` - Pie chart visualization

### Utility Modules
- `src/lib/calculations.ts` - Core financial calculations
- `src/lib/formatting.ts` - Swedish number and currency formatting
- `src/lib/translations.ts` - Internationalization support
- `src/lib/types.ts` - TypeScript interfaces and types

### Data Files
- `src/data/expenseCategories.ts` - Complete expense category hierarchy

### Configuration Files
- `next.config.js` - Next.js framework configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript compiler options
- `package.json` - Project dependencies and scripts

## Module Organization Principles

1. **Components**: Organized by feature and complexity
   - UI components (Shadcn) are kept separate
   - Feature-specific components grouped together
   - Shared components in layout directory

2. **Business Logic**: Separated into lib directory
   - Calculations isolated from UI
   - Formatting utilities centralized
   - Type definitions shared across app

3. **Data Management**: 
   - Static data in data directory
   - Dynamic state managed in hooks
   - Global state in contexts

4. **Testing**: Mirror structure of source code
   - Unit tests for utilities
   - Integration tests for components
   - E2E tests for user flows

## Import Conventions

```typescript
// External imports first
import React from 'react';
import { useForm } from 'react-hook-form';

// Internal absolute imports (using @/ alias)
import { Button } from '@/components/ui/button';
import { calculateLoanScenarios } from '@/lib/calculations';
import type { CalculatorState } from '@/lib/types';

// Relative imports last (if needed)
import { LocalComponent } from './LocalComponent';
```

## File Naming Conventions

- React components: PascalCase (e.g., `CalculatorForm.tsx`)
- Utilities and hooks: camelCase (e.g., `calculations.ts`, `useCalculator.ts`)
- Types and interfaces: PascalCase with 'I' prefix for interfaces
- Constants: UPPER_SNAKE_CASE
- Test files: Same name with `.test.ts` or `.spec.ts` suffix

## Code Organization Guidelines

1. **Component Structure**:
   ```typescript
   // 1. Imports
   // 2. Types/Interfaces
   // 3. Component definition
   // 4. Hooks
   // 5. Event handlers
   // 6. Render logic
   // 7. Exports
   ```

2. **File Length**: Keep files under 300 lines
3. **Single Responsibility**: Each module should have one clear purpose
4. **Colocation**: Keep related code together (component + styles + tests)