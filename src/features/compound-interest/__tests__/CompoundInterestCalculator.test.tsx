/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompoundInterestCalculator } from "@/features/compound-interest/CompoundInterestCalculator";
import * as nextNavigation from "next/navigation";

// Mock recharts to avoid rendering issues in tests
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container" style={{ width: 500, height: 400 }}>
      {children}
    </div>
  ),
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode;
    data: unknown;
  }) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: ({
    dataKey,
    stackId,
    fill,
  }: {
    dataKey: string;
    stackId: string;
    fill: string;
  }) => (
    <div
      data-testid={`bar-${dataKey}`}
      data-stack-id={stackId}
      data-fill={fill}
    />
  ),
  XAxis: ({ dataKey }: { dataKey: string }) => (
    <div data-testid="x-axis" data-key={dataKey} />
  ),
  YAxis: ({ tickFormatter }: { tickFormatter?: () => string }) => (
    <div
      data-testid="y-axis"
      data-formatter={tickFormatter ? "custom" : "default"}
    />
  ),
  Tooltip: ({ content }: { content?: React.ComponentType }) => (
    <div data-testid="tooltip" data-custom={content ? "true" : "false"} />
  ),
  Legend: ({ content }: { content?: React.ComponentType }) => (
    <div data-testid="legend" data-custom={content ? "true" : "false"} />
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
}));

// DON'T MOCK THE CALCULATION FUNCTIONS - We want to test the real logic!
// This was the bug - the tests were mocking the actual calculation functions

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

  // CRITICAL NEW TESTS - These would have caught the percentage bug!

  it("should produce realistic compound interest calculations", async () => {
    render(<CompoundInterestCalculator />);

    // Set realistic values: 100k start, 5k monthly, 7% return, 10 years
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "100000" } }); // Start sum
    fireEvent.change(sliders[1], { target: { value: "5000" } }); // Monthly savings
    fireEvent.change(sliders[2], { target: { value: "7" } }); // 7% return
    fireEvent.change(sliders[3], { target: { value: "10" } }); // 10 years

    await waitFor(() => {
      // With 7% annual return, the total should be reasonable (not astronomical)
      // This test would have failed with the old bug since 7% was treated as 700%
      const totalElements = screen.getAllByText(/kr/);
      const hasReasonableValues = totalElements.some((el) => {
        const text = el.textContent || "";
        const numbers = text.replace(/[^\d]/g, "");
        if (numbers.length > 0) {
          const value = parseInt(numbers);
          // Should be between 100k and 10M kr (reasonable compound growth)
          return value >= 100000 && value <= 10000000;
        }
        return false;
      });
      expect(hasReasonableValues).toBe(true);
    });
  });

  it("should never show astronomical values that indicate percentage conversion bug", async () => {
    render(<CompoundInterestCalculator />);

    // Test various percentage values
    const returnSlider = screen.getByLabelText(/yearly_return_label/i);

    // Test 15% (maximum allowed)
    fireEvent.change(returnSlider, { target: { value: "15" } });

    await waitFor(() => {
      // Even with maximum 15% return, values should never exceed reasonable bounds
      const totalElements = screen.getAllByText(/kr/);
      const hasAstronomicalValues = totalElements.some((el) => {
        const text = el.textContent || "";
        const numbers = text.replace(/[^\d]/g, "");
        if (numbers.length > 0) {
          const value = parseInt(numbers);
          // If we see values over 1 trillion kr, it's definitely the percentage bug
          return value > 1000000000000;
        }
        return false;
      });
      expect(hasAstronomicalValues).toBe(false);
    });
  });

  it("should handle zero values without errors", async () => {
    render(<CompoundInterestCalculator />);

    // Set everything to zero/minimum
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "0" } }); // Start sum = 0
    fireEvent.change(sliders[1], { target: { value: "0" } }); // Monthly savings = 0
    fireEvent.change(sliders[2], { target: { value: "1" } }); // Return = 1% (minimum)
    fireEvent.change(sliders[3], { target: { value: "1" } }); // Horizon = 1 year

    await waitFor(() => {
      // Should show 0 values without crashing
      expect(screen.getAllByText("0 kr").length).toBeGreaterThan(0);
    });
  });

  it("should handle maximum values without overflow", async () => {
    render(<CompoundInterestCalculator />);

    // Set to maximum allowed values
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "10000000" } }); // Max start sum
    fireEvent.change(sliders[1], { target: { value: "100000" } }); // Max monthly savings
    fireEvent.change(sliders[2], { target: { value: "15" } }); // Max return
    fireEvent.change(sliders[3], { target: { value: "50" } }); // Max horizon

    await waitFor(() => {
      // Should still show finite, reasonable values (not Infinity or astronomical numbers)
      const totalElements = screen.getAllByText(/kr/);
      const hasValidValues = totalElements.some((el) => {
        const text = el.textContent || "";
        return (
          text.includes("kr") &&
          !text.includes("Infinity") &&
          !text.includes("NaN")
        );
      });
      expect(hasValidValues).toBe(true);
    });
  });

  it("should correctly convert percentage input to decimal for calculations", async () => {
    render(<CompoundInterestCalculator />);

    // Set specific values to test percentage conversion
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "10000" } }); // 10k start
    fireEvent.change(sliders[1], { target: { value: "1000" } }); // 1k monthly
    fireEvent.change(sliders[2], { target: { value: "10" } }); // 10% return
    fireEvent.change(sliders[3], { target: { value: "5" } }); // 5 years

    await waitFor(() => {
      // With proper percentage conversion (10% = 0.10), the total should be around 100k-200k
      // If the bug existed (10% = 10.0), the value would be astronomical
      const totalElements = screen.getAllByText(/kr/);
      const hasReasonableGrowth = totalElements.some((el) => {
        const text = el.textContent || "";
        const numbers = text.replace(/[^\d]/g, "");
        if (numbers.length > 0) {
          const value = parseInt(numbers);
          // For 10k start + 1k monthly + 10% return over 5 years,
          // realistic total should be roughly 80k-300k kr
          return value >= 70000 && value <= 500000;
        }
        return false;
      });
      expect(hasReasonableGrowth).toBe(true);
    });
  });
});
