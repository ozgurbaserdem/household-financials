import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalculatorState } from "@/lib/types";
import { calculateIncomeWithTax } from "@/lib/calculations";
import { DEFAULT_EXPENSES } from "@/data/expenseCategories";

const initialState: CalculatorState = {
  loanParameters: {
    amount: 0,
    interestRates: [3],
    amortizationRates: [3],
  },
  income1: calculateIncomeWithTax(0),
  income2: calculateIncomeWithTax(0),
  secondaryIncome1: calculateIncomeWithTax(0),
  secondaryIncome2: calculateIncomeWithTax(0),
  childBenefits: 0,
  otherBenefits: 0,
  otherIncomes: 0,
  expenses: DEFAULT_EXPENSES,
  currentBuffer: 0,
  numberOfAdults: "1",
};

const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    updateLoanParameters: (
      state,
      action: PayloadAction<CalculatorState["loanParameters"]>
    ) => {
      state.loanParameters = action.payload;
    },
    updateIncome: (
      state,
      action: PayloadAction<{
        income1?: number;
        income2?: number;
        secondaryIncome1?: number;
        secondaryIncome2?: number;
        childBenefits?: number;
        otherBenefits?: number;
        otherIncomes?: number;
        currentBuffer?: number;
      }>
    ) => {
      const {
        income1,
        income2,
        secondaryIncome1,
        secondaryIncome2,
        childBenefits,
        otherBenefits,
        otherIncomes,
        currentBuffer,
      } = action.payload;

      if (income1 !== undefined)
        state.income1 = calculateIncomeWithTax(income1);
      if (income2 !== undefined)
        state.income2 = calculateIncomeWithTax(income2);
      if (secondaryIncome1 !== undefined)
        state.secondaryIncome1 = calculateIncomeWithTax(secondaryIncome1, true);
      if (secondaryIncome2 !== undefined)
        state.secondaryIncome2 = calculateIncomeWithTax(secondaryIncome2, true);
      if (childBenefits !== undefined) state.childBenefits = childBenefits;
      if (otherBenefits !== undefined) state.otherBenefits = otherBenefits;
      if (otherIncomes !== undefined) state.otherIncomes = otherIncomes;
      if (currentBuffer !== undefined) state.currentBuffer = currentBuffer;
    },
    updateExpenses: (
      state,
      action: PayloadAction<CalculatorState["expenses"]>
    ) => {
      state.expenses = action.payload;
    },
    updateNumberOfAdults: (state, action: PayloadAction<"1" | "2">) => {
      state.numberOfAdults = action.payload;
    },
    resetCalculator: () => initialState,
  },
});

export const {
  updateLoanParameters,
  updateIncome,
  updateExpenses,
  updateNumberOfAdults,
  resetCalculator,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
