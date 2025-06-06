import React from "react";
import { Loans } from "@/features/calculator/Loans";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLoanParameters } from "@/store/slices/calculatorSlice";

export function LoansStep() {
  const dispatch = useAppDispatch();
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const numberOfAdults = useAppSelector((state) => state.income.numberOfAdults);

  return (
    <>
      <Loans
        values={{
          loanAmount: loanParameters.amount,
          interestRate: loanParameters.interestRate,
          amortizationRate: loanParameters.amortizationRate,
          hasLoan: loanParameters.hasLoan,
        }}
        numberOfAdults={numberOfAdults}
        onChange={(values) => {
          dispatch(
            updateLoanParameters({
              amount: values.loanAmount,
              interestRate: values.interestRate,
              amortizationRate: values.amortizationRate,
              hasLoan: values.hasLoan,
            })
          );
        }}
      />
    </>
  );
}
