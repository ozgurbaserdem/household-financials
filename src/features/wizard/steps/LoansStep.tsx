import React from "react";

import { Loans } from "@/features/budget-calculator/loans/Loans";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLoanParameters } from "@/store/slices/calculatorSlice";

export const LoansStep = () => {
  const dispatch = useAppDispatch();
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const numberOfAdults = useAppSelector((state) => state.income.numberOfAdults);

  return (
    <Loans
      numberOfAdults={numberOfAdults}
      values={{
        loanAmount: loanParameters.amount,
        interestRate: loanParameters.interestRate,
        amortizationRate: loanParameters.amortizationRate,
        hasLoan: loanParameters.hasLoan,
      }}
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
  );
};
