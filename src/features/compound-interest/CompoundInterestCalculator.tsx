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
import { CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/ModernCard";
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

  const [editingField, setEditingField] = useState<
    keyof CompoundInterestInputs | null
  >(null);
  const [tempValue, setTemporaryValue] = useState<string>("");
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

  const handleEditStart = (field: keyof CompoundInterestInputs) => {
    setEditingField(field);
    setTemporaryValue((inputs[field] ?? 0).toString());
  };

  const handleEditEnd = (field: keyof CompoundInterestInputs) => {
    const numValue = parseFloat(tempValue.replace(/[^\d.-]/g, ""));
    if (!Number.isNaN(numValue)) {
      // Input fields are not constrained by min/max limits
      handleInputChange(field, numValue);
    }
    setEditingField(null);
    setTemporaryValue("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    field: keyof CompoundInterestInputs
  ) => {
    if (e.key === "Enter") {
      handleEditEnd(field);
    } else if (e.key === "Escape") {
      setEditingField(null);
      setTemporaryValue("");
    }
  };

  return (
    <Box className="space-y-6">
      {/* Input Controls */}
      <Card glass gradient>
        <CardHeader>
          <CardIcon>
            <Calculator className="w-6 h-6 text-blue-400" />
          </CardIcon>
          <Box className="flex-1">
            <CardTitle>{t("calculator.title")}</CardTitle>
            <Text className="text-sm text-gray-300 mt-1">
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
                    ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-950 rounded-lg p-4 bg-purple-500/10"
                    : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="space-y-1">
                  <Label
                    className="text-sm font-medium text-gray-200 block"
                    htmlFor={config.key}
                  >
                    {config.label}
                  </Label>
                  {config.description && (
                    <Text className="text-xs text-gray-400 block">
                      {config.description}
                    </Text>
                  )}
                </div>
                <div className="space-y-3">
                  {/* Custom styled range slider with value display at the end */}
                  <div className="relative flex items-center gap-4">
                    <input
                      className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                      id={config.key}
                      max={config.max}
                      min={config.min}
                      step={config.step}
                      style={{
                        background: `linear-gradient(to right, 
                          rgb(59 130 246) 0%, 
                          rgb(147 51 234) ${(((inputs[config.key] ?? config.min) - config.min) / (config.max - config.min)) * 100}%, 
                          rgb(55 65 81) ${(((inputs[config.key] ?? config.min) - config.min) / (config.max - config.min)) * 100}%, 
                          rgb(55 65 81) 100%)`,
                      }}
                      type="range"
                      value={inputs[config.key] ?? config.min}
                      onChange={(e) =>
                        handleInputChange(config.key, Number(e.target.value))
                      }
                    />
                    <div className="flex-shrink-0">
                      {editingField === config.key ? (
                        <input
                          autoFocus
                          className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-blue-400 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-28 text-center text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-blue-400/50"
                          type="text"
                          value={tempValue}
                          onBlur={() => handleEditEnd(config.key)}
                          onChange={(e) => setTemporaryValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, config.key)}
                        />
                      ) : (
                        <button
                          className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-28 text-center cursor-text"
                          onClick={() => handleEditStart(config.key)}
                        >
                          <Text className="text-sm font-semibold text-white">
                            {config.prefix}
                            {(inputs[config.key] ?? config.min).toLocaleString(
                              "sv-SE"
                            )}
                            {config.suffix}
                          </Text>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Advanced Settings Toggle */}
          <div className="mt-6 border-t border-gray-700/50 pt-6">
            <button
              className="flex items-center justify-between w-full p-2 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 hover:from-blue-900/30 hover:to-purple-900/30 group"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Settings2 className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <div className="text-left">
                  <Text className="text-base font-semibold text-white group-hover:text-blue-100 transition-colors block">
                    {t("advanced_settings.title")}
                  </Text>
                  <Text className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors block">
                    {t("advanced_settings.description")}
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {!showAdvanced && inputs.withdrawalType !== "none" && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                      {t("advanced_settings.active_badge")}
                    </span>
                  )}
                  {!showAdvanced && (inputs.annualSavingsIncrease || 0) > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                      +{inputs.annualSavingsIncrease}%
                    </span>
                  )}
                </div>
                {showAdvanced ? (
                  <ChevronUp className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
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
                  <div className="flex items-center gap-4">
                    <input
                      className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                      max={50}
                      min={0}
                      step={0.5}
                      style={{
                        background: `linear-gradient(to right, 
                          rgb(59 130 246) 0%, 
                          rgb(147 51 234) ${((inputs.annualSavingsIncrease || 0) / 50) * 100}%, 
                          rgb(55 65 81) ${((inputs.annualSavingsIncrease || 0) / 50) * 100}%, 
                          rgb(55 65 81) 100%)`,
                      }}
                      type="range"
                      value={inputs.annualSavingsIncrease || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "annualSavingsIncrease",
                          Number(e.target.value)
                        )
                      }
                    />
                    <div className="flex-shrink-0">
                      {editingField === "annualSavingsIncrease" ? (
                        <input
                          autoFocus
                          className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-blue-400 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-20 text-center text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-blue-400/50"
                          type="text"
                          value={tempValue}
                          onBlur={() => handleEditEnd("annualSavingsIncrease")}
                          onChange={(e) => setTemporaryValue(e.target.value)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, "annualSavingsIncrease")
                          }
                        />
                      ) : (
                        <button
                          className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-20 text-center cursor-text"
                          onClick={() =>
                            handleEditStart("annualSavingsIncrease")
                          }
                        >
                          <Text className="text-sm font-semibold text-white">
                            {inputs.annualSavingsIncrease || 0}%/år
                          </Text>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Withdrawal Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-200 block">
                        {t("advanced_settings.planned_withdrawal.title")}
                      </Label>
                      <Text className="text-xs text-gray-400 block mt-1">
                        {t("advanced_settings.planned_withdrawal.description")}
                      </Text>
                    </div>
                    <Switch
                      checked={inputs.withdrawalType !== "none"}
                      className="data-[state=checked]:bg-blue-500"
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
                        <Label className="text-xs font-medium text-gray-300">
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
                        <Label className="text-xs font-medium text-gray-300">
                          {t(
                            "advanced_settings.planned_withdrawal.withdrawal_year_question"
                          )}
                        </Label>
                        <div className="flex items-center gap-4">
                          <input
                            className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                            max={inputs.investmentHorizon}
                            min={1}
                            step={1}
                            style={{
                              background: `linear-gradient(to right, 
                                rgb(59 130 246) 0%, 
                                rgb(147 51 234) ${(((inputs.withdrawalYear || 10) - 1) / (inputs.investmentHorizon - 1)) * 100}%, 
                                rgb(55 65 81) ${(((inputs.withdrawalYear || 10) - 1) / (inputs.investmentHorizon - 1)) * 100}%, 
                                rgb(55 65 81) 100%)`,
                            }}
                            type="range"
                            value={inputs.withdrawalYear || 10}
                            onChange={(e) =>
                              handleInputChange(
                                "withdrawalYear",
                                Number(e.target.value)
                              )
                            }
                          />
                          <div className="flex-shrink-0">
                            {editingField === "withdrawalYear" ? (
                              <input
                                autoFocus
                                className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-blue-400 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-20 text-center text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-blue-400/50"
                                type="text"
                                value={tempValue}
                                onBlur={() => handleEditEnd("withdrawalYear")}
                                onChange={(e) =>
                                  setTemporaryValue(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(e, "withdrawalYear")
                                }
                              />
                            ) : (
                              <button
                                className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-20 text-center cursor-text"
                                onClick={() =>
                                  handleEditStart("withdrawalYear")
                                }
                              >
                                <Text className="text-sm font-semibold text-white">
                                  {t(
                                    "advanced_settings.planned_withdrawal.year_prefix"
                                  )}{" "}
                                  {inputs.withdrawalYear || 10}
                                </Text>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Withdrawal Amount/Percentage */}
                      {inputs.withdrawalType === "percentage" ? (
                        <div className="space-y-2 lg:flex-1">
                          <Label className="text-xs font-medium text-gray-300">
                            {t(
                              "advanced_settings.planned_withdrawal.withdrawal_percentage_label"
                            )}
                          </Label>
                          <div className="flex items-center gap-4">
                            <input
                              className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                              max={100}
                              min={0}
                              step={1}
                              style={{
                                background: `linear-gradient(to right, 
                                  rgb(59 130 246) 0%, 
                                  rgb(147 51 234) ${inputs.withdrawalPercentage || 10}%, 
                                  rgb(55 65 81) ${inputs.withdrawalPercentage || 10}%, 
                                  rgb(55 65 81) 100%)`,
                              }}
                              type="range"
                              value={inputs.withdrawalPercentage || 10}
                              onChange={(e) =>
                                handleInputChange(
                                  "withdrawalPercentage",
                                  Number(e.target.value)
                                )
                              }
                            />
                            <div className="flex-shrink-0">
                              {editingField === "withdrawalPercentage" ? (
                                <input
                                  autoFocus
                                  className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-blue-400 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-16 text-center text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-blue-400/50"
                                  type="text"
                                  value={tempValue}
                                  onBlur={() =>
                                    handleEditEnd("withdrawalPercentage")
                                  }
                                  onChange={(e) =>
                                    setTemporaryValue(e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, "withdrawalPercentage")
                                  }
                                />
                              ) : (
                                <button
                                  className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-16 text-center cursor-text"
                                  onClick={() =>
                                    handleEditStart("withdrawalPercentage")
                                  }
                                >
                                  <Text className="text-sm font-semibold text-white">
                                    {inputs.withdrawalPercentage || 10}%
                                  </Text>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 lg:flex-1">
                          <Label className="text-xs font-medium text-gray-300">
                            {t(
                              "advanced_settings.planned_withdrawal.withdrawal_amount_label"
                            )}
                          </Label>
                          <div className="flex items-center gap-4">
                            <input
                              className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                              max={10000000}
                              min={0}
                              step={10000}
                              style={{
                                background: `linear-gradient(to right, 
                                  rgb(59 130 246) 0%, 
                                  rgb(147 51 234) ${((inputs.withdrawalAmount || 100000) / 10000000) * 100}%, 
                                  rgb(55 65 81) ${((inputs.withdrawalAmount || 100000) / 10000000) * 100}%, 
                                  rgb(55 65 81) 100%)`,
                              }}
                              type="range"
                              value={inputs.withdrawalAmount || 100000}
                              onChange={(e) =>
                                handleInputChange(
                                  "withdrawalAmount",
                                  Number(e.target.value)
                                )
                              }
                            />
                            <div className="flex-shrink-0">
                              {editingField === "withdrawalAmount" ? (
                                <input
                                  autoFocus
                                  className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-blue-400 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-32 text-center text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-blue-400/50"
                                  type="text"
                                  value={tempValue}
                                  onBlur={() =>
                                    handleEditEnd("withdrawalAmount")
                                  }
                                  onChange={(e) =>
                                    setTemporaryValue(e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, "withdrawalAmount")
                                  }
                                />
                              ) : (
                                <button
                                  className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-32 text-center cursor-text"
                                  onClick={() =>
                                    handleEditStart(
                                      "withdrawalAmount" as keyof CompoundInterestInputs
                                    )
                                  }
                                >
                                  <Text className="text-sm font-semibold text-white">
                                    {(
                                      inputs.withdrawalAmount || 100000
                                    ).toLocaleString("sv-SE")}{" "}
                                    kr
                                  </Text>
                                </button>
                              )}
                            </div>
                          </div>
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
      <Card glass gradient>
        <CardHeader>
          <CardIcon>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </CardIcon>
          <Box className="flex-1">
            <CardTitle>{t("results.title")}</CardTitle>
            <Text className="text-sm text-gray-300 mt-1">
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
              className="glass p-3 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:from-gray-800/60 hover:to-gray-900/60 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-xs text-gray-400 font-medium break-words hyphens-auto block">
                  {t("results.theoretical_total_value")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.theoreticalTotalValue}
                  className="text-lg lg:text-xl font-bold text-white leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </motion.div>

            {/* Current Total Value (after withdrawals) */}
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-3 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:from-gray-800/60 hover:to-gray-900/60 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-xs text-gray-400 font-medium break-words hyphens-auto block">
                  {t("results.total_value_after_withdrawals")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.totalValue}
                  className="text-lg lg:text-xl font-bold text-white leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  style={{
                    width: `${(finalValues.totalValue / finalValues.theoreticalTotalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-3 rounded-xl border border-gray-700/50 bg-gradient-to-br from-blue-900/20 to-blue-800/20 hover:from-blue-900/30 hover:to-blue-800/30 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-sm text-gray-400 font-medium break-words hyphens-auto block">
                  {t("results.start_sum")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.startSum}
                  className="text-lg lg:text-xl font-semibold text-blue-400 leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                <div
                  className="h-full bg-blue-400 rounded-full"
                  style={{
                    width: `${(finalValues.startSum / finalValues.totalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-3 rounded-xl border border-gray-700/50 bg-gradient-to-br from-green-900/20 to-green-800/20 hover:from-green-900/30 hover:to-green-800/30 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-sm text-gray-400 font-medium break-words hyphens-auto block">
                  {t("results.total_savings")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.totalSavings}
                  className="text-lg lg:text-xl font-semibold text-green-400 leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                <div
                  className="h-full bg-green-400 rounded-full"
                  style={{
                    width: `${(finalValues.totalSavings / finalValues.theoreticalTotalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-3 rounded-xl border border-gray-700/50 bg-gradient-to-br from-purple-900/20 to-purple-800/20 hover:from-purple-900/30 hover:to-purple-800/30 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.5 }}
            >
              <div className="space-y-2 lg:flex-1">
                <Text className="text-sm text-gray-400 font-medium break-words hyphens-auto block">
                  {t("results.compound_returns")}
                </Text>
                <CurrencyDisplay
                  amount={finalValues.totalReturns}
                  className="text-lg lg:text-xl font-semibold text-purple-400 leading-relaxed break-words whitespace-nowrap block"
                  showDecimals={false}
                  size="lg"
                  variant="neutral"
                />
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                <div
                  className="h-full bg-purple-400 rounded-full"
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
                className="glass p-3 rounded-xl border border-gray-700/50 bg-gradient-to-br from-red-900/20 to-red-800/20 hover:from-red-900/30 hover:to-red-800/30 transition-all duration-300 lg:flex lg:flex-col lg:min-h-[140px]"
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.6 }}
              >
                <div className="space-y-2 lg:flex-1">
                  <Text className="text-sm text-gray-400 font-medium break-words hyphens-auto block">
                    {t("results.total_withdrawn")}
                  </Text>
                  <CurrencyDisplay
                    amount={finalValues.totalWithdrawn}
                    className="text-lg lg:text-xl font-semibold text-red-400 leading-relaxed break-words whitespace-nowrap block"
                    showDecimals={false}
                    size="lg"
                    variant="neutral"
                  />
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                  <div
                    className="h-full bg-red-400 rounded-full"
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
