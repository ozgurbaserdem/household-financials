# lib/

This directory contains core business logic, utilities, and services that power the financial calculator application.

## Overview

The lib directory is organized into several key areas:

- **Services**: Core business logic classes for financial calculations
- **Calculations**: Pure functions for specific financial computations
- **Types**: TypeScript type definitions for the entire application
- **Utilities**: Helper functions and hooks
- **Validation**: Form and data validation logic

## Architecture

### Services (`/services/`)

Service classes that encapsulate complex business logic:

- **FinancialCalculationService**: Main service orchestrating financial calculations
- **TaxCalculationService**: Swedish tax calculations with 2025 rules
- **LoanCalculationService**: Loan payment and scenario calculations

Services follow the singleton pattern for consistent state and performance.

### Core Calculations (`calculations.ts`)

Pure functions that serve as the main API for financial calculations:

- Income calculations with Swedish tax rules
- Loan scenario modeling
- Expense analysis and categorization
- Financial health scoring

These functions abstract the service layer complexity and provide a clean interface for components.

### Types (`types.ts`)

Comprehensive TypeScript definitions including:

- **CalculatorState**: Complete application state structure
- **CalculationResult**: Loan scenario results
- **FinancialHealthScore**: Health metrics and recommendations
- **Income/Expense interfaces**: Data structures for financial inputs

### Utilities

#### Hooks (`/hooks/`)

- **use-is-touch-device**: Touch capability detection for responsive UX
- **use-focus-management**: Accessibility-focused element management

#### Other Utilities

- **formatting.ts**: Swedish locale number/currency formatting
- **utils.ts**: General utility functions (cn, etc.)
- **validation/**: Form validation schemas and logic

## Key Features

### Swedish Tax Compliance

- Official 2025 tax rates and thresholds
- Municipal tax variations across all Swedish kommuner
- Support for primary/secondary income tax rules
- Church tax calculations
- Grundavdrag and jobbskatteavdrag handling

### Financial Health Analysis

Comprehensive scoring system based on:

- Debt-to-income ratio (30% weight)
- Emergency fund coverage (30% weight)
- Housing cost ratio (20% weight)
- Discretionary income ratio (20% weight)

### Loan Scenario Modeling

- Multiple interest/amortization rate combinations
- Monthly payment breakdowns (interest vs. amortization)
- Total cost projections over time
- Optimal and worst-case scenario analysis

## Usage Examples

### Basic Income Calculation

```typescript
import { getNetIncome } from "./calculations";

const netIncome = getNetIncome(50000, false, "Stockholm", true);
// Returns net income after Swedish taxes
```

### Financial Health Assessment

```typescript
import { calculateFinancialHealthScore } from "./calculations";

const healthScore = calculateFinancialHealthScore(calculatorState);
// Returns score (0-100) with recommendations
```

### Service Usage

```typescript
import { financialCalculationService } from "./services";

const scenarios = financialCalculationService.calculateLoanScenarios(state);
// Returns array of detailed loan scenarios
```

## Integration Points

This library integrates with:

- **Redux Store**: Calculator state management
- **React Components**: Financial calculation display
- **Internationalization**: Multi-language number formatting
- **Form Validation**: Real-time input validation

## Testing

All calculation logic includes comprehensive test coverage:

- Unit tests for individual functions
- Integration tests for service workflows
- Edge case handling for invalid inputs
- Swedish tax rule accuracy verification

## Performance Considerations

- Services use singleton pattern for memory efficiency
- Calculations are pure functions for predictable performance
- Heavy computations use memoization where appropriate
- Formatting utilities cache number formatters
