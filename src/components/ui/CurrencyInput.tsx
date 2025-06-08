import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

interface CurrencyInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  ariaLabel: string;
  hidden?: boolean;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

const CurrencyInput = <T extends FieldValues>({
  form,
  name,
  label,
  ariaLabel,
  hidden = false,
  onBlur,
  className,
  disabled,
  placeholder = "0",
  min = 0,
  max,
  step,
}: CurrencyInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const isValidNumber =
          typeof field.value === "number" &&
          !Number.isNaN(field.value) &&
          field.value !== 0;
        let value: string | number;
        if (Array.isArray(field.value)) {
          value = "";
        } else if (isValidNumber) {
          value = field.value;
        } else {
          value = "";
        }

        return (
          <FormItem className={hidden ? "hidden" : ""}>
            <FormLabel className="calculator-form-label">{label}</FormLabel>
            <FormControl>
              <Input
                max={max}
                min={min}
                step={step}
                type="number"
                {...field}
                aria-label={ariaLabel}
                className={className}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onBlur={onBlur}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export { CurrencyInput };
