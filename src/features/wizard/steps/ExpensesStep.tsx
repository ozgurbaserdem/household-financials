import React from "react";
import { ExpenseCategories } from "@/features/calculator/ExpenseCategories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateExpenses } from "@/store/slices/calculatorSlice";
import { StepDescription } from "@/components/ui/step-description";

export function ExpensesStep() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);

  return (
    <>
      <StepDescription stepKey="expenses" />
      <ExpenseCategories
        expenses={expenses}
        onChange={(expenses) => dispatch(updateExpenses(expenses))}
      />
    </>
  );
}
