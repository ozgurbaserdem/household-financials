export interface LoanParameters {
  amount: number;
  interestRate: number;
  amortizationRate: number;
  hasLoan: boolean;
}

// Helper functions for loan parameters
export const hasValidLoan = (loanParameters: LoanParameters): boolean => {
  return (
    loanParameters.hasLoan &&
    loanParameters.amount > 0 &&
    loanParameters.interestRate > 0 &&
    loanParameters.amortizationRate > 0
  );
};

export interface IncomeRange {
  min: number;
  max: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
}

export interface KommunData {
  kommunNamn: string;
  kommunalSkatt: number;
  kyrkoSkatt: number;
  summaInklKyrka: number;
}

export interface IncomeState {
  income1: number;
  income2: number;
  secondaryIncome1: number;
  secondaryIncome2: number;
  childBenefits: number;
  otherBenefits: number;
  otherIncomes: number;
  currentBuffer: number;
  numberOfAdults: "1" | "2";
  selectedKommun?: string;
  includeChurchTax?: boolean;
  secondaryIncomeTaxRate: number;
}

export interface CalculationResult {
  interestRate: number;
  amortizationRate: number;
  monthlyInterest: number;
  monthlyAmortization: number;
  totalHousingCost: number;
  totalExpenses: number;
  remainingSavings: number;
  income1Net: number;
  income2Net: number;
  secondaryIncome1Net: number;
  secondaryIncome2Net: number;
  childBenefits: number;
  otherBenefits: number;
  otherIncomes: number;
  currentBuffer: number;
  totalIncome?: {
    gross: number;
    net: number;
  };
}

export interface ExpensesByCategory {
  [categoryId: string]: number;
}

export interface FinancialHealthScore {
  overallScore: number;
  metrics: {
    debtToIncomeRatio: number;
    emergencyFundCoverage: number;
    housingCostRatio: number;
    discretionaryIncomeRatio: number;
  };
  recommendations: string[];
}

export interface CalculatorState {
  loanParameters: LoanParameters;
  expenses: ExpensesByCategory;
  income: IncomeState;
  expenseViewMode: "detailed" | "simple";
  totalExpenses: number;
}

// Enhanced Chart Types
export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface CompoundInterestDataPoint {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

// Financial Calculation Types
export interface TaxCalculationResult {
  gross: number;
  net: number;
  municipalTax: number;
  stateTax: number;
  socialFees: number;
  churchTax?: number;
  jobTaxDeduction: number;
}

export interface LoanScenario {
  interestRate: number;
  amortizationRate: number;
  monthlyPayment: number;
  totalMonthlyCost: number;
  remainingAfterExpenses: number;
}

export interface CompoundInterestInput {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  frequency: number;
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  yearlyData: CompoundInterestDataPoint[];
}

// Form Types
export interface FormValidationError {
  field: string;
  message: string;
  type: "required" | "min" | "max" | "invalid";
}

export interface StepValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

// UI Component Types
export interface SelectOption {
  value: string;
  label: string;
}

export interface ValidationProps {
  isValid?: boolean;
  errorMessage?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ExportData {
  calculatorState: CalculatorState;
  results: CalculationResult[];
  metadata: {
    exportDate: string;
    version: string;
    locale: string;
  };
}
