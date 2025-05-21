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
  [key: string]: unknown;
}

function IncomeInputField({
  form,
  name,
  label,
  ariaLabel,
  hidden = false,
  onBlur,
  ...rest
}: IncomeInputFieldProps) {
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
              aria-label={ariaLabel}
              onChange={(e) => field.onChange(Number(e.target.value))}
              onBlur={onBlur}
              {...rest}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { IncomeInputField };
