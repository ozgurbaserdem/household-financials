import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Loans } from "@/components/calculator/Loans";

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

describe("Loans", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.ResizeObserver = ResizeObserverMock;
  });

  it("renders all loan fields", () => {
    render(
      <Loans
        onSubmit={mockOnSubmit}
        values={{
          loanAmount: 1000000,
          interestRates: [3.5],
          amortizationRates: [2],
        }}
      />
    );
    expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interest_rates_aria/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/amortization_rates_aria/i)
    ).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    render(
      <Loans
        onSubmit={mockOnSubmit}
        values={{
          loanAmount: 1000000,
          interestRates: [3.5],
          amortizationRates: [2],
        }}
      />
    );
    fireEvent.change(screen.getByLabelText(/loan_amount_aria/i), {
      target: { value: "2000000" },
    });
    // Check and uncheck interest and amortization rates
    const interestCheckbox = screen.getAllByLabelText("3.5%")[0];
    if (interestCheckbox.getAttribute("aria-checked") !== "true") {
      fireEvent.click(interestCheckbox);
    }
    const amortizationCheckbox = screen.getAllByLabelText("2%")[0];
    if (amortizationCheckbox.getAttribute("aria-checked") !== "true") {
      fireEvent.click(amortizationCheckbox);
    }
    // Submit the form
    fireEvent.submit(screen.getByTestId("loan-form"));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          loanParameters: expect.objectContaining({
            amount: 2000000,
            interestRates: expect.arrayContaining([3.5]),
            amortizationRates: expect.arrayContaining([2]),
          }),
        })
      );
    });
  });

  it.only("initializes with provided values", () => {
    const initialValues = {
      loanAmount: 1000000,
      interestRates: [3.5],
      amortizationRates: [2],
    };
    render(<Loans onSubmit={mockOnSubmit} values={initialValues} />);
    expect(screen.getByLabelText(/loan_amount_aria/i)).toHaveValue(1000000);
    // Interest and amortization rates are checked
    expect(screen.getAllByLabelText("3.5%")[0]).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getAllByLabelText("2%")[1]).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
