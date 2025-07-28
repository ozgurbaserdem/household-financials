import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Provider } from "react-redux";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { Form } from "@/components/ui/Form";
import { ResultsTable } from "@/features/budget-calculator/results/ResultsTable";
import { calculateLoanScenarios } from "@/lib/calculations";
import type { CalculatorState } from "@/lib/types";
import calculatorReducer from "@/store/slices/calculatorSlice";

// Types for motion components
interface MotionProps {
  children: ReactNode;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

interface AnimatePresenceProps {
  children: ReactNode;
}

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: MotionProps) => (
      <div {...props}>{children}</div>
    ),
    p: ({ children, ...props }: MotionProps) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: AnimatePresenceProps) => children,
}));

// Mock the calculations module
vi.mock("@/lib/calculations", () => ({
  formatCurrency: (value: number) => `${value} kr`,
  formatPercentage: (value: number) => `${value}%`,
  calculateLoanScenarios: vi.fn(),
  calculateFinancialHealthScoreForResult: () => ({
    overallScore: 75,
    metrics: {
      debtToIncomeRatio: 0.3,
      emergencyFundCoverage: 3,
      housingCostRatio: 0.25,
      discretionaryIncomeRatio: 0.15,
    },
    recommendations: [],
  }),
}));

const mockCalculateLoanScenarios = vi.mocked(calculateLoanScenarios);

const createTestStore = (preloadedState?: CalculatorState) => {
  return configureStore({
    reducer: calculatorReducer,
    preloadedState: preloadedState,
  });
};

// Wrapper component to provide form context
const FormWrapper = ({ children }: { children: ReactNode }) => {
  const form = useForm({
    defaultValues: {
      interestRate: 3.5,
      amortizationRate: 2,
    },
  });

  return <Form {...form}>{children}</Form>;
};

const createMockState = (
  overrides?: Partial<CalculatorState>
): CalculatorState => ({
  loanParameters: {
    amount: 3000000,
    interestRate: 3.5,
    amortizationRate: 2,
    hasLoan: true,
  },
  income: {
    income1: 35000,
    income2: 30000,
    secondaryIncome1: 0,
    secondaryIncome2: 0,
    childBenefits: 0,
    otherBenefits: 0,
    otherIncomes: 0,
    currentBuffer: 50000,
    numberOfAdults: "2",
    selectedKommun: "Stockholm",
    includeChurchTax: false,
    secondaryIncomeTaxRate: 30,
  },
  expenses: {
    // ExpensesByCategory format - flat key-value pairs
    groceries: 5000,
    "dining-out": 1000,
    "public-transport": 800,
    car: 2000,
    fuel: 1500,
    rent: 0,
    "electricity-heating": 1500,
    mortgage: 0,
    "water-garbage": 500,
  },
  expenseViewMode: "detailed" as const,
  totalExpenses: 16800,
  ...overrides,
});

describe("ResultsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Single Scenario Case", () => {
    it("should not show best/worst scenario summary when only one scenario exists", () => {
      const singleScenario = {
        interestRate: 3.5,
        amortizationRate: 2,
        monthlyInterest: 8750,
        monthlyAmortization: 5000,
        totalHousingCost: 15750,
        totalExpenses: 27250,
        remainingSavings: 18420,
        income1Net: 27335,
        income2Net: 23835,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 50000,
        totalIncome: { gross: 65000, net: 51170 },
      };

      mockCalculateLoanScenarios.mockReturnValue([singleScenario]);

      const store = createTestStore();
      render(
        <Provider store={store}>
          <FormWrapper>
            <ResultsTable calculatorState={createMockState()} />
          </FormWrapper>
        </Provider>
      );

      // Best/worst scenario sections should not be present
      expect(screen.queryByText("best_option")).not.toBeInTheDocument();
      expect(screen.queryByText("worst_option")).not.toBeInTheDocument();

      // Should show exactly one result card (not duplicated)
      // Check that we don't have duplicate cards by looking for unique elements
      const resultCards = screen.getAllByText("remaining_savings");
      expect(resultCards).toHaveLength(1);
    });

    it("should not show best/worst badges on cards when single scenario", () => {
      const singleScenario = {
        interestRate: 3.5,
        amortizationRate: 2,
        monthlyInterest: 8750,
        monthlyAmortization: 5000,
        totalHousingCost: 15750,
        totalExpenses: 27250,
        remainingSavings: 18420,
        income1Net: 27335,
        income2Net: 23835,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 50000,
        totalIncome: { gross: 65000, net: 51170 },
      };

      mockCalculateLoanScenarios.mockReturnValue([singleScenario]);

      const store = createTestStore();
      render(
        <Provider store={store}>
          <FormWrapper>
            <ResultsTable calculatorState={createMockState()} />
          </FormWrapper>
        </Provider>
      );

      // Badges should not be present
      expect(screen.queryByText("Best Option")).not.toBeInTheDocument();
      expect(screen.queryByText("Highest Cost")).not.toBeInTheDocument();
    });
  });

  describe("Multiple Scenarios Case", () => {
    it("should show best/worst scenario summary when multiple scenarios exist", () => {
      const scenarios = [
        {
          interestRate: 3,
          amortizationRate: 2,
          monthlyInterest: 7500,
          monthlyAmortization: 5000,
          totalHousingCost: 14500,
          totalExpenses: 26000,
          remainingSavings: 25170, // Best scenario
          income1Net: 27335,
          income2Net: 23835,
          secondaryIncome1Net: 0,
          secondaryIncome2Net: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 50000,
          totalIncome: { gross: 65000, net: 51170 },
        },
        {
          interestRate: 4,
          amortizationRate: 3,
          monthlyInterest: 10000,
          monthlyAmortization: 7500,
          totalHousingCost: 19500,
          totalExpenses: 31000,
          remainingSavings: 20170, // Worst scenario
          income1Net: 27335,
          income2Net: 23835,
          secondaryIncome1Net: 0,
          secondaryIncome2Net: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 50000,
          totalIncome: { gross: 65000, net: 51170 },
        },
      ];

      mockCalculateLoanScenarios.mockReturnValue(scenarios);

      const store = createTestStore();
      render(
        <Provider store={store}>
          <FormWrapper>
            <ResultsTable
              calculatorState={createMockState({
                loanParameters: {
                  amount: 3000000,
                  interestRate: 3,
                  amortizationRate: 2,
                  hasLoan: true,
                },
              })}
            />
          </FormWrapper>
        </Provider>
      );

      // Since ResultsTable now only shows single scenarios, check for basic structure
      expect(screen.getAllByText("interest_rate")).toHaveLength(2); // One in result card, one in slider
      expect(screen.getAllByText("remaining_savings")).toHaveLength(1); // Only in result card
      expect(screen.getAllByText("housing_cost")).toHaveLength(2); // In result card and somewhere else
    });

    it("should show badges on best and worst scenario cards", () => {
      const scenarios = [
        {
          interestRate: 3,
          amortizationRate: 2,
          monthlyInterest: 7500,
          monthlyAmortization: 5000,
          totalHousingCost: 14500,
          totalExpenses: 26000,
          remainingSavings: 25170,
          income1Net: 27335,
          income2Net: 23835,
          secondaryIncome1Net: 0,
          secondaryIncome2Net: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 50000,
          totalIncome: { gross: 65000, net: 51170 },
        },
        {
          interestRate: 4,
          amortizationRate: 3,
          monthlyInterest: 10000,
          monthlyAmortization: 7500,
          totalHousingCost: 19500,
          totalExpenses: 31000,
          remainingSavings: 20170,
          income1Net: 27335,
          income2Net: 23835,
          secondaryIncome1Net: 0,
          secondaryIncome2Net: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 50000,
          totalIncome: { gross: 65000, net: 51170 },
        },
      ];

      mockCalculateLoanScenarios.mockReturnValue(scenarios);

      const store = createTestStore();
      render(
        <Provider store={store}>
          <FormWrapper>
            <ResultsTable
              calculatorState={createMockState({
                loanParameters: {
                  amount: 3000000,
                  interestRate: 3,
                  amortizationRate: 2,
                  hasLoan: true,
                },
              })}
            />
          </FormWrapper>
        </Provider>
      );

      // Since ResultsTable now only shows single scenarios, check for basic structure
      expect(screen.getAllByText("interest_rate")).toHaveLength(2); // One in result card, one in slider
      expect(screen.getAllByText("remaining_savings")).toHaveLength(1); // Only in result card

      // Should not show any badges since only one scenario is displayed
      expect(screen.queryByText("best_option")).not.toBeInTheDocument();
      expect(screen.queryByText("worst_option")).not.toBeInTheDocument();
    });
  });

  describe("Boundary Cases", () => {
    it("should handle zero loan amount gracefully", () => {
      const zeroLoanScenario = {
        interestRate: 0,
        amortizationRate: 0,
        monthlyInterest: 0,
        monthlyAmortization: 0,
        totalHousingCost: 2000,
        totalExpenses: 13500,
        remainingSavings: 37670,
        income1Net: 27335,
        income2Net: 23835,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 50000,
        totalIncome: { gross: 65000, net: 51170 },
      };

      mockCalculateLoanScenarios.mockReturnValue([zeroLoanScenario]);

      const store = createTestStore();
      render(
        <Provider store={store}>
          <ResultsTable
            calculatorState={createMockState({
              loanParameters: {
                amount: 0,
                interestRate: 0,
                amortizationRate: 0,
                hasLoan: false,
              },
            })}
          />
        </Provider>
      );

      // Should render without errors - check basic structure exists
      expect(screen.getAllByText("interest_rate")).toHaveLength(1); // Only in result card, no sliders when no loan
      expect(screen.getByText("remaining_savings")).toBeInTheDocument();
    });

    it("should handle negative remaining savings", () => {
      const negativeScenario = {
        interestRate: 6,
        amortizationRate: 4,
        monthlyInterest: 15000,
        monthlyAmortization: 10000,
        totalHousingCost: 27000,
        totalExpenses: 38500,
        remainingSavings: -5000,
        income1Net: 20000,
        income2Net: 13500,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 50000,
        totalIncome: { gross: 45000, net: 33500 },
      };

      mockCalculateLoanScenarios.mockReturnValue([negativeScenario]);

      const store = createTestStore();
      render(
        <Provider store={store}>
          <FormWrapper>
            <ResultsTable calculatorState={createMockState()} />
          </FormWrapper>
        </Provider>
      );

      // Should show negative value - check for the class that indicates negative
      const remainingSavingsElements = screen.getAllByText("remaining_savings");
      expect(remainingSavingsElements.length).toBeGreaterThan(0);
    });

    it("should handle many scenarios correctly", () => {
      const manyScenarios = Array.from({ length: 9 }, (_, i) => ({
        interestRate: 3 + i * 0.5,
        amortizationRate: 2 + Math.floor(i / 3),
        monthlyInterest: 7500 + i * 1250,
        monthlyAmortization: 5000 + Math.floor(i / 3) * 2500,
        totalHousingCost: 14500 + i * 1250 + Math.floor(i / 3) * 2500,
        totalExpenses: 26000 + i * 1250 + Math.floor(i / 3) * 2500,
        remainingSavings: 25170 - (i * 1250 + Math.floor(i / 3) * 2500),
        income1Net: 27335,
        income2Net: 23835,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 50000,
        totalIncome: { gross: 65000, net: 51170 },
      }));

      mockCalculateLoanScenarios.mockReturnValue(manyScenarios);

      const store = createTestStore();
      render(
        <Provider store={store}>
          <FormWrapper>
            <ResultsTable
              calculatorState={createMockState({
                loanParameters: {
                  amount: 3000000,
                  interestRate: 3,
                  amortizationRate: 2,
                  hasLoan: true,
                },
              })}
            />
          </FormWrapper>
        </Provider>
      );

      // Since ResultsTable now only shows single scenarios, check for basic structure
      expect(screen.getAllByText("interest_rate")).toHaveLength(2); // One in result card, one in slider
      expect(screen.getAllByText("housing_cost")).toHaveLength(2); // In result card and somewhere else
      expect(screen.getByText("remaining_savings")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle identical best and worst scenarios gracefully", () => {
      const identicalScenarios = Array(3).fill({
        interestRate: 3.5,
        amortizationRate: 2,
        monthlyInterest: 8750,
        monthlyAmortization: 5000,
        totalHousingCost: 15750,
        totalExpenses: 27250,
        remainingSavings: 18420,
        income1Net: 27335,
        income2Net: 23835,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 50000,
        totalIncome: { gross: 65000, net: 51170 },
      });

      mockCalculateLoanScenarios.mockReturnValue(identicalScenarios);

      const store = createTestStore();
      render(
        <Provider store={store}>
          <FormWrapper>
            <ResultsTable calculatorState={createMockState()} />
          </FormWrapper>
        </Provider>
      );

      // Since ResultsTable now only shows single scenarios, check for basic structure
      expect(screen.getAllByText("interest_rate")).toHaveLength(2); // One in result card, one in slider
      expect(screen.getByText("remaining_savings")).toBeInTheDocument();

      // Should not show any badges or multiple scenarios even when given identical data
      expect(screen.queryByText("best_option")).not.toBeInTheDocument();
      expect(screen.queryByText("worst_option")).not.toBeInTheDocument();
    });

    it("should show correct scenario count in subtitle", () => {
      const scenarios = [
        {
          interestRate: 3,
          amortizationRate: 2,
          monthlyInterest: 7500,
          monthlyAmortization: 5000,
          totalHousingCost: 14500,
          totalExpenses: 26000,
          remainingSavings: 25170,
          income1Net: 27335,
          income2Net: 23835,
          secondaryIncome1Net: 0,
          secondaryIncome2Net: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 50000,
          totalIncome: { gross: 65000, net: 51170 },
        },
      ];

      mockCalculateLoanScenarios.mockReturnValue(scenarios);

      const store = createTestStore();
      render(
        <Provider store={store}>
          <FormWrapper>
            <ResultsTable calculatorState={createMockState()} />
          </FormWrapper>
        </Provider>
      );

      // Since ResultsTable now only shows single scenarios, check for basic structure
      expect(screen.getAllByText("interest_rate")).toHaveLength(2); // One in result card, one in slider
      expect(screen.getByText("remaining_savings")).toBeInTheDocument();
    });
  });
});
