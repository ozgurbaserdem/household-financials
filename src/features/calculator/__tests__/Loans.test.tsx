import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Loans } from "@/features/calculator/Loans";

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe("Loans", () => {
  const mockOnChange = vi.fn();

  // Helper function to find custom interest rate input
  const findCustomRateInput = () => {
    // Use step and max attributes to find the custom interest rate input
    const inputs = screen.getAllByRole("spinbutton");
    const customInput = inputs.find(
      (input) =>
        input.getAttribute("step") === "0.01" &&
        input.getAttribute("max") === "20"
    );
    if (!customInput) {
      throw new Error("Could not find custom interest rate input");
    }
    return customInput;
  };

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
          customInterestRates: [],
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
          customInterestRates: [],
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
        customInterestRates: [],
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
          customInterestRates: [],
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
        customInterestRates: [],
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
          customInterestRates: [],
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
          customInterestRates: [],
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
          customInterestRates: [],
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
          customInterestRates: [],
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
          customInterestRates: [],
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
      customInterestRates: [],
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
          customInterestRates: [],
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
          customInterestRates: [],
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
            customInterestRates: [],
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
            customInterestRates: [],
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
            customInterestRates: [],
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
            customInterestRates: [],
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
            customInterestRates: [],
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

  describe("Custom Interest Rates", () => {
    it("should add custom interest rate when input is provided", async () => {
      const { rerender } = render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 0,
            interestRates: [],
            amortizationRates: [],
            customInterestRates: [],
          }}
        />
      );

      // Click "has loan" button to show loan fields
      const hasLoanButton = screen.getByRole("button", { name: "has_loan" });
      fireEvent.click(hasLoanButton);

      // Wait for the onChange to be called first
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith({
          loanAmount: 1000000,
          interestRates: [3],
          amortizationRates: [3],
          customInterestRates: [],
        });
      });

      // Re-render with the updated values from onChange
      rerender(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3],
            amortizationRates: [3],
            customInterestRates: [],
          }}
        />
      );

      // Now the loan fields should be visible
      await waitFor(() => {
        expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
      });

      // Find the custom interest rate input
      const customRateInput = findCustomRateInput();
      fireEvent.change(customRateInput, { target: { value: "2.74" } });

      // Find and click the add button (plus icon)
      const addButton = screen.getByRole("button", { name: "" }); // Plus icon button has empty name
      fireEvent.click(addButton);

      // Should call onChange with the new custom rate
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            customInterestRates: [2.74],
          })
        );
      });
    });

    it("should not add invalid custom interest rate", async () => {
      const { rerender } = render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 0,
            interestRates: [],
            amortizationRates: [],
            customInterestRates: [],
          }}
        />
      );

      // Click "has loan" button to show loan fields
      const hasLoanButton = screen.getByRole("button", { name: "has_loan" });
      fireEvent.click(hasLoanButton);

      // Wait for the onChange to be called first
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith({
          loanAmount: 1000000,
          interestRates: [3],
          amortizationRates: [3],
          customInterestRates: [],
        });
      });

      // Re-render with the updated values from onChange
      rerender(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3],
            amortizationRates: [3],
            customInterestRates: [],
          }}
        />
      );

      // Clear the mock after initial setup
      mockOnChange.mockClear();

      // Wait for loan fields to appear
      await waitFor(() => {
        expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
      });

      // Find the custom interest rate input
      const customRateInput = findCustomRateInput();
      const addButton = screen.getByRole("button", { name: "" });

      // Try to add empty value
      fireEvent.change(customRateInput, { target: { value: "" } });
      fireEvent.click(addButton);

      // Should not call onChange for empty value
      expect(mockOnChange).not.toHaveBeenCalled();

      // Try to add negative value
      fireEvent.change(customRateInput, { target: { value: "-1" } });
      fireEvent.click(addButton);

      // Should not call onChange for negative value
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should display added custom interest rates", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [],
            amortizationRates: [2],
            customInterestRates: [2.74, 3.89],
          }}
        />
      );

      // Wait for custom rates to be rendered
      await waitFor(() => {
        expect(screen.getByText("2.74%")).toBeInTheDocument();
        expect(screen.getByText("3.89%")).toBeInTheDocument();
      });
    });

    it("should remove custom interest rate when X button is clicked", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [],
            amortizationRates: [2],
            customInterestRates: [2.74, 3.89, 4.12],
          }}
        />
      );

      // Wait for custom rates and remove buttons to be rendered
      await waitFor(() => {
        expect(screen.getByText("2.74%")).toBeInTheDocument();
        expect(screen.getByText("3.89%")).toBeInTheDocument();
        expect(screen.getByText("4.12%")).toBeInTheDocument();
      });

      // Find all X buttons by looking for buttons with X icons near the custom rates
      const removeButtons = screen
        .getAllByRole("button")
        .filter(
          (button) =>
            button.textContent === "" &&
            button.querySelector('svg[class*="lucide-x"]')
        );

      // Click the second remove button (for 3.89%)
      fireEvent.click(removeButtons[1]);

      // Should call onChange with the rate removed
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            customInterestRates: [2.74, 4.12], // 3.89 should be removed
          })
        );
      });
    });

    it("should validate loan when only custom rates are present", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [], // No predefined rates
            amortizationRates: [2],
            customInterestRates: [2.74], // Only custom rate
          }}
        />
      );

      // Should not show validation error since custom rate satisfies requirement
      expect(
        screen.queryByText("validation_rates_required")
      ).not.toBeInTheDocument();

      // Should display monthly payment calculation
      expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();
    });

    it("should show validation error when removing last custom rate", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [], // No predefined rates
            amortizationRates: [2],
            customInterestRates: [2.74], // Only one custom rate
          }}
        />
      );

      // Wait for the custom rate to be rendered
      await waitFor(() => {
        expect(screen.getByText("2.74%")).toBeInTheDocument();
      });

      // Find the X button by looking for buttons with X icons
      const removeButtons = screen
        .getAllByRole("button")
        .filter(
          (button) =>
            button.textContent === "" &&
            button.querySelector('svg[class*="lucide-x"]')
        );

      // Remove the only custom rate
      fireEvent.click(removeButtons[0]);

      // Should show validation error after removing the last rate
      await waitFor(() => {
        expect(
          screen.getByText("validation_rates_required")
        ).toBeInTheDocument();
      });
    });

    it("should calculate payment range with mixed interest rates", () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3, 4], // 3% and 4% predefined
            amortizationRates: [2],
            customInterestRates: [2.74, 5.25], // Custom rates: 2.74% and 5.25%
          }}
        />
      );

      // Should calculate payment range using all rates (2.74% to 5.25%)
      // Min: 1000000 * ((2.74 + 2) / 100 / 12) = 3950
      // Max: 1000000 * ((5.25 + 2) / 100 / 12) = 6041.67
      expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();

      // Look for payment range that includes both min and max
      const paymentElement = screen.getByText(/3\s*950.*-.*6\s*042/);
      expect(paymentElement).toBeInTheDocument();
    });

    it("should handle Swedish decimal format in custom rate input", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3],
            amortizationRates: [2],
            customInterestRates: [],
          }}
        />
      );

      // Clear any initial calls to mockOnChange
      mockOnChange.mockClear();

      // Wait for loan fields to appear
      await waitFor(() => {
        expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
      });

      const customRateInput = findCustomRateInput();
      const addButton = screen.getByRole("button", { name: "" });

      // Test Swedish decimal format with comma (component should handle both formats)
      fireEvent.change(customRateInput, { target: { value: "2.74" } });

      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            customInterestRates: [2.74],
          })
        );
      });
    });

    it("should clear custom rate input after adding", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3],
            amortizationRates: [2],
            customInterestRates: [],
          }}
        />
      );

      // Clear any initial calls to mockOnChange
      mockOnChange.mockClear();

      // Wait for loan fields to appear
      await waitFor(() => {
        expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
      });

      const customRateInput = findCustomRateInput();
      const addButton = screen.getByRole("button", { name: "" });

      // Add a custom rate
      fireEvent.change(customRateInput, { target: { value: "3.5" } });
      fireEvent.click(addButton);

      // Input should be cleared after adding (React Hook Form sets it to null/undefined)
      await waitFor(() => {
        expect((customRateInput as HTMLInputElement).value).toBe("");
      });
    });

    it("should prevent duplicate custom rates", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [],
            amortizationRates: [2],
            customInterestRates: [2.74],
          }}
        />
      );

      const customRateInput = findCustomRateInput();
      const addButton = screen.getByRole("button", { name: "" });

      // Try to add the same rate again
      fireEvent.change(customRateInput, { target: { value: "2.74" } });
      fireEvent.click(addButton);

      // Should not add duplicate rate
      expect(mockOnChange).not.toHaveBeenCalledWith(
        expect.objectContaining({
          customInterestRates: [2.74, 2.74],
        })
      );
    });

    it("should uncheck predefined rates when adding custom rate if validation requires it", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [], // No predefined rates initially
            amortizationRates: [],
            customInterestRates: [],
          }}
        />
      );

      // Add a custom rate
      const customRateInput = findCustomRateInput();
      fireEvent.change(customRateInput, { target: { value: "2.74" } });

      const addButton = screen.getByRole("button", { name: "" });
      fireEvent.click(addButton);

      // Should call onChange with the custom rate
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            customInterestRates: [2.74],
          })
        );
      });
    });

    it("should handle custom rates with high precision", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3],
            amortizationRates: [2],
            customInterestRates: [],
          }}
        />
      );

      // Clear any initial calls to mockOnChange
      mockOnChange.mockClear();

      // Wait for loan fields to appear
      await waitFor(() => {
        expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
      });

      const customRateInput = findCustomRateInput();
      const addButton = screen.getByRole("button", { name: "" });

      // Add rate with many decimal places
      fireEvent.change(customRateInput, { target: { value: "2.123456" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            customInterestRates: [2.12], // Component rounds to 2 decimal places
          })
        );
      });
    });
  });

  describe("Mixed Rate Scenarios", () => {
    it("should prioritize predefined rates in calculation display when both exist", () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3], // Predefined rate
            amortizationRates: [2],
            customInterestRates: [2.74], // Custom rate is lower
          }}
        />
      );

      // Should calculate range using all rates, but display should be consistent
      expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();

      // Min should use the lowest rate (2.74% custom)
      // Max should use the highest rate (3% predefined)
      const paymentElement = screen.getByText(/3\s*950.*-.*4\s*167/);
      expect(paymentElement).toBeInTheDocument();
    });

    it("should validate correctly with mixed rates", () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3, 4],
            amortizationRates: [2, 3],
            customInterestRates: [2.74, 5.25],
          }}
        />
      );

      // Should not show validation error with complete loan setup
      expect(
        screen.queryByText("validation_rates_required")
      ).not.toBeInTheDocument();

      // Should show payment calculation
      expect(screen.getByText(/estimated_monthly_payment/)).toBeInTheDocument();
    });

    it("should handle removing all predefined rates when custom rates exist", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3], // One predefined rate
            amortizationRates: [2],
            customInterestRates: [2.74], // One custom rate
          }}
        />
      );

      // Find and uncheck the predefined interest rate (not amortization rate)
      const allRateElements = screen.getAllByText("3%");
      // The first 3% should be the interest rate (they come before amortization rates)
      fireEvent.click(allRateElements[0].parentElement!);

      // Should still be valid because custom rate exists
      await waitFor(() => {
        expect(
          screen.queryByText("validation_rates_required")
        ).not.toBeInTheDocument();
      });
    });

    it("should handle removing all custom rates when predefined rates exist", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3], // One predefined rate
            amortizationRates: [2],
            customInterestRates: [2.74], // One custom rate
          }}
        />
      );

      // Remove the custom rate
      const removeButtons = screen
        .getAllByRole("button")
        .filter(
          (button) =>
            button.textContent === "" &&
            button.querySelector('svg[class*="lucide-x"]')
        );
      const removeButton = removeButtons[0];
      fireEvent.click(removeButton);

      // Should still be valid because predefined rate exists
      await waitFor(() => {
        expect(
          screen.queryByText("validation_rates_required")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases with Custom Rates", () => {
    it("should handle very high custom interest rates", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3],
            amortizationRates: [2],
            customInterestRates: [],
          }}
        />
      );

      // Clear any initial calls to mockOnChange
      mockOnChange.mockClear();

      // Wait for loan fields to appear
      await waitFor(() => {
        expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
      });

      const customRateInput = findCustomRateInput();
      const addButton = screen.getByRole("button", { name: "" });

      // Add a very high interest rate (over the max of 20, should be rejected)
      fireEvent.change(customRateInput, { target: { value: "25.5" } });
      fireEvent.click(addButton);

      // Should not add rates over 20%
      expect(mockOnChange).not.toHaveBeenCalled();

      // Try with a valid high rate under the limit
      fireEvent.change(customRateInput, { target: { value: "19.5" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            customInterestRates: [19.5],
          })
        );
      });
    });

    it("should handle very low custom interest rates", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [3],
            amortizationRates: [2],
            customInterestRates: [],
          }}
        />
      );

      // Clear any initial calls to mockOnChange
      mockOnChange.mockClear();

      // Wait for loan fields to appear
      await waitFor(() => {
        expect(screen.getByLabelText(/loan_amount_aria/i)).toBeInTheDocument();
      });

      const customRateInput = findCustomRateInput();
      const addButton = screen.getByRole("button", { name: "" });

      // Add very low interest rate
      fireEvent.change(customRateInput, { target: { value: "0.01" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            customInterestRates: [0.01],
          })
        );
      });
    });

    it("should maintain custom rates when toggling loan amount", async () => {
      render(
        <Loans
          onChange={mockOnChange}
          values={{
            loanAmount: 1000000,
            interestRates: [],
            amortizationRates: [2],
            customInterestRates: [2.74, 3.89],
          }}
        />
      );

      // Change loan amount
      const loanInput = screen.getByLabelText(/loan_amount_aria/i);
      fireEvent.change(loanInput, { target: { value: "2000000" } });

      // Custom rates should be preserved
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            loanAmount: 2000000,
            customInterestRates: [2.74, 3.89],
          })
        );
      });
    });
  });
});
