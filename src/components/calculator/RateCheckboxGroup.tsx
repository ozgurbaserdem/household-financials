import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Box } from "@/components/ui/box";
import type { UseFormReturn } from "react-hook-form";
import React from "react";
import type { LoansFormValues } from "./Loans";

interface RateCheckboxGroupProps {
  form: UseFormReturn<LoansFormValues>;
  fieldName: "interestRates" | "amortizationRates";
  label: string;
  options: number[];
  ariaLabel: string;
  onChange: (newValue: number[]) => void;
}

function RateCheckboxGroup({
  form,
  fieldName,
  label,
  options,
  ariaLabel,
  onChange,
}: RateCheckboxGroupProps) {
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Box className="flex flex-wrap gap-4" aria-label={ariaLabel}>
        {options.map((rate) => (
          <FormField
            key={rate}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 min-w-18">
                <FormControl>
                  <Checkbox
                    checked={field.value.includes(rate)}
                    aria-label={`${rate}%`}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, rate]
                        : field.value.filter((r: number) => r !== rate);
                      field.onChange(newValue);
                      onChange(newValue);
                    }}
                  />
                </FormControl>
                <FormLabel className="text-sm">{rate}%</FormLabel>
              </FormItem>
            )}
          />
        ))}
      </Box>
    </>
  );
}

export { RateCheckboxGroup };
