import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Only pass a number or empty string to Input value
        const value = Array.isArray(field.value)
          ? ""
          : typeof field.value === "number" &&
              !isNaN(field.value) &&
              field.value !== 0
            ? field.value
            : "";
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={min}
                max={max}
                step={step}
                {...field}
                value={value}
                placeholder={placeholder}
                aria-label={ariaLabel}
                className={className}
                disabled={disabled}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export { LoanInputField };
