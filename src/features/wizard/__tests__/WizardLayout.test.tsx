import { configureStore } from "@reduxjs/toolkit";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import type { Mock } from "vitest";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { WizardLayout } from "@/features/wizard/WizardLayout";
import { useRouter, usePathname } from "@/i18n/navigation";
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

// Mock @/i18n/navigation
vi.mock("@/i18n/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, style, ...props }: MotionProps) => (
      <div {...props} style={style}>
        {children}
      </div>
    ),
    button: ({ children, ...props }: MotionProps) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, ...props }: MotionProps) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: AnimatePresenceProps) => children,
}));

// Mock radix-ui
vi.mock("@radix-ui/react-slot", () => ({
  Slot: ({ children }: { children: ReactNode }) => children,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Check: () => <span>✓</span>,
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
  AlertCircle: () => <span>⚠</span>,
}));

// Mock navigation utils
vi.mock("@/lib/utils/navigation", () => ({
  getStepParameter: vi.fn(() => "steg"),
  getStepName: vi.fn((step: { label: string }) => {
    const mapping: Record<string, string> = {
      Income: "inkomst",
      Loans: "lan",
      Expenses: "utgifter",
      Summary: "summering",
      Results: "resultat",
    };
    return mapping[step.label] || step.label.toLowerCase();
  }),
  getStepIndexFromName: vi.fn(
    (name: string, steps: Array<{ label: string }>) => {
      const nameToLabel: Record<string, string> = {
        inkomst: "Income",
        lan: "Loans",
        utgifter: "Expenses",
        summering: "Summary",
        resultat: "Results",
      };
      const label = nameToLabel[name];
      return steps.findIndex((s) => s.label === label);
    }
  ),
}));

const createTestStore = (preloadedState?: CalculatorState) => {
  return configureStore({
    reducer: calculatorReducer,
    preloadedState: preloadedState,
  });
};

describe("WizardLayout", () => {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();
  const mockSearchParameters = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (usePathname as Mock).mockReturnValue("/householdbudget");
    (useSearchParams as Mock).mockReturnValue(mockSearchParameters);
  });

  it("prevents navigation to next step when loan validation fails", async () => {
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
        amount: 1000000, // Has loan amount
        interestRate: 0, // But no rate selected
        amortizationRate: 0,
        hasLoan: true, // User explicitly said they have loan
      },
      expenses: {},
      expenseViewMode: "detailed" as const,
      totalExpenses: 0,
    });

    // Mock being on the loans step
    mockSearchParameters.set("steg", "lan");

    render(
      <Provider store={store}>
        <WizardLayout
          steps={[
            { label: "Income", component: <div>Income Step</div> },
            { label: "Loans", component: <div>Loans Step</div> },
            { label: "Expenses", component: <div>Expenses Step</div> },
          ]}
        />
      </Provider>
    );

    // Try to navigate to next step
    const nextButton = screen.getByText("next");
    fireEvent.click(nextButton);

    // Should not navigate - router.replace should not be called with a new step
    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({
            steg: "utgifter",
          }),
        })
      );
    });
  });

  it("allows navigation when no loan is selected", async () => {
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
        interestRate: 0,
        amortizationRate: 0,
        hasLoan: false, // User explicitly said no loan
      },
      expenses: {},
      expenseViewMode: "detailed" as const,
      totalExpenses: 0,
    });

    // Mock being on the loans step
    const testSearchParameters = new URLSearchParams();
    testSearchParameters.set("steg", "lan");
    (useSearchParams as Mock).mockReturnValue(testSearchParameters);

    render(
      <Provider store={store}>
        <WizardLayout
          steps={[
            { label: "Income", component: <div>Income Step</div> },
            { label: "Loans", component: <div>Loans Step</div> },
            { label: "Expenses", component: <div>Expenses Step</div> },
          ]}
        />
      </Provider>
    );

    // Try to navigate to next step
    const nextButton = screen.getByText("next");
    fireEvent.click(nextButton);

    // Should navigate without error - check that replace was called
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/householdbudget",
          query: expect.objectContaining({
            steg: "utgifter",
          }),
        })
      );
    });
  });

  it("allows navigation when loan has all required fields", async () => {
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
        interestRate: 3,
        amortizationRate: 2,
        hasLoan: true, // User explicitly said they have loan
      },
      expenses: {},
      expenseViewMode: "detailed" as const,
      totalExpenses: 0,
    });

    // Mock being on the loans step
    const testSearchParameters = new URLSearchParams();
    testSearchParameters.set("steg", "lan");
    (useSearchParams as Mock).mockReturnValue(testSearchParameters);

    render(
      <Provider store={store}>
        <WizardLayout
          steps={[
            { label: "Income", component: <div>Income Step</div> },
            { label: "Loans", component: <div>Loans Step</div> },
            { label: "Expenses", component: <div>Expenses Step</div> },
          ]}
        />
      </Provider>
    );

    // Try to navigate to next step
    const nextButton = screen.getByText("next");
    fireEvent.click(nextButton);

    // Should navigate without error
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/householdbudget",
          query: expect.objectContaining({
            steg: "utgifter",
          }),
        })
      );
    });
  });

  it("prevents navigation from income step when no income is provided", async () => {
    const store = createTestStore({
      income: {
        income1: 0, // No income
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
        interestRate: 0,
        amortizationRate: 0,
        hasLoan: false,
      },
      expenses: {},
      expenseViewMode: "detailed" as const,
      totalExpenses: 0,
    });

    // Mock being on the income step
    const testSearchParameters = new URLSearchParams();
    testSearchParameters.set("steg", "inkomst");
    (useSearchParams as Mock).mockReturnValue(testSearchParameters);

    render(
      <Provider store={store}>
        <WizardLayout
          steps={[
            { label: "Income", component: <div>Income Step</div> },
            { label: "Loans", component: <div>Loans Step</div> },
            { label: "Expenses", component: <div>Expenses Step</div> },
          ]}
        />
      </Provider>
    );

    // Try to navigate to next step
    const nextButton = screen.getByText("next");
    fireEvent.click(nextButton);

    // Should not navigate - income validation should prevent navigation
    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({
            steg: "lan",
          }),
        })
      );
    });

    // Should show validation error
    expect(screen.getByText("validation.income_required")).toBeInTheDocument();
  });
});
