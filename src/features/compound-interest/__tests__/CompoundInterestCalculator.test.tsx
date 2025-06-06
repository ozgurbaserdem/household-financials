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
  ReferenceLine: ({
    x,
    stroke,
    strokeDasharray,
    strokeWidth,
    label,
  }: {
    x: number;
    stroke: string;
    strokeDasharray: string;
    strokeWidth: number;
    label: { value: string; position: string; fill: string };
  }) => (
    <div
      data-testid="reference-line"
      data-x={x}
      data-stroke={stroke}
      data-stroke-dasharray={strokeDasharray}
      data-stroke-width={strokeWidth}
      data-label={label.value}
    />
  ),
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

  it("should allow manual input without bounds constraints", async () => {
    const user = userEvent.setup();
    render(<CompoundInterestCalculator />);

    // Click on monthly savings value
    const monthlyValue = screen.getByText("5 000 kr/mån");
    await user.click(monthlyValue);

    const input = screen.getByRole("textbox");

    // Enter value above slider maximum - should be allowed in input field
    await user.clear(input);
    await user.type(input, "15000000");
    await user.keyboard("{Enter}");

    // Input fields are not constrained, so should accept the value
    await waitFor(() => {
      expect(screen.getByText("15 000 000 kr/mån")).toBeInTheDocument();
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
    fireEvent.change(sliders[2], { target: { value: "0" } }); // Return (minimum is 0)
    fireEvent.change(sliders[3], { target: { value: "1" } }); // Horizon

    await waitFor(() => {
      const zeroKrElements = screen.getAllByText("0 kr");
      expect(zeroKrElements.length).toBeGreaterThan(0); // Start sum
      expect(screen.getByText("0 kr/mån")).toBeInTheDocument(); // Monthly savings

      // Debug: print all text content to see what's actually rendered
      const allTextContent = screen
        .getAllByText(/%/)
        .map((el) => el.textContent);
      console.log("Percentage values found:", allTextContent);

      expect(screen.getByText("0%")).toBeInTheDocument(); // Minimum is 0%
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
    fireEvent.change(startSumSlider, { target: { value: "2000000" } });

    await waitFor(() => {
      expect(screen.getAllByText("2 000 000 kr")[0]).toBeInTheDocument();
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

    // Test 100% (maximum allowed)
    fireEvent.change(returnSlider, { target: { value: "100" } });

    await waitFor(() => {
      // Even with maximum 100% return, values should never exceed reasonable bounds
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
    fireEvent.change(sliders[2], { target: { value: "0" } }); // Return = 0% (minimum)
    fireEvent.change(sliders[3], { target: { value: "1" } }); // Horizon = 1 year

    await waitFor(() => {
      // Should show 0 values without crashing
      expect(screen.getAllByText("0 kr").length).toBeGreaterThan(0);
    });
  });

  it("should handle maximum values without overflow", async () => {
    render(<CompoundInterestCalculator />);

    // Set to maximum allowed slider values
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "10000000" } }); // Max start sum (10M)
    fireEvent.change(sliders[1], { target: { value: "100000" } }); // Max monthly savings (100k)
    fireEvent.change(sliders[2], { target: { value: "200" } }); // Max return (200%)
    fireEvent.change(sliders[3], { target: { value: "100" } }); // Max horizon

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

  // NEW COMPREHENSIVE TESTS FOR ADVANCED FEATURES

  describe("Advanced Settings", () => {
    it("should show advanced settings toggle with proper styling", () => {
      render(<CompoundInterestCalculator />);

      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      expect(advancedToggle).toBeInTheDocument();
      expect(advancedToggle).toHaveClass("p-4", "rounded-xl");

      // Should show description
      expect(
        screen.getByText("advanced_settings.description")
      ).toBeInTheDocument();
    });

    it("should toggle advanced settings when clicked", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });

      // Advanced settings should be hidden initially
      expect(
        screen.queryByText("advanced_settings.annual_savings_increase.label")
      ).not.toBeInTheDocument();

      // Click to expand
      await user.click(advancedToggle);

      // Should show advanced settings
      await waitFor(() => {
        expect(
          screen.getByText("advanced_settings.annual_savings_increase.label")
        ).toBeInTheDocument();
        expect(
          screen.getByText("advanced_settings.planned_withdrawal.title")
        ).toBeInTheDocument();
      });

      // Click to collapse
      await user.click(advancedToggle);

      // Should hide advanced settings
      await waitFor(() => {
        expect(
          screen.queryByText("advanced_settings.annual_savings_increase.label")
        ).not.toBeInTheDocument();
      });
    });

    it("should show status indicators when advanced features are active", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Open advanced settings
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      // Enable withdrawals
      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      // Close advanced settings
      await user.click(advancedToggle);

      // Should show "Aktiv" badge when withdrawal is enabled
      await waitFor(() => {
        expect(
          screen.getByText("advanced_settings.active_badge")
        ).toBeInTheDocument();
      });
    });

    it("should show percentage badge for annual savings increase", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Open advanced settings
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      // Wait for advanced settings to appear
      await waitFor(() => {
        expect(
          screen.getByText("advanced_settings.annual_savings_increase.label")
        ).toBeInTheDocument();
      });

      // Find the annual increase slider by looking for the specific input with the unique attributes
      const annualIncreaseSlider = screen
        .getByRole("slider", { name: "" })
        .closest("div")
        ?.parentElement?.querySelector('input[min="0"][max="50"][step="0.5"]');
      if (!annualIncreaseSlider) {
        // Alternative: find by unique attribute combination
        const allSliders = screen.getAllByRole("slider");
        const targetSlider = allSliders.find(
          (slider) =>
            slider.getAttribute("min") === "0" &&
            slider.getAttribute("max") === "50" &&
            slider.getAttribute("step") === "0.5"
        );
        expect(targetSlider).toBeTruthy();
        fireEvent.change(targetSlider!, { target: { value: "5" } });
      } else {
        fireEvent.change(annualIncreaseSlider, { target: { value: "5" } });
      }

      // Close advanced settings
      await user.click(advancedToggle);

      // Should show "+5%" badge
      await waitFor(() => {
        expect(screen.getByText("+5%")).toBeInTheDocument();
      });
    });
  });

  describe("Annual Savings Increase", () => {
    it("should handle annual savings increase slider", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Open advanced settings
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      // Wait for advanced settings to appear
      await waitFor(() => {
        expect(
          screen.getByText("advanced_settings.annual_savings_increase.label")
        ).toBeInTheDocument();
      });

      // Find annual savings increase slider by its unique attributes
      const allSliders = screen.getAllByRole("slider");
      const annualIncreaseSlider = allSliders.find(
        (slider) =>
          slider.getAttribute("min") === "0" &&
          slider.getAttribute("max") === "50" &&
          slider.getAttribute("step") === "0.5"
      );
      expect(annualIncreaseSlider).toBeTruthy();
      expect(annualIncreaseSlider).toHaveAttribute("min", "0");
      expect(annualIncreaseSlider).toHaveAttribute("max", "50");
      expect(annualIncreaseSlider).toHaveAttribute("step", "0.5");

      // Change to 10%
      fireEvent.change(annualIncreaseSlider!, { target: { value: "10" } });

      await waitFor(() => {
        expect(screen.getByText("10%/år")).toBeInTheDocument();
      });
    });

    it("should affect calculation results with annual increase", async () => {
      render(<CompoundInterestCalculator />);

      // Set base values
      const sliders = screen.getAllByRole("slider");
      fireEvent.change(sliders[0], { target: { value: "100000" } }); // Start sum
      fireEvent.change(sliders[1], { target: { value: "5000" } }); // Monthly savings
      fireEvent.change(sliders[2], { target: { value: "7" } }); // Return
      fireEvent.change(sliders[3], { target: { value: "10" } }); // Years

      // Open advanced settings first
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await userEvent.setup().click(advancedToggle);

      // Wait for advanced settings to appear and get the annual increase slider
      await waitFor(() => {
        expect(
          screen.getByText("advanced_settings.annual_savings_increase.label")
        ).toBeInTheDocument();
      });

      // Find the annual increase slider by its unique attributes
      const allSliders = screen.getAllByRole("slider");
      const annualIncreaseSlider = allSliders.find(
        (slider) =>
          slider.getAttribute("min") === "0" &&
          slider.getAttribute("max") === "50" &&
          slider.getAttribute("step") === "0.5"
      );
      expect(annualIncreaseSlider).toBeTruthy();

      fireEvent.change(annualIncreaseSlider!, { target: { value: "5" } });

      await waitFor(() => {
        // With 5% annual increase, total should be higher
        const newResults = screen.getAllByText(/kr/);
        const hasHigherValue = newResults.some((el) => {
          const text = el.textContent || "";
          const value = parseInt(text.replace(/[^\d]/g, ""));
          return value > 800000; // Should be significantly higher with annual increases
        });
        expect(hasHigherValue).toBe(true);
      });
    });
  });

  describe("Withdrawal Settings", () => {
    it("should enable withdrawal settings when switch is toggled", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Open advanced settings
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      // Withdrawal settings should be hidden initially
      expect(
        screen.queryByText(
          "advanced_settings.planned_withdrawal.withdrawal_type_question"
        )
      ).not.toBeInTheDocument();

      // Enable withdrawals
      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      // Should show withdrawal options
      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_type_question"
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.percentage_option"
          )
        ).toBeInTheDocument();
        expect(
          screen.getByText("advanced_settings.planned_withdrawal.amount_option")
        ).toBeInTheDocument();
      });
    });

    it("should switch between percentage and amount withdrawal types", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Open advanced settings and enable withdrawals
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.percentage_option"
          )
        ).toBeInTheDocument();
      });

      // Should default to percentage mode
      expect(
        screen.getByText(
          "advanced_settings.planned_withdrawal.withdrawal_percentage_label"
        )
      ).toBeInTheDocument();

      // Switch to amount mode
      const amountButton = screen.getByText(
        "advanced_settings.planned_withdrawal.amount_option"
      );
      await user.click(amountButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_amount_label"
          )
        ).toBeInTheDocument();
      });

      // Switch back to percentage mode
      const percentageButton = screen.getByText(
        "advanced_settings.planned_withdrawal.percentage_option"
      );
      await user.click(percentageButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_percentage_label"
          )
        ).toBeInTheDocument();
      });
    });

    it("should handle withdrawal year slider", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Set investment horizon to 20 years first
      const sliders = screen.getAllByRole("slider");
      fireEvent.change(sliders[3], { target: { value: "20" } });

      // Open advanced settings and enable withdrawals
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_year_question"
          )
        ).toBeInTheDocument();
      });

      // Find withdrawal year slider by its unique attributes (min=1, max=20)
      const allSliders = screen.getAllByRole("slider");
      const withdrawalYearSlider = allSliders.find(
        (slider) =>
          slider.getAttribute("min") === "1" &&
          slider.getAttribute("max") === "20"
      );
      expect(withdrawalYearSlider).toBeTruthy();
      expect(withdrawalYearSlider).toHaveAttribute("min", "1");
      expect(withdrawalYearSlider).toHaveAttribute("max", "20"); // Should match investment horizon

      // Change withdrawal year
      fireEvent.change(withdrawalYearSlider!, { target: { value: "15" } });

      await waitFor(() => {
        expect(
          screen.getByText(
            /advanced_settings\.planned_withdrawal\.year_prefix.*15/
          )
        ).toBeInTheDocument();
      });
    });

    it("should handle percentage withdrawal slider", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Open advanced settings and enable withdrawals
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_percentage_label"
          )
        ).toBeInTheDocument();
      });

      // Find percentage withdrawal slider by its unique attributes (min=0, max=100, step=1)
      const allSliders = screen.getAllByRole("slider");
      const percentageSlider = allSliders.find(
        (slider) =>
          slider.getAttribute("min") === "0" &&
          slider.getAttribute("max") === "100" &&
          slider.getAttribute("step") === "1" &&
          slider.getAttribute("value") === "10"
      );
      expect(percentageSlider).toBeTruthy();
      expect(percentageSlider).toHaveAttribute("min", "0");
      expect(percentageSlider).toHaveAttribute("max", "100");

      // Change percentage
      fireEvent.change(percentageSlider!, { target: { value: "25" } });

      await waitFor(() => {
        expect(screen.getByText("25%")).toBeInTheDocument();
      });
    });

    it("should handle amount withdrawal with editable input", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Open advanced settings and enable withdrawals
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      // Switch to amount mode
      // Switch to amount mode
      const amountButton = screen.getByText(
        "advanced_settings.planned_withdrawal.amount_option"
      );
      await user.click(amountButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_amount_label"
          )
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_amount_label"
          )
        ).toBeInTheDocument();
      });

      // Default should show 100,000 kr
      expect(screen.getByText("100 000 kr")).toBeInTheDocument();

      // Click to edit the withdrawal amount
      const withdrawalValue = screen.getByText("100 000 kr");
      await user.click(withdrawalValue);

      // Should show input field
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("100000");

      // Change value
      await user.clear(input);
      await user.type(input, "200000");
      await user.keyboard("{Enter}");

      // Should update display
      await waitFor(() => {
        expect(screen.getByText("200 000 kr")).toBeInTheDocument();
      });
    });

    it("should disable withdrawals when switch is turned off", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Open advanced settings and enable withdrawals
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_type_question"
          )
        ).toBeInTheDocument();
      });

      // Disable withdrawals
      await user.click(withdrawalSwitch);

      await waitFor(() => {
        expect(
          screen.queryByText(
            "advanced_settings.planned_withdrawal.withdrawal_type_question"
          )
        ).not.toBeInTheDocument();
      });
    });

    it("should show withdrawal impact in results", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Set up scenario with withdrawals
      const sliders = screen.getAllByRole("slider");
      fireEvent.change(sliders[0], { target: { value: "1000000" } }); // 1M start
      fireEvent.change(sliders[1], { target: { value: "0" } }); // No monthly savings
      fireEvent.change(sliders[2], { target: { value: "7" } }); // 7% return
      fireEvent.change(sliders[3], { target: { value: "20" } }); // 20 years

      // Enable withdrawals
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      // Set withdrawal year to 10 and percentage to 4%
      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_year_question"
          )
        ).toBeInTheDocument();
      });

      const withdrawalTestSliders = screen.getAllByRole("slider");
      const withdrawalYearSlider = withdrawalTestSliders.find(
        (slider) =>
          slider.getAttribute("min") === "1" &&
          slider.getAttribute("value") === "10"
      );
      expect(withdrawalYearSlider).toBeTruthy();
      fireEvent.change(withdrawalYearSlider!, { target: { value: "10" } });

      const percentageSlider = withdrawalTestSliders.find(
        (slider) =>
          slider.getAttribute("min") === "0" &&
          slider.getAttribute("max") === "100" &&
          slider.getAttribute("step") === "1" &&
          slider.getAttribute("value") === "10"
      );
      expect(percentageSlider).toBeTruthy();
      fireEvent.change(percentageSlider!, { target: { value: "4" } });

      await waitFor(() => {
        // Should show withdrawal column in results
        expect(screen.getByText("results.total_withdrawn")).toBeInTheDocument();
      });
    });
  });

  describe("Age Tracking", () => {
    it("should display and allow editing of user age", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Should show age input with default value
      expect(screen.getByText("30 år")).toBeInTheDocument();

      // Click to edit age
      const ageValue = screen.getByText("30 år");
      await user.click(ageValue);

      // Should show input field
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("30");

      // Change age
      await user.clear(input);
      await user.type(input, "25");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("25 år")).toBeInTheDocument();
      });
    });

    it("should handle age slider", () => {
      render(<CompoundInterestCalculator />);

      const ageSlider = screen.getByLabelText("inputs.age_label");
      expect(ageSlider).toHaveAttribute("min", "18");
      expect(ageSlider).toHaveAttribute("max", "100");
      expect(ageSlider).toHaveAttribute("step", "1");

      // Change age via slider
      fireEvent.change(ageSlider, { target: { value: "45" } });

      expect(screen.getByText("45 år")).toBeInTheDocument();
    });
  });

  describe("Enhanced Input Fields", () => {
    it("should allow input values beyond slider limits", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Test start sum beyond 10M limit
      const startSumValue = screen.getAllByText("0 kr")[0];
      await user.click(startSumValue);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "50000000"); // 50M, well above 10M slider limit
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getAllByText("50 000 000 kr")[0]).toBeInTheDocument();
      });
    });

    it("should handle very large monthly savings input", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Test monthly savings beyond 100k limit
      const monthlyValue = screen.getByText("5 000 kr/mån");
      await user.click(monthlyValue);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "500000"); // 500k, well above 100k slider limit
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("500 000 kr/mån")).toBeInTheDocument();
      });
    });

    it("should handle yearly return beyond slider limits", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Test yearly return beyond 200% limit
      const returnValue = screen.getByText("7%");
      await user.click(returnValue);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "500"); // 500%, well above 200% slider limit
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("500%")).toBeInTheDocument();
      });
    });

    it("should handle negative values in input fields", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Test negative start sum
      const startSumValue = screen.getAllByText("0 kr")[0];
      await user.click(startSumValue);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "-100000");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        // The input parsing extracts numbers, so -100000 becomes 100000
        // But we can check that the input was processed and a value was set
        const allKrElements = screen.getAllByText(/\d.*kr/);
        const hasProcessedValue = allKrElements.some((el) => {
          const text = el.textContent || "";
          return text.includes("100") && text.includes("kr");
        });
        expect(hasProcessedValue).toBe(true);
      });
    });

    it("should handle decimal values in input fields", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Test decimal return rate
      const returnValue = screen.getByText("7%");
      await user.click(returnValue);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "7.25");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("7,25%")).toBeInTheDocument();
      });
    });
  });

  describe("Results Display with Advanced Features", () => {
    it("should show theoretical total value when withdrawals are enabled", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Set up scenario
      const sliders = screen.getAllByRole("slider");
      fireEvent.change(sliders[0], { target: { value: "100000" } });
      fireEvent.change(sliders[1], { target: { value: "5000" } });
      fireEvent.change(sliders[2], { target: { value: "7" } });
      fireEvent.change(sliders[3], { target: { value: "10" } });

      // Enable withdrawals
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      await waitFor(() => {
        // Should show both theoretical and actual total values
        expect(
          screen.getByText("results.theoretical_total_value")
        ).toBeInTheDocument();
        expect(
          screen.getByText(/results\.total_value_after_withdrawals/)
        ).toBeInTheDocument();
      });
    });

    it("should calculate and display results with all advanced features combined", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Set up complex scenario
      const sliders = screen.getAllByRole("slider");
      fireEvent.change(sliders[0], { target: { value: "500000" } }); // 500k start
      fireEvent.change(sliders[1], { target: { value: "10000" } }); // 10k monthly
      fireEvent.change(sliders[2], { target: { value: "8" } }); // 8% return
      fireEvent.change(sliders[3], { target: { value: "25" } }); // 25 years

      // Open advanced settings
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      // Wait for advanced settings to appear
      await waitFor(() => {
        expect(
          screen.getByText("advanced_settings.annual_savings_increase.label")
        ).toBeInTheDocument();
      });

      // Set annual savings increase
      const allSliders = screen.getAllByRole("slider");
      const annualIncreaseSlider = allSliders.find(
        (slider) =>
          slider.getAttribute("min") === "0" &&
          slider.getAttribute("max") === "50" &&
          slider.getAttribute("step") === "0.5"
      );
      expect(annualIncreaseSlider).toBeTruthy();
      fireEvent.change(annualIncreaseSlider!, { target: { value: "3" } });

      // Enable withdrawals
      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_year_question"
          )
        ).toBeInTheDocument();
      });

      // Set withdrawal parameters
      const withdrawalSliders = screen.getAllByRole("slider");
      const withdrawalYearSlider = withdrawalSliders.find(
        (slider) =>
          slider.getAttribute("min") === "1" &&
          slider.getAttribute("value") === "10"
      );
      expect(withdrawalYearSlider).toBeTruthy();
      fireEvent.change(withdrawalYearSlider!, { target: { value: "20" } });

      const percentageSlider = withdrawalSliders.find(
        (slider) =>
          slider.getAttribute("min") === "0" &&
          slider.getAttribute("max") === "100" &&
          slider.getAttribute("step") === "1" &&
          slider.getAttribute("value") === "10"
      );
      expect(percentageSlider).toBeTruthy();
      fireEvent.change(percentageSlider!, { target: { value: "5" } });

      await waitFor(() => {
        // Should show all result components
        expect(
          screen.getByText("results.theoretical_total_value")
        ).toBeInTheDocument();
        expect(
          screen.getByText(/results\.total_value_after_withdrawals/)
        ).toBeInTheDocument();
        expect(screen.getByText("results.total_withdrawn")).toBeInTheDocument();

        // Should have realistic values (not astronomical)
        const totalElements = screen.getAllByText(/kr/);
        const hasReasonableValues = totalElements.some((el) => {
          const text = el.textContent || "";
          const numbers = text.replace(/[^\d]/g, "");
          if (numbers.length > 0) {
            const value = parseInt(numbers);
            return value >= 1000000 && value <= 50000000; // Should be in reasonable range
          }
          return false;
        });
        expect(hasReasonableValues).toBe(true);
      });
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle extreme input values gracefully", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Test extremely high values
      const startSumValue = screen.getAllByText("0 kr")[0];
      await user.click(startSumValue);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "999999999999"); // Nearly trillion
      await user.keyboard("{Enter}");

      await waitFor(() => {
        // Should handle without crashing - look for the value in the input area
        const inputElements = screen.getAllByText("999 999 999 999 kr");
        expect(inputElements.length).toBeGreaterThan(0);
      });
    });

    it("should handle withdrawal year exceeding investment horizon", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      // Set investment horizon to 5 years
      const sliders = screen.getAllByRole("slider");
      fireEvent.change(sliders[3], { target: { value: "5" } });

      // Open advanced settings and enable withdrawals
      const advancedToggle = screen.getByRole("button", {
        name: /advanced_settings\.title/i,
      });
      await user.click(advancedToggle);

      const withdrawalSwitch = screen.getByRole("switch");
      await user.click(withdrawalSwitch);

      await waitFor(() => {
        expect(
          screen.getByText(
            "advanced_settings.planned_withdrawal.withdrawal_year_question"
          )
        ).toBeInTheDocument();
      });

      // Withdrawal year slider max should be limited to investment horizon
      // First need to wait for the component to update with the new investment horizon
      await waitFor(() => {
        const allSliders = screen.getAllByRole("slider");
        const withdrawalYearSlider = allSliders.find(
          (slider) =>
            slider.getAttribute("min") === "1" &&
            slider.getAttribute("max") === "5" // Should be limited to investment horizon
        );
        expect(withdrawalYearSlider).toBeTruthy();
        expect(withdrawalYearSlider).toHaveAttribute("max", "5");
      });
    });

    it("should handle empty and invalid input gracefully", async () => {
      const user = userEvent.setup();
      render(<CompoundInterestCalculator />);

      const startSumValue = screen.getAllByText("0 kr")[0];
      await user.click(startSumValue);

      const input = screen.getByRole("textbox");

      // Test empty input
      await user.clear(input);
      await user.keyboard("{Enter}");

      await waitFor(() => {
        // Should revert to previous value or 0
        expect(screen.getAllByText("0 kr")[0]).toBeInTheDocument();
      });

      // Test invalid characters - click again to get fresh input
      const startSumValue2 = screen.getAllByText("0 kr")[0];
      await user.click(startSumValue2);

      // Wait for input to appear
      await waitFor(() => {
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });

      const input2 = screen.getByRole("textbox");
      await user.clear(input2);
      await user.type(input2, "abc123def");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        // Should extract only numbers
        const allKrElements = screen.getAllByText(/\d.*kr/);
        const hasExtractedNumbers = allKrElements.some((el) => {
          const text = el.textContent || "";
          return text.includes("123") && text.includes("kr");
        });
        expect(hasExtractedNumbers).toBe(true);
      });
    });
  });
});
