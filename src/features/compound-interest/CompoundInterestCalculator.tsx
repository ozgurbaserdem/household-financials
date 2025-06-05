"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";
const formatCurrencyNoDecimals = (amount: number): string => {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
import {
  calculateCompoundInterest,
  calculateFinalValues,
  type CompoundInterestInputs,
} from "@/lib/compound-interest";
import { CompoundInterestChart } from "@/features/charts/CompoundInterestChart";
import { motion } from "framer-motion";

export function CompoundInterestCalculator() {
  const t = useTranslations("compound_interest");
  const searchParams = useSearchParams();

  // Get initial values from URL parameters
  const initialMonthlySavings = searchParams.get("monthlySavings");

  const [inputs, setInputs] = useState<CompoundInterestInputs>({
    startSum: 0,
    monthlySavings: initialMonthlySavings
      ? parseInt(initialMonthlySavings)
      : 5000,
    yearlyReturn: 7,
    investmentHorizon: 20,
  });

  const [editingField, setEditingField] = useState<
    keyof CompoundInterestInputs | null
  >(null);
  const [tempValue, setTempValue] = useState<string>("");
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
      max: 1000000000,
      step: 10000,
      prefix: "",
      suffix: " kr",
    },
    {
      key: "monthlySavings" as const,
      label: t("inputs.monthly_savings_label"),
      description: t("inputs.monthly_savings_description"),
      min: 0,
      max: 10000000,
      step: 500,
      prefix: "",
      suffix: " kr/mån",
    },
    {
      key: "yearlyReturn" as const,
      label: t("inputs.yearly_return_label"),
      description: t("inputs.yearly_return_description"),
      min: 0,
      max: 1000,
      step: 0.5,
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
    setTempValue(inputs[field].toString());
  };

  const handleEditEnd = (field: keyof CompoundInterestInputs) => {
    const numValue = parseFloat(tempValue.replace(/[^\d.-]/g, ""));
    if (!isNaN(numValue)) {
      // Find the config for this field to apply min/max constraints
      const config = inputConfigs.find((c) => c.key === field);
      if (config) {
        const clampedValue = Math.max(
          config.min,
          Math.min(config.max, numValue)
        );
        handleInputChange(field, clampedValue);
      } else {
        handleInputChange(field, numValue);
      }
    }
    setEditingField(null);
    setTempValue("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    field: keyof CompoundInterestInputs
  ) => {
    if (e.key === "Enter") {
      handleEditEnd(field);
    } else if (e.key === "Escape") {
      setEditingField(null);
      setTempValue("");
    }
  };

  return (
    <Box className="space-y-6">
      {/* Input Controls */}
      <Card gradient glass>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`space-y-2 ${
                  highlightedField === config.key
                    ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-950 rounded-lg p-4 bg-purple-500/10"
                    : ""
                }`}
              >
                <div className="space-y-1">
                  <Label
                    htmlFor={config.key}
                    className="text-sm font-medium text-gray-200 block"
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
                      id={config.key}
                      type="range"
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      value={inputs[config.key]}
                      onChange={(e) =>
                        handleInputChange(config.key, Number(e.target.value))
                      }
                      className="flex-1 h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider-custom"
                      style={{
                        background: `linear-gradient(to right, 
                          rgb(59 130 246) 0%, 
                          rgb(147 51 234) ${((inputs[config.key] - config.min) / (config.max - config.min)) * 100}%, 
                          rgb(55 65 81) ${((inputs[config.key] - config.min) / (config.max - config.min)) * 100}%, 
                          rgb(55 65 81) 100%)`,
                      }}
                    />
                    <div className="flex-shrink-0">
                      {editingField === config.key ? (
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          onBlur={() => handleEditEnd(config.key)}
                          onKeyDown={(e) => handleKeyDown(e, config.key)}
                          className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-blue-400 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-28 text-center text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-blue-400/50"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => handleEditStart(config.key)}
                          className="glass px-2 py-1 rounded-lg bg-gray-900/80 border border-gray-700 hover:border-blue-400/50 transition-all duration-200 hover:bg-gray-900/90 w-28 text-center cursor-text"
                        >
                          <Text className="text-sm font-semibold text-white">
                            {config.prefix}
                            {inputs[config.key].toLocaleString("sv-SE")}
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
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Card gradient glass>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:from-gray-800/60 hover:to-gray-900/60 transition-all duration-300 min-h-[140px] flex flex-col"
            >
              <div className="flex-1 space-y-2">
                <Text className="text-sm text-gray-400 font-medium block">
                  {t("results.total_value")}
                </Text>
                <Text className="text-xl lg:text-2xl font-bold text-white leading-relaxed break-words block">
                  {formatCurrencyNoDecimals(finalValues.totalValue)}
                </Text>
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-4">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-xl border border-gray-700/50 bg-gradient-to-br from-blue-900/20 to-blue-800/20 hover:from-blue-900/30 hover:to-blue-800/30 transition-all duration-300 min-h-[140px] flex flex-col"
            >
              <div className="flex-1 space-y-2">
                <Text className="text-sm text-gray-400 font-medium block">
                  {t("results.start_sum")}
                </Text>
                <Text className="text-lg lg:text-xl font-semibold text-blue-400 leading-relaxed break-words block">
                  {formatCurrencyNoDecimals(finalValues.startSum)}
                </Text>
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-4">
                <div
                  className="h-full bg-blue-400 rounded-full"
                  style={{
                    width: `${(finalValues.startSum / finalValues.totalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="glass p-6 rounded-xl border border-gray-700/50 bg-gradient-to-br from-green-900/20 to-green-800/20 hover:from-green-900/30 hover:to-green-800/30 transition-all duration-300 min-h-[140px] flex flex-col"
            >
              <div className="flex-1 space-y-2">
                <Text className="text-sm text-gray-400 font-medium block">
                  {t("results.total_savings")}
                </Text>
                <Text className="text-lg lg:text-xl font-semibold text-green-400 leading-relaxed break-words block">
                  {formatCurrencyNoDecimals(finalValues.totalSavings)}
                </Text>
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-4">
                <div
                  className="h-full bg-green-400 rounded-full"
                  style={{
                    width: `${(finalValues.totalSavings / finalValues.totalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="glass p-6 rounded-xl border border-gray-700/50 bg-gradient-to-br from-purple-900/20 to-purple-800/20 hover:from-purple-900/30 hover:to-purple-800/30 transition-all duration-300 min-h-[140px] flex flex-col"
            >
              <div className="flex-1 space-y-2">
                <Text className="text-sm text-gray-400 font-medium block">
                  {t("results.compound_returns")}
                </Text>
                <Text className="text-lg lg:text-xl font-semibold text-purple-400 leading-relaxed break-words block">
                  {formatCurrencyNoDecimals(finalValues.totalReturns)}
                </Text>
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-4">
                <div
                  className="h-full bg-purple-400 rounded-full"
                  style={{
                    width: `${(finalValues.totalReturns / finalValues.totalValue) * 100}%`,
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Growth Summary */}
          <div className="mt-6 p-6 glass rounded-xl border border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-gray-900/30">
            <Text className="text-sm text-gray-300 text-center leading-relaxed max-w-4xl mx-auto">
              {t("results.growth_summary", {
                startSum: formatCurrencyNoDecimals(finalValues.startSum),
                totalSavings: formatCurrencyNoDecimals(
                  finalValues.totalSavings
                ),
                returns: formatCurrencyNoDecimals(finalValues.totalReturns),
                total: formatCurrencyNoDecimals(finalValues.totalValue),
                years: inputs.investmentHorizon,
              })}
            </Text>
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
}
