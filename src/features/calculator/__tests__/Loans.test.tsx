import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Loans } from "@/features/calculator/Loans";

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe("Loans", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loan form with has loan/no loan toggle", () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 0,
          interestRates: [],
          amortizationRates: [],
        }}
      />
    );

    expect(
      screen.getByRole("button", { name: "has_loan" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "no_loan" })).toBeInTheDocument();
  });

  it("toggles from no loan to has loan correctly", async () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 0,
          interestRates: [],
          amortizationRates: [],
        }}
      />
    );

    // Click "has loan" button
    const hasLoanButton = screen.getByRole("button", { name: "has_loan" });
    fireEvent.click(hasLoanButton);

    // Should call onChange with default values
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        loanAmount: 1000000,
        interestRates: [3],
        amortizationRates: [3],
      });
    });

    // Loan fields should be visible
    expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
  });

  it("toggles from has loan to no loan correctly", async () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 2000000,
          interestRates: [4, 5],
          amortizationRates: [2, 3],
        }}
      />
    );

    // Click "no loan" button
    const noLoanButton = screen.getByRole("button", { name: "no_loan" });
    fireEvent.click(noLoanButton);

    // Should call onChange with zeroed values
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        loanAmount: 0,
        interestRates: [],
        amortizationRates: [],
      });
    });

    // Loan fields should not be visible
    expect(
      screen.queryByLabelText(/loan_amount_aria/i)
    ).not.toBeInTheDocument();
  });

  it("maintains hasLoan state when toggling back from no loan", async () => {
    const { rerender } = render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 2000000,
          interestRates: [4],
          amortizationRates: [2],
        }}
      />
    );

    // Toggle to no loan
    fireEvent.click(screen.getByRole("button", { name: "no_loan" }));

    // Update component with new values from onChange
    rerender(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 0,
          interestRates: [],
          amortizationRates: [],
        }}
      />
    );

    // Toggle back to has loan
    fireEvent.click(screen.getByRole("button", { name: "has_loan" }));

    // Should maintain the hasLoan state without reverting
    await waitFor(() => {
      expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
    });
  });

  it("shows validation error when loan amount is entered but no rates selected", async () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 0,
          interestRates: [],
          amortizationRates: [],
        }}
      />
    );

    // Click has loan
    fireEvent.click(screen.getByRole("button", { name: "has_loan" }));

    // Enter loan amount
    const loanInput = screen.getByLabelText(/loan_amount_aria/i);
    fireEvent.change(loanInput, { target: { value: "1500000" } });

    // Validation error should appear
    await waitFor(() => {
      expect(screen.getByText("validation_rates_required")).toBeInTheDocument();
    });
  });

  it("clears validation error when rates are selected", async () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 0,
          interestRates: [],
          amortizationRates: [],
        }}
      />
    );

    // First toggle to has loan
    fireEvent.click(screen.getByRole("button", { name: "has_loan" }));

    // Enter loan amount to trigger validation
    const loanInput = screen.getByLabelText(/loan_amount_aria/i);
    fireEvent.change(loanInput, { target: { value: "1000000" } });

    // Should show validation error after entering amount without rates
    await waitFor(() => {
      expect(screen.getByText("validation_rates_required")).toBeInTheDocument();
    });

    // Select interest rate
    const interestRate = screen.getAllByText("3%")[0];
    fireEvent.click(interestRate.parentElement!);

    // Select amortization rate
    const amortizationRate = screen.getAllByText("2%")[0];
    fireEvent.click(amortizationRate.parentElement!);

    // Validation error should disappear
    await waitFor(() => {
      expect(
        screen.queryByText("validation_rates_required")
      ).not.toBeInTheDocument();
    });
  });

  it("displays correct monthly payment calculation", () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 1000000,
          interestRates: [3],
          amortizationRates: [2],
        }}
      />
    );

    // Monthly payment should be displayed
    // (1000000 * ((3 + 2) / 100 / 12)) = 4166.67
    expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();
    // Check that the monthly payment appears somewhere (4 167 kr in Swedish format)
    const monthlyPayments = screen.getAllByText(/4\s*167/);
    expect(monthlyPayments.length).toBeGreaterThan(0);
  });

  it("preserves existing values when provided", () => {
    const initialValues = {
      loanAmount: 1500000,
      interestRates: [3.5, 4],
      amortizationRates: [2, 3],
    };

    render(<Loans onChange={mockOnChange} values={initialValues} />);

    expect(screen.getByLabelText(/loan_amount_aria/i)).toHaveValue(1500000);

    // Check that the correct rates are selected
    const interestRates = screen.getAllByRole("checkbox", { hidden: true });
    const rate35 = interestRates.find(
      (cb) => cb.parentElement?.textContent === "3.5%"
    );
    const rate4 = interestRates.find(
      (cb) => cb.parentElement?.textContent === "4%"
    );

    expect(rate35).toHaveAttribute("aria-checked", "true");
    expect(rate4).toHaveAttribute("aria-checked", "true");
  });

  it("allows multiple interest and amortization rates selection", async () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 1000000,
          interestRates: [],
          amortizationRates: [],
        }}
      />
    );

    // Click on the interest rate labels (which contain the checkboxes)
    const interestRateLabels = screen.getAllByText(/^\d+(\.\d+)?%$/);

    // Find and click 3%, 3.5%, and 4% for interest rates (first set of rates)
    fireEvent.click(interestRateLabels[5].parentElement!); // 3%
    fireEvent.click(interestRateLabels[6].parentElement!); // 3.5%
    fireEvent.click(interestRateLabels[7].parentElement!); // 4%

    // Find and click 2% and 3% for amortization rates (second set of rates)
    fireEvent.click(interestRateLabels[14].parentElement!); // 2%
    fireEvent.click(interestRateLabels[15].parentElement!); // 3%

    // Verify that onChange was called with the selected rates
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
      // Check the most recent call contains our selections
      const calls = mockOnChange.mock.calls;
      const hasAllRates = calls.some((call) => {
        const { interestRates, amortizationRates } = call[0];
        return (
          interestRates.includes(3) &&
          interestRates.includes(3.5) &&
          interestRates.includes(4) &&
          amortizationRates.includes(2) &&
          amortizationRates.includes(3)
        );
      });
      expect(hasAllRates).toBeTruthy();
    });
  });

  it("displays no loan message when hasLoan is false", () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 0,
          interestRates: [],
          amortizationRates: [],
        }}
      />
    );

    // Check that the no loan button is active (has default variant)
    const noLoanButton = screen.getByRole("button", { name: "no_loan" });
    expect(noLoanButton).toHaveClass("from-blue-600");

    // Loan fields should not be visible
    expect(
      screen.queryByLabelText(/loan_amount_aria/i)
    ).not.toBeInTheDocument();
  });

  describe("calculatePaymentRange", () => {
    it("displays single payment when only one rate combination is selected", () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3],
            amortizationRates: [2],
          }}
        />
      );

      // Should display single payment: 1000000 * ((3 + 2) / 100 / 12) = 4166.67
      // In Swedish format: 4 167 kr
      expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();
      const paymentText = screen.getByText(/4\s*167/);
      expect(paymentText).toBeInTheDocument();
      // Should not contain a dash (range separator)
      expect(paymentText.textContent).not.toContain("-");
    });

    it("displays payment range when multiple rate combinations are selected", () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [2, 4], // 2% and 4%
            amortizationRates: [1, 3], // 1% and 3%
          }}
        />
      );

      // Min payment: 1000000 * ((2 + 1) / 100 / 12) = 2500
      // Max payment: 1000000 * ((4 + 3) / 100 / 12) = 5833.33
      // Should display range in Swedish format: 2 500 kr - 5 833 kr
      expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();

      // Look for the range separator
      const paymentElement = screen.getByText(/2\s*500.*-.*5\s*833/);
      expect(paymentElement).toBeInTheDocument();
      expect(paymentElement.textContent).toContain("-");
    });

    it("displays zero payment when no rates are selected", () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [],
            amortizationRates: [],
          }}
        />
      );

      // Should display no_loan message instead of payment - specifically in the header area
      const headerArea = screen.getByText("title").closest("div");
      expect(headerArea).toHaveTextContent("no_loan");
      expect(
        screen.queryByText(/estimated_monthly_payment/)
      ).not.toBeInTheDocument();
    });

    it("displays zero payment when loan amount is zero", () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 0,
            interestRates: [3],
            amortizationRates: [2],
          }}
        />
      );

      // Should display no_loan message - specifically in the header area
      const headerArea = screen.getByText("title").closest("div");
      expect(headerArea).toHaveTextContent("no_loan");
      expect(
        screen.queryByText(/estimated_monthly_payment/)
      ).not.toBeInTheDocument();
    });

    it("calculates range correctly with multiple interest and amortization rates", () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 2000000,
            interestRates: [1, 2, 3], // 1%, 2%, 3%
            amortizationRates: [0, 1, 2], // 0%, 1%, 2%
          }}
        />
      );

      // Min payment: 2000000 * ((1 + 0) / 100 / 12) = 1666.67 ≈ 1 667 kr
      // Max payment: 2000000 * ((3 + 2) / 100 / 12) = 8333.33 ≈ 8 333 kr
      expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();

      // Look for the range with appropriate formatting
      const paymentElement = screen.getByText(/1\s*667.*-.*8\s*333/);
      expect(paymentElement).toBeInTheDocument();
    });
  });
});
