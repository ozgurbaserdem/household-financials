"use client";

import { Box } from "@/components/ui/Box";
import { CompoundInterestChart } from "@/features/charts/CompoundInterestChart";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { InputSection } from "./components/InputSection";
import { ResultsSection } from "./components/ResultsSection";
import { useCompoundInterest } from "./hooks/useCompoundInterest";

export const CompoundInterestCalculator = () => {
  const {
    inputs,
    highlightedField,
    chartData,
    finalValues,
    handleInputChange,
    handleWithdrawalToggle,
    handleWithdrawalTypeChange,
  } = useCompoundInterest();

  return (
    <ErrorBoundary>
      <Box className="space-y-6">
        <InputSection
          highlightedField={highlightedField}
          inputs={inputs}
          onInputChange={handleInputChange}
          onWithdrawalToggle={handleWithdrawalToggle}
          onWithdrawalTypeChange={handleWithdrawalTypeChange}
        />

        <ResultsSection
          finalValues={finalValues}
          investmentHorizon={inputs.investmentHorizon}
        />

        <CompoundInterestChart
          data={chartData}
          isVisible={chartData.length > 0}
        />
      </Box>
    </ErrorBoundary>
  );
};
