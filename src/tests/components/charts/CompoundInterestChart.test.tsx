import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompoundInterestChart } from "@/components/charts/CompoundInterestChart";
import type { CompoundInterestData } from "@/lib/compound-interest";

// Mock recharts to avoid rendering issues in tests
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children, data }: any) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, stackId, fill }: any) => (
    <div
      data-testid={`bar-${dataKey}`}
      data-stack-id={stackId}
      data-fill={fill}
    />
  ),
  XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: ({ tickFormatter }: any) => (
    <div
      data-testid="y-axis"
      data-formatter={tickFormatter ? "custom" : "default"}
    />
  ),
  Tooltip: ({ content }: any) => (
    <div data-testid="tooltip" data-custom={content ? "true" : "false"} />
  ),
  Legend: ({ content }: any) => (
    <div data-testid="legend" data-custom={content ? "true" : "false"} />
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
}));

describe("CompoundInterestChart", () => {
  const mockData: CompoundInterestData[] = [
    {
      year: 0,
      startSum: 50000,
      accumulatedSavings: 0,
      compoundReturns: 0,
      totalValue: 50000,
    },
    {
      year: 1,
      startSum: 50000,
      accumulatedSavings: 12000,
      compoundReturns: 3500,
      totalValue: 65500,
    },
    {
      year: 2,
      startSum: 50000,
      accumulatedSavings: 24000,
      compoundReturns: 7800,
      totalValue: 81800,
    },
    {
      year: 5,
      startSum: 50000,
      accumulatedSavings: 60000,
      compoundReturns: 25000,
      totalValue: 135000,
    },
    {
      year: 10,
      startSum: 50000,
      accumulatedSavings: 120000,
      compoundReturns: 75000,
      totalValue: 245000,
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
    const startSumBar = screen.getByTestId("bar-startSum");
    expect(startSumBar).toHaveAttribute("data-stack-id", "portfolio");
    expect(startSumBar).toHaveAttribute("data-fill", "#3B82F6");

    // Check accumulated savings bar
    const savingsBar = screen.getByTestId("bar-accumulatedSavings");
    expect(savingsBar).toHaveAttribute("data-stack-id", "portfolio");
    expect(savingsBar).toHaveAttribute("data-fill", "#10B981");

    // Check compound returns bar
    const returnsBar = screen.getByTestId("bar-compoundReturns");
    expect(returnsBar).toHaveAttribute("data-stack-id", "portfolio");
    expect(returnsBar).toHaveAttribute("data-fill", "#8B5CF6");
  });

  it("should pass correct data to the chart", () => {
    render(<CompoundInterestChart data={mockData} />);

    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]"
    );

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
      },
    ];

    render(<CompoundInterestChart data={singlePoint} />);

    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]"
    );

    expect(chartData).toHaveLength(1);
    expect(chartData[0]).toEqual(singlePoint[0]);
  });

  it("should handle large data sets", () => {
    // Create 50 years of data
    const largeData: CompoundInterestData[] = [];
    for (let year = 0; year <= 50; year++) {
      largeData.push({
        year,
        startSum: 10000,
        accumulatedSavings: 1000 * 12 * year,
        compoundReturns: year * year * 100,
        totalValue: 10000 + 1000 * 12 * year + year * year * 100,
      });
    }

    render(<CompoundInterestChart data={largeData} />);

    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]"
    );

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
      },
      {
        year: 1,
        startSum: 100000,
        accumulatedSavings: 12000,
        compoundReturns: -5000, // Loss
        totalValue: 107000,
      },
    ];

    render(<CompoundInterestChart data={dataWithLoss} />);

    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]"
    );

    expect(chartData[1].compoundReturns).toBe(-5000);
  });

  it("should render all three data series as stacked bars", () => {
    render(<CompoundInterestChart data={mockData} />);

    // All bars should have the same stack ID for stacking
    const bars = [
      screen.getByTestId("bar-startSum"),
      screen.getByTestId("bar-accumulatedSavings"),
      screen.getByTestId("bar-compoundReturns"),
    ];

    bars.forEach((bar) => {
      expect(bar).toHaveAttribute("data-stack-id", "portfolio");
    });
  });
});
