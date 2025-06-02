import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultsStep } from "@/features/wizard/steps/ResultsStep";
import { Provider } from "react-redux";
import { configureStore, Store } from "@reduxjs/toolkit";
import calculatorReducer from "@/store/slices/calculatorSlice";
import {
  CalculatorState,
  CalculationResult,
  ExpensesByCategory,
} from "@/lib/types";
import { NextIntlClientProvider, useLocale } from "next-intl";

// Mock useLocale directly
const mockUseLocale = vi.mocked(useLocale);

// Define LoanScenario based on usage
export interface LoanScenario {
  interestRate: number;
  amortizationRate: number;
  monthlyPayment: number;
  remainingSavings: number;
  totalLoanCost: number;
  loanTermYears: number;
  loanTermMonths: number;
  totalInterestPaid: number;
  totalAmortizationPaid: number;
}

// Define types for mock props
interface ResultsTableProps {
  calculatorState: Partial<CalculatorState>;
}

interface ExpenseBreakdownProps {
  expenses: Partial<CalculatorState["expenses"]>;
}

interface ForecastProps {
  calculatorState: Partial<CalculatorState>;
}

interface LinkProps {
  href: string | { pathname: string; query?: Record<string, unknown> };
  children: React.ReactNode;
}

// Mock components
vi.mock("@/features/calculator/ResultsTable", () => ({
  ResultsTable: ({ calculatorState }: ResultsTableProps) => (
    <div
      data-testid="results-table"
      data-state={JSON.stringify(calculatorState)}
    >
      Results Table
    </div>
  ),
}));

vi.mock("@/features/charts/ExpenseBreakdown", () => ({
  ExpenseBreakdown: ({ expenses }: ExpenseBreakdownProps) => (
    <div
      data-testid="expense-breakdown"
      data-expenses={JSON.stringify(expenses)}
    >
      Expense Breakdown
    </div>
  ),
}));

vi.mock("@/features/calculator/Forecast", () => ({
  Forecast: ({ calculatorState }: ForecastProps) => (
    <div data-testid="forecast" data-state={JSON.stringify(calculatorState)}>
      Forecast
    </div>
  ),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: LinkProps) => {
    let hrefString: string;
    if (typeof href === "string") {
      hrefString = href;
    } else {
      // For testing, we'll use a simplified approach
      // The actual behavior will be tested through the component
      hrefString = `${href.pathname}${href.query ? "?" + new URLSearchParams(href.query as Record<string, string>).toString() : ""}`;
    }
    return (
      <a href={hrefString} data-testid="compound-interest-link">
        {children}
      </a>
    );
  },
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
  },
}));

// Mock calculation functions

vi.mock("@/lib/calculations", () => ({
  formatCurrency: (value: number) => `${value.toLocaleString("en-US")} kr`,
  calculateLoanScenarios: vi.fn(() => [
    {
      interestRate: 3,
      amortizationRate: 2,
      remainingSavings: 3000,
      monthlyInterest: 2000,
      monthlyAmortization: 3000,
      totalHousingCost: 5000,
      totalExpenses: 10000,
      income1Net: 30000,
      income2Net: 0,
      secondaryIncome1Net: 0,
      secondaryIncome2Net: 0,
      childBenefits: 0,
      otherBenefits: 0,
      otherIncomes: 0,
      currentBuffer: 10000,
      totalIncome: { gross: 50000, net: 35000 },
    },
    {
      interestRate: 4,
      amortizationRate: 2,
      remainingSavings: 2500,
      monthlyInterest: 2200,
      monthlyAmortization: 3300,
      totalHousingCost: 5500,
      totalExpenses: 10500,
      income1Net: 30000,
      income2Net: 0,
      secondaryIncome1Net: 0,
      secondaryIncome2Net: 0,
      childBenefits: 0,
      otherBenefits: 0,
      otherIncomes: 0,
      currentBuffer: 10000,
      totalIncome: { gross: 50000, net: 35000 },
    },
    {
      interestRate: 5,
      amortizationRate: 2,
      remainingSavings: 2000,
      monthlyInterest: 2500,
      monthlyAmortization: 3500,
      totalHousingCost: 6000,
      totalExpenses: 11000,
      income1Net: 30000,
      income2Net: 0,
      secondaryIncome1Net: 0,
      secondaryIncome2Net: 0,
      childBenefits: 0,
      otherBenefits: 0,
      otherIncomes: 0,
      currentBuffer: 10000,
      totalIncome: { gross: 50000, net: 35000 },
    },
  ]),
}));

// Import after mocks are set up
import { calculateLoanScenarios } from "@/lib/calculations";

// Define a type for store overrides
interface MockStoreOverrides {
  loanParameters?: Partial<CalculatorState["loanParameters"]>;
  income?: Partial<CalculatorState["income"]>;
  expenses?: Partial<CalculatorState["expenses"]>;
}

describe("ResultsStep", () => {
  const createMockStore = (overrides: MockStoreOverrides = {}) => {
    const baseInitialState: CalculatorState = {
      loanParameters: {
        amount: 2000000,
        interestRates: [3.5],
        amortizationRates: [2],
        customInterestRates: [],
      },
      income: {
        income1: 50000,
        income2: 0, // Assuming 0 if not specified, was 35000
        secondaryIncome1: 0,
        secondaryIncome2: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 0,
        numberOfAdults: "1",
      },
      expenses: {
        // Conforms to ExpensesByCategory - key-value pairs of expense IDs and amounts
        rent: 10000,
        groceries: 5000,
      },
      expenseViewMode: "detailed" as const,
      totalExpenses: 15000,
    };

    return configureStore({
      reducer: calculatorReducer,
      preloadedState: {
        ...baseInitialState,
        loanParameters: {
          ...baseInitialState.loanParameters,
          ...overrides.loanParameters,
        },
        income: {
          ...baseInitialState.income,
          ...overrides.income,
        },
        expenses: {
          ...baseInitialState.expenses,
          ...(overrides.expenses as Partial<ExpensesByCategory>),
        },
      } as CalculatorState,
    });
  };

  const renderWithProviders = (
    ui: React.ReactElement,
    store: Store = createMockStore()
  ) => {
    return render(
      <Provider store={store}>
        <NextIntlClientProvider messages={{}} locale="en">
          {ui}
        </NextIntlClientProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset locale to English
    mockUseLocale.mockReturnValue("en");
    // Reset mock to default implementation
    vi.mocked(calculateLoanScenarios).mockReturnValue([
      {
        interestRate: 3,
        amortizationRate: 2,
        remainingSavings: 3000,
        monthlyInterest: 2000,
        monthlyAmortization: 3000,
        totalHousingCost: 5000,
        totalExpenses: 10000,
        income1Net: 30000,
        income2Net: 0,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 10000,
        totalIncome: { gross: 50000, net: 35000 },
      },
      {
        interestRate: 4,
        amortizationRate: 2,
        remainingSavings: 2500,
        monthlyInterest: 2200,
        monthlyAmortization: 3300,
        totalHousingCost: 5500,
        totalExpenses: 10500,
        income1Net: 30000,
        income2Net: 0,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 10000,
        totalIncome: { gross: 50000, net: 35000 },
      },
      {
        interestRate: 5,
        amortizationRate: 2,
        remainingSavings: 2000,
        monthlyInterest: 2500,
        monthlyAmortization: 3500,
        totalHousingCost: 6000,
        totalExpenses: 11000,
        income1Net: 30000,
        income2Net: 0,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 10000,
        totalIncome: { gross: 50000, net: 35000 },
      },
    ]);
  });

  it("should render all main components", () => {
    renderWithProviders(<ResultsStep />);

    expect(screen.getByTestId("results-table")).toBeInTheDocument();
    expect(screen.getByTestId("expense-breakdown")).toBeInTheDocument();
    expect(screen.getByTestId("forecast")).toBeInTheDocument();
  });

  it("should pass correct state to child components", () => {
    const store = createMockStore();
    renderWithProviders(<ResultsStep />, store);

    const resultsTable = screen.getByTestId("results-table");
    const state = JSON.parse(
      resultsTable.getAttribute("data-state") || "{}"
    ) as Partial<CalculatorState>;

    expect(state).toHaveProperty("loanParameters");
    expect(state).toHaveProperty("income");
    expect(state).toHaveProperty("expenses");
  });

  it("should show compound interest CTA when there are positive savings", () => {
    renderWithProviders(<ResultsStep />);

    // Should show CTA section
    expect(screen.getByText("compound_interest_cta.title")).toBeInTheDocument();
    // Check for the translation key with interpolation
    expect(
      screen.getByText("compound_interest_cta.description")
    ).toBeInTheDocument();
    expect(
      screen.getByText("compound_interest_cta.button")
    ).toBeInTheDocument();
  });

  it("should not show compound interest CTA when there are no savings", () => {
    // Mock to return no remaining savings
    vi.mocked(calculateLoanScenarios).mockReturnValueOnce([
      {
        interestRate: 5,
        amortizationRate: 2,
        remainingSavings: 0,
        monthlyInterest: 30000,
        monthlyAmortization: 10000,
        totalHousingCost: 40000,
        totalExpenses: 50000,
        income1Net: 30000,
        income2Net: 0,
        secondaryIncome1Net: 0,
        secondaryIncome2Net: 0,
        childBenefits: 0,
        otherBenefits: 0,
        otherIncomes: 0,
        currentBuffer: 10000,
        totalIncome: { gross: 50000, net: 35000 },
      },
    ]);

    renderWithProviders(<ResultsStep />);

    // Should not show CTA section
    expect(
      screen.queryByText("compound_interest_cta.title")
    ).not.toBeInTheDocument();
  });

  it("should link to correct compound interest page for English locale", () => {
    renderWithProviders(<ResultsStep />);

    const link = screen.getByTestId("compound-interest-link");
    const storeState = createMockStore().getState();
    const scenarios = vi.mocked(calculateLoanScenarios)(storeState);
    const highestSavings = Math.round(
      Math.max(...scenarios.map((s) => s.remainingSavings))
    );
    expect(link).toHaveAttribute(
      "href",
      `/ranta-pa-ranta?monthlySavings=${highestSavings}`
    );
  });

  it("should link to correct compound interest page for Swedish locale", () => {
    mockUseLocale.mockReturnValue("sv");

    renderWithProviders(<ResultsStep />);

    const link = screen.getByTestId("compound-interest-link");
    const storeState = createMockStore().getState();
    const scenarios = vi.mocked(calculateLoanScenarios)(storeState);
    const highestSavings = Math.round(
      Math.max(...scenarios.map((s) => s.remainingSavings))
    );
    expect(link).toHaveAttribute(
      "href",
      `/ranta-pa-ranta?monthlySavings=${highestSavings}`
    );
  });

  it("should display the highest remaining savings from all scenarios", () => {
    renderWithProviders(<ResultsStep />);

    // The default mock has 3000 as the highest remaining savings
    // Just check that the CTA is shown and contains the description text
    expect(screen.getByText("compound_interest_cta.title")).toBeInTheDocument();
    expect(
      screen.getByText("compound_interest_cta.description")
    ).toBeInTheDocument();

    const link = screen.getByTestId("compound-interest-link");
    expect(link).toHaveAttribute("href", `/ranta-pa-ranta?monthlySavings=3000`);
  });

  it("should round monthly savings in the URL", () => {
    // Ensure English locale
    mockUseLocale.mockReturnValue("en");

    const mockScenarios: CalculationResult[] = [
      {
        interestRate: 3,
        amortizationRate: 2,
        remainingSavings: 3456.78,
        monthlyInterest: 1,
        monthlyAmortization: 1,
        totalHousingCost: 1,
        totalExpenses: 1,
        income1Net: 1,
        income2Net: 1,
        secondaryIncome1Net: 1,
        secondaryIncome2Net: 1,
        childBenefits: 1,
        otherBenefits: 1,
        otherIncomes: 1,
        currentBuffer: 1,
        totalIncome: { gross: 1, net: 1 },
      },
    ];
    vi.mocked(calculateLoanScenarios).mockReturnValueOnce(mockScenarios);

    renderWithProviders(<ResultsStep />);

    const link = screen.getByTestId("compound-interest-link");
    expect(link).toHaveAttribute(
      "href",
      `/ranta-pa-ranta?monthlySavings=3457` // 3456.78 rounded
    );
  });

  it("should handle empty loan scenarios", () => {
    vi.mocked(calculateLoanScenarios).mockReturnValueOnce([]);

    renderWithProviders(<ResultsStep />);

    // Should not show CTA when no scenarios
    expect(
      screen.queryByText("compound_interest_cta.title")
    ).not.toBeInTheDocument();
  });

  it("should display formatted currency correctly", () => {
    renderWithProviders(<ResultsStep />);

    // Check for formatted currency display in the badge - the text should include both amount and period
    expect(screen.getByText("3,000 kr / month")).toBeInTheDocument();
  });

  it("should show potential wealth badge for English", () => {
    renderWithProviders(<ResultsStep />);

    expect(screen.getByText("Potential wealth")).toBeInTheDocument();
  });

  it("should show potential wealth badge for Swedish", () => {
    mockUseLocale.mockReturnValue("sv");

    renderWithProviders(<ResultsStep />);

    // Check for Swedish potential wealth badge text
    expect(screen.getByText("Potentiell förmögenhet")).toBeInTheDocument();
  });
});
