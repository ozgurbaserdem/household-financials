import React from "react";
import { Income } from "@/components/calculator/Income";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateIncome } from "@/store/slices/calculatorSlice";

export function IncomeStep() {
  const dispatch = useAppDispatch();
  const income = useAppSelector((state) => state.income);

  return (
    <Income
      values={{
        income1: income.income1,
        income2: income.income2,
        secondaryIncome1: income.secondaryIncome1,
        secondaryIncome2: income.secondaryIncome2,
        childBenefits: income.childBenefits,
        otherBenefits: income.otherBenefits,
        otherIncomes: income.otherIncomes,
        currentBuffer: income.currentBuffer,
      }}
      numberOfAdults={income.numberOfAdults}
      onNumberOfAdultsChange={(value) =>
        dispatch(updateIncome({ numberOfAdults: value }))
      }
      onChange={(values) => dispatch(updateIncome(values))}
    />
  );
}
