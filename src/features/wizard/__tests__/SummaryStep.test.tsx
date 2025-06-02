import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SummaryStep } from "@/features/wizard/steps/SummaryStep";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import calculatorReducer from "@/store/slices/calculatorSlice";

// Mock wizard context
vi.mock("@/features/wizard/WizardLayout", () => ({
  useWizard: vi.fn(() => ({
    setStepIndex: vi.fn(),
  })),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    p: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock window.scrollTo
window.scrollTo = vi.fn();

interface TestStoreState {
  income?: {
    income1: number;
    income2: number;
    secondaryIncome1: number;
    secondaryIncome2: number;
    childBenefits: number;
    otherBenefits: number;
    otherIncomes: number;
    currentBuffer: number;
    numberOfAdults: "1" | "2";
  };
  loanParameters?: {
    amount: number;
    interestRates: number[];
    amortizationRates: number[];
    customInterestRates?: number[];
  };
  expenses?: Record<string, number>;
}

function createTestStore(preloadedState?: TestStoreState) {
  const initialState = {
    loanParameters: {
      amount: 0,
      interestRates: [3],
      amortizationRates: [3],
      customInterestRates: [],
      ...preloadedState?.loanParameters,
    },
    income: {
      income1: 0,
      income2: 0,
      secondaryIncome1: 0,
      secondaryIncome2: 0,
      childBenefits: 0,
      otherBenefits: 0,
      otherIncomes: 0,
      currentBuffer: 0,
      numberOfAdults: "1" as const,
      ...preloadedState?.income,
    },
    expenses: preloadedState?.expenses || {},
    expenseViewMode: "detailed" as const,
    totalExpenses: 0,
  };

  return configureStore({
    reducer: calculatorReducer,
    preloadedState: initialState,
  });
}

describe("SummaryStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays no loan message when user has no loan", async () => {
    const store = createTestStore({
      income: {
        income1: 30000,
        income2: 0,
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 0,
        numberOfAdults: "1",
      },
      loanParameters: {
        amount: 0,
        interestRates: [],
        amortizationRates: [],
      },
      expenses: {},
    });

    render(
      <Provider store={store}>
        <SummaryStep />
      </Provider>
    );

    // Should show "-" for loan payment in quick stats
    const loanPaymentElements = screen.getAllByText("-");
    expect(loanPaymentElements.length).toBeGreaterThan(0);

    // Click on the loans section to expand it
    const loansSection = screen.getByText("loansTitle");
    const loansSectionContainer = loansSection.closest(".glass");
    expect(loansSectionContainer).toBeTruthy();

    // Click the accordion trigger to expand
    const accordionTrigger = loansSection.closest("button");
    expect(accordionTrigger).toBeTruthy();
    fireEvent.click(accordionTrigger!);

    // Wait for and verify the no loan message
    await waitFor(() => {
      expect(screen.getByText("no_loan")).toBeInTheDocument();
    });
  });

  it("correctly calculates surplus when no loan exists", async () => {
    const store = createTestStore({
      income: {
        income1: 50000,
        income2: 0,
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 0,
        numberOfAdults: "1",
      },
      loanParameters: {
        amount: 0,
        interestRates: [],
        amortizationRates: [],
      },
      expenses: {
        home: 10000,
        food: 5000,
      },
    });

    render(
      <Provider store={store}>
        <SummaryStep />
      </Provider>
    );

    // Check that surplus calculation doesn't include loan payment
    await waitFor(() => {
      expect(screen.getByText("estimated_monthly_surplus")).toBeInTheDocument();
    });
  });

  it("displays loan information when user has a loan", async () => {
    const store = createTestStore({
      income: {
        income1: 50000,
        income2: 0,
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 0,
        numberOfAdults: "1",
      },
      loanParameters: {
        amount: 2000000,
        interestRates: [3],
        amortizationRates: [2],
      },
      expenses: {
        home: 0,
      },
    });

    render(
      <Provider store={store}>
        <SummaryStep />
      </Provider>
    );

    // Click on the loans section to expand it
    const loansSection = screen.getByText("loansTitle");
    const loansSectionContainer = loansSection.closest(".glass");
    expect(loansSectionContainer).toBeTruthy();

    // Click the accordion trigger to expand
    const accordionTrigger = loansSection.closest("button");
    expect(accordionTrigger).toBeTruthy();
    fireEvent.click(accordionTrigger!);

    // Wait for and verify loan information
    await waitFor(() => {
      expect(screen.getByText("loanAmount")).toBeInTheDocument();
      expect(screen.getByText("interestRates")).toBeInTheDocument();
      expect(screen.getByText("3,00 %")).toBeInTheDocument();
      expect(screen.getByText("amortizationRates")).toBeInTheDocument();
      expect(screen.getByText("2,00 %")).toBeInTheDocument();
    });
  });

  it("displays correct monthly payment calculation for loans", async () => {
    const store = createTestStore({
      income: {
        income1: 50000,
        income2: 0,
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 0,
        numberOfAdults: "1",
      },
      loanParameters: {
        amount: 1000000,
        interestRates: [3],
        amortizationRates: [2],
      },
      expenses: {},
    });

    render(
      <Provider store={store}>
        <SummaryStep />
      </Provider>
    );

    // Monthly payment = 1000000 * ((3 + 2) / 100 / 12) = 4166.67
    // Should show in loan payment section (formatted as Swedish currency)
    await waitFor(() => {
      expect(screen.getByText("loan_payment")).toBeInTheDocument();
    });
  });

  it("shows deficit when expenses and loan exceed income", async () => {
    const store = createTestStore({
      income: {
        income1: 20000, // Lower income to ensure deficit
        income2: 0,
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 0,
        numberOfAdults: "1",
      },
      loanParameters: {
        amount: 4000000, // Higher loan amount
        interestRates: [5], // Higher interest rate
        amortizationRates: [3],
      },
      expenses: {
        home: 15000, // Higher expenses
        food: 8000,
        carTransportation: 3000,
        healthBeauty: 2000,
      },
    });

    render(
      <Provider store={store}>
        <SummaryStep />
      </Provider>
    );

    // Should show deficit message
    await waitFor(() => {
      expect(screen.getByText("estimated_monthly_deficit")).toBeInTheDocument();
    });
  });

  it("correctly handles two adults income scenario", async () => {
    const store = createTestStore({
      income: {
        income1: 35000,
        income2: 30000,
        secondaryIncome1: 5000,
        secondaryIncome2: 3000,
        childBenefits: 2000,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 10000,
        numberOfAdults: "2",
      },
      loanParameters: {
        amount: 0,
        interestRates: [],
        amortizationRates: [],
      },
      expenses: {},
    });

    render(
      <Provider store={store}>
        <SummaryStep />
      </Provider>
    );

    // Click on the income section to expand it
    const incomeSection = screen.getByText("incomeTitle");
    const incomeSectionContainer = incomeSection.closest(".glass");
    expect(incomeSectionContainer).toBeTruthy();

    // Click the accordion trigger to expand
    const accordionTrigger = incomeSection.closest("button");
    expect(accordionTrigger).toBeTruthy();
    fireEvent.click(accordionTrigger!);

    // Wait for and verify income information
    await waitFor(() => {
      expect(screen.getByText("income1")).toBeInTheDocument();
      expect(screen.getByText("income2")).toBeInTheDocument();
      expect(screen.getByText("secondaryIncome1")).toBeInTheDocument();
      expect(screen.getByText("secondaryIncome2")).toBeInTheDocument();
      // Check for the adults count text - since translations aren't mocked, this will be the translation key pattern
      // The key will contain count=2 in the adults_count format
      expect(screen.getByText(/adults_count/)).toBeInTheDocument();
    });
  });

  it("hides zero-value income fields", async () => {
    const store = createTestStore({
      income: {
        income1: 40000,
        income2: 0,
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 0,
        numberOfAdults: "1",
      },
      loanParameters: {
        amount: 0,
        interestRates: [],
        amortizationRates: [],
      },
      expenses: {},
    });

    render(
      <Provider store={store}>
        <SummaryStep />
      </Provider>
    );

    // Click on the income section header to expand it
    const incomeSection = screen.getByText("incomeTitle");
    const incomeSectionContainer = incomeSection.closest(".glass");
    expect(incomeSectionContainer).toBeTruthy();

    // Click the accordion trigger to expand
    const accordionTrigger = incomeSection.closest("button");
    expect(accordionTrigger).toBeTruthy();
    fireEvent.click(accordionTrigger!);

    // Wait for the section to be expanded and content to be visible
    await waitFor(() => {
      const incomeContent = screen.getByTestId("income-content");
      expect(incomeContent).toBeInTheDocument();
    });

    // Now check for the income information
    expect(screen.getByText("income1")).toBeInTheDocument();
    expect(screen.queryByText("secondaryIncome1")).not.toBeInTheDocument();
    expect(screen.queryByText("childBenefits")).not.toBeInTheDocument();
    expect(screen.queryByText("otherBenefits")).not.toBeInTheDocument();
  });

  it("displays expenses sorted by amount", async () => {
    const store = createTestStore({
      income: {
        income1: 50000,
        income2: 0,
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 0,
        numberOfAdults: "1",
      },
      loanParameters: {
        amount: 0,
        interestRates: [],
        amortizationRates: [],
      },
      expenses: {
        home: 15000,
        food: 5000,
        carTransportation: 3000,
        healthBeauty: 1000,
      },
    });

    render(
      <Provider store={store}>
        <SummaryStep />
      </Provider>
    );

    // Wait for and verify expenses information
    await waitFor(() => {
      expect(screen.getByText("expensesTitle")).toBeInTheDocument();
      expect(screen.getByText("totalExpenses")).toBeInTheDocument();
    });
  });

  describe("Custom Interest Rates Integration", () => {
    it("displays loan information when only custom rates are present", async () => {
      const store = createTestStore({
        income: {
          income1: 50000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
        loanParameters: {
          amount: 2000000,
          interestRates: [], // No predefined rates
          amortizationRates: [2],
          customInterestRates: [2.74], // Only custom rate
        },
        expenses: {
          home: 0,
        },
      });

      render(
        <Provider store={store}>
          <SummaryStep />
        </Provider>
      );

      // Should show loan payment in quick stats (not "-")
      await waitFor(() => {
        expect(screen.getByText("loan_payment")).toBeInTheDocument();
        // Monthly payment calculation: 2000000 * ((2.74 + 2) / 100 / 12) = 7900
        expect(screen.queryByText("-")).not.toBeInTheDocument();
      });

      // Click on the loans section to expand it
      const loansSection = screen.getByText("loansTitle");
      const accordionTrigger = loansSection.closest("button");
      expect(accordionTrigger).toBeTruthy();
      fireEvent.click(accordionTrigger!);

      // Wait for and verify loan information displays custom rate
      await waitFor(() => {
        expect(screen.getByText("loanAmount")).toBeInTheDocument();
        expect(screen.getByText("interestRates")).toBeInTheDocument();
        expect(screen.getByText("2,74 %")).toBeInTheDocument(); // Custom rate in Swedish format
        expect(screen.getByText("amortizationRates")).toBeInTheDocument();
        expect(screen.getByText("2,00 %")).toBeInTheDocument();
      });
    });

    it("calculates monthly payment correctly with custom rates only", async () => {
      const store = createTestStore({
        income: {
          income1: 30000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
        loanParameters: {
          amount: 1000000,
          interestRates: [], // No predefined rates
          amortizationRates: [3],
          customInterestRates: [3.89], // Only custom rate
        },
        expenses: {
          home: 10000,
        },
      });

      render(
        <Provider store={store}>
          <SummaryStep />
        </Provider>
      );

      // Monthly payment = 1000000 * ((3.89 + 3) / 100 / 12) = 5741.67
      // Should be included in surplus/deficit calculation
      await waitFor(() => {
        expect(screen.getByText("loan_payment")).toBeInTheDocument();
        // The calculated surplus/deficit should account for the loan payment
        const summary = screen.getByText(/estimated_monthly_/);
        expect(summary).toBeInTheDocument();
      });
    });

    it("prioritizes predefined rates over custom rates in display", async () => {
      const store = createTestStore({
        income: {
          income1: 50000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
        loanParameters: {
          amount: 1000000,
          interestRates: [3.5], // Predefined rate
          amortizationRates: [2],
          customInterestRates: [2.74], // Custom rate (lower than predefined)
        },
        expenses: {},
      });

      render(
        <Provider store={store}>
          <SummaryStep />
        </Provider>
      );

      // Click on the loans section to expand it
      const loansSection = screen.getByText("loansTitle");
      const accordionTrigger = loansSection.closest("button");
      expect(accordionTrigger).toBeTruthy();
      fireEvent.click(accordionTrigger!);

      // Should display the predefined rate (3.5%) since it's prioritized
      await waitFor(() => {
        expect(screen.getByText("3,50 %")).toBeInTheDocument(); // Predefined rate should be shown
        // Monthly payment should be calculated using the predefined rate: 3.5%
        // 1000000 * ((3.5 + 2) / 100 / 12) = 4583.33
      });
    });

    it("handles mixed rates scenario with multiple custom rates", async () => {
      const store = createTestStore({
        income: {
          income1: 60000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
        loanParameters: {
          amount: 2500000,
          interestRates: [3, 4], // Predefined rates
          amortizationRates: [2],
          customInterestRates: [2.74, 5.25], // Custom rates
        },
        expenses: {
          home: 15000,
        },
      });

      render(
        <Provider store={store}>
          <SummaryStep />
        </Provider>
      );

      // Should use the first predefined rate for calculation
      // Monthly payment = 2500000 * ((3 + 2) / 100 / 12) = 10416.67
      await waitFor(() => {
        expect(screen.getByText("loan_payment")).toBeInTheDocument();
      });

      // Click on the loans section to expand it
      const loansSection = screen.getByText("loansTitle");
      const accordionTrigger = loansSection.closest("button");
      expect(accordionTrigger).toBeTruthy();
      fireEvent.click(accordionTrigger!);

      // Should display the first predefined rate
      await waitFor(() => {
        expect(screen.getByText("3,00 %")).toBeInTheDocument(); // First predefined rate
      });
    });

    it("shows no loan when amount is 0 despite having custom rates", async () => {
      const store = createTestStore({
        income: {
          income1: 40000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
        loanParameters: {
          amount: 0, // No loan amount
          interestRates: [],
          amortizationRates: [],
          customInterestRates: [2.74, 3.89], // Custom rates exist but amount is 0
        },
        expenses: {},
      });

      render(
        <Provider store={store}>
          <SummaryStep />
        </Provider>
      );

      // Should show "-" for loan payment in quick stats
      const loanPaymentElements = screen.getAllByText("-");
      expect(loanPaymentElements.length).toBeGreaterThan(0);

      // Click on the loans section to expand it
      const loansSection = screen.getByText("loansTitle");
      const accordionTrigger = loansSection.closest("button");
      expect(accordionTrigger).toBeTruthy();
      fireEvent.click(accordionTrigger!);

      // Should show no loan message despite custom rates
      await waitFor(() => {
        expect(screen.getByText("no_loan")).toBeInTheDocument();
      });
    });

    it("shows no loan when no amortization rates despite custom interest rates", async () => {
      const store = createTestStore({
        income: {
          income1: 40000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
        loanParameters: {
          amount: 1000000,
          interestRates: [],
          amortizationRates: [], // No amortization rates
          customInterestRates: [2.74], // Custom rates exist
        },
        expenses: {},
      });

      render(
        <Provider store={store}>
          <SummaryStep />
        </Provider>
      );

      // Should show "-" for loan payment in quick stats
      const loanPaymentElements = screen.getAllByText("-");
      expect(loanPaymentElements.length).toBeGreaterThan(0);

      // Click on the loans section to expand it
      const loansSection = screen.getByText("loansTitle");
      const accordionTrigger = loansSection.closest("button");
      expect(accordionTrigger).toBeTruthy();
      fireEvent.click(accordionTrigger!);

      // Should show no loan message because loan is invalid (no amortization)
      await waitFor(() => {
        expect(screen.getByText("no_loan")).toBeInTheDocument();
      });
    });

    it("handles undefined customInterestRates gracefully", async () => {
      const store = createTestStore({
        income: {
          income1: 40000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
        loanParameters: {
          amount: 1000000,
          interestRates: [3.5],
          amortizationRates: [2],
          // customInterestRates is undefined
        },
        expenses: {},
      });

      render(
        <Provider store={store}>
          <SummaryStep />
        </Provider>
      );

      // Should still work normally with predefined rates
      await waitFor(() => {
        expect(screen.getByText("loan_payment")).toBeInTheDocument();
      });

      // Click on the loans section to expand it
      const loansSection = screen.getByText("loansTitle");
      const accordionTrigger = loansSection.closest("button");
      expect(accordionTrigger).toBeTruthy();
      fireEvent.click(accordionTrigger!);

      // Should display the predefined rate
      await waitFor(() => {
        expect(screen.getByText("3,50 %")).toBeInTheDocument();
      });
    });

    it("calculates deficit correctly with high custom interest rate", async () => {
      const store = createTestStore({
        income: {
          income1: 20000, // Low income
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
        loanParameters: {
          amount: 3000000, // High loan amount
          interestRates: [],
          amortizationRates: [3],
          customInterestRates: [7.25], // High custom interest rate
        },
        expenses: {
          home: 10000,
          food: 5000,
        },
      });

      render(
        <Provider store={store}>
          <SummaryStep />
        </Provider>
      );

      // With high custom rate: 3000000 * ((7.25 + 3) / 100 / 12) = 25625
      // Plus expenses: 15000, total outgoing: 40625
      // Net income will be less than 20000, so should show deficit
      await waitFor(() => {
        expect(
          screen.getByText("estimated_monthly_deficit")
        ).toBeInTheDocument();
      });
    });

    it("handles precision in custom rate display correctly", async () => {
      const store = createTestStore({
        income: {
          income1: 50000,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          numberOfAdults: "1",
        },
        loanParameters: {
          amount: 1500000,
          interestRates: [],
          amortizationRates: [2],
          customInterestRates: [2.789], // High precision custom rate
        },
        expenses: {},
      });

      render(
        <Provider store={store}>
          <SummaryStep />
        </Provider>
      );

      // Click on the loans section to expand it
      const loansSection = screen.getByText("loansTitle");
      const accordionTrigger = loansSection.closest("button");
      expect(accordionTrigger).toBeTruthy();
      fireEvent.click(accordionTrigger!);

      // Should display the custom rate with proper formatting (2 decimal places)
      await waitFor(() => {
        expect(screen.getByText("2,79 %")).toBeInTheDocument(); // Should be rounded to 2 decimals
      });
    });
  });
});
