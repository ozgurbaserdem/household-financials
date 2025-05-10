import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

describe("CalculatorForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup ResizeObserver mock
    window.ResizeObserver = ResizeObserverMock;
  });

  it("renders all form fields", () => {
    render(<CalculatorForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interest_rates_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/income1_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/income2_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/running_costs_aria/i)).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    render(<CalculatorForm onSubmit={mockOnSubmit} />);

    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/loan_amount_aria/i), {
      target: { value: "1000000" },
    });
    fireEvent.change(screen.getByLabelText(/income1_aria/i), {
      target: { value: "30000" },
    });
    fireEvent.change(screen.getByLabelText(/income2_aria/i), {
      target: { value: "25000" },
    });
    fireEvent.change(screen.getByLabelText(/running_costs_aria/i), {
      target: { value: "5000" },
    });

    // Ensure at least one interest and amortization rate is checked
    const interestRateCheckbox = screen.getAllByLabelText("3.5%")[0];
    if (interestRateCheckbox.getAttribute("aria-checked") !== "true") {
      fireEvent.click(interestRateCheckbox);
    }
    const amortizationRateCheckbox = screen.getAllByLabelText("2%")[0];
    if (amortizationRateCheckbox.getAttribute("aria-checked") !== "true") {
      fireEvent.click(amortizationRateCheckbox);
    }

    // Submit the form
    fireEvent.click(screen.getByText(/calculate/i));

    // Wait for the async form submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const submittedData = mockOnSubmit.mock.calls[0][0];
    expect(submittedData.loanParameters.amount).toBe(1000000);
    expect(submittedData.loanParameters.interestRates).toContain(3.5);
    expect(submittedData.grossIncome1).toBe(30000);
    expect(submittedData.grossIncome2).toBe(25000);
    expect(submittedData.runningCosts).toBe(5000);
  });

  it("handles extra incomes section toggle", () => {
    render(<CalculatorForm onSubmit={mockOnSubmit} />);

    // Initially, the extra incomes section should be collapsed
    const toggleButton = screen.getByText("add_extra_incomes");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    // Click to expand
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    // Click to collapse
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("initializes with provided values", () => {
    const initialValues = {
      loanAmount: 1000000,
      interestRates: [3.5],
      amortizationRates: [2],
      income1: 30000,
      income2: 25000,
      income3: 0,
      income4: 0,
      runningCosts: 2000,
    };

    render(<CalculatorForm onSubmit={mockOnSubmit} values={initialValues} />);

    expect(screen.getByLabelText(/loan_amount_aria/i)).toHaveValue(1000000);
    expect(screen.getByLabelText(/income1_aria/i)).toHaveValue(30000);
    expect(screen.getByLabelText(/income2_aria/i)).toHaveValue(25000);
    expect(screen.getByLabelText(/running_costs_aria/i)).toHaveValue(2000);
  });
});
