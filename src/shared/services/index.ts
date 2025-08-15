// Service exports for the financial calculation layer
export {
  TaxCalculationService,
  taxCalculationService,
} from "./TaxCalculationService";
export {
  LoanCalculationService,
  loanCalculationService,
} from "./LoanCalculationService";
export {
  FinancialCalculationService,
  financialCalculationService,
} from "./FinancialCalculationService";

// Type exports
export type {
  TaxCalculationConfig,
  TaxCalculationResult,
} from "./TaxCalculationService";
export type {
  LoanScenario,
  LoanCalculationOptions,
} from "./LoanCalculationService";
export type {
  IncomeCalculationResult,
  ExpenseCalculationResult,
} from "./FinancialCalculationService";
