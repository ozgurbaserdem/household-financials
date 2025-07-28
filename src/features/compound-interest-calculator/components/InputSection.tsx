import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { useTranslations } from "next-intl";

import { Box } from "@/components/ui/Box";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { SliderInput } from "@/components/ui/SliderInput";
import { Text } from "@/components/ui/Text";
import type { CompoundInterestInputs } from "@/lib/compound-interest";

import { STYLES } from "../constants";

import { AdvancedSettings } from "./AdvancedSettings";

interface InputSectionProps {
  inputs: CompoundInterestInputs;
  highlightedField: string | null;
  onInputChange: (field: keyof CompoundInterestInputs, value: number) => void;
  onWithdrawalToggle: (enabled: boolean) => void;
  onWithdrawalTypeChange: (
    type: CompoundInterestInputs["withdrawalType"]
  ) => void;
}

const INPUT_CONFIGS = [
  {
    key: "startSum" as const,
    translationKey: "start_sum",
    min: 0,
    max: 2000000,
    step: 10000,
    suffixKey: "currency",
  },
  {
    key: "monthlySavings" as const,
    translationKey: "monthly_savings",
    min: 0,
    max: 100000,
    step: 500,
    suffixKey: "currency_per_month",
  },
  {
    key: "yearlyReturn" as const,
    translationKey: "yearly_return",
    min: 0,
    max: 200,
    step: 1,
    suffixKey: "percent",
  },
  {
    key: "investmentHorizon" as const,
    translationKey: "investment_horizon",
    min: 1,
    max: 100,
    step: 1,
    suffixKey: "years",
  },
  {
    key: "age" as const,
    translationKey: "age",
    min: 18,
    max: 100,
    step: 1,
    suffixKey: "years",
  },
] as const;

export const InputSection = ({
  inputs,
  highlightedField,
  onInputChange,
  onWithdrawalToggle,
  onWithdrawalTypeChange,
}: InputSectionProps) => {
  const t = useTranslations("compound_interest");

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className={STYLES.ICON_CONTAINER}>
          <Calculator className={STYLES.ICON} />
        </div>
        <Box className="flex-1">
          <CardTitle>{t("calculator.title")}</CardTitle>
          <Text className="text-sm text-muted-foreground mt-1">
            {t("calculator.description")}
          </Text>
        </Box>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {INPUT_CONFIGS.map((config, index) => (
            <motion.div
              key={config.key}
              animate={{ opacity: 1, y: 0 }}
              className={`space-y-2 ${
                highlightedField === config.key ? STYLES.HIGHLIGHT_RING : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="space-y-1">
                <Label
                  className="text-sm font-medium text-foreground block"
                  htmlFor={config.key}
                >
                  {t(`inputs.${config.translationKey}_label`)}
                </Label>
                <Text className="text-xs text-muted-foreground block">
                  {t(`inputs.${config.translationKey}_description`)}
                </Text>
              </div>
              <div className="space-y-3">
                <SliderInput
                  allowInputBeyondMax={
                    config.key === "startSum" || config.key === "yearlyReturn"
                  }
                  ariaLabel={t(`inputs.${config.translationKey}_aria`)}
                  decimals={0}
                  max={config.max}
                  min={config.min}
                  step={config.step}
                  suffix={t(`suffixes.${config.suffixKey}`)}
                  value={inputs[config.key] ?? config.min}
                  width="w-28"
                  onChange={(value) => onInputChange(config.key, value)}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <AdvancedSettings
          inputs={inputs}
          onInputChange={onInputChange}
          onWithdrawalToggle={onWithdrawalToggle}
          onWithdrawalTypeChange={onWithdrawalTypeChange}
        />
      </CardContent>
    </Card>
  );
};
