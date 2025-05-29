import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ReactNode } from "react";
import { CalculatorState } from "@/lib/types";

// Types for motion components
interface MotionProps {
  children: ReactNode;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

interface AnimatePresenceProps {
  children: ReactNode;
}

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

// Mock @/i18n/navigation
vi.mock("@/i18n/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => "en"),
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
  AnimatePresence: ({ children }: AnimatePresenceProps) => <>{children}</>,
}));

// Mock radix-ui
vi.mock("@radix-ui/react-slot", () => ({
  Slot: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Check: () => <span>✓</span>,
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
}));

// Mock navigation utils
vi.mock("@/utils/navigation", () => ({
  getStepParam: vi.fn(() => "steg"),
  getStepName: vi.fn((step: { label: string }) => {
    const mapping: Record<string, string> = {
      Income: "inkomst",
      Loans: "lan",
      Expenses: "utgifter",
      Summary: "sammanfattning",
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
        sammanfattning: "Summary",
        resultat: "Results",
      };
      const label = nameToLabel[name];
      return steps.findIndex((s) => s.label === label);
    }
  ),
}));

import calculatorReducer from "@/store/slices/calculatorSlice";

function createTestStore(preloadedState?: CalculatorState) {
  return configureStore({
    reducer: calculatorReducer,
    preloadedState: preloadedState,
  });
}

describe("WizardLayout", () => {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (usePathname as Mock).mockReturnValue("/en/householdbudget");
    (useSearchParams as Mock).mockReturnValue(mockSearchParams);
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
        interestRates: [], // But no rates selected
        amortizationRates: [],
      },
      expenses: {},
    });

    // Mock being on the loans step
    mockSearchParams.set("steg", "lan");

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
        interestRates: [],
        amortizationRates: [],
      },
      expenses: {},
    });

    // Mock being on the loans step
    const testSearchParams = new URLSearchParams();
    testSearchParams.set("steg", "lan");
    (useSearchParams as Mock).mockReturnValue(testSearchParams);

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
          pathname: "/en/householdbudget",
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
        interestRates: [3, 4],
        amortizationRates: [2, 3],
      },
      expenses: {},
    });

    // Mock being on the loans step
    const testSearchParams = new URLSearchParams();
    testSearchParams.set("steg", "lan");
    (useSearchParams as Mock).mockReturnValue(testSearchParams);

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
          pathname: "/en/householdbudget",
          query: expect.objectContaining({
            steg: "utgifter",
          }),
        })
      );
    });
  });

  it("allows navigation from income step even without income", async () => {
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
        interestRates: [],
        amortizationRates: [],
      },
      expenses: {},
    });

    // Mock being on the income step
    const testSearchParams = new URLSearchParams();
    testSearchParams.set("steg", "inkomst");
    (useSearchParams as Mock).mockReturnValue(testSearchParams);

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

    // Should navigate to loans step (no validation on income)
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/en/householdbudget",
          query: expect.objectContaining({
            steg: "lan",
          }),
        })
      );
    });
  });
});
