import React from "react";

import { Income } from "@/features/calculator/Income";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateIncome } from "@/store/slices/calculatorSlice";

export const IncomeStep = () => {
  const dispatch = useAppDispatch();
  const income = useAppSelector((state) => state.income);

  return (
    <Income
      numberOfAdults={income.numberOfAdults}
      values={{
        income1: income.income1,
        income2: income.income2,
        secondaryIncome1: income.secondaryIncome1,
        secondaryIncome2: income.secondaryIncome2,
        childBenefits: income.childBenefits,
        otherBenefits: income.otherBenefits,
        otherIncomes: income.otherIncomes,
        currentBuffer: income.currentBuffer,
        selectedKommun: income.selectedKommun,
        includeChurchTax: income.includeChurchTax,
      }}
      onChange={(values) => dispatch(updateIncome(values))}
      onNumberOfAdultsChange={(value) =>
        dispatch(updateIncome({ numberOfAdults: value }))
      }
    />
  );
};
