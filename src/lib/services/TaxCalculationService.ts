import type { KommunData } from "../types";
import kommunalskattData from "@/data/kommunalskatt_2025.json";

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
   * Calculate net income from gross income with comprehensive tax calculation
   */
  calculateNetIncome(
    gross: number,
    isSecondary = false,
    selectedKommun?: string,
    includeChurchTax?: boolean
  ): TaxCalculationResult {
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
  }

  /**
   * Get the appropriate tax configuration based on parameters
   */
  private getTaxConfig(
    isSecondary: boolean,
    selectedKommun?: string,
    includeChurchTax?: boolean
  ): TaxCalculationConfig {
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
  }

  /**
   * Perform the actual tax calculation
   */
  private calculateTaxes(
    gross: number,
    config: TaxCalculationConfig
  ): TaxCalculationResult {
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
  }

  /**
   * Get available kommun options for selection
   */
  getKommunOptions(): KommunData[] {
    return this.kommunList;
  }

  /**
   * Find kommun data by name
   */
  findKommun(kommunNamn: string): KommunData | undefined {
    return this.kommunList.find((k) => k.kommunNamn === kommunNamn);
  }

  /**
   * Batch calculate net income for multiple income sources
   */
  calculateMultipleIncomes(
    incomes: Array<{
      amount: number;
      isSecondary?: boolean;
      selectedKommun?: string;
      includeChurchTax?: boolean;
    }>
  ): TaxCalculationResult[] {
    return incomes.map(
      ({ amount, isSecondary, selectedKommun, includeChurchTax }) =>
        this.calculateNetIncome(
          amount,
          isSecondary,
          selectedKommun,
          includeChurchTax
        )
    );
  }
}

// Export singleton instance
export const taxCalculationService = new TaxCalculationService();
