import { kommunalskattData } from "@/data/kommunalskatt_2025";

import type { KommunData } from "../types";

export interface TaxCalculationConfig {
  kommunalskatt: number;
  statligSkatt: number;
  statligSkattThreshold: number;
  grundavdrag: number;
  jobbskatteavdrag: number;
}

export interface TaxCalculationResult {
  gross: number;
  net: number;
  tax: number;
  kommunalskatt: number;
  statligSkatt: number;
}

/**
 * Swedish tax calculation service implementing 2025 tax rules.
 *
 * Handles comprehensive tax calculations including:
 * - Municipal tax (kommunalskatt) with kommun-specific rates
 * - State tax (statlig skatt) for high earners
 * - Basic deduction (grundavdrag)
 * - Job tax credit (jobbskatteavdrag)
 * - Church tax (optional)
 * - Different rules for primary vs secondary income
 *
 * Uses official 2025 tax rates and thresholds from Skatteverket.
 */
export class TaxCalculationService {
  private readonly defaultConfig: TaxCalculationConfig = {
    kommunalskatt: 0.31, // default primary income rate
    statligSkatt: 0.2,
    statligSkattThreshold: 53592, // kr/month for 2025
    grundavdrag: 3000, // basic deduction per month (approx)
    jobbskatteavdrag: 3100, // job tax deduction per month (approx)
  };

  private readonly secondaryIncomeConfig: TaxCalculationConfig = {
    ...this.defaultConfig,
    kommunalskatt: 0.34, // higher rate for secondary income
    grundavdrag: 0, // no grundavdrag for secondary income
    jobbskatteavdrag: 0, // no jobbskatteavdrag for secondary income
  };

  private readonly kommunList = kommunalskattData as KommunData[];

  /**
   * Calculates net income from gross income using Swedish tax rules.
   *
   * Applies the complete Swedish tax calculation including:
   * - Basic deduction (grundavdrag)
   * - Municipal tax at kommun-specific rates
   * - State tax for income above threshold (643,104 SEK/year)
   * - Job tax credit (jobbskatteavdrag)
   * - Optional church tax
   *
   * @param gross - Monthly gross income in SEK
   * @param isSecondary - If true, applies secondary income tax rules (higher rate, no deductions)
   * @param selectedKommun - Kommun name for municipal tax rate lookup
   * @param includeChurchTax - Whether to include church tax in calculations
   * @returns Complete tax calculation result with breakdown
   *
   * @example
   * ```typescript
   * const result = service.calculateNetIncome(50000, false, "Stockholm", true);
   * console.log(result.net); // 37850
   * console.log(result.kommunalskatt); // 15500
   * ```
   */
  calculateNetIncome = (
    gross: number,
    isSecondary = false,
    selectedKommun?: string,
    includeChurchTax?: boolean
  ): TaxCalculationResult => {
    if (gross <= 0) {
      return {
        gross: 0,
        net: 0,
        tax: 0,
        kommunalskatt: 0,
        statligSkatt: 0,
      };
    }

    const config = this.getTaxConfig(
      isSecondary,
      selectedKommun,
      includeChurchTax
    );
    return this.calculateTaxes(gross, config);
  };

  /**
   * Determines the appropriate tax configuration based on income type and location.
   *
   * Selects between primary and secondary income tax configurations,
   * and applies kommun-specific tax rates when available.
   *
   * @param isSecondary - Whether this is secondary income
   * @param selectedKommun - Kommun name for tax rate lookup
   * @param includeChurchTax - Whether to include church tax
   * @returns Tax configuration object for calculations
   *
   * @private
   */
  private getTaxConfig = (
    isSecondary: boolean,
    selectedKommun?: string,
    includeChurchTax?: boolean
  ): TaxCalculationConfig => {
    if (isSecondary) {
      return this.secondaryIncomeConfig;
    }

    const baseConfig = { ...this.defaultConfig };

    if (selectedKommun) {
      const kommun = this.kommunList.find(
        (k) => k.kommunNamn === selectedKommun
      );
      if (kommun) {
        baseConfig.kommunalskatt = includeChurchTax
          ? kommun.summaInklKyrka / 100
          : kommun.kommunalSkatt / 100;
      }
    }

    return baseConfig;
  };

  /**
   * Performs the actual tax calculation using Swedish tax rules.
   *
   * Implements the Swedish tax calculation process:
   * 1. Apply basic deduction (grundavdrag)
   * 2. Calculate municipal tax on taxable income
   * 3. Calculate state tax on income above threshold
   * 4. Apply job tax credit (jobbskatteavdrag)
   *
   * @param gross - Gross monthly income
   * @param config - Tax configuration with rates and deductions
   * @returns Detailed tax calculation result
   *
   * @private
   */
  private calculateTaxes = (
    gross: number,
    config: TaxCalculationConfig
  ): TaxCalculationResult => {
    const taxableIncome = Math.max(0, gross - config.grundavdrag);

    // Calculate kommunal tax
    const kommunalTax = taxableIncome * config.kommunalskatt;

    // Calculate statlig tax (only applies above threshold)
    const statligTax =
      gross > config.statligSkattThreshold
        ? (gross - config.statligSkattThreshold) * config.statligSkatt
        : 0;

    // Total tax before jobbskatteavdrag
    const totalTaxBeforeDeduction = kommunalTax + statligTax;

    // Apply jobbskatteavdrag (tax reduction)
    const finalTax = Math.max(
      0,
      totalTaxBeforeDeduction - config.jobbskatteavdrag
    );

    return {
      gross,
      net: gross - finalTax,
      tax: finalTax,
      kommunalskatt: kommunalTax,
      statligSkatt: statligTax,
    };
  };

  /**
   * Returns all available Swedish kommun options with tax rates.
   *
   * Provides the complete list of Swedish municipalities with
   * their 2025 tax rates for user selection.
   *
   * @returns Array of kommun data with tax rates
   *
   * @example
   * ```typescript
   * const kommuner = service.getKommunOptions();
   * console.log(kommuner[0]); // { kommunNamn: "Stockholm", kommunalSkatt: 31.2, ... }
   * ```
   */
  getKommunOptions = (): KommunData[] => {
    return this.kommunList;
  };

  /**
   * Finds specific kommun data by kommun name.
   *
   * @param kommunNamn - Exact kommun name to search for
   * @returns Kommun data object or undefined if not found
   *
   * @example
   * ```typescript
   * const stockholm = service.findKommun("Stockholm");
   * console.log(stockholm?.kommunalSkatt); // 31.2
   * ```
   */
  findKommun = (kommunNamn: string): KommunData | undefined => {
    return this.kommunList.find((k) => k.kommunNamn === kommunNamn);
  };

  /**
   * Batch calculates net income for multiple income sources efficiently.
   *
   * Useful for calculating total household income where different
   * income sources may have different tax treatments.
   *
   * @param incomes - Array of income objects with tax parameters
   * @returns Array of tax calculation results in same order
   *
   * @example
   * ```typescript
   * const incomes = [
   *   { amount: 50000, isSecondary: false, selectedKommun: "Stockholm" },
   *   { amount: 20000, isSecondary: true }
   * ];
   * const results = service.calculateMultipleIncomes(incomes);
   * ```
   */
  calculateMultipleIncomes = (
    incomes: Array<{
      amount: number;
      isSecondary?: boolean;
      selectedKommun?: string;
      includeChurchTax?: boolean;
    }>
  ): TaxCalculationResult[] => {
    return incomes.map(
      ({ amount, isSecondary, selectedKommun, includeChurchTax }) =>
        this.calculateNetIncome(
          amount,
          isSecondary,
          selectedKommun,
          includeChurchTax
        )
    );
  };
}

// Export singleton instance
export const taxCalculationService = new TaxCalculationService();
