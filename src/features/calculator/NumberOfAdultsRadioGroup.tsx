import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";
import React from "react";

interface NumberOfAdultsRadioGroupProps {
  value: "1" | "2";
  onChange: (value: "1" | "2") => void;
}

const NumberOfAdultsRadioGroup = ({
  value,
  onChange,
}: NumberOfAdultsRadioGroupProps) => {
  const t = useTranslations("income");
  return (
    <fieldset>
      <legend
        id="adults-group-label"
        className="calculator-form-label"
        aria-label={t("number_of_adults_full")}
      >
        {t("number_of_adults")}
      </legend>
      <FormControl>
        <RadioGroup
          aria-labelledby="adults-group-label"
          value={value}
          onValueChange={(v) => onChange(v as "1" | "2")}
          className="flex gap-4"
        >
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <RadioGroupItem value="1" />
            </FormControl>
            <FormLabel className="font-normal">{t("one_adult")}</FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <RadioGroupItem value="2" />
            </FormControl>
            <FormLabel className="font-normal">{t("two_adults")}</FormLabel>
          </FormItem>
        </RadioGroup>
      </FormControl>
    </fieldset>
  );
};

export { NumberOfAdultsRadioGroup };
