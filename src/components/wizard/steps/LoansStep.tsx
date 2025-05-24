import React from "react";
import { Loans } from "@/components/calculator/Loans";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLoanParameters } from "@/store/slices/calculatorSlice";

export function LoansStep() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state);

  return (
    <Loans
      values={{
        loanAmount: formData.loanParameters.amount,
        interestRates: formData.loanParameters.interestRates,
        amortizationRates: formData.loanParameters.amortizationRates,
      }}
      onChange={(values) => {
        dispatch(
          updateLoanParameters({
            amount: values.loanAmount,
            interestRates: values.interestRates,
            amortizationRates: values.amortizationRates,
          })
        );
      }}
    />
  );
}
