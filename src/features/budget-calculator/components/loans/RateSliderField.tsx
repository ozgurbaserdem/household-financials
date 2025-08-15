"use client";

import type { LucideIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { SliderInput } from "@/components/ui/SliderInput";
import { Text } from "@/components/ui/Text";

interface RateSliderFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  helpText: string;
  icon: LucideIcon;
  ariaLabel: string;
  max: number;
  min?: number;
  step?: number;
  defaultValue: number;
  onChange: () => void;
}

export const RateSliderField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  helpText,
  icon: Icon,
  ariaLabel,
  max,
  min = 0.05,
  step = 0.05,
  defaultValue,
  onChange,
}: RateSliderFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-foreground" />
            {label}
          </FormLabel>
          <FormControl>
            <SliderInput
              ariaLabel={ariaLabel}
              max={max}
              min={min}
              step={step}
              suffix="%"
              value={field.value || defaultValue}
              onChange={(value) => {
                field.onChange(value);
                onChange();
              }}
            />
          </FormControl>
          <Text className="text-xs text-muted-foreground mt-1">{helpText}</Text>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
