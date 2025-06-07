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
  [key: string]: unknown;
}

const LoanInputField = ({
  form,
  name,
  label,
  ariaLabel,
  onBlur,
  ...rest
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
                min={0}
                {...field}
                value={value}
                placeholder="0"
                aria-label={ariaLabel}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={onBlur}
                {...rest}
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
