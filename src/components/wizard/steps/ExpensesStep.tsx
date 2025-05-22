import React from "react";
import { ExpenseCategories } from "@/components/calculator/ExpenseCategories";
import { useWizard } from "../WizardLayout";

export function ExpensesStep() {
  const { formData, setFormData } = useWizard();
  return (
    <ExpenseCategories
      expenses={formData.expenses}
      onChange={(expenses) => setFormData((prev) => ({ ...prev, expenses }))}
    />
  );
}
