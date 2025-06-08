import type { UseFormReturn } from "react-hook-form";

import { CurrencyInput } from "@/components/ui/CurrencyInput";

import type { IncomeFormValues } from "./Income";

interface IncomeInputFieldProps {
  form: UseFormReturn<IncomeFormValues>;
  name: keyof IncomeFormValues;
  label: string;
  ariaLabel: string;
  hidden?: boolean;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const IncomeInputField = ({
  form,
  name,
  label,
  ariaLabel,
  hidden = false,
  onBlur,
  className,
  disabled,
  placeholder = "0",
}: IncomeInputFieldProps) => {
  return (
    <CurrencyInput
      ariaLabel={ariaLabel}
      className={className}
      disabled={disabled}
      form={form}
      hidden={hidden}
      label={label}
      name={name}
      placeholder={placeholder}
      onBlur={onBlur}
    />
  );
};

export { IncomeInputField };
