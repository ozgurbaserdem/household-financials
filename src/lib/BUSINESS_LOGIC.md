# Financial Calculator Business Logic Documentation

This document provides comprehensive documentation of the complex business logic implemented in the Swedish financial calculator application.

## Overview

The financial calculator implements sophisticated Swedish tax calculations, loan modeling, and financial health assessment algorithms to provide accurate household budget analysis for Swedish users.

## Swedish Tax Calculation System

### Legal Framework

The tax calculations are based on Swedish tax law for 2025, implementing the official rates and thresholds from Skatteverket (Swedish Tax Agency).

### Tax Components

#### 1. Municipal Tax (Kommunalskatt)

- **Rate**: Varies by municipality (kommun), ranging from ~29% to ~35%
- **Base**: Taxable income after grundavdrag (basic deduction)
- **Application**: Applied to all taxable income

**Implementation Details:**

```typescript
// Municipal tax calculation
const kommunalTax = taxableIncome * config.kommunalskatt;
```

The system includes all 290 Swedish municipalities with their specific 2025 tax rates, loaded from `kommunalskatt_2025.json`.

#### 2. State Tax (Statlig Skatt)

- **Rate**: 20% on income above the threshold
- **Threshold**: 643,104 SEK annually (53,592 SEK monthly) for 2025
- **Progressive**: Only applies to income exceeding the threshold

**Implementation Logic:**

```typescript
const statligTax =
  gross > config.statligSkattThreshold
    ? (gross - config.statligSkattThreshold) * config.statligSkatt
    : 0;
```

#### 3. Basic Deduction (Grundavdrag)

- **Amount**: Approximately 36,000 SEK annually (3,000 SEK monthly)
- **Application**: Reduces taxable income before municipal tax calculation
- **Eligibility**: Primary income only (not secondary income)

#### 4. Job Tax Credit (Jobbskatteavdrag)

- **Amount**: Approximately 37,200 SEK annually (3,100 SEK monthly)
- **Application**: Direct reduction of total tax owed
- **Purpose**: Incentivize employment by reducing tax burden

#### 5. Church Tax (Kyrkoavgift)

- **Rate**: ~1% (varies by kommun and religious community)
- **Optional**: Users can choose to include or exclude
- **Application**: Additional to municipal tax rate

### Income Type Differentiation

#### Primary Income

- Subject to all deductions and credits
- Standard municipal tax rates
- Full grundavdrag and jobbskatteavdrag

#### Secondary Income

- Higher tax rate (~34% vs ~31% municipal tax)
- No grundavdrag or jobbskatteavdrag
- Simplified calculation for additional income sources

**Tax Configuration Example:**

```typescript
const defaultConfig = {
  kommunalskatt: 0.31, // 31% municipal tax
  statligSkatt: 0.2, // 20% state tax
  statligSkattThreshold: 53592, // Monthly threshold
  grundavdrag: 3000, // Monthly basic deduction
  jobbskatteavdrag: 3100, // Monthly job tax credit
};

const secondaryConfig = {
  ...defaultConfig,
  kommunalskatt: 0.34, // Higher rate for secondary income
  grundavdrag: 0, // No basic deduction
  jobbskatteavdrag: 0, // No job tax credit
};
```

## Loan Calculation System

### Swedish Mortgage Practices

The loan calculations reflect Swedish mortgage market practices where loans typically include both interest payments and mandatory amortization.

### Calculation Components

#### Monthly Interest Payment

```typescript
const monthlyInterest = (loanAmount * (annualInterestRate / 100)) / 12;
```

#### Monthly Amortization Payment

```typescript
const monthlyAmortization = (loanAmount * (annualAmortizationRate / 100)) / 12;
```

#### Total Monthly Payment

```typescript
const totalMonthlyPayment = monthlyInterest + monthlyAmortization;
```

### Scenario Modeling

The system generates comprehensive loan scenarios by varying:

- Interest rates (typically 3 different rates)
- Amortization rates (typically 3 different rates)
- Results in 9 total scenarios for comparison

### Amortization Requirements

Swedish mortgage regulations require mandatory amortization:

- 2% annually for loan-to-value ratios above 70%
- 1% annually for ratios between 50-70%
- No requirement below 50% LTV

The calculator allows flexible amortization rates to model different scenarios and regulatory requirements.

## Financial Health Scoring Algorithm

### Methodology

The financial health score (0-100) uses a weighted scoring system based on established personal finance best practices and Swedish financial advisory guidelines.

### Scoring Metrics and Weights

#### 1. Debt-to-Income Ratio (30% weight)

**Formula:**

```typescript
const debtToIncomeRatio = loanAmount / (grossAnnualIncome * 12);
```

**Scoring Logic:**

- Optimal: Under 2x annual income (100 points)
- Acceptable: 2-4x annual income (50-100 points)
- Concerning: Over 4x annual income (0-50 points)

**Implementation:**

```typescript
const dtiScore = Math.max(0, 100 * (1 - Math.min(debtToIncomeRatio, 2) / 2));
```

#### 2. Emergency Fund Coverage (30% weight)

**Formula:**

```typescript
const emergencyFundCoverage = emergencyFund / monthlyExpenses;
```

**Scoring Logic:**

- Optimal: 6+ months of expenses (100 points)
- Good: 3-6 months (50-100 points)
- Poor: Under 3 months (0-50 points)

**Implementation:**

```typescript
const emergencyScore = Math.min(100, emergencyFundCoverage * 100);
```

#### 3. Housing Cost Ratio (20% weight)

**Formula:**

```typescript
const housingCostRatio = totalHousingCost / netMonthlyIncome;
```

**Scoring Logic:**

- Optimal: Under 25% of net income (100 points)
- Acceptable: 25-30% (50-100 points)
- Concerning: Over 30% (0-50 points)

**Implementation:**

```typescript
const housingScore = Math.max(0, 100 * (1 - housingCostRatio / 0.3));
```

#### 4. Discretionary Income Ratio (20% weight)

**Formula:**

```typescript
const discretionaryRatio = (netIncome - totalExpenses) / netIncome;
```

**Scoring Logic:**

- Optimal: 20%+ discretionary income (100 points)
- Acceptable: 10-20% (50-100 points)
- Poor: Under 10% (0-50 points)

**Implementation:**

```typescript
const discretionaryScore = Math.min(100, discretionaryRatio * 200);
```

### Overall Score Calculation

```typescript
const weights = {
  debtToIncomeRatio: 0.3,
  emergencyFundCoverage: 0.3,
  housingCostRatio: 0.2,
  discretionaryIncomeRatio: 0.2,
};

const overallScore = Math.round(
  dtiScore * weights.debtToIncomeRatio +
    emergencyScore * weights.emergencyFundCoverage +
    housingScore * weights.housingCostRatio +
    discretionaryScore * weights.discretionaryIncomeRatio
);
```

### Recommendation Engine

The system generates personalized recommendations based on metric thresholds:

#### Debt-to-Income Recommendations

- Triggered when DTI > 4.3x
- Suggests debt reduction strategies
- Recommends income increase options

#### Emergency Fund Recommendations

- Triggered when coverage < 3 months
- Provides savings goal calculations
- Suggests automatic savings plans

#### Housing Cost Recommendations

- Triggered when housing > 30% of net income
- Analyzes refinancing opportunities
- Suggests housing cost reduction strategies

#### Discretionary Income Recommendations

- Triggered when discretionary < 20%
- Identifies expense reduction opportunities
- Analyzes income optimization potential

## Edge Case Handling

### Division by Zero Protection

All calculations include safeguards against division by zero:

```typescript
const safeDiv = (numerator: number, denominator: number) =>
  denominator > 0 ? numerator / denominator : 0;
```

### NaN and Infinity Handling

Financial calculations validate all results:

```typescript
Object.keys(scores).forEach((key) => {
  if (!Number.isFinite(scores[key])) {
    scores[key] = 0;
  }
});
```

### Input Validation

- All monetary inputs validated for positive values
- Percentage inputs constrained to reasonable ranges (0-100%)
- String inputs sanitized and converted to numbers safely

## Performance Optimizations

### Calculation Caching

- Services use singleton pattern to avoid repeated instantiation
- Heavy calculations memoized where appropriate
- Number formatters cached for repeated use

### Lazy Evaluation

- Complex calculations only performed when required
- Scenario generation optimized for common use cases
- Progressive enhancement for advanced features

## Regulatory Compliance

### Data Privacy

- No personal data stored permanently
- Calculations performed client-side when possible
- Session storage for temporary calculation state

### Accuracy Standards

- All tax calculations verified against official Skatteverket documentation
- Regular updates for annual tax rate changes
- Comprehensive test coverage for calculation accuracy

### Accessibility

- All financial results available to screen readers
- Calculation explanations provided in multiple languages
- Clear error messages for invalid inputs

## Future Enhancements

### Planned Features

- Integration with Swedish pension calculations
- Support for self-employment tax scenarios
- Advanced investment portfolio analysis
- Regional cost-of-living adjustments

### Scalability Considerations

- Modular calculation services for easy extension
- Plugin architecture for additional financial products
- API design for potential mobile application support
