export interface LoanParameters {
  amount: number;
  interestRates: number[];
  amortizationRates: number[];
}

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
    savingsRate: number;
    housingCostRatio: number;
    discretionaryIncomeRatio: number;
  };
  recommendations: string[];
}

export interface CalculatorState {
  loanParameters: {
    amount: number;
    interestRates: number[];
    amortizationRates: number[];
  };
  expenses: ExpensesByCategory;
  income: IncomeState;
  expenseViewMode: "detailed" | "simple";
  totalExpenses: number;
}
