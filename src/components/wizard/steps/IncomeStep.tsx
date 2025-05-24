import React from "react";
import { Income } from "@/components/calculator/Income";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateIncome,
  updateNumberOfAdults,
} from "@/store/slices/calculatorSlice";

export function IncomeStep() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state);

  return (
    <Income
      values={{
        income1: formData.income1.gross,
        income2: formData.income2.gross,
        secondaryIncome1: formData.secondaryIncome1.gross,
        secondaryIncome2: formData.secondaryIncome2.gross,
        childBenefits: formData.childBenefits,
        otherBenefits: formData.otherBenefits,
        otherIncomes: formData.otherIncomes,
        currentBuffer: formData.currentBuffer,
      }}
      numberOfAdults={formData.numberOfAdults}
      onNumberOfAdultsChange={(value) => dispatch(updateNumberOfAdults(value))}
      onChange={(values) => {
        dispatch(updateIncome(values));
      }}
    />
  );
}
