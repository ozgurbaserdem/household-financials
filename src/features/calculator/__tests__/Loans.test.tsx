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
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: false,
        }}
        numberOfAdults="1"
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
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: false,
        }}
        numberOfAdults="1"
      />
    );

    const hasLoanButton = screen.getByRole("button", { name: "has_loan" });
    fireEvent.click(hasLoanButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        loanAmount: 0,
        interestRate: 3.5,
        amortizationRate: 2,
        hasLoan: true,
      });
    });
  });

  it("toggles from has loan to no loan correctly", async () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 100000,
          interestRate: 4.5,
          amortizationRate: 3,
          hasLoan: true,
        }}
        numberOfAdults="1"
      />
    );

    const noLoanButton = screen.getByRole("button", { name: "no_loan" });
    fireEvent.click(noLoanButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        loanAmount: 0,
        interestRate: 3.5,
        amortizationRate: 2,
        hasLoan: false,
      });
    });
  });

  it("shows loan amount input when has loan is selected", () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 0,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: true,
        }}
        numberOfAdults="1"
      />
    );

    expect(screen.getByLabelText("loan_amount")).toBeInTheDocument();
    expect(screen.getByLabelText("interest_rate_aria")).toBeInTheDocument();
    expect(screen.getByLabelText("amortization_rate_aria")).toBeInTheDocument();
  });

  it("updates loan amount correctly", async () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 0,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: true,
        }}
        numberOfAdults="1"
      />
    );

    const loanAmountInput = screen.getByLabelText("loan_amount");
    fireEvent.change(loanAmountInput, { target: { value: "500000" } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        loanAmount: 500000,
        interestRate: 3.5,
        amortizationRate: 2,
        hasLoan: true,
      });
    });
  });

  it("updates interest rate correctly", async () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 100000,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: true,
        }}
        numberOfAdults="1"
      />
    );

    const interestRateInput = screen.getByLabelText("interest_rate_aria");
    fireEvent.change(interestRateInput, { target: { value: "4.5" } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        loanAmount: 100000,
        interestRate: 4.5,
        amortizationRate: 2,
        hasLoan: true,
      });
    });
  });

  it("updates amortization rate correctly", async () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 100000,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: true,
        }}
        numberOfAdults="1"
      />
    );

    const amortizationRateInput = screen.getByLabelText(
      "amortization_rate_aria"
    );
    fireEvent.change(amortizationRateInput, { target: { value: "3" } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        loanAmount: 100000,
        interestRate: 3.5,
        amortizationRate: 3,
        hasLoan: true,
      });
    });
  });

  it("calculates monthly payment display correctly", () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 1000000,
          interestRate: 3.6,
          amortizationRate: 2.4,
          hasLoan: true,
        }}
        numberOfAdults="1"
      />
    );

    // Monthly payment = 1000000 * ((3.6 + 2.4) / 100 / 12) = 1000000 * 0.06 / 12 = 5000
    expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();
    expect(screen.getByText(/5 000 kr/)).toBeInTheDocument();
  });

  it("shows no loan message when hasLoan is false", () => {
    render(
      <Loans
        onChange={mockOnChange}
        values={{
          loanAmount: 0,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: false,
        }}
        numberOfAdults="2"
      />
    );

    // Should show the "no loan" button as active
    const noLoanButton = screen.getByRole("button", { name: "no_loan" });
    expect(noLoanButton).toHaveClass("bg-gradient-to-r");
  });
});
