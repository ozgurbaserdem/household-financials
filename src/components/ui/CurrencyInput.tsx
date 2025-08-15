import { useState, useEffect } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { formatNumber } from "@/lib/formatting/";

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
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const fieldValue = form.watch(name);
  const numericFieldValue = typeof fieldValue === "number" ? fieldValue : 0;
  const isValidNumber =
    typeof numericFieldValue === "number" &&
    !Number.isNaN(numericFieldValue) &&
    numericFieldValue !== 0;

  // Update display value when field value changes and not focused
  useEffect(() => {
    if (!isFocused) {
      if (isValidNumber) {
        setDisplayValue(formatNumber(numericFieldValue));
      } else {
        setDisplayValue("");
      }
    }
  }, [numericFieldValue, isValidNumber, isFocused]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const handleFocus = () => {
          setIsFocused(true);
          // Set raw number value for editing
          setDisplayValue(isValidNumber ? String(numericFieldValue) : "");
        };

        const handleBlur = () => {
          setIsFocused(false);
          // Parse the entered value and update field
          const cleanedValue = displayValue.replace(/[^\d]/g, "");
          const numericValue = cleanedValue === "" ? 0 : Number(cleanedValue);
          field.onChange(numericValue);
          onBlur?.();
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          setDisplayValue(inputValue);
        };

        return (
          <FormItem className={hidden ? "hidden" : ""}>
            <FormLabel className="text-foreground font-medium text-sm">
              {label}
            </FormLabel>
            <FormControl>
              <Input
                aria-label={ariaLabel}
                className={className}
                disabled={disabled}
                max={max}
                min={min}
                placeholder={placeholder}
                step={step}
                type="text"
                value={displayValue}
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
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
