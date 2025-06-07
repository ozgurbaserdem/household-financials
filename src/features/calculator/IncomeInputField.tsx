import { CurrencyInput } from "@/components/ui/CurrencyInput";
import type { UseFormReturn } from "react-hook-form";
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
      form={form}
      name={name}
      label={label}
      ariaLabel={ariaLabel}
      hidden={hidden}
      onBlur={onBlur}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};

export { IncomeInputField };
