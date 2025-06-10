"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  Settings2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useMemo, useEffect } from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
  CardContent,
} from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Label } from "@/components/ui/Label";
import { SliderInput } from "@/components/ui/SliderInput";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import { CompoundInterestChart } from "@/features/charts/CompoundInterestChart";
import {
  calculateCompoundInterest,
  calculateFinalValues,
  type CompoundInterestInputs,
} from "@/lib/compound-interest";

export const CompoundInterestCalculator = () => {
  const t = useTranslations("compound_interest");
  const searchParameters = useSearchParams();

  // Get initial values from URL parameters
  const initialMonthlySavings = searchParameters.get("monthlySavings");

  const [inputs, setInputs] = useState<CompoundInterestInputs>({
    startSum: 0,
    monthlySavings: initialMonthlySavings
      ? Number.parseInt(initialMonthlySavings)
      : 5000,
    yearlyReturn: 7,
    investmentHorizon: 20,
    age: 30,
    withdrawalType: "none",
    withdrawalYear: 10,
    withdrawalAmount: 100000,
    withdrawalPercentage: 10,
    annualSavingsIncrease: 0,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  // Highlight the monthly savings field if it came from URL
  useEffect(() => {
    if (initialMonthlySavings) {
      setHighlightedField("monthlySavings");
      // Remove highlight after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedField(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [initialMonthlySavings]);

  const inputConfigs = [
    {
      key: "startSum" as const,
      label: t("inputs.start_sum_label"),
      description: t("inputs.start_sum_description"),
      min: 0,
      max: 2000000,
      step: 10000,
      prefix: "",
      suffix: " kr",
    },
    {
      key: "monthlySavings" as const,
      label: t("inputs.monthly_savings_label"),
      description: t("inputs.monthly_savings_description"),
      min: 0,
      max: 100000,
      step: 500,
      prefix: "",
      suffix: " kr/mån",
    },
    {
      key: "yearlyReturn" as const,
      label: t("inputs.yearly_return_label"),
      description: t("inputs.yearly_return_description"),
      min: 0,
      max: 200,
      step: 1,
      prefix: "",
      suffix: "%",
    },
    {
      key: "investmentHorizon" as const,
      label: t("inputs.investment_horizon_label"),
      description: t("inputs.investment_horizon_description"),
      min: 1,
      max: 100,
      step: 1,
      prefix: "",
      suffix: " år",
    },
    {
      key: "age" as const,
      label: t("inputs.age_label"),
      description: t("inputs.age_description"),
      min: 18,
      max: 100,
      step: 1,
      prefix: "",
      suffix: " år",
    },
  ];

  const chartData = useMemo(() => {
    return calculateCompoundInterest({
      ...inputs,
      yearlyReturn: inputs.yearlyReturn / 100, // Convert percentage to decimal
    });
  }, [inputs]);

  const finalValues = useMemo(() => {
    return calculateFinalValues({
      ...inputs,
      yearlyReturn: inputs.yearlyReturn / 100, // Convert percentage to decimal
    });
  }, [inputs]);

  const handleInputChange = (
    field: keyof CompoundInterestInputs,
    value: number
  ) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box className="space-y-6">
      {/* Input Controls */}
      <Card variant="elevated">
        <CardHeader>
          <CardIcon>
            <Calculator className="w-6 h-6 text-foreground" />
          </CardIcon>
          <Box className="flex-1">
            <CardTitle>{t("calculator.title")}</CardTitle>
            <Text className="text-sm text-muted-foreground mt-1">
              {t("calculator.description")}
            </Text>
          </Box>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inputConfigs.map((config, index) => (
              <motion.div
                key={config.key}
                animate={{ opacity: 1, y: 0 }}
                className={`space-y-2 ${
                  highlightedField === config.key
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg p-4 bg-primary/10"
                    : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="space-y-1">
                  <Label
                    className="text-sm font-medium text-foreground block"
                    htmlFor={config.key}
                  >
                    {config.label}
                  </Label>
                  {config.description && (
                    <Text className="text-xs text-muted-foreground block">
                      {config.description}
                    </Text>
                  )}
                </div>
                <div className="space-y-3">
                  <SliderInput
                    decimals={config.key === "yearlyReturn" ? 0 : 0}
                    max={config.max}
                    min={config.min}
                    prefix={config.prefix}
                    step={config.step}
                    suffix={config.suffix}
                    value={inputs[config.key] ?? config.min}
                    width="w-28"
                    onChange={(value) => handleInputChange(config.key, value)}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Advanced Settings Toggle */}
          <div className="mt-6 border-t border-border pt-6">
            <button
              className="flex items-center justify-between w-full p-2 rounded-xl bg-muted/50 border border-border hover:border-primary/50 transition-all duration-300 hover:bg-muted/70 group"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Settings2 className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-left">
                  <Text className="text-base font-semibold text-foreground group-hover:text-primary transition-colors block">
                    {t("advanced_settings.title")}
                  </Text>
                  <Text className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors block">
                    {t("advanced_settings.description")}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {!showAdvanced && inputs.withdrawalType !== "none" && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                      {t("advanced_settings.active_badge")}
                    </span>
                  )}
                  {!showAdvanced && (inputs.annualSavingsIncrease || 0) > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full border border-primary/30">
                      +{inputs.annualSavingsIncrease}%
                    </span>
                  )}
                </div>
                {showAdvanced ? (
                  <ChevronUp className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
            </button>

            {/* Advanced Settings Content */}
            {showAdvanced && (
              <motion.div
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 space-y-6"
                exit={{ opacity: 0, height: 0 }}
                initial={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Annual Savings Increase */}
                <div className="space-y-2 lg:flex-1">
                  <Label className="text-sm font-medium text-gray-200 block">
                    {t("advanced_settings.annual_savings_increase.label")}
                  </Label>
                  <Text className="text-xs text-gray-400 block">
                    {t("advanced_settings.annual_savings_increase.description")}
                  </Text>
                  <SliderInput
                    decimals={1}
                    max={50}
                    min={0}
                    step={0.5}
                    suffix="%/år"
                    value={inputs.annualSavingsIncrease || 0}
                    width="w-20"
                    onChange={(value) =>
                      handleInputChange("annualSavingsIncrease", value)
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
                      checked={inputs.withdrawalType !== "none"}
                      className="data-[state=checked]:bg-primary"
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          setInputs((prev) => ({
                            ...prev,
                            withdrawalType: "none",
                          }));
                        } else {
                          setInputs((prev) => ({
                            ...prev,
                            withdrawalType: "percentage",
                          }));
                        }
                      }}
                    />
                  </div>

                  {inputs.withdrawalType !== "none" && (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pl-2"
                      initial={{ opacity: 0, y: -10 }}
                    >
                      {/* Withdrawal Type Selector */}
                      <div className="space-y-2 lg:flex-1">
                        <Label className="text-xs font-medium text-foreground">
                          {t(
                            "advanced_settings.planned_withdrawal.withdrawal_type_question"
                          )}
                        </Label>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            type="button"
                            variant={
                              inputs.withdrawalType === "percentage"
                                ? "gradient"
                                : "secondary"
                            }
                            onClick={() =>
                              setInputs((prev) => ({
                                ...prev,
                                withdrawalType: "percentage",
                              }))
                            }
                          >
                            {t(
                              "advanced_settings.planned_withdrawal.percentage_option"
                            )}
                          </Button>
                          <Button
                            className="flex-1"
                            type="button"
                            variant={
                              inputs.withdrawalType === "amount"
                                ? "gradient"
                                : "secondary"
                            }
                            onClick={() =>
                              setInputs((prev) => ({
                                ...prev,
                                withdrawalType: "amount",
                              }))
                            }
                          >
                            {t(
                              "advanced_settings.planned_withdrawal.amount_option"
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Withdrawal Year */}
                      <div className="space-y-2 lg:flex-1">
                        <Label className="text-xs font-medium text-foreground">
                          {t(
                            "advanced_settings.planned_withdrawal.withdrawal_year_question"
                          )}
                        </Label>
                        <SliderInput
                          decimals={0}
                          max={inputs.investmentHorizon}
                          min={1}
                          prefix={`${t("advanced_settings.planned_withdrawal.year_prefix")} `}
                          step={1}
                          value={inputs.withdrawalYear || 10}
                          width="w-20"
                          onChange={(value) =>
                            handleInputChange("withdrawalYear", value)
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
                            decimals={0}
                            max={100}
                            min={0}
                            step={1}
                            suffix="%"
                            value={inputs.withdrawalPercentage || 10}
                            width="w-16"
                            onChange={(value) =>
                              handleInputChange("withdrawalPercentage", value)
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
                            decimals={0}
                            max={10000000}
                            min={0}
                            step={10000}
                            suffix=" kr"
                            value={inputs.withdrawalAmount || 100000}
                            width="w-32"
                            onChange={(value) =>
                              handleInputChange("withdrawalAmount", value)
                            }
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Card variant="elevated">
        <CardHeader>
          <CardIcon>
            <TrendingUp className="w-6 h-6 text-foreground" />
          </CardIcon>
          <Box className="flex-1">
            <CardTitle>{t("results.title")}</CardTitle>
            <Text className="text-sm text-muted-foreground mt-1">
              {t("results.description", { years: inputs.investmentHorizon })}
            </Text>
          </Box>
        </CardHeader>
        <CardContent>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${finalValues.totalWithdrawn > 0 ? "lg:grid-cols-6" : "lg:grid-cols-4"}`}
          >
            {/* Theoretical Total Value (without withdrawals) */}
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-xs text-muted-foreground font-medium break-words hyphens-auto block">
                  {t("results.theoretical_total_value")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.theoreticalTotalValue}
                  className="text-lg lg:text-xl font-bold text-foreground leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-muted rounded-full mt-1">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </motion.div>

            {/* Current Total Value (after withdrawals) */}
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-xs text-muted-foreground font-medium break-words hyphens-auto block">
                  {t("results.total_value_after_withdrawals")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.totalValue}
                  className="text-lg lg:text-xl font-bold text-foreground leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-muted rounded-full mt-1">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${(finalValues.totalValue / finalValues.theoreticalTotalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl border border-border bg-blue-500/5 hover:bg-blue-500/10 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-sm text-muted-foreground font-medium break-words hyphens-auto block">
                  {t("results.start_sum")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.startSum}
                  className="text-lg lg:text-xl font-semibold text-blue-500 leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-muted rounded-full mt-1">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${(finalValues.startSum / finalValues.totalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl border border-border bg-green-500/5 hover:bg-green-500/10 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-sm text-muted-foreground font-medium break-words hyphens-auto block">
                  {t("results.total_savings")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.totalSavings}
                  className="text-lg lg:text-xl font-semibold text-green-500 leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-muted rounded-full mt-1">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(finalValues.totalSavings / finalValues.theoreticalTotalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl border border-border bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.5 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-sm text-muted-foreground font-medium break-words hyphens-auto block">
                  {t("results.compound_returns")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.totalReturns}
                  className="text-lg lg:text-xl font-semibold text-purple-500 leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-muted rounded-full mt-1">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${(finalValues.totalReturns / finalValues.theoreticalTotalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>

            {/* Total Withdrawn (show only if there have been withdrawals) */}
            {finalValues.totalWithdrawn > 0 && (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl border border-border bg-red-500/5 hover:bg-red-500/10 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.6 }}
              >
                <div className="space-y-2 lg:flex-1">
                  <Text className="text-sm text-muted-foreground font-medium break-words hyphens-auto block">
                    {t("results.total_withdrawn")}
                  </Text>
                  <CurrencyDisplay
                    amount={finalValues.totalWithdrawn}
                    className="text-lg lg:text-xl font-semibold text-red-500 leading-relaxed break-words whitespace-nowrap block"
                    showDecimals={false}
                    size="lg"
                    variant="neutral"
                  />
                </div>
                <div className="w-full h-1 bg-muted rounded-full mt-1">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (finalValues.totalWithdrawn / (finalValues.totalValue + finalValues.totalWithdrawn)) * 100)}%`,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <CompoundInterestChart
        data={chartData}
        isVisible={chartData.length > 0}
      />
    </Box>
  );
};
