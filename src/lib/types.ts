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
  subcategories: ExpenseSubcategory[];
}

export interface ExpenseSubcategory {
  id: string;
  name: string;
}

export interface CalculationResult {
  interestRate: number;
  amortizationRate: number;
  monthlyInterest: number;
  monthlyAmortization: number;
  totalHousingCost: number;
  totalExpenses: number;
  remainingSavings: number;
  income1: number;
  income2: number;
  secondaryIncome1: number;
  secondaryIncome2: number;
  childBenefits: number;
  otherBenefits: number;
  otherIncomes: number;
  totalIncome?: {
    gross: number;
    net: number;
  };
}

export interface IncomeCalculation {
  gross: number;
  net: number;
}

export interface CalculatorState {
  loanParameters: {
    amount: number;
    interestRates: number[];
    amortizationRates: number[];
  };
  income1: IncomeCalculation;
  income2: IncomeCalculation;
  secondaryIncome1: IncomeCalculation;
  secondaryIncome2: IncomeCalculation;
  childBenefits: number;
  otherBenefits: number;
  otherIncomes: number;
  expenses: ExpensesByCategory;
}

export interface ExpensesByCategory {
  [categoryId: string]: {
    [subcategoryId: string]: number;
  };
}
