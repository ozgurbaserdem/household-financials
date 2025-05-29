/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompoundInterestCalculator } from "@/components/compound-interest/CompoundInterestCalculator";
import * as nextNavigation from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

// Mock next-intl
vi.mock("next-intl", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useTranslations: () => (key: string, values?: Record<string, unknown>) => {
      // Simple mock that returns the key
      if (values) {
        let result = key;
        Object.entries(values).forEach(([k, v]) => {
          result = result.replace(`{${k}}`, String(v));
        });
        return result;
      }
      return key;
    },
  };
});

// Mock the calculation functions
vi.mock("@/lib/compound-interest", () => ({
  calculateCompoundInterest: vi.fn((inputs) => {
    // Simple mock implementation
    const years = [];
    for (let year = 0; year <= inputs.investmentHorizon; year++) {
      years.push({
        year,
        startSum: inputs.startSum,
        accumulatedSavings: inputs.monthlySavings * 12 * year,
        compoundReturns: year * 1000, // Simple mock
        totalValue:
          inputs.startSum + inputs.monthlySavings * 12 * year + year * 1000,
      });
    }
    return years;
  }),
  calculateFinalValues: vi.fn((inputs) => {
    const years = inputs.investmentHorizon;
    const totalSavings = inputs.monthlySavings * 12 * years;
    const totalReturns = years * 1000;
    return {
      totalValue: inputs.startSum + totalSavings + totalReturns,
      startSum: inputs.startSum,
      totalSavings: totalSavings,
      totalReturns: totalReturns,
    };
  }),
}));

describe("CompoundInterestCalculator", () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (nextNavigation.useRouter as any).mockReturnValue(mockRouter);
    (nextNavigation.useSearchParams as any).mockReturnValue(
      new URLSearchParams()
    );
  });

  it("should render all input fields with default values", () => {
    render(<CompoundInterestCalculator />);

    // Check for all sliders
    expect(screen.getByLabelText(/start_sum_label/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly_savings_label/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/yearly_return_label/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/investment_horizon_label/i)
    ).toBeInTheDocument();

    // Check default values (component defaults: startSum=0, monthlySavings=5000, yearlyReturn=7, investmentHorizon=20)
    expect(screen.getAllByText("0 kr")[0]).toBeInTheDocument(); // Start sum
    expect(screen.getByText("5 000 kr/mån")).toBeInTheDocument(); // Monthly savings
    expect(screen.getByText("7%")).toBeInTheDocument(); // Yearly return
    expect(screen.getByText("20 år")).toBeInTheDocument(); // Investment horizon
  });

  it("should update values when sliders are moved", async () => {
    render(<CompoundInterestCalculator />);

    const startSumSlider = screen.getByLabelText(/start_sum_label/i);

    // Change start sum
    fireEvent.change(startSumSlider, { target: { value: "100000" } });

    await waitFor(() => {
      expect(screen.getAllByText("100 000 kr")[0]).toBeInTheDocument();
    });
  });

  it("should handle URL parameter for monthly savings", () => {
    const searchParams = new URLSearchParams({ monthlySavings: "8000" });
    (nextNavigation.useSearchParams as any).mockReturnValue(searchParams);

    render(<CompoundInterestCalculator />);

    expect(screen.getByText("8 000 kr/mån")).toBeInTheDocument();
  });

  it("should allow manual input when clicking on values", async () => {
    const user = userEvent.setup();
    render(<CompoundInterestCalculator />);

    // Click on start sum value (default is 0) - get the input button, not results
    const startSumValue = screen.getAllByText("0 kr")[0];
    await user.click(startSumValue);

    // Should show input field
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("0");

    // Type new value
    await user.clear(input);
    await user.type(input, "75000");
    await user.keyboard("{Enter}");

    // Should update display
    await waitFor(() => {
      expect(screen.getAllByText("75 000 kr")[0]).toBeInTheDocument();
    });
  });

  it("should validate manual input within bounds", async () => {
    const user = userEvent.setup();
    render(<CompoundInterestCalculator />);

    // Click on monthly savings value
    const monthlyValue = screen.getByText("5 000 kr/mån");
    await user.click(monthlyValue);

    const input = screen.getByRole("textbox");

    // Try to enter value above maximum
    await user.clear(input);
    await user.type(input, "150000");
    await user.keyboard("{Enter}");

    // Should cap at maximum (100000)
    await waitFor(() => {
      expect(screen.getByText("100 000 kr/mån")).toBeInTheDocument();
    });
  });

  it("should handle percentage input for yearly return", async () => {
    const user = userEvent.setup();
    render(<CompoundInterestCalculator />);

    // Click on return value
    const returnValue = screen.getByText("7%");
    await user.click(returnValue);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("7");

    // Change to 10.5%
    await user.clear(input);
    await user.type(input, "10.5");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("10,5%")).toBeInTheDocument(); // Swedish decimal
    });
  });

  it("should display calculation results", () => {
    render(<CompoundInterestCalculator />);

    // Check for results section (translation keys)
    expect(screen.getByText(/results\.description/i)).toBeInTheDocument();

    // Check for key result values (translation keys)
    expect(screen.getByText(/results\.total_value/i)).toBeInTheDocument();
    expect(screen.getByText(/results\.compound_returns/i)).toBeInTheDocument();
  });

  it("should render the compound interest chart", () => {
    render(<CompoundInterestCalculator />);

    // Chart should be rendered
    expect(screen.getByTestId("compound-interest-chart")).toBeInTheDocument();
  });

  it("should close input on blur", async () => {
    const user = userEvent.setup();
    render(<CompoundInterestCalculator />);

    // Click on a value to edit (default start sum is 0) - get the input button
    const value = screen.getAllByText("0 kr")[0];
    await user.click(value);

    // Input should be visible
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    // Click outside
    await user.click(document.body);

    // Input should be hidden
    await waitFor(() => {
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });

  it("should handle edge case values", async () => {
    render(<CompoundInterestCalculator />);

    // Set all values to minimum
    const sliders = screen.getAllByRole("slider");

    fireEvent.change(sliders[0], { target: { value: "0" } }); // Start sum
    fireEvent.change(sliders[1], { target: { value: "0" } }); // Monthly savings
    fireEvent.change(sliders[2], { target: { value: "1" } }); // Return
    fireEvent.change(sliders[3], { target: { value: "1" } }); // Horizon

    await waitFor(() => {
      const zeroKrElements = screen.getAllByText("0 kr");
      expect(zeroKrElements.length).toBeGreaterThan(0); // Start sum
      expect(screen.getByText("0 kr/mån")).toBeInTheDocument(); // Monthly savings
      expect(screen.getByText("1%")).toBeInTheDocument();
      expect(screen.getByText("1 år")).toBeInTheDocument();
    });
  });

  it("should highlight field when coming from query parameter", () => {
    const searchParams = new URLSearchParams({ monthlySavings: "3000" });
    (nextNavigation.useSearchParams as any).mockReturnValue(searchParams);

    render(<CompoundInterestCalculator />);

    // Monthly savings field should have highlight styling - look for the parent with ring classes
    const monthlyText = screen.getByText("3 000 kr/mån");
    const monthlySection = monthlyText.closest(".space-y-2");
    expect(monthlySection?.className).toContain("ring-2 ring-purple-500");
  });

  it("should format large numbers correctly", async () => {
    render(<CompoundInterestCalculator />);

    const startSumSlider = screen.getByLabelText(/start_sum_label/i);

    // Set to large value
    fireEvent.change(startSumSlider, { target: { value: "5000000" } });

    await waitFor(() => {
      expect(screen.getAllByText("5 000 000 kr")[0]).toBeInTheDocument();
    });
  });

  it("should handle decimal values in sliders", async () => {
    render(<CompoundInterestCalculator />);

    const returnSlider = screen.getByLabelText(/yearly_return_label/i);

    // Set to decimal value
    fireEvent.change(returnSlider, { target: { value: "7.5" } });

    await waitFor(() => {
      expect(screen.getByText("7,5%")).toBeInTheDocument();
    });
  });
});
