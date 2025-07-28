import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import type { CompoundInterestInputs } from "@/lib/compound-interest";

interface WithdrawalTypeSelectorProps {
  withdrawalType: CompoundInterestInputs["withdrawalType"];
  onChange: (type: CompoundInterestInputs["withdrawalType"]) => void;
}

export const WithdrawalTypeSelector = ({
  withdrawalType,
  onChange,
}: WithdrawalTypeSelectorProps) => {
  const t = useTranslations("compound_interest");

  return (
    <div className="space-y-2 lg:flex-1">
      <Label className="text-xs font-medium text-foreground">
        {t("advanced_settings.planned_withdrawal.withdrawal_type_question")}
      </Label>
      <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
        <Button
          aria-checked={withdrawalType === "percentage"}
          aria-describedby="withdrawal-type-help"
          className="flex-1 py-2 px-3 text-md"
          role="radio"
          size="budgetkollen-selection"
          type="button"
          variant={
            withdrawalType === "percentage"
              ? "budgetkollen-selection-active"
              : "budgetkollen-selection"
          }
          onClick={() => onChange("percentage")}
        >
          {t("advanced_settings.planned_withdrawal.percentage_option")}
        </Button>
        <Button
          aria-checked={withdrawalType === "amount"}
          aria-describedby="withdrawal-type-help"
          className="flex-1 py-2 px-3 text-md"
          role="radio"
          size="budgetkollen-selection"
          type="button"
          variant={
            withdrawalType === "amount"
              ? "budgetkollen-selection-active"
              : "budgetkollen-selection"
          }
          onClick={() => onChange("amount")}
        >
          {t("advanced_settings.planned_withdrawal.amount_option")}
        </Button>
      </div>
      <div className="sr-only" id="withdrawal-type-help">
        {t("accessibility.withdrawal_type_help")}
      </div>
    </div>
  );
};
