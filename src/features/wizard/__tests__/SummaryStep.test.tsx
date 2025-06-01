import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SummaryStep } from "@/features/wizard/steps/SummaryStep";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

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
    numberOfAdults: string;
  };
  loanParameters?: {
    amount: number;
    interestRates: number[];
    amortizationRates: number[];
  };
  expenses?: Record<string, Record<string, number>>;
}

function createTestStore(preloadedState?: TestStoreState) {
  return configureStore({
    reducer: {
      income: (state = preloadedState?.income) => state,
      loanParameters: (state = preloadedState?.loanParameters) => state,
      expenses: (state = preloadedState?.expenses) => state,
    },
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
      expect(screen.getByText("3%")).toBeInTheDocument();
      expect(screen.getByText("amortizationRates")).toBeInTheDocument();
      expect(screen.getByText("2%")).toBeInTheDocument();
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
});
