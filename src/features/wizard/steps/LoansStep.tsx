import React from "react";
import { Loans } from "@/features/calculator/Loans";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLoanParameters } from "@/store/slices/calculatorSlice";
import { StepDescription } from "@/components/ui/step-description";

export function LoansStep() {
  const dispatch = useAppDispatch();
  const loanParameters = useAppSelector((state) => state.loanParameters);

  return (
    <>
      <StepDescription stepKey="loans" />
      <Loans
        values={{
          loanAmount: loanParameters.amount,
          interestRates: loanParameters.interestRates,
          amortizationRates: loanParameters.amortizationRates,
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
    </>
  );
}
