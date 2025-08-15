import type { UseFormReturn } from "react-hook-form";

import { Box } from "@/components/ui/Box";

import type { IncomeFormValues } from "./Income";
import { IncomeInputField } from "./IncomeInputField";

interface IncomeFieldConfig {
  name: keyof IncomeFormValues;
  label: string;
  ariaLabel: string;
}

interface IncomeFieldGridProps {
  form: UseFormReturn<IncomeFormValues>;
  numberOfAdults: "1" | "2";
  primaryField: IncomeFieldConfig;
  secondaryField?: IncomeFieldConfig;
  onFieldChange: () => void;
  className?: string;
}

export const IncomeFieldGrid = ({
  form,
  numberOfAdults,
  primaryField,
  secondaryField,
  onFieldChange,
  className = "",
}: IncomeFieldGridProps) => {
  return (
    <Box className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <IncomeInputField
        ariaLabel={primaryField.ariaLabel}
        className="modern-input"
        form={form}
        label={primaryField.label}
        name={primaryField.name}
        onBlur={onFieldChange}
      />

      {numberOfAdults === "2" && secondaryField && (
        <div>
          <IncomeInputField
            ariaLabel={secondaryField.ariaLabel}
            className="modern-input"
            form={form}
            label={secondaryField.label}
            name={secondaryField.name}
            onBlur={onFieldChange}
          />
        </div>
      )}
    </Box>
  );
};
