import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

import {
  calculateCompoundInterest,
  calculateFinalValues,
  type CompoundInterestInputs,
} from "@/lib/compound-interest";

import { HIGHLIGHT_TIMEOUT } from "../constants";

const parseUrlParameter = (param: string | null, fallback: number): number => {
  if (!param) return fallback;
  const parsed = Number.parseInt(param, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const useCompoundInterest = () => {
  const searchParameters = useSearchParams();

  // Parse URL parameters with validation
  const initialMonthlySavings = searchParameters.get("monthlySavings");
  const initialStartSum = searchParameters.get("startSum");

  const [inputs, setInputs] = useState<CompoundInterestInputs>({
    startSum: parseUrlParameter(initialStartSum, 0),
    monthlySavings: parseUrlParameter(initialMonthlySavings, 5000),
    yearlyReturn: 7,
    investmentHorizon: 20,
    age: 30,
    withdrawalType: "none",
    withdrawalYear: 10,
    withdrawalAmount: 100000,
    withdrawalPercentage: 10,
    annualSavingsIncrease: 0,
  });

  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  // Highlight fields if they came from URL with proper cleanup
  useEffect(() => {
    if (initialMonthlySavings || initialStartSum) {
      // Prioritize startSum if both are present
      setHighlightedField(initialStartSum ? "startSum" : "monthlySavings");

      const timer = setTimeout(() => {
        setHighlightedField(null);
      }, HIGHLIGHT_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [initialMonthlySavings, initialStartSum]);

  // Convert inputs with percentage calculation once
  const convertedInputs = useMemo(
    () => ({
      ...inputs,
      yearlyReturn: inputs.yearlyReturn / 100,
    }),
    [inputs]
  );

  const chartData = useMemo(() => {
    try {
      return calculateCompoundInterest(convertedInputs);
    } catch (error) {
      console.error("Error calculating compound interest:", error);
      return [];
    }
  }, [convertedInputs]);

  const finalValues = useMemo(() => {
    try {
      return calculateFinalValues(convertedInputs);
    } catch (error) {
      console.error("Error calculating final values:", error);
      return {
        totalValue: 0,
        startSum: inputs.startSum,
        totalSavings: 0,
        totalReturns: 0,
        totalWithdrawn: 0,
        theoreticalTotalValue: 0,
      };
    }
  }, [convertedInputs, inputs.startSum]);

  const handleInputChange = (
    field: keyof CompoundInterestInputs,
    value: number
  ) => {
    setInputs((previousInputs) => ({
      ...previousInputs,
      [field]: value,
    }));
  };

  const handleWithdrawalToggle = (enabled: boolean) => {
    setInputs((previousInputs) => ({
      ...previousInputs,
      withdrawalType: enabled ? "percentage" : "none",
    }));
  };

  const handleWithdrawalTypeChange = (
    type: CompoundInterestInputs["withdrawalType"]
  ) => {
    setInputs((previousInputs) => ({
      ...previousInputs,
      withdrawalType: type,
    }));
  };

  return {
    inputs,
    highlightedField,
    chartData,
    finalValues,
    handleInputChange,
    handleWithdrawalToggle,
    handleWithdrawalTypeChange,
  };
};
