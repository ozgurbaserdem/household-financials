/**
 * Financial Health Score Calculation Utilities
 *
 * Pure business logic functions for calculating and categorizing
 * financial health metrics and recommendations.
 */

import type { FinancialHealthScore } from "@/lib/types";

/**
 * Determines the color class for score display based on score value.
 *
 * @param score - Score value (0-100)
 * @returns Tailwind CSS color class string
 *
 * @example
 * ```typescript
 * getScoreColor(85); // "text-green-600 dark:text-green-400"
 * getScoreColor(65); // "text-yellow-600 dark:text-yellow-400"
 * getScoreColor(45); // "text-red-600 dark:text-red-400"
 * ```
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

/**
 * Determines the progress bar color based on score value.
 *
 * @param score - Score value (0-100)
 * @returns Tailwind CSS background color class string
 *
 * @example
 * ```typescript
 * getProgressColor(85); // "bg-green-600 dark:bg-green-400"
 * getProgressColor(65); // "bg-yellow-600 dark:bg-yellow-400"
 * getProgressColor(45); // "bg-red-600 dark:bg-red-400"
 * ```
 */
export const getProgressColor = (score: number): string => {
  if (score >= 80) return "bg-green-600 dark:bg-green-400";
  if (score >= 60) return "bg-yellow-600 dark:bg-yellow-400";
  return "bg-red-600 dark:bg-red-400";
};

/**
 * Financial health score thresholds and categories.
 */
export const FINANCIAL_HEALTH_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  POOR: 0,
} as const;

/**
 * Categorizes a financial health score into a performance level.
 *
 * @param score - Financial health score (0-100)
 * @returns Performance category
 *
 * @example
 * ```typescript
 * categorizeScore(85); // "excellent"
 * categorizeScore(65); // "good"
 * categorizeScore(45); // "poor"
 * ```
 */
export const categorizeScore = (
  score: number
): "excellent" | "good" | "poor" => {
  if (score >= FINANCIAL_HEALTH_THRESHOLDS.EXCELLENT) return "excellent";
  if (score >= FINANCIAL_HEALTH_THRESHOLDS.GOOD) return "good";
  return "poor";
};

/**
 * Validates if a financial health score value is within acceptable range.
 *
 * @param score - Score value to validate
 * @returns True if score is between 0 and 100 (inclusive)
 *
 * @example
 * ```typescript
 * isValidScore(85); // true
 * isValidScore(-5); // false
 * isValidScore(105); // false
 * ```
 */
export const isValidScore = (score: number): boolean => {
  return Number.isFinite(score) && score >= 0 && score <= 100;
};

/**
 * Safely extracts display values from a financial health score object.
 *
 * @param score - Financial health score data
 * @returns Object with safe display values
 *
 * @example
 * ```typescript
 * const score = { overallScore: 85, metrics: { debtToIncomeRatio: 2.5 } };
 * getSafeDisplayValues(score);
 * // { overallScore: 85, debtToIncomeRatio: 2.5, ... }
 * ```
 */
export const getSafeDisplayValues = (score: FinancialHealthScore) => {
  const safeDisplay = (value: number | undefined) =>
    Number.isFinite(value) ? value : undefined;

  return {
    overallScore: Number.isFinite(score.overallScore) ? score.overallScore : 0,
    debtToIncomeRatio: safeDisplay(score.metrics.debtToIncomeRatio),
    emergencyFundCoverage: safeDisplay(score.metrics.emergencyFundCoverage),
    housingCostRatio: safeDisplay(score.metrics.housingCostRatio),
    discretionaryIncomeRatio: safeDisplay(
      score.metrics.discretionaryIncomeRatio
    ),
  };
};
