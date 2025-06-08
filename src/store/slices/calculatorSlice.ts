import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { DEFAULT_EXPENSES } from "@/data/expenseCategories";
import type {
  CalculatorState,
  ExpensesByCategory,
  IncomeState,
} from "@/lib/types";

const initialState: CalculatorState = {
  loanParameters: {
    amount: 0,
    interestRate: 3.5,
    amortizationRate: 2,
    hasLoan: false,
  },
  income: {
    income1: 0,
    income2: 0,
    secondaryIncome1: 0,
    secondaryIncome2: 0,
    childBenefits: 0,
    otherBenefits: 0,
    otherIncomes: 0,
    currentBuffer: 0,
    numberOfAdults: "1",
  },
  expenses: DEFAULT_EXPENSES,
  expenseViewMode: "detailed",
  totalExpenses: 0,
};

const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    updateLoanParameters: (
      state,
      action: PayloadAction<Partial<CalculatorState["loanParameters"]>>
    ) => {
      state.loanParameters = {
        ...state.loanParameters,
        ...action.payload,
      };
    },
    updateIncome: (state, action: PayloadAction<Partial<IncomeState>>) => {
      state.income = {
        ...state.income,
        ...action.payload,
      };
    },
    updateExpenses: (
      state,
      action: PayloadAction<Partial<ExpensesByCategory>>
    ) => {
      // Filter out undefined values and ensure numbers
      const validExpenses = Object.fromEntries(
        Object.entries(action.payload).filter(
          ([, value]) => value !== undefined
        )
      ) as ExpensesByCategory;

      state.expenses = {
        ...state.expenses,
        ...validExpenses,
      };
    },
    updateExpenseViewMode: (
      state,
      action: PayloadAction<"detailed" | "simple">
    ) => {
      state.expenseViewMode = action.payload;
    },
    updateTotalExpenses: (state, action: PayloadAction<number>) => {
      state.totalExpenses = action.payload;
    },
    resetCalculator: () => initialState,
  },
});

export const {
  updateLoanParameters,
  updateIncome,
  updateExpenses,
  updateExpenseViewMode,
  updateTotalExpenses,
  resetCalculator,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
