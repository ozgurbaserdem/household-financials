import type { UseFormReturn } from "react-hook-form";

import { Box } from "@/components/ui/Box";

import type { IncomeFormValues } from "./Income";
import { IncomeInputField } from "./IncomeInputField";

interface IncomeSectionField {
  name: keyof IncomeFormValues;
  label: string;
  ariaLabel: string;
}

interface IncomeSectionProps {
  form: UseFormReturn<IncomeFormValues>;
  fields: IncomeSectionField[];
  onFieldChange: () => void;
  className?: string;
}

export const IncomeSection = ({
  form,
  fields,
  onFieldChange,
  className = "",
}: IncomeSectionProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <Box key={field.name} className="space-y-2">
            <IncomeInputField
              ariaLabel={field.ariaLabel}
              className="modern-input"
              form={form}
              label={field.label}
              name={field.name}
              onBlur={onFieldChange}
            />
          </Box>
        ))}
      </Box>
    </div>
  );
};
