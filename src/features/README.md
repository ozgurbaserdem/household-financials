# features/

This directory contains feature-specific React components organized by functionality. Each subdirectory represents a distinct feature or page within the financial calculator application.

## Overview

Features are organized around specific user workflows and functionality areas:

- **calculator/**: Core budget calculator components
- **wizard/**: Multi-step wizard interface components
- **charts/**: Data visualization and graphing components
- **compound-interest/**: Compound interest calculator feature
- **hushallskalkyl/**: Swedish household calculation feature

## Architecture

### Feature Organization

Each feature directory follows a consistent structure:

```
feature-name/
├── ComponentName.tsx          # Main feature components
├── feature-name-dialog.tsx    # Modal/dialog components
├── __tests__/                 # Feature-specific tests
│   └── *.test.tsx
└── steps/                     # Multi-step components (wizard)
    └── StepName.tsx
```

### Component Patterns

#### Separation of Concerns

- **Container components**: Handle business logic and state
- **Presentation components**: Focus on UI rendering and user interaction
- **Hook components**: Encapsulate reusable stateful logic

#### Data Flow

- Props flow down from parent containers
- Events bubble up through callback props
- Global state managed via Redux for calculator data
- Local state for UI-specific concerns (modals, forms, etc.)

## Feature Details

### calculator/

Core budget calculation interface components:

**Main Components:**

- **Income.tsx**: Income input and tax calculation interface
- **Loans.tsx**: Loan parameter configuration
- **ExpenseCategories.tsx**: Detailed expense category inputs
- **FinancialHealthScore.tsx**: Health score display with metrics
- **Forecast.tsx**: Future financial projections
- **ResultsTable.tsx**: Loan scenario comparison table

**Supporting Components:**

- **IncomeInputField.tsx**: Reusable income input with validation
- **LoanInputField.tsx**: Loan-specific input field
- **NumberOfAdultsRadioGroup.tsx**: Household size selection
- **ResultCard.tsx**: Individual loan scenario display

### wizard/

Multi-step wizard interface for guided budget creation:

**Core Components:**

- **WizardLayout.tsx**: Main wizard container with navigation
- **ProgressStepper.tsx**: Visual progress indicator

**Step Components:**

- **IncomeStep.tsx**: Income data collection
- **LoansStep.tsx**: Loan information gathering
- **ExpensesStep.tsx**: Expense category inputs
- **SummaryStep.tsx**: Review and edit collected data
- **ResultsStep.tsx**: Final results and recommendations

### charts/

Data visualization components using Recharts:

- **CompoundInterestChart.tsx**: Interactive compound interest visualization
- **ExpenseBreakdown.tsx**: Pie chart for expense category distribution

### compound-interest/

Standalone compound interest calculator:

- **CompoundInterestCalculator.tsx**: Main calculator interface
- **CompoundInterestClient.tsx**: Client-side wrapper component

### hushallskalkyl/

Swedish-specific household calculation tools:

- **HushallskalkylContent.tsx**: Main content component
- **hushallskalkyl-dialog.tsx**: Modal interface for household calculations

## Integration Points

### State Management

- Redux store for persistent calculator data
- Local component state for UI interactions
- URL parameters for wizard step navigation

### Internationalization

- All components support Swedish/English localization
- Text content externalized to message files
- Number formatting respects Swedish locale conventions

### Accessibility

- Focus management for wizard navigation
- Screen reader support with ARIA labels
- Keyboard navigation for all interactive elements
- Touch-friendly interfaces for mobile devices

## Component Guidelines

### TypeScript

- All components written in TypeScript with strict typing
- Props interfaces documented with JSDoc
- Generic types used for reusable components

### Styling

- Tailwind CSS for all styling
- Responsive design patterns (mobile-first)
- Dark mode support throughout
- Consistent spacing and typography scale

### Testing

- Jest and React Testing Library for component tests
- Coverage focused on user interactions and edge cases
- Accessibility testing with axe-core integration
- Mock services for isolated component testing

## Performance Optimizations

### React Optimizations

- React.memo() for expensive components
- useMemo() for heavy calculations
- useCallback() for stable function references
- Dynamic imports for code splitting

### User Experience

- Optimistic updates for form interactions
- Loading states for async operations
- Error boundaries for graceful failure handling
- Progressive enhancement for JavaScript-disabled environments

## Common Patterns

### Form Handling

```typescript
// React Hook Form with Zod validation
const form = useForm<FormData>({
  resolver: zodResolver(validationSchema),
  defaultValues: initialData,
});
```

### Internationalization

```typescript
// Using next-intl for translations
const t = useTranslations('calculator');
return <Text>{t('income_label')}</Text>;
```

### Responsive Design

```typescript
// Mobile-first responsive patterns
<Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</Box>
```

### State Updates

```typescript
// Redux for global calculator state
const dispatch = useAppDispatch();
dispatch(updateIncome({ income1: value }));
```
