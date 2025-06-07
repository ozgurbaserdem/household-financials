import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { UseFormReturn, FieldPath, FieldValues } from "react-hook-form";

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
        const value = Array.isArray(field.value)
          ? ""
          : typeof field.value === "number" &&
              !isNaN(field.value) &&
              field.value !== 0
            ? field.value
            : "";

        return (
          <FormItem className={hidden ? "hidden" : ""}>
            <FormLabel className="calculator-form-label">{label}</FormLabel>
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

export { CurrencyInput };
