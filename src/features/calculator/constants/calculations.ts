// Constants for calculation defaults and magic numbers

export const CALCULATION_CONSTANTS = {
  // Default array index for single scenario calculations
  DEFAULT_SCENARIO_INDEX: 0,

  // Rounding precision for monetary values
  CURRENCY_ROUND_TO_NEAREST: 1,

  // Default fallback values
  DEFAULT_BUFFER_AMOUNT: 0,
  DEFAULT_SAVINGS_AMOUNT: 0,
} as const;

// Utility function for safe array access
export const getSafeArrayElement = <T>(
  array: T[],
  index: number,
  fallback: T
): T => {
  return array && array.length > index ? array[index] : fallback;
};
