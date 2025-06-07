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

/**
 * Formats a decimal value as a percentage string with 1 decimal place.
 *
 * @param value - Decimal value (e.g., 0.25 for 25%)
 * @returns Formatted percentage string with 1 decimal place
 *
 * @example
 * ```typescript
 * formatPercent(0.254); // "25.4%"
 * formatPercent(0.15); // "15.0%"
 * ```
 */
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Formats debt-to-income ratio as a multiplier (e.g., "2.5x").
 *
 * @param value - DTI ratio value
 * @returns Formatted ratio string with 1 decimal place and "x" suffix
 *
 * @example
 * ```typescript
 * formatDTIRatio(2.5); // "2.5x"
 * formatDTIRatio(1.23); // "1.2x"
 * ```
 */
export const formatDTIRatio = (value: number): string => {
  return `${value.toFixed(1)}x`;
};

/**
 * Formats a number as Swedish currency (SEK) with no decimal places.
 *
 * Uses Swedish locale formatting with proper currency symbol placement
 * and non-breaking space before "kr" to prevent line breaks.
 *
 * @param amount - The monetary amount to format
 * @returns Formatted currency string without decimals
 *
 * @example
 * ```typescript
 * formatCurrencyNoDecimals(123456.78); // "123 457 kr"
 * formatCurrencyNoDecimals(1000); // "1 000 kr"
 * ```
 */
export const formatCurrencyNoDecimals = (amount: number): string => {
  const formatted = new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  // Replace regular space with non-breaking space before "kr" to prevent line breaks
  return formatted.replace(/\s+kr$/, "\u00A0kr");
};

/**
 * Formats currency in a compact format for chart display.
 *
 * Converts large numbers to abbreviated format (k for thousands, m for millions)
 * for better display in charts and compact UI elements.
 *
 * @param value - The monetary value to format
 * @returns Compact formatted string
 *
 * @example
 * ```typescript
 * formatCompactCurrency(1500000); // "1.5m"
 * formatCompactCurrency(25000); // "25k"
 * formatCompactCurrency(500); // "500"
 * ```
 */
export const formatCompactCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}m`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return value.toString();
};

/**
 * Safely handles potentially undefined or infinite numeric values for display.
 *
 * @param value - Numeric value that might be undefined or infinite
 * @returns The value if finite, undefined otherwise
 *
 * @example
 * ```typescript
 * safeDisplay(42); // 42
 * safeDisplay(Infinity); // undefined
 * safeDisplay(undefined); // undefined
 * ```
 */
export const safeDisplay = (value: number | undefined): number | undefined => {
  return Number.isFinite(value) ? value : undefined;
};
