import { configureStore } from "@reduxjs/toolkit";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ExpenseCategories } from "@/features/calculator/ExpenseCategories";
import type { CalculatorState, ExpensesByCategory } from "@/lib/types";
import calculatorReducer from "@/store/slices/calculatorSlice";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: "Expense Categories",
      track_expenses: "Track your monthly expenses across categories",
      total_expenses: "Total Expenses",
      "home.name": "Home",
      "food.name": "Food",
      "carTransportation.name": "Car & Transportation",
      "view_toggle.detailed": "Detailed view",
      "view_toggle.simple": "Simple view",
      "view_toggle.simple_description": "Enter your total monthly expenses",
      "aria.title": "Expense Categories section",
    };
    return translations[key] || key;
  },
}));

describe("ExpenseCategories", () => {
  const mockOnChange = vi.fn();

  // Create a test store
  const createTestStore = (initialState?: Partial<CalculatorState>) => {
    const defaultState: CalculatorState = {
      loanParameters: {
        amount: 0,
        interestRate: 3,
        amortizationRate: 3,
        hasLoan: false,
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
        numberOfAdults: "1",
      },
      expenses: {},
      expenseViewMode: "detailed",
      totalExpenses: 0,
      ...initialState,
    };

    return configureStore({
      reducer: calculatorReducer,
      preloadedState: defaultState,
    });
  };

  // Test wrapper component
  const TestWrapper = ({
    children,
    initialState,
  }: {
    children: React.ReactNode;
    initialState?: Partial<CalculatorState>;
  }) => {
    const store = createTestStore(initialState);
    return <Provider store={store}>{children}</Provider>;
  };

  // Create a function to get fresh test data
  const getTestData = (): ExpensesByCategory => ({
    home: 6000,
    food: 5000,
    carTransportation: 2000,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all expense categories in detailed view", () => {
    const testExpenses = getTestData();
    render(
      <TestWrapper
        initialState={{ expenses: testExpenses, expenseViewMode: "detailed" }}
      >
        <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Check for category names (using getAllByText since there are mobile and desktop versions)
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Food").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Car & Transportation").length).toBeGreaterThan(
      0
    );
  });

  it("displays correct initial values in detailed view", () => {
    const testExpenses = getTestData();
    render(
      <TestWrapper
        initialState={{ expenses: testExpenses, expenseViewMode: "detailed" }}
      >
        <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Check for input fields with correct values (there are mobile and desktop versions)
    expect(screen.getAllByDisplayValue("6000").length).toBeGreaterThan(0);
    expect(screen.getAllByDisplayValue("5000").length).toBeGreaterThan(0);
    expect(screen.getAllByDisplayValue("2000").length).toBeGreaterThan(0);
  });

  it("handles expense changes correctly in detailed view", () => {
    const testExpenses = getTestData();
    render(
      <TestWrapper
        initialState={{ expenses: testExpenses, expenseViewMode: "detailed" }}
      >
        <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
      </TestWrapper>
    );

    const homeInputs = screen.getAllByDisplayValue("6000");
    fireEvent.change(homeInputs[0], { target: { value: "7000" } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...testExpenses,
      home: 7000,
    });
  });

  it("calculates category totals correctly in detailed view", () => {
    const testExpenses = getTestData();
    render(
      <TestWrapper
        initialState={{ expenses: testExpenses, expenseViewMode: "detailed" }}
      >
        <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
      </TestWrapper>
    );

    // The grand total should be displayed (6000 + 5000 + 2000 = 13000)
    expect(screen.getByTestId("grand-total")).toHaveTextContent("13 000 kr");
  });

  it("handles zero values correctly in detailed view", () => {
    const emptyExpenses = {
      home: 0,
      food: 0,
    };

    render(
      <TestWrapper
        initialState={{ expenses: emptyExpenses, expenseViewMode: "detailed" }}
      >
        <ExpenseCategories expenses={emptyExpenses} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Should show placeholders for zero values
    const placeholderInputs = screen.getAllByPlaceholderText("0");
    expect(placeholderInputs.length).toBeGreaterThan(0);

    // Grand total should be 0
    expect(screen.getByTestId("grand-total")).toHaveTextContent("0 kr");
  });

  it("updates grand total when values change in detailed view", async () => {
    const testExpenses = { home: 1000, food: 2000 };
    render(
      <TestWrapper
        initialState={{ expenses: testExpenses, expenseViewMode: "detailed" }}
      >
        <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Initial total should be 3000
    expect(screen.getByTestId("grand-total")).toHaveTextContent("3 000 kr");

    const homeInputs = screen.getAllByDisplayValue("1000");
    fireEvent.change(homeInputs[0], { target: { value: "5000" } });

    // onChange should be called with updated values
    expect(mockOnChange).toHaveBeenCalledWith({
      home: 5000,
      food: 2000,
    });
  });

  it("shows progress bars for categories with values in detailed view", () => {
    const testExpenses = getTestData();
    render(
      <TestWrapper
        initialState={{ expenses: testExpenses, expenseViewMode: "detailed" }}
      >
        <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Should have progress bars for non-zero categories
    // Progress bars use bg-gradient-golden class and are within progress containers
    const progressBars = document.querySelectorAll(
      ".bg-gradient-golden.rounded-full.transition-all.duration-500"
    );
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it("handles clearing expense values in detailed view", () => {
    const testExpenses = getTestData();
    render(
      <TestWrapper
        initialState={{ expenses: testExpenses, expenseViewMode: "detailed" }}
      >
        <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
      </TestWrapper>
    );

    const homeInputs = screen.getAllByDisplayValue("6000");

    // Clear the value
    fireEvent.change(homeInputs[0], { target: { value: "" } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...testExpenses,
      home: 0,
    });
  });

  it("renders simple view when expenseViewMode is simple", () => {
    render(
      <TestWrapper
        initialState={{
          expenseViewMode: "simple",
          totalExpenses: 10000,
          expenses: { home: 5000, food: 3000 },
        }}
      >
        <ExpenseCategories expenses={{}} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Should show the simple view inputs (both mobile and desktop)
    expect(
      screen.getAllByLabelText("Enter your total monthly expenses").length
    ).toBeGreaterThan(0);
    expect(screen.getAllByDisplayValue("10000").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Enter your total monthly expenses").length
    ).toBeGreaterThan(0);

    // Should NOT show detailed category inputs
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Food")).not.toBeInTheDocument();
  });

  it("displays view toggle switch", () => {
    render(
      <TestWrapper initialState={{ expenseViewMode: "detailed", expenses: {} }}>
        <ExpenseCategories expenses={{}} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Should show view toggle labels
    expect(screen.getByText("Detailed view")).toBeInTheDocument();
    expect(screen.getByText("Simple view")).toBeInTheDocument();
  });

  it("shows correct total in simple view", () => {
    render(
      <TestWrapper
        initialState={{
          expenseViewMode: "simple",
          totalExpenses: 15000,
          expenses: { home: 5000 }, // This should be ignored in simple mode
        }}
      >
        <ExpenseCategories expenses={{}} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Grand total should show totalExpenses value (15000), not sum of expenses (5000)
    expect(screen.getByTestId("grand-total")).toHaveTextContent("15 000 kr");
  });

  it("shows correct total in detailed view", () => {
    const testExpenses = { home: 6000, food: 4000 };
    render(
      <TestWrapper
        initialState={{
          expenseViewMode: "detailed",
          totalExpenses: 20000, // This should be ignored in detailed mode
          expenses: testExpenses,
        }}
      >
        <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Grand total should show sum of detailed expenses (10000), not totalExpenses (20000)
    expect(screen.getByTestId("grand-total")).toHaveTextContent("10 000 kr");
  });

  it("handles simple view total expense changes", () => {
    render(
      <TestWrapper
        initialState={{
          expenseViewMode: "simple",
          totalExpenses: 5000,
        }}
      >
        <ExpenseCategories expenses={{}} onChange={mockOnChange} />
      </TestWrapper>
    );

    const totalInputs = screen.getAllByLabelText(
      "Enter your total monthly expenses"
    );
    fireEvent.change(totalInputs[0], { target: { value: "8000" } });

    // Should update the Redux state, not call the onChange prop
    // The component now manages its own state via Redux
    expect(totalInputs[0]).toHaveValue(8000);
  });
});
