import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Label } from "@/components/ui/Label";
import { SliderInput } from "@/components/ui/SliderInput";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import type { CompoundInterestInputs } from "@/lib/compound-interest";

import { STYLES } from "../constants";

import { WithdrawalTypeSelector } from "./WithdrawalTypeSelector";

interface AdvancedSettingsProps {
  inputs: CompoundInterestInputs;
  onInputChange: (field: keyof CompoundInterestInputs, value: number) => void;
  onWithdrawalToggle: (enabled: boolean) => void;
  onWithdrawalTypeChange: (
    type: CompoundInterestInputs["withdrawalType"]
  ) => void;
}

export const AdvancedSettings = ({
  inputs,
  onInputChange,
  onWithdrawalToggle,
  onWithdrawalTypeChange,
}: AdvancedSettingsProps) => {
  const t = useTranslations("compound_interest");

  const hasActiveWithdrawal = inputs.withdrawalType !== "none";
  const hasAnnualIncrease = (inputs.annualSavingsIncrease || 0) > 0;

  return (
    <div className="mt-6">
      <Accordion collapsible className="w-full" type="single">
        <AccordionItem value="advanced-settings">
          <AccordionTrigger>
            <div className="flex items-center gap-3 w-full">
              <div className={STYLES.ICON_CONTAINER}>
                <Settings2 className={STYLES.ICON_SMALL} />
              </div>
              <div className="text-left flex-1">
                <Text className="text-base font-semibold text-foreground block">
                  {t("advanced_settings.title")}
                </Text>
                <Text className="text-xs text-muted-foreground block">
                  {t("advanced_settings.description")}
                </Text>
              </div>
              <div className="flex items-center gap-2 mr-2">
                {hasActiveWithdrawal && (
                  <span className="px-2 py-1 text-xs font-medium icon-bg-golden text-golden rounded-full">
                    {t("advanced_settings.active_badge")}
                  </span>
                )}
                {hasAnnualIncrease && (
                  <span className="px-2 py-1 text-xs font-medium icon-bg-golden text-golden rounded-full">
                    +{inputs.annualSavingsIncrease}%
                  </span>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-4">
            <div className="space-y-6">
              {/* Annual Savings Increase */}
              <div className="space-y-2 lg:flex-1">
                <Label className="text-sm font-medium text-foreground block">
                  {t("advanced_settings.annual_savings_increase.label")}
                </Label>
                <Text className="text-xs text-muted-foreground block">
                  {t("advanced_settings.annual_savings_increase.description")}
                </Text>
                <SliderInput
                  ariaLabel={t(
                    "advanced_settings.annual_savings_increase.label"
                  )}
                  decimals={1}
                  max={50}
                  min={0}
                  step={0.5}
                  suffix={t("suffixes.percent_per_year")}
                  value={inputs.annualSavingsIncrease || 0}
                  width="w-20"
                  onChange={(value) =>
                    onInputChange("annualSavingsIncrease", value)
                  }
                />
              </div>

              {/* Withdrawal Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-foreground block">
                      {t("advanced_settings.planned_withdrawal.title")}
                    </Label>
                    <Text className="text-xs text-muted-foreground block mt-1">
                      {t("advanced_settings.planned_withdrawal.description")}
                    </Text>
                  </div>
                  <Switch
                    checked={hasActiveWithdrawal}
                    className="data-[state=checked]:bg-primary"
                    onCheckedChange={onWithdrawalToggle}
                  />
                </div>

                {hasActiveWithdrawal && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pl-2"
                    initial={{ opacity: 0, y: -10 }}
                  >
                    {/* Withdrawal Type Selector */}
                    <WithdrawalTypeSelector
                      withdrawalType={inputs.withdrawalType}
                      onChange={onWithdrawalTypeChange}
                    />

                    {/* Withdrawal Year */}
                    <div className="space-y-2 lg:flex-1">
                      <Label className="text-xs font-medium text-foreground">
                        {t(
                          "advanced_settings.planned_withdrawal.withdrawal_year_question"
                        )}
                      </Label>
                      <SliderInput
                        ariaLabel={t(
                          "advanced_settings.planned_withdrawal.withdrawal_year_question"
                        )}
                        decimals={0}
                        max={inputs.investmentHorizon}
                        min={1}
                        prefix={`${t("advanced_settings.planned_withdrawal.year_prefix")} `}
                        step={1}
                        value={inputs.withdrawalYear || 10}
                        width="w-20"
                        onChange={(value) =>
                          onInputChange("withdrawalYear", value)
                        }
                      />
                    </div>

                    {/* Withdrawal Amount/Percentage */}
                    {inputs.withdrawalType === "percentage" ? (
                      <div className="space-y-2 lg:flex-1">
                        <Label className="text-xs font-medium text-foreground">
                          {t(
                            "advanced_settings.planned_withdrawal.withdrawal_percentage_label"
                          )}
                        </Label>
                        <SliderInput
                          ariaLabel={t(
                            "advanced_settings.planned_withdrawal.withdrawal_percentage_label"
                          )}
                          decimals={0}
                          max={100}
                          min={0}
                          step={1}
                          suffix={t("suffixes.percent")}
                          value={inputs.withdrawalPercentage || 10}
                          width="w-16"
                          onChange={(value) =>
                            onInputChange("withdrawalPercentage", value)
                          }
                        />
                      </div>
                    ) : (
                      <div className="space-y-2 lg:flex-1">
                        <Label className="text-xs font-medium text-foreground">
                          {t(
                            "advanced_settings.planned_withdrawal.withdrawal_amount_label"
                          )}
                        </Label>
                        <SliderInput
                          ariaLabel={t(
                            "advanced_settings.planned_withdrawal.withdrawal_amount_label"
                          )}
                          decimals={0}
                          max={10000000}
                          min={0}
                          step={10000}
                          suffix={t("suffixes.currency")}
                          value={inputs.withdrawalAmount || 100000}
                          width="w-32"
                          onChange={(value) =>
                            onInputChange("withdrawalAmount", value)
                          }
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
