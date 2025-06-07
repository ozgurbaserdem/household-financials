import {
  formatPercent,
  formatDTIRatio,
  formatCurrencyNoDecimals,
  formatCompactCurrency,
  safeDisplay,
} from "../formatting";

describe("formatting utilities", () => {
  describe("formatPercent", () => {
    it("should format decimal values as percentages with 1 decimal place", () => {
      expect(formatPercent(0.254)).toBe("25.4%");
      expect(formatPercent(0.15)).toBe("15.0%");
      expect(formatPercent(0.0)).toBe("0.0%");
      expect(formatPercent(1.0)).toBe("100.0%");
    });

    it("should handle edge cases", () => {
      expect(formatPercent(0.999)).toBe("99.9%");
      expect(formatPercent(0.001)).toBe("0.1%");
    });
  });

  describe("formatDTIRatio", () => {
    it("should format DTI ratio with 1 decimal place and x suffix", () => {
      expect(formatDTIRatio(2.5)).toBe("2.5x");
      expect(formatDTIRatio(1.23)).toBe("1.2x");
      expect(formatDTIRatio(0.8)).toBe("0.8x");
    });

    it("should handle whole numbers", () => {
      expect(formatDTIRatio(3)).toBe("3.0x");
      expect(formatDTIRatio(1)).toBe("1.0x");
    });
  });

  describe("formatCurrencyNoDecimals", () => {
    it("should format currency without decimal places", () => {
      const result = formatCurrencyNoDecimals(123456.78);
      expect(result).toMatch(/123.*457.*kr/); // Should round to 123 457 kr
    });

    it("should use non-breaking space before kr", () => {
      const result = formatCurrencyNoDecimals(1000);
      expect(result).toContain("\u00A0kr"); // Non-breaking space
    });

    it("should handle zero amount", () => {
      const result = formatCurrencyNoDecimals(0);
      expect(result).toMatch(/0.*kr/);
    });

    it("should handle large amounts", () => {
      const result = formatCurrencyNoDecimals(5000000);
      expect(result).toMatch(/5.*000.*000.*kr/);
    });
  });

  describe("formatCompactCurrency", () => {
    it("should format millions with m suffix", () => {
      expect(formatCompactCurrency(1500000)).toBe("1.5m");
      expect(formatCompactCurrency(10000000)).toBe("10m");
      expect(formatCompactCurrency(2300000)).toBe("2.3m");
    });

    it("should format thousands with k suffix", () => {
      expect(formatCompactCurrency(25000)).toBe("25k");
      expect(formatCompactCurrency(1500)).toBe("1.5k");
      expect(formatCompactCurrency(10000)).toBe("10k");
    });

    it("should return string for values under 1000", () => {
      expect(formatCompactCurrency(500)).toBe("500");
      expect(formatCompactCurrency(99)).toBe("99");
      expect(formatCompactCurrency(0)).toBe("0");
    });

    it("should handle edge cases", () => {
      expect(formatCompactCurrency(1000)).toBe("1.0k");
      expect(formatCompactCurrency(1000000)).toBe("1.0m");
      expect(formatCompactCurrency(999999)).toBe("1000k");
    });
  });

  describe("safeDisplay", () => {
    it("should return finite numbers unchanged", () => {
      expect(safeDisplay(42)).toBe(42);
      expect(safeDisplay(0)).toBe(0);
      expect(safeDisplay(-5.5)).toBe(-5.5);
    });

    it("should return undefined for non-finite values", () => {
      expect(safeDisplay(Infinity)).toBeUndefined();
      expect(safeDisplay(-Infinity)).toBeUndefined();
      expect(safeDisplay(NaN)).toBeUndefined();
    });

    it("should return undefined for undefined input", () => {
      expect(safeDisplay(undefined)).toBeUndefined();
    });
  });
});
