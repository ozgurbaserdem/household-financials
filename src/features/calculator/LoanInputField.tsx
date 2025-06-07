import { CurrencyInput } from "@/components/ui/currency-input";
import type { UseFormReturn } from "react-hook-form";
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
      form={form}
      name={name}
      label={label}
      ariaLabel={ariaLabel}
      onBlur={onBlur}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
    />
  );
};

export { LoanInputField };
