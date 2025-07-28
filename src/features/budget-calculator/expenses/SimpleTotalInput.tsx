"use client";

import { Sigma } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { ResponsiveExpenseInput } from "./ResponsiveExpenseInput";

interface SimpleTotalInputProps {
  value: number;
  onChange: (value: string) => void;
}

export const SimpleTotalInput = ({
  value,
  onChange,
}: SimpleTotalInputProps) => {
  const t = useTranslations("expense_categories");

  const handleChange = useCallback(
    (inputValue: string) => {
      onChange(inputValue);
    },
    [onChange]
  );

  return (
    <div className="space-y-4">
      <ResponsiveExpenseInput
        ariaLabel={t("view_toggle.simple_description")}
        icon={<Sigma className="w-4 h-4 transition-colors duration-300" />}
        id="total-expenses"
        label={t("view_toggle.simple_description")}
        showProgressBar={false}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
