import { useState, useEffect, useCallback, useMemo } from "react";
import type { CalculatorState, CalculationResult } from "@/lib/types";
import { calculateLoanScenarios } from "@/lib/calculations";

interface UseDebouncedCalculationProps {
  calculatorState: CalculatorState;
  debounceMs?: number;
}

export function useDebouncedCalculation({
  calculatorState,
  debounceMs = 300,
}: UseDebouncedCalculationProps) {
  const [results, setResults] = useState<CalculationResult[]>([]);

  // Memoize the calculation function to prevent unnecessary recreations
  const calculateResults = useCallback(() => {
    const newResults = calculateLoanScenarios(calculatorState);
    setResults(newResults);
  }, [calculatorState]);

  // Debounced calculation effect
  useEffect(() => {
    const timeoutId = setTimeout(calculateResults, debounceMs);
    return () => clearTimeout(timeoutId);
  }, [calculateResults, debounceMs]);

  // Memoize the results to prevent unnecessary re-renders
  const memoizedResults = useMemo(() => results, [results]);

  return {
    results: memoizedResults,
  };
}
