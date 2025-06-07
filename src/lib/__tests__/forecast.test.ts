import {
  calculateForecast,
  calculateLoanPayoffYears,
  calculateTotalInterest,
  calculateAverageMonthlySavings,
  validateForecastInputs,
  FORECAST_DEFAULTS,
} from "../forecast";
import type { CalculatorState } from "../types";

describe("forecast utilities", () => {
  const mockCalculatorState: CalculatorState = {
    loanParameters: {
      hasLoan: true,
      amount: 1000000, // 1M SEK
      interestRate: 3.0, // 3%
      amortizationRate: 2.0, // 2%
    },
    income: {
      income1: 35000, // 35k SEK/month gross
      income2: 0,
      secondaryIncome1: 0,
      secondaryIncome2: 0,
      childBenefits: 0,
      otherBenefits: 0,
      otherIncomes: 0,
      currentBuffer: 0,
      numberOfAdults: "1",
      selectedKommun: "Stockholm",
      includeChurchTax: false,
    },
    expenses: {
      housing: { rent: 0, utilities: 2000 },
      food: { groceries: 3000, diningOut: 1000 },
      transportation: { publicTransport: 500, fuel: 0, carPayment: 0 },
      healthcare: { insurance: 800, medical: 500 },
      entertainment: { subscriptions: 300, hobbies: 1000 },
      personal: { clothing: 500, personalCare: 300 },
      family: { childcare: 0, education: 0 },
      savings: { emergency: 2000, investments: 5000 },
      insurance: { life: 200, other: 100 },
      debt: { creditCard: 0, otherDebt: 0 },
      miscellaneous: { gifts: 200, other: 300 },
      taxes: { propertyTax: 0, otherTaxes: 0 },
      business: { equipment: 0, services: 0 },
    },
    expenseViewMode: "detailed" as const,
    totalExpenses: 0,
  };

  describe("calculateForecast", () => {
    it("should calculate forecast data correctly", () => {
      const forecast = calculateForecast(mockCalculatorState);

      expect(forecast).toHaveLength(50); // Should hit max years
      expect(forecast[0].year).toBe(0);
      expect(forecast[0].remainingLoan).toBe(1000000);

      // Loan should decrease over time
      expect(forecast[10].remainingLoan).toBeLessThan(
        forecast[0].remainingLoan
      );
    });

    it("should return empty array for invalid loan amount", () => {
      const stateWithoutLoan = {
        ...mockCalculatorState,
        loanParameters: { ...mockCalculatorState.loanParameters, amount: 0 },
      };

      const forecast = calculateForecast(stateWithoutLoan);
      expect(forecast).toEqual([]);
    });

    it("should respect custom salary increase rate", () => {
      const forecast = calculateForecast(mockCalculatorState, 0.05); // 5% increase

      expect(forecast[1].monthlyIncome).toBeGreaterThan(
        forecast[0].monthlyIncome
      );
      const expectedIncrease = forecast[0].monthlyIncome * 1.05;
      expect(forecast[1].monthlyIncome).toBeCloseTo(expectedIncrease, -2);
    });

    it("should respect max years parameter", () => {
      const forecast = calculateForecast(mockCalculatorState, 0.025, 10);

      expect(forecast.length).toBeLessThanOrEqual(10);
    });
  });

  describe("calculateLoanPayoffYears", () => {
    it("should calculate correct payoff years", () => {
      const years = calculateLoanPayoffYears(mockCalculatorState);
      expect(years).toBeGreaterThan(0);
      expect(years).toBeLessThanOrEqual(50);
    });

    it("should return 0 for no loan", () => {
      const stateWithoutLoan = {
        ...mockCalculatorState,
        loanParameters: { ...mockCalculatorState.loanParameters, amount: 0 },
      };

      const years = calculateLoanPayoffYears(stateWithoutLoan);
      expect(years).toBe(0);
    });
  });

  describe("calculateTotalInterest", () => {
    it("should calculate total interest correctly", () => {
      const totalInterest = calculateTotalInterest(mockCalculatorState);
      expect(totalInterest).toBeGreaterThan(0);

      // Interest should be reasonable amount (less than principal for normal loans)
      expect(totalInterest).toBeLessThan(
        mockCalculatorState.loanParameters.amount * 2
      );
    });
  });

  describe("calculateAverageMonthlySavings", () => {
    it("should calculate average monthly savings", () => {
      const avgSavings = calculateAverageMonthlySavings(mockCalculatorState);
      expect(typeof avgSavings).toBe("number");
      expect(avgSavings).toBeGreaterThanOrEqual(0);
    });

    it("should return 0 for no loan", () => {
      const stateWithoutLoan = {
        ...mockCalculatorState,
        loanParameters: { ...mockCalculatorState.loanParameters, amount: 0 },
      };

      const avgSavings = calculateAverageMonthlySavings(stateWithoutLoan);
      expect(avgSavings).toBe(0);
    });
  });

  describe("validateForecastInputs", () => {
    it("should validate valid calculator state", () => {
      expect(validateForecastInputs(mockCalculatorState)).toBe(true);
    });

    it("should reject state without loan amount", () => {
      const invalidState = {
        ...mockCalculatorState,
        loanParameters: { ...mockCalculatorState.loanParameters, amount: 0 },
      };

      expect(validateForecastInputs(invalidState)).toBe(false);
    });

    it("should reject state with invalid interest rate", () => {
      const invalidState = {
        ...mockCalculatorState,
        loanParameters: {
          ...mockCalculatorState.loanParameters,
          interestRate: 0,
        },
      };

      expect(validateForecastInputs(invalidState)).toBe(false);
    });

    it("should reject state with invalid amortization rate", () => {
      const invalidState = {
        ...mockCalculatorState,
        loanParameters: {
          ...mockCalculatorState.loanParameters,
          amortizationRate: 0,
        },
      };

      expect(validateForecastInputs(invalidState)).toBe(false);
    });
  });

  describe("FORECAST_DEFAULTS", () => {
    it("should have correct default values", () => {
      expect(FORECAST_DEFAULTS.SALARY_INCREASE_RATE).toBe(0.025);
      expect(FORECAST_DEFAULTS.MAX_FORECAST_YEARS).toBe(50);
    });
  });
});
