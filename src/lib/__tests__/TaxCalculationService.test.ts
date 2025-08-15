import { describe, it, expect } from "vitest";

import { TaxCalculationService } from "@/shared/services/TaxCalculationService";

describe("TaxCalculationService", () => {
  const service = new TaxCalculationService();

  describe("calculateNetIncome", () => {
    describe("primary income calculations", () => {
      it("should calculate net income for primary income with default kommun tax", () => {
        const result = service.calculateNetIncome(50000, false);

        expect(result.gross).toBe(50000);
        expect(result.net).toBeGreaterThan(30000);
        expect(result.net).toBeLessThan(50000);
        expect(result.kommunalskatt).toBeGreaterThan(0);
        expect(result.statligSkatt).toBe(0); // Below threshold
      });

      it("should calculate net income for primary income with Stockholm kommun", () => {
        const result = service.calculateNetIncome(
          50000,
          false,
          "Stockholm",
          false
        );

        expect(result.gross).toBe(50000);
        expect(result.net).toBeGreaterThan(30000);
        expect(result.kommunalskatt).toBeGreaterThan(0);
        expect(result.statligSkatt).toBe(0);
      });

      it("should include church tax when requested", () => {
        const withoutChurch = service.calculateNetIncome(
          50000,
          false,
          "Stockholm",
          false
        );
        const withChurch = service.calculateNetIncome(
          50000,
          false,
          "Stockholm",
          true
        );

        // Church tax should result in higher total tax (thus lower net income)
        expect(withChurch.net).toBeLessThanOrEqual(withoutChurch.net);
        expect(withChurch.kommunalskatt).toBeGreaterThanOrEqual(
          withoutChurch.kommunalskatt
        );
      });

      it("should apply state tax for high income", () => {
        const result = service.calculateNetIncome(
          60000,
          false,
          "Stockholm",
          false
        );

        expect(result.statligSkatt).toBeGreaterThan(0);
        expect(result.gross).toBe(60000);
        expect(result.net).toBeLessThan(60000);
      });
    });

    describe("secondary income calculations", () => {
      it("should use default 34% tax rate for secondary income when no custom rate provided", () => {
        const result = service.calculateNetIncome(10000, true);

        expect(result.gross).toBe(10000);
        // With 34% tax rate, net should be approximately 6600
        expect(result.net).toBeCloseTo(6600, -2);
        expect(result.kommunalskatt).toBeCloseTo(3400, -2);
        expect(result.statligSkatt).toBe(0);
      });

      it("should use custom tax rate when provided", () => {
        const result25 = service.calculateNetIncome(
          10000,
          true,
          undefined,
          undefined,
          25
        );
        const result40 = service.calculateNetIncome(
          10000,
          true,
          undefined,
          undefined,
          40
        );

        // 25% tax rate
        expect(result25.net).toBeCloseTo(7500, -2);
        expect(result25.kommunalskatt).toBeCloseTo(2500, -2);

        // 40% tax rate
        expect(result40.net).toBeCloseTo(6000, -2);
        expect(result40.kommunalskatt).toBeCloseTo(4000, -2);

        // Lower tax rate should result in higher net income
        expect(result25.net).toBeGreaterThan(result40.net);
      });

      it("should not apply grundavdrag or jobbskatteavdrag to secondary income", () => {
        const primaryResult = service.calculateNetIncome(10000, false);
        const secondaryResult = service.calculateNetIncome(
          10000,
          true,
          undefined,
          undefined,
          31
        );

        // Secondary income should have higher tax burden due to no deductions
        expect(secondaryResult.net).toBeLessThan(primaryResult.net);
      });

      it("should handle edge cases for custom tax rates", () => {
        // Minimum rate (25%)
        const minResult = service.calculateNetIncome(
          10000,
          true,
          undefined,
          undefined,
          25
        );
        expect(minResult.net).toBeCloseTo(7500, -2);

        // Maximum rate (40%)
        const maxResult = service.calculateNetIncome(
          10000,
          true,
          undefined,
          undefined,
          40
        );
        expect(maxResult.net).toBeCloseTo(6000, -2);

        // Default rate when undefined
        const defaultResult = service.calculateNetIncome(10000, true);
        const explicitDefaultResult = service.calculateNetIncome(
          10000,
          true,
          undefined,
          undefined,
          34
        );
        expect(defaultResult.net).toBeCloseTo(explicitDefaultResult.net, 2);
      });
    });

    describe("zero and negative income handling", () => {
      it("should handle zero income", () => {
        const result = service.calculateNetIncome(0, false);

        expect(result.gross).toBe(0);
        expect(result.net).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.kommunalskatt).toBe(0);
        expect(result.statligSkatt).toBe(0);
      });

      it("should handle negative income", () => {
        const result = service.calculateNetIncome(-1000, false);

        expect(result.gross).toBe(0);
        expect(result.net).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.kommunalskatt).toBe(0);
        expect(result.statligSkatt).toBe(0);
      });
    });
  });

  describe("calculateMultipleIncomes", () => {
    it("should calculate multiple incomes with different tax treatments", () => {
      const incomes = [
        { amount: 40000, isSecondary: false, selectedKommun: "Stockholm" },
        { amount: 10000, isSecondary: true, secondaryIncomeTaxRate: 30 },
        { amount: 5000, isSecondary: true, secondaryIncomeTaxRate: 35 },
      ];

      const results = service.calculateMultipleIncomes(incomes);

      expect(results).toHaveLength(3);
      expect(results[0].gross).toBe(40000);
      expect(results[1].gross).toBe(10000);
      expect(results[2].gross).toBe(5000);

      // Secondary incomes should have different net amounts based on tax rates
      expect(results[1].net).toBeGreaterThan(results[2].net); // 30% vs 35%
    });

    it("should handle empty income array", () => {
      const results = service.calculateMultipleIncomes([]);
      expect(results).toHaveLength(0);
    });
  });

  describe("kommun data integration", () => {
    it("should find kommun data correctly", () => {
      // Use a kommun that definitely exists in the data
      const kommuns = service.getKommunOptions();
      expect(kommuns.length).toBeGreaterThan(0);

      const firstKommun = kommuns[0];
      const found = service.findKommun(firstKommun.kommunNamn);
      expect(found).toBeDefined();
      expect(found?.kommunNamn).toBe(firstKommun.kommunNamn);
      expect(found?.kommunalSkatt).toBeGreaterThan(0);
    });

    it("should return undefined for non-existent kommun", () => {
      const nonExistent = service.findKommun("NonExistentKommun");
      expect(nonExistent).toBeUndefined();
    });

    it("should get all kommun options", () => {
      const kommuner = service.getKommunOptions();
      expect(kommuner.length).toBeGreaterThan(0);
      expect(kommuner[0]).toHaveProperty("kommunNamn");
      expect(kommuner[0]).toHaveProperty("kommunalSkatt");
    });
  });

  describe("tax configuration", () => {
    it("should use different tax configurations for primary vs secondary income", () => {
      const primaryResult = service.calculateNetIncome(20000, false);
      const secondaryResult = service.calculateNetIncome(20000, true);

      // Secondary income should generally have higher effective tax rate
      const primaryEffectiveRate =
        (primaryResult.gross - primaryResult.net) / primaryResult.gross;
      const secondaryEffectiveRate =
        (secondaryResult.gross - secondaryResult.net) / secondaryResult.gross;

      expect(secondaryEffectiveRate).toBeGreaterThan(primaryEffectiveRate);
    });
  });
});
