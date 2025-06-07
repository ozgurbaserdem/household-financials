/**
 * Formats a number as Swedish currency (SEK) with proper localization.
 *
 * Uses Swedish locale formatting (sv-SE) with automatic currency symbol
 * and appropriate decimal places for Swedish krona display.
 *
 * @param amount - The monetary amount to format
 * @returns Formatted currency string (e.g., "123 456 kr")
 *
 * @example
 * ```typescript
 * formatCurrency(123456.78); // "123 457 kr"
 * formatCurrency(1000); // "1 000 kr"
 * ```
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  }).format(amount);
};

/**
 * Formats a number as a percentage with Swedish localization.
 *
 * Converts the input value (expected as a percentage) to decimal format
 * and applies Swedish locale formatting with comma decimal separator.
 *
 * @param value - The percentage value (e.g., 5.5 for 5.5%)
 * @returns Formatted percentage string with 2 decimal places (e.g., "5,50 %")
 *
 * @example
 * ```typescript
 * formatPercentage(5.5); // "5,50 %"
 * formatPercentage(12.345); // "12,35 %"
 * ```
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("sv-SE", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

/**
 * Formats a number with Swedish locale conventions.
 *
 * Applies Swedish number formatting with space as thousand separator
 * and comma as decimal separator, following Swedish standards.
 *
 * @param value - The number to format
 * @returns Formatted number string (e.g., "123 456,78")
 *
 * @example
 * ```typescript
 * formatNumber(123456.78); // "123 456,78"
 * formatNumber(1000); // "1 000"
 * ```
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("sv-SE").format(value);
};
