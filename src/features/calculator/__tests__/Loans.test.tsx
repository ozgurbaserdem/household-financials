import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

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
        numberOfAdults="1"
        values={{
          loanAmount: 0,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: false,
        }}
        onChange={mockOnChange}
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
        numberOfAdults="1"
        values={{
          loanAmount: 0,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: false,
        }}
        onChange={mockOnChange}
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
        numberOfAdults="1"
        values={{
          loanAmount: 100000,
          interestRate: 4.5,
          amortizationRate: 3,
          hasLoan: true,
        }}
        onChange={mockOnChange}
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
        numberOfAdults="1"
        values={{
          loanAmount: 0,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: true,
        }}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText("loan_amount")).toBeInTheDocument();
    expect(screen.getAllByLabelText("interest_rate_aria")).toHaveLength(2);
    expect(screen.getAllByLabelText("amortization_rate_aria")).toHaveLength(2);
  });

  it("updates loan amount correctly", async () => {
    render(
      <Loans
        numberOfAdults="1"
        values={{
          loanAmount: 0,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: true,
        }}
        onChange={mockOnChange}
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
        numberOfAdults="1"
        values={{
          loanAmount: 100000,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: true,
        }}
        onChange={mockOnChange}
      />
    );

    const interestRateInputs = screen.getAllByLabelText("interest_rate_aria");
    const interestRateSlider = interestRateInputs.find(
      (input) => input.getAttribute("type") === "range"
    );
    expect(interestRateSlider).toBeTruthy();
    fireEvent.change(interestRateSlider as HTMLElement, {
      target: { value: "4.5" },
    });

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
        numberOfAdults="1"
        values={{
          loanAmount: 100000,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: true,
        }}
        onChange={mockOnChange}
      />
    );

    const amortizationRateInputs = screen.getAllByLabelText(
      "amortization_rate_aria"
    );
    const amortizationRateSlider = amortizationRateInputs.find(
      (input) => input.getAttribute("type") === "range"
    );
    expect(amortizationRateSlider).toBeTruthy();
    fireEvent.change(amortizationRateSlider as HTMLElement, {
      target: { value: "3" },
    });

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
        numberOfAdults="1"
        values={{
          loanAmount: 1000000,
          interestRate: 3.6,
          amortizationRate: 2.4,
          hasLoan: true,
        }}
        onChange={mockOnChange}
      />
    );

    // Monthly payment = 1000000 * ((3.6 + 2.4) / 100 / 12) = 1000000 * 0.06 / 12 = 5000
    expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();
    expect(screen.getByText(/5 000 kr/)).toBeInTheDocument();
  });

  it("shows no loan message when hasLoan is false", () => {
    render(
      <Loans
        numberOfAdults="2"
        values={{
          loanAmount: 0,
          interestRate: 3.5,
          amortizationRate: 2,
          hasLoan: false,
        }}
        onChange={mockOnChange}
      />
    );

    // Should show the "no loan" button as active
    const noLoanButton = screen.getByRole("button", { name: "no_loan" });
    expect(noLoanButton).toHaveClass("border-yellow-400");
  });
});
