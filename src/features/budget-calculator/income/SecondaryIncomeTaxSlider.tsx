import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import { FormField, FormItem, FormControl } from "@/components/ui/Form";
import { Label } from "@/components/ui/Label";
import { SliderInput } from "@/components/ui/SliderInput";

import type { IncomeFormValues } from "./Income";

interface SecondaryIncomeTaxSliderProps {
  form: UseFormReturn<IncomeFormValues>;
  onFieldChange: () => void;
  isVisible: boolean;
}

export const SecondaryIncomeTaxSlider = ({
  form,
  onFieldChange,
  isVisible,
}: SecondaryIncomeTaxSliderProps) => {
  const t = useTranslations("income");

  if (!isVisible) return null;

  return (
    <div className="mt-4 space-y-2">
      <Label className="text-sm font-medium text-foreground">
        {t("secondary_income_tax_rate")}
      </Label>
      <div className="text-xs text-muted-foreground mb-2">
        {t("secondary_income_tax_rate_help")}
      </div>
      <FormField
        control={form.control}
        name="secondaryIncomeTaxRate"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <SliderInput
                ariaLabel={t("secondary_income_tax_rate_aria")}
                decimals={0}
                max={40}
                min={25}
                step={1}
                suffix="%"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  onFieldChange();
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
