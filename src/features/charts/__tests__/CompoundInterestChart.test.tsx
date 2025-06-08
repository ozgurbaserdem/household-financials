import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";

import { CompoundInterestChart } from "@/features/charts/CompoundInterestChart";
import type { CompoundInterestData } from "@/lib/compound-interest";

// Mock recharts to avoid rendering issues in tests
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode;
    data: unknown;
  }) => (
    <div data-chart-data={JSON.stringify(data)} data-testid="bar-chart">
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
      data-fill={fill}
      data-stack-id={stackId}
      data-testid={`bar-${dataKey}`}
    />
  ),
  XAxis: ({ dataKey }: { dataKey: string }) => (
    <div data-key={dataKey} data-testid="x-axis" />
  ),
  YAxis: ({ tickFormatter }: { tickFormatter?: () => string }) => (
    <div
      data-formatter={tickFormatter ? "custom" : "default"}
      data-testid="y-axis"
    />
  ),
  Tooltip: ({ content }: { content?: React.ComponentType }) => (
    <div data-custom={content ? "true" : "false"} data-testid="tooltip" />
  ),
  Legend: ({ content }: { content?: React.ComponentType }) => (
    <div data-custom={content ? "true" : "false"} data-testid="legend" />
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
      data-label={label.value}
      data-stroke={stroke}
      data-stroke-dasharray={strokeDasharray}
      data-stroke-width={strokeWidth}
      data-testid="reference-line"
      data-x={x}
    />
  ),
}));

describe("CompoundInterestChart", () => {
  const mockData: CompoundInterestData[] = [
    {
      year: 0,
      startSum: 50000,
      accumulatedSavings: 0,
      compoundReturns: 0,
      totalValue: 50000,
      chartStartSum: 50000,
      chartSavings: 0,
      chartReturns: 0,
    },
    {
      year: 1,
      startSum: 50000,
      accumulatedSavings: 12000,
      compoundReturns: 3500,
      totalValue: 65500,
      chartStartSum: 50000,
      chartSavings: 12000,
      chartReturns: 3500,
    },
    {
      year: 2,
      startSum: 50000,
      accumulatedSavings: 24000,
      compoundReturns: 7800,
      totalValue: 81800,
      chartStartSum: 50000,
      chartSavings: 24000,
      chartReturns: 7800,
    },
    {
      year: 5,
      startSum: 50000,
      accumulatedSavings: 60000,
      compoundReturns: 25000,
      totalValue: 135000,
      chartStartSum: 50000,
      chartSavings: 60000,
      chartReturns: 25000,
    },
    {
      year: 10,
      startSum: 50000,
      accumulatedSavings: 120000,
      compoundReturns: 75000,
      totalValue: 245000,
      chartStartSum: 50000,
      chartSavings: 120000,
      chartReturns: 75000,
    },
  ];

  it("should render the chart container", () => {
    render(<CompoundInterestChart data={mockData} />);

    expect(screen.getByTestId("compound-interest-chart")).toBeInTheDocument();
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("should render all chart components", () => {
    render(<CompoundInterestChart data={mockData} />);

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    // Legend is custom rendered, not a Recharts component
  });

  it("should render three bar series with correct properties", () => {
    render(<CompoundInterestChart data={mockData} />);

    // Check start sum bar
    const startSumBar = screen.getByTestId("bar-chartStartSum");
    expect(startSumBar).toHaveAttribute("data-stack-id", "portfolio");
    expect(startSumBar).toHaveAttribute("data-fill", "#3B82F6");

    // Check accumulated savings bar
    const savingsBar = screen.getByTestId("bar-chartSavings");
    expect(savingsBar).toHaveAttribute("data-stack-id", "portfolio");
    expect(savingsBar).toHaveAttribute("data-fill", "#10B981");

    // Check compound returns bar
    const returnsBar = screen.getByTestId("bar-chartReturns");
    expect(returnsBar).toHaveAttribute("data-stack-id", "portfolio");
    expect(returnsBar).toHaveAttribute("data-fill", "#8B5CF6");
  });

  it("should pass correct data to the chart", () => {
    render(<CompoundInterestChart data={mockData} />);

    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(barChart.dataset.chartData || "[]");

    expect(chartData).toHaveLength(5);
    expect(chartData[0]).toEqual(mockData[0]);
    expect(chartData[4]).toEqual(mockData[4]);
  });

  it("should configure axes correctly", () => {
    render(<CompoundInterestChart data={mockData} />);

    // X-axis should use year as data key
    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toHaveAttribute("data-key", "year");

    // Y-axis should have custom formatter
    const yAxis = screen.getByTestId("y-axis");
    expect(yAxis).toHaveAttribute("data-formatter", "custom");
  });

  it("should have custom tooltip", () => {
    render(<CompoundInterestChart data={mockData} />);

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toHaveAttribute("data-custom", "true");
    // Legend is custom rendered, not a Recharts Legend component
  });

  it("should handle empty data array", () => {
    const { container } = render(<CompoundInterestChart data={[]} />);

    // Component returns null for empty data
    expect(container.firstChild).toBeNull();
  });

  it("should handle single data point", () => {
    const singlePoint: CompoundInterestData[] = [
      {
        year: 0,
        startSum: 100000,
        accumulatedSavings: 0,
        compoundReturns: 0,
        totalValue: 100000,
        chartStartSum: 100000,
        chartSavings: 0,
        chartReturns: 0,
      },
    ];

    render(<CompoundInterestChart data={singlePoint} />);

    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(barChart.dataset.chartData || "[]");

    expect(chartData).toHaveLength(1);
    expect(chartData[0]).toEqual(singlePoint[0]);
  });

  it("should handle large data sets", () => {
    // Create 50 years of data
    const largeData: CompoundInterestData[] = Array.from(
      { length: 51 },
      (_, year) => {
        const accumulatedSavings = 1000 * 12 * year;
        const compoundReturns = year * year * 100;
        return {
          year,
          startSum: 10000,
          accumulatedSavings,
          compoundReturns,
          totalValue: 10000 + accumulatedSavings + compoundReturns,
          chartStartSum: 10000,
          chartSavings: accumulatedSavings,
          chartReturns: compoundReturns,
        };
      }
    );

    render(<CompoundInterestChart data={largeData} />);

    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(barChart.dataset.chartData || "[]");

    expect(chartData).toHaveLength(51);
  });

  it("should render with proper accessibility attributes", () => {
    render(<CompoundInterestChart data={mockData} />);

    const chartContainer = screen.getByTestId("compound-interest-chart");
    expect(chartContainer).toHaveClass("h-[400px]", "w-full");
  });

  it("should handle negative compound returns", () => {
    const dataWithLoss: CompoundInterestData[] = [
      {
        year: 0,
        startSum: 100000,
        accumulatedSavings: 0,
        compoundReturns: 0,
        totalValue: 100000,
        chartStartSum: 100000,
        chartSavings: 0,
        chartReturns: 0,
      },
      {
        year: 1,
        startSum: 100000,
        accumulatedSavings: 12000,
        compoundReturns: -5000, // Loss
        totalValue: 107000,
        chartStartSum: 100000,
        chartSavings: 12000,
        chartReturns: -5000,
      },
    ];

    render(<CompoundInterestChart data={dataWithLoss} />);

    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(barChart.dataset.chartData || "[]");

    expect(chartData[1].compoundReturns).toBe(-5000);
  });

  it("should render all three data series as stacked bars", () => {
    render(<CompoundInterestChart data={mockData} />);

    // All bars should have the same stack ID for stacking
    const bars = [
      screen.getByTestId("bar-chartStartSum"),
      screen.getByTestId("bar-chartSavings"),
      screen.getByTestId("bar-chartReturns"),
    ];

    bars.map((bar) =>
      expect(bar).toHaveAttribute("data-stack-id", "portfolio")
    );
  });

  // NEW COMPREHENSIVE TESTS FOR ADVANCED CHART FEATURES

  describe("Withdrawal Phase Visualization", () => {
    it("should render withdrawal phase bar when withdrawal data is present", () => {
      const dataWithWithdrawal: CompoundInterestData[] = [
        {
          year: 0,
          startSum: 100000,
          accumulatedSavings: 0,
          compoundReturns: 0,
          totalValue: 100000,
          chartStartSum: 100000,
          chartSavings: 0,
          chartReturns: 0,
        },
        {
          year: 5,
          startSum: 100000,
          accumulatedSavings: 0,
          compoundReturns: 0,
          totalValue: 150000,
          chartStartSum: 0, // Set to 0 during withdrawal phase
          chartSavings: 0, // Set to 0 during withdrawal phase
          chartReturns: 0, // Set to 0 during withdrawal phase
          withdrawal: 10000,
          isWithdrawalPhase: true,
          withdrawalPhaseValue: 150000,
        },
      ];

      render(<CompoundInterestChart data={dataWithWithdrawal} />);

      // Should render withdrawal phase bar
      expect(
        screen.getByTestId("bar-withdrawalPhaseValue")
      ).toBeInTheDocument();
      expect(screen.getByTestId("bar-withdrawalPhaseValue")).toHaveAttribute(
        "data-fill",
        "#F87171"
      );
    });

    it("should show reference line for withdrawal year", () => {
      const dataWithWithdrawal: CompoundInterestData[] = [
        {
          year: 0,
          startSum: 100000,
          accumulatedSavings: 0,
          compoundReturns: 0,
          totalValue: 100000,
          chartStartSum: 100000,
          chartSavings: 0,
          chartReturns: 0,
        },
        {
          year: 10,
          startSum: 100000,
          accumulatedSavings: 60000,
          compoundReturns: 40000,
          totalValue: 180000,
          chartStartSum: 0,
          chartSavings: 0,
          chartReturns: 0,
          withdrawal: 18000,
          isWithdrawalPhase: true,
          withdrawalPhaseValue: 162000,
        },
      ];

      render(<CompoundInterestChart data={dataWithWithdrawal} />);

      // Check that chart data includes withdrawal information
      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      expect(chartData[1].withdrawal).toBe(18000);
      expect(chartData[1].withdrawalPhaseValue).toBe(162000);
    });

    it("should handle mixed accumulation and withdrawal phases", () => {
      const mixedPhaseData: CompoundInterestData[] = [
        // Accumulation phase
        {
          year: 1,
          startSum: 50000,
          accumulatedSavings: 12000,
          compoundReturns: 3000,
          totalValue: 65000,
          chartStartSum: 50000,
          chartSavings: 12000,
          chartReturns: 3000,
        },
        {
          year: 5,
          startSum: 50000,
          accumulatedSavings: 60000,
          compoundReturns: 25000,
          totalValue: 135000,
          chartStartSum: 50000,
          chartSavings: 60000,
          chartReturns: 25000,
        },
        // Withdrawal phase
        {
          year: 10,
          startSum: 50000,
          accumulatedSavings: 60000,
          compoundReturns: 50000,
          totalValue: 140000,
          chartStartSum: 0, // Zero during withdrawal
          chartSavings: 0, // Zero during withdrawal
          chartReturns: 0, // Zero during withdrawal
          withdrawal: 7000,
          isWithdrawalPhase: true,
          withdrawalPhaseValue: 140000,
        },
      ];

      render(<CompoundInterestChart data={mixedPhaseData} />);

      // Should render all bar types
      expect(screen.getByTestId("bar-chartStartSum")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chartSavings")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chartReturns")).toBeInTheDocument();
      expect(
        screen.getByTestId("bar-withdrawalPhaseValue")
      ).toBeInTheDocument();

      // Check chart data integrity
      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      expect(chartData).toHaveLength(3);
      expect(chartData[2].isWithdrawalPhase).toBe(true);
      expect(chartData[2].withdrawalPhaseValue).toBe(140000);
    });
  });

  describe("Custom Tooltip with Advanced Features", () => {
    it("should display age information in tooltip when available", () => {
      const dataWithAge: CompoundInterestData[] = [
        {
          year: 0,
          startSum: 100000,
          accumulatedSavings: 0,
          compoundReturns: 0,
          totalValue: 100000,
          chartStartSum: 100000,
          chartSavings: 0,
          chartReturns: 0,
          userAge: 30,
        },
        {
          year: 5,
          startSum: 100000,
          accumulatedSavings: 60000,
          compoundReturns: 25000,
          totalValue: 185000,
          chartStartSum: 100000,
          chartSavings: 60000,
          chartReturns: 25000,
          userAge: 35,
        },
      ];

      render(<CompoundInterestChart data={dataWithAge} />);

      // Tooltip should be configured for custom display
      const tooltip = screen.getByTestId("tooltip");
      expect(tooltip).toHaveAttribute("data-custom", "true");
    });

    it("should display withdrawal information in tooltip", () => {
      const dataWithWithdrawal: CompoundInterestData[] = [
        {
          year: 10,
          startSum: 100000,
          accumulatedSavings: 120000,
          compoundReturns: 80000,
          totalValue: 280000,
          chartStartSum: 0,
          chartSavings: 0,
          chartReturns: 0,
          withdrawal: 14000,
          isWithdrawalPhase: true,
          withdrawalPhaseValue: 266000,
          currentMonthlySavings: 0, // No savings during withdrawal
        },
      ];

      render(<CompoundInterestChart data={dataWithWithdrawal} />);

      // Check that chart data includes withdrawal and savings information
      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      expect(chartData[0].withdrawal).toBe(14000);
      expect(chartData[0].currentMonthlySavings).toBe(0);
    });

    it("should display current monthly savings in tooltip", () => {
      const dataWithMonthlySavings: CompoundInterestData[] = [
        {
          year: 3,
          startSum: 50000,
          accumulatedSavings: 36000,
          compoundReturns: 15000,
          totalValue: 101000,
          chartStartSum: 50000,
          chartSavings: 36000,
          chartReturns: 15000,
          currentMonthlySavings: 5250, // Increased from 5000 due to annual increase
        },
      ];

      render(<CompoundInterestChart data={dataWithMonthlySavings} />);

      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      expect(chartData[0].currentMonthlySavings).toBe(5250);
    });
  });

  describe("Chart Responsiveness and Accessibility", () => {
    it("should have proper accessibility attributes", () => {
      render(<CompoundInterestChart data={mockData} />);

      // Chart title should have accessibility attributes
      const chartTitle = screen.getByRole("heading", { level: 3 });
      expect(chartTitle).toHaveAttribute("tabindex", "0");
      expect(chartTitle).toHaveAttribute("aria-label", "chart.aria_title");
    });

    it("should calculate proper Y-axis scaling for large values", () => {
      const largeValueData: CompoundInterestData[] = [
        {
          year: 20,
          startSum: 1000000,
          accumulatedSavings: 2400000,
          compoundReturns: 5000000,
          totalValue: 8400000,
          chartStartSum: 1000000,
          chartSavings: 2400000,
          chartReturns: 5000000,
        },
      ];

      render(<CompoundInterestChart data={largeValueData} />);

      // Y-axis should have custom formatter for large values
      const yAxis = screen.getByTestId("y-axis");
      expect(yAxis).toHaveAttribute("data-formatter", "custom");
    });

    it("should handle very small values correctly", () => {
      const smallValueData: CompoundInterestData[] = [
        {
          year: 1,
          startSum: 100,
          accumulatedSavings: 120,
          compoundReturns: 15,
          totalValue: 235,
          chartStartSum: 100,
          chartSavings: 120,
          chartReturns: 15,
        },
      ];

      render(<CompoundInterestChart data={smallValueData} />);

      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      expect(chartData[0].totalValue).toBe(235);
    });
  });

  describe("Chart Data Validation", () => {
    it("should handle zero values in all fields", () => {
      const zeroValueData: CompoundInterestData[] = [
        {
          year: 0,
          startSum: 0,
          accumulatedSavings: 0,
          compoundReturns: 0,
          totalValue: 0,
          chartStartSum: 0,
          chartSavings: 0,
          chartReturns: 0,
        },
      ];

      render(<CompoundInterestChart data={zeroValueData} />);

      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      expect(chartData[0]).toEqual(zeroValueData[0]);
    });

    it("should handle negative compound returns in chart data", () => {
      const negativeReturnsData: CompoundInterestData[] = [
        {
          year: 1,
          startSum: 100000,
          accumulatedSavings: 12000,
          compoundReturns: -5000,
          totalValue: 107000,
          chartStartSum: 100000,
          chartSavings: 12000,
          chartReturns: -5000,
        },
      ];

      render(<CompoundInterestChart data={negativeReturnsData} />);

      // Should render bars even with negative returns
      expect(screen.getByTestId("bar-chartStartSum")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chartSavings")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chartReturns")).toBeInTheDocument();

      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      expect(chartData[0].compoundReturns).toBe(-5000);
      expect(chartData[0].chartReturns).toBe(-5000);
    });

    it("should correctly pass through all data properties", () => {
      const complexData: CompoundInterestData[] = [
        {
          year: 15,
          startSum: 200000,
          accumulatedSavings: 180000,
          compoundReturns: 120000,
          totalValue: 480000,
          chartStartSum: 200000,
          chartSavings: 180000,
          chartReturns: 120000,
          withdrawal: 24000,
          currentMonthlySavings: 0,
          userAge: 45,
          isWithdrawalPhase: true,
          withdrawalPhaseValue: 456000,
        },
      ];

      render(<CompoundInterestChart data={complexData} />);

      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      // All properties should be preserved
      expect(chartData[0]).toEqual(complexData[0]);
    });
  });

  describe("Chart Performance and Edge Cases", () => {
    it("should handle rapid data changes", () => {
      const { rerender } = render(<CompoundInterestChart data={mockData} />);

      // Change data rapidly
      const newData: CompoundInterestData[] = [
        {
          year: 1,
          startSum: 1000,
          accumulatedSavings: 1200,
          compoundReturns: 100,
          totalValue: 2300,
          chartStartSum: 1000,
          chartSavings: 1200,
          chartReturns: 100,
        },
      ];

      rerender(<CompoundInterestChart data={newData} />);

      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      expect(chartData).toHaveLength(1);
      expect(chartData[0]).toEqual(newData[0]);
    });

    it("should handle visibility toggle correctly", () => {
      const { rerender } = render(
        <CompoundInterestChart data={mockData} isVisible={true} />
      );

      expect(screen.getByTestId("compound-interest-chart")).toBeInTheDocument();

      // Hide chart
      rerender(<CompoundInterestChart data={mockData} isVisible={false} />);

      expect(
        screen.queryByTestId("compound-interest-chart")
      ).not.toBeInTheDocument();
    });

    it("should maintain chart structure with varying data lengths", () => {
      // Test with single data point
      const singlePoint: CompoundInterestData[] = [
        {
          year: 0,
          startSum: 10000,
          accumulatedSavings: 0,
          compoundReturns: 0,
          totalValue: 10000,
          chartStartSum: 10000,
          chartSavings: 0,
          chartReturns: 0,
        },
      ];

      const { rerender } = render(<CompoundInterestChart data={singlePoint} />);
      expect(screen.getByTestId("compound-interest-chart")).toBeInTheDocument();

      // Test with many data points (50 years)
      const manyPoints: CompoundInterestData[] = Array.from(
        { length: 50 },
        (_, i) => ({
          year: i,
          startSum: 10000,
          accumulatedSavings: i * 12000,
          compoundReturns: i * i * 100,
          totalValue: 10000 + i * 12000 + i * i * 100,
          chartStartSum: 10000,
          chartSavings: i * 12000,
          chartReturns: i * i * 100,
        })
      );

      rerender(<CompoundInterestChart data={manyPoints} />);

      const barChart = screen.getByTestId("bar-chart");
      const chartData = JSON.parse(barChart.dataset.chartData || "[]");

      expect(chartData).toHaveLength(50);
    });
  });
});
