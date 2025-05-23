import React from "react";
import { ExpenseCategories } from "@/components/calculator/ExpenseCategories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateExpenses } from "@/store/slices/calculatorSlice";

export function ExpensesStep() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);

  return (
    <ExpenseCategories
      expenses={expenses}
      onChange={(expenses) => dispatch(updateExpenses(expenses))}
    />
  );
}
