import type { UseFormReturn } from "react-hook-form";

import { CurrencyInput } from "@/components/ui/CurrencyInput";

import type { LoansFormValues } from "./Loans";

interface LoanInputFieldProps {
  form: UseFormReturn<LoansFormValues>;
  name: keyof LoansFormValues;
  label: string;
  ariaLabel: string;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

const LoanInputField = ({
  form,
  name,
  label,
  ariaLabel,
  onBlur,
  className,
  disabled,
  placeholder = "0",
  min = 0,
  max,
  step,
}: LoanInputFieldProps) => {
  return (
    <CurrencyInput
      ariaLabel={ariaLabel}
      className={className}
      disabled={disabled}
      form={form}
      label={label}
      max={max}
      min={min}
      name={name}
      placeholder={placeholder}
      step={step}
      onBlur={onBlur}
    />
  );
};

export { LoanInputField };
