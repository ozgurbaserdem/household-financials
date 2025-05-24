import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalculatorState, IncomeState, ExpensesByCategory } from "@/lib/types";
import { DEFAULT_EXPENSES } from "@/data/expenseCategories";

const initialState: CalculatorState = {
  loanParameters: {
    amount: 0,
    interestRates: [3],
    amortizationRates: [3],
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
      for (const cat in action.payload) {
        if (action.payload[cat]) {
          state.expenses[cat] = {
            ...state.expenses[cat],
            ...action.payload[cat],
          };
        }
      }
    },
    resetCalculator: () => initialState,
  },
});

export const {
  updateLoanParameters,
  updateIncome,
  updateExpenses,
  resetCalculator,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
