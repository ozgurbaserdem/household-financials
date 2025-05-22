import React from "react";
import { Loans } from "@/components/calculator/Loans";
import { useWizard } from "../WizardLayout";

export function LoansStep() {
  const { formData, setFormData } = useWizard();
  return (
    <Loans
      values={{
        loanAmount: formData.loanParameters.amount,
        interestRates: formData.loanParameters.interestRates,
        amortizationRates: formData.loanParameters.amortizationRates,
      }}
      onChange={(values) => {
        setFormData((prev) => ({
          ...prev,
          loanParameters: {
            amount: values.loanAmount,
            interestRates: values.interestRates,
            amortizationRates: values.amortizationRates,
          },
        }));
      }}
    />
  );
}
