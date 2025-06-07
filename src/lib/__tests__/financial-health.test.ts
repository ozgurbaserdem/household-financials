import {
  getScoreColor,
  getProgressColor,
  categorizeScore,
  isValidScore,
  getSafeDisplayValues,
  FINANCIAL_HEALTH_THRESHOLDS,
} from "../financial-health";
import type { FinancialHealthScore } from "../types";

describe("financial-health utilities", () => {
  describe("getScoreColor", () => {
    it("should return green for excellent scores (>= 80)", () => {
      expect(getScoreColor(80)).toBe("text-green-600 dark:text-green-400");
      expect(getScoreColor(85)).toBe("text-green-600 dark:text-green-400");
      expect(getScoreColor(100)).toBe("text-green-600 dark:text-green-400");
    });

    it("should return yellow for good scores (60-79)", () => {
      expect(getScoreColor(60)).toBe("text-yellow-600 dark:text-yellow-400");
      expect(getScoreColor(65)).toBe("text-yellow-600 dark:text-yellow-400");
      expect(getScoreColor(79)).toBe("text-yellow-600 dark:text-yellow-400");
    });

    it("should return red for poor scores (< 60)", () => {
      expect(getScoreColor(0)).toBe("text-red-600 dark:text-red-400");
      expect(getScoreColor(30)).toBe("text-red-600 dark:text-red-400");
      expect(getScoreColor(59)).toBe("text-red-600 dark:text-red-400");
    });
  });

  describe("getProgressColor", () => {
    it("should return green for excellent scores (>= 80)", () => {
      expect(getProgressColor(80)).toBe("bg-green-600 dark:bg-green-400");
      expect(getProgressColor(90)).toBe("bg-green-600 dark:bg-green-400");
    });

    it("should return yellow for good scores (60-79)", () => {
      expect(getProgressColor(60)).toBe("bg-yellow-600 dark:bg-yellow-400");
      expect(getProgressColor(70)).toBe("bg-yellow-600 dark:bg-yellow-400");
    });

    it("should return red for poor scores (< 60)", () => {
      expect(getProgressColor(40)).toBe("bg-red-600 dark:bg-red-400");
      expect(getProgressColor(59)).toBe("bg-red-600 dark:bg-red-400");
    });
  });

  describe("categorizeScore", () => {
    it("should categorize scores correctly", () => {
      expect(categorizeScore(85)).toBe("excellent");
      expect(categorizeScore(80)).toBe("excellent");

      expect(categorizeScore(70)).toBe("good");
      expect(categorizeScore(60)).toBe("good");

      expect(categorizeScore(50)).toBe("poor");
      expect(categorizeScore(0)).toBe("poor");
    });
  });

  describe("isValidScore", () => {
    it("should validate scores within range 0-100", () => {
      expect(isValidScore(0)).toBe(true);
      expect(isValidScore(50)).toBe(true);
      expect(isValidScore(100)).toBe(true);
    });

    it("should reject scores outside range", () => {
      expect(isValidScore(-1)).toBe(false);
      expect(isValidScore(101)).toBe(false);
    });

    it("should reject non-finite values", () => {
      expect(isValidScore(Infinity)).toBe(false);
      expect(isValidScore(-Infinity)).toBe(false);
      expect(isValidScore(NaN)).toBe(false);
    });
  });

  describe("getSafeDisplayValues", () => {
    const mockScore: FinancialHealthScore = {
      overallScore: 75,
      metrics: {
        debtToIncomeRatio: 2.5,
        emergencyFundCoverage: 0.8,
        housingCostRatio: 0.3,
        discretionaryIncomeRatio: 0.2,
      },
      recommendations: ["increase_emergency_fund"],
    };

    it("should return safe display values for valid score", () => {
      const result = getSafeDisplayValues(mockScore);

      expect(result.overallScore).toBe(75);
      expect(result.debtToIncomeRatio).toBe(2.5);
      expect(result.emergencyFundCoverage).toBe(0.8);
      expect(result.housingCostRatio).toBe(0.3);
      expect(result.discretionaryIncomeRatio).toBe(0.2);
    });

    it("should handle infinite values safely", () => {
      const scoreWithInfinite: FinancialHealthScore = {
        overallScore: Infinity,
        metrics: {
          debtToIncomeRatio: Infinity,
          emergencyFundCoverage: undefined,
          housingCostRatio: NaN,
          discretionaryIncomeRatio: 0.2,
        },
        recommendations: [],
      };

      const result = getSafeDisplayValues(scoreWithInfinite);

      expect(result.overallScore).toBe(0);
      expect(result.debtToIncomeRatio).toBeUndefined();
      expect(result.emergencyFundCoverage).toBeUndefined();
      expect(result.housingCostRatio).toBeUndefined();
      expect(result.discretionaryIncomeRatio).toBe(0.2);
    });
  });

  describe("FINANCIAL_HEALTH_THRESHOLDS", () => {
    it("should have correct threshold values", () => {
      expect(FINANCIAL_HEALTH_THRESHOLDS.EXCELLENT).toBe(80);
      expect(FINANCIAL_HEALTH_THRESHOLDS.GOOD).toBe(60);
      expect(FINANCIAL_HEALTH_THRESHOLDS.POOR).toBe(0);
    });
  });
});
