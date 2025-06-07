import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={hidden ? "hidden" : ""}>
          <FormLabel className="calculator-form-label">{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={0}
              {...field}
              value={
                typeof field.value === "number" && field.value !== 0
                  ? field.value
                  : ""
              }
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
      )}
    />
  );
};

export { IncomeInputField };
