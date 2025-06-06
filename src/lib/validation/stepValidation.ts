import { CalculatorState } from "@/lib/types";

export interface StepValidationResult {
  isValid: boolean;
  errorKey?: string;
}

// Translation keys for validation messages
export const VALIDATION_KEYS = {
  INCOME_REQUIRED: "wizard.validation.income_required",
  INCOME_REQUIRED_TWO_ADULTS: "wizard.validation.income_required_two_adults",
  LOAN_AMOUNT_REQUIRED: "wizard.validation.loan_amount_required",
  LOAN_DETAILS_REQUIRED: "wizard.validation.loan_details_required",
  LOAN_INTEREST_RATE_REQUIRED: "wizard.validation.loan_interest_rate_required",
  LOAN_AMORTIZATION_RATE_REQUIRED:
    "wizard.validation.loan_amortization_rate_required",
  LOAN_BOTH_RATES_REQUIRED: "wizard.validation.loan_both_rates_required",
  EXPENSES_REQUIRED: "wizard.validation.expenses_required",
  EXPENSES_REQUIRED_SIMPLE: "wizard.validation.expenses_required_simple",
  STEP_NOT_ACCESSIBLE: "wizard.validation.step_not_accessible",
  COMPLETE_PREVIOUS_STEPS: "wizard.validation.complete_previous_steps",
} as const;

/**
 * Validates if the income step has required data
 */
export function validateIncomeStep(
  income: CalculatorState["income"]
): StepValidationResult {
  // At least one income source must be provided
  const hasIncome =
    income.income1 > 0 ||
    income.income2 > 0 ||
    income.secondaryIncome1 > 0 ||
    income.secondaryIncome2 > 0 ||
    income.childBenefits > 0 ||
    income.otherBenefits > 0 ||
    income.otherIncomes > 0;

  if (!hasIncome) {
    return {
      isValid: false,
      errorKey: VALIDATION_KEYS.INCOME_REQUIRED,
    };
  }

  // If there are two adults, at least one should have income
  if (
    income.numberOfAdults === "2" &&
    income.income1 === 0 &&
    income.income2 === 0
  ) {
    return {
      isValid: false,
      errorKey: VALIDATION_KEYS.INCOME_REQUIRED_TWO_ADULTS,
    };
  }

  return { isValid: true };
}

/**
 * Validates if the loans step has valid data when a loan amount is entered
 */
export function validateLoansStep(
  loanParameters: CalculatorState["loanParameters"]
): StepValidationResult {
  const hasLoanAmount = loanParameters.amount > 0;
  const hasInterestRate = loanParameters.interestRate > 0;
  const hasAmortizationRate = loanParameters.amortizationRate > 0;

  // If user explicitly said they have loans, they need to provide loan data
  if (loanParameters.hasLoan) {
    // If they claim to have loans but no amount
    if (!hasLoanAmount) {
      return {
        isValid: false,
        errorKey: VALIDATION_KEYS.LOAN_AMOUNT_REQUIRED,
      };
    }

    // Check for specific missing rates
    if (!hasInterestRate && !hasAmortizationRate) {
      return {
        isValid: false,
        errorKey: VALIDATION_KEYS.LOAN_BOTH_RATES_REQUIRED,
      };
    } else if (!hasInterestRate) {
      return {
        isValid: false,
        errorKey: VALIDATION_KEYS.LOAN_INTEREST_RATE_REQUIRED,
      };
    } else if (!hasAmortizationRate) {
      return {
        isValid: false,
        errorKey: VALIDATION_KEYS.LOAN_AMORTIZATION_RATE_REQUIRED,
      };
    }
  }

  // If user has loan data but didn't explicitly say they have loans, that's inconsistent
  if (!loanParameters.hasLoan && hasLoanAmount) {
    return {
      isValid: false,
      errorKey: VALIDATION_KEYS.LOAN_AMOUNT_REQUIRED,
    };
  }

  // If user explicitly said no loans or no data at all, that's valid
  return { isValid: true };
}

/**
 * Validates if the expenses step has some data
 */
export function validateExpensesStep(
  expenses: CalculatorState["expenses"],
  totalExpenses: number,
  expenseViewMode: CalculatorState["expenseViewMode"]
): StepValidationResult {
  if (expenseViewMode === "simple") {
    // In simple mode, just check if total expenses is provided
    if (totalExpenses <= 0) {
      return {
        isValid: false,
        errorKey: VALIDATION_KEYS.EXPENSES_REQUIRED_SIMPLE,
      };
    }
  } else {
    // In detailed mode, check if at least some categories have values
    const hasExpenses = Object.values(expenses).some((amount) => amount > 0);
    if (!hasExpenses) {
      return {
        isValid: false,
        errorKey: VALIDATION_KEYS.EXPENSES_REQUIRED,
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates if the summary step prerequisites are met
 */
export function validateSummaryStep(
  state: CalculatorState
): StepValidationResult {
  const incomeValidation = validateIncomeStep(state.income);
  if (!incomeValidation.isValid) {
    return incomeValidation;
  }

  const loansValidation = validateLoansStep(state.loanParameters);
  if (!loansValidation.isValid) {
    return loansValidation;
  }

  const expensesValidation = validateExpensesStep(
    state.expenses,
    state.totalExpenses,
    state.expenseViewMode
  );
  if (!expensesValidation.isValid) {
    return expensesValidation;
  }

  return { isValid: true };
}

/**
 * Validates if the results step prerequisites are met (same as summary)
 */
export function validateResultsStep(
  state: CalculatorState
): StepValidationResult {
  return validateSummaryStep(state);
}

/**
 * Gets the maximum allowed step index based on completed validations
 */
export function getMaxAllowedStep(state: CalculatorState): number {
  // Step 0 (Income) is always accessible
  let maxStep = 0;

  // Check if we can access Step 1 (Loans)
  const incomeValidation = validateIncomeStep(state.income);
  if (incomeValidation.isValid) {
    maxStep = 1;
  } else {
    return maxStep;
  }

  // Check if we can access Step 2 (Expenses)
  const loansValidation = validateLoansStep(state.loanParameters);
  if (loansValidation.isValid) {
    maxStep = 2;
  } else {
    return maxStep;
  }

  // Check if we can access Step 3 (Summary)
  const expensesValidation = validateExpensesStep(
    state.expenses,
    state.totalExpenses,
    state.expenseViewMode
  );
  if (expensesValidation.isValid) {
    maxStep = 3;
  } else {
    return maxStep;
  }

  // Check if we can access Step 4 (Results)
  const summaryValidation = validateSummaryStep(state);
  if (summaryValidation.isValid) {
    maxStep = 4;
  }

  return maxStep;
}

/**
 * Checks if a specific step can be accessed
 */
export function canAccessStep(
  targetStep: number,
  state: CalculatorState
): boolean {
  const maxAllowed = getMaxAllowedStep(state);
  return targetStep <= maxAllowed;
}

/**
 * Gets validation error key for a specific step (what's blocking access to that step)
 */
export function getStepValidationErrorKey(
  stepIndex: number,
  state: CalculatorState
): string | null {
  switch (stepIndex) {
    case 0:
      return null; // Income step is always accessible
    case 1:
      const incomeValidation = validateIncomeStep(state.income);
      return incomeValidation.isValid
        ? null
        : incomeValidation.errorKey || null;
    case 2:
      const loansValidation = validateLoansStep(state.loanParameters);
      return loansValidation.isValid ? null : loansValidation.errorKey || null;
    case 3:
      const expensesValidation = validateExpensesStep(
        state.expenses,
        state.totalExpenses,
        state.expenseViewMode
      );
      return expensesValidation.isValid
        ? null
        : expensesValidation.errorKey || null;
    case 4:
      const summaryValidation = validateSummaryStep(state);
      return summaryValidation.isValid
        ? null
        : summaryValidation.errorKey || null;
    default:
      return null;
  }
}

/**
 * Gets validation error for the current step (what needs to be fixed to proceed)
 */
export function getCurrentStepValidationError(
  currentStepIndex: number,
  state: CalculatorState
): string | null {
  switch (currentStepIndex) {
    case 0: // Income step - validate income data
      const incomeValidation = validateIncomeStep(state.income);
      return incomeValidation.isValid
        ? null
        : incomeValidation.errorKey || null;
    case 1: // Loans step - validate loan data
      const loansValidation = validateLoansStep(state.loanParameters);
      return loansValidation.isValid ? null : loansValidation.errorKey || null;
    case 2: // Expenses step - validate expense data
      const expensesValidation = validateExpensesStep(
        state.expenses,
        state.totalExpenses,
        state.expenseViewMode
      );
      return expensesValidation.isValid
        ? null
        : expensesValidation.errorKey || null;
    case 3: // Summary step - all previous steps should be valid
      const summaryValidation = validateSummaryStep(state);
      return summaryValidation.isValid
        ? null
        : summaryValidation.errorKey || null;
    default:
      return null;
  }
}
