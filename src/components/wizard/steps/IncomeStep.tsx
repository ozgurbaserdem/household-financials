import React from "react";
import { Income } from "@/components/calculator/Income";
import { useWizard } from "../WizardLayout";
import { calculateIncomeWithTax } from "@/lib/calculations";

export function IncomeStep() {
  const { formData, setFormData } = useWizard();
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
      onNumberOfAdultsChange={(value) =>
        setFormData((prev) => ({ ...prev, numberOfAdults: value }))
      }
      onChange={(values) => {
        setFormData((prev) => ({
          ...prev,
          income1: calculateIncomeWithTax(values.income1),
          income2: calculateIncomeWithTax(values.income2),
          secondaryIncome1: calculateIncomeWithTax(
            values.secondaryIncome1,
            true
          ),
          secondaryIncome2: calculateIncomeWithTax(
            values.secondaryIncome2,
            true
          ),
          childBenefits: values.childBenefits,
          otherBenefits: values.otherBenefits,
          otherIncomes: values.otherIncomes,
          currentBuffer: values.currentBuffer,
        }));
      }}
    />
  );
}
