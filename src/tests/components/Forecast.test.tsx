import { describe, it, expect, beforeAll, vi } from "vitest";
import { render } from "@testing-library/react";
import { Forecast } from "../../components/calculator/Forecast";
import type { CalculatorState } from "@/lib/types";

interface ForecastData {
  year: number;
  remainingLoan: number;
  yearlyCost: number;
  monthlyCost: number;
  monthlyIncome: number;
  monthlySavings: number;
}

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

interface LineChartProps {
  children: React.ReactNode;
  data: ForecastData[];
}

interface LineProps {
  dataKey: string;
  dataPoints: string;
}

// Mock Recharts components
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div
        style={{ width: 500, height: 400 }}
        data-testid="responsive-container"
      >
        {children}
      </div>
    ),
    LineChart: ({ children, data }: LineChartProps) => (
      <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    Line: ({ dataKey, dataPoints }: LineProps) => (
      <div
        className="recharts-line"
        data-key={dataKey}
        data-points={dataPoints}
      />
    ),
    XAxis: () => <div className="recharts-xAxis" />,
    YAxis: () => <div className="recharts-yAxis" />,
    CartesianGrid: () => <div className="recharts-cartesian-grid" />,
    Tooltip: () => <div className="recharts-tooltip" />,
  };
});

beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock;
});

const mockCalculatorState: CalculatorState = {
  loanParameters: {
    amount: 9000000,
    interestRates: [0.03],
    amortizationRates: [0.03],
  },
  income: {
    income1: 50000,
    income2: 0,
    secondaryIncome1: 0,
    secondaryIncome2: 0,
    childBenefits: 0,
    otherBenefits: 0,
    otherIncomes: 0,
    currentBuffer: 0,
    numberOfAdults: "1",
  },
  expenses: {},
};

describe("Forecast", () => {
  it("renders nothing when no loan amount is provided", () => {
    const emptyState: CalculatorState = {
      ...mockCalculatorState,
      loanParameters: {
        ...mockCalculatorState.loanParameters,
        amount: 0,
      },
      income: { ...mockCalculatorState.income },
      expenses: {},
    };
    const { container } = render(<Forecast calculatorState={emptyState} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("calculates correct yearly amortization based on initial loan", () => {
    const { container } = render(
      <Forecast calculatorState={mockCalculatorState} />
    );
    const chart = container.querySelector("[data-testid='line-chart']");
    expect(chart).toBeInTheDocument();

    // Initial loan: 9,000,000
    // Yearly amortization: 9,000,000 * 0.03 = 270,000
    // First year remaining loan should be: 9,000,000 - 270,000 = 8,730,000
    const line = container.querySelector(".recharts-line");
    expect(line).toBeInTheDocument();

    // Get the data points from the line
    const dataPoints = line?.getAttribute("data-points");
    expect(dataPoints).toBeDefined();
    if (dataPoints) {
      const points = JSON.parse(dataPoints);
      expect(points[0].remainingLoan).toBe(8730000); // First year remaining loan
    }
  });

  it("handles very large loan amounts", () => {
    const largeLoanState: CalculatorState = {
      ...mockCalculatorState,
      loanParameters: {
        ...mockCalculatorState.loanParameters,
        amount: 100000000,
      },
      income: { ...mockCalculatorState.income },
      expenses: {},
    };
    const { container } = render(<Forecast calculatorState={largeLoanState} />);
    const chart = container.querySelector("[data-testid='line-chart']");
    expect(chart).toBeInTheDocument();

    const line = container.querySelector(".recharts-line");
    expect(line).toBeInTheDocument();

    // Verify first year calculation
    const dataPoints = line?.getAttribute("data-points");
    expect(dataPoints).toBeDefined();
    if (dataPoints) {
      const points = JSON.parse(dataPoints);
      expect(points[0].remainingLoan).toBe(97000000); // 100M - (100M * 0.03)
    }
  });

  it("handles very small loan amounts", () => {
    const smallLoanState: CalculatorState = {
      ...mockCalculatorState,
      loanParameters: {
        ...mockCalculatorState.loanParameters,
        amount: 100000,
      },
      income: { ...mockCalculatorState.income },
      expenses: {},
    };
    const { container } = render(<Forecast calculatorState={smallLoanState} />);
    const chart = container.querySelector("[data-testid='line-chart']");
    expect(chart).toBeInTheDocument();

    const line = container.querySelector(".recharts-line");
    expect(line).toBeInTheDocument();

    // Verify first year calculation
    const dataPoints = line?.getAttribute("data-points");
    expect(dataPoints).toBeDefined();
    if (dataPoints) {
      const points = JSON.parse(dataPoints);
      expect(points[0].remainingLoan).toBe(97000); // 100K - (100K * 0.03)
    }
  });

  it("calculates correct interest based on remaining loan", () => {
    const { container } = render(
      <Forecast calculatorState={mockCalculatorState} />
    );
    const chart = container.querySelector("[data-testid='line-chart']");
    expect(chart).toBeInTheDocument();

    const line = container.querySelector(".recharts-line");
    expect(line).toBeInTheDocument();

    // First year:
    // Interest: 9,000,000 * 0.03 = 270,000
    // Amortization: 9,000,000 * 0.03 = 270,000
    // Total yearly cost: 540,000
    // Monthly cost: 540,000 / 12 = 45,000
    const dataPoints = line?.getAttribute("data-points");
    expect(dataPoints).toBeDefined();
    if (dataPoints) {
      const points = JSON.parse(dataPoints);
      expect(points[0].yearlyCost).toBe(540000);
      expect(points[0].monthlyCost).toBe(45000);
    }
  });

  it("handles different interest and amortization rates", () => {
    const differentRatesState: CalculatorState = {
      ...mockCalculatorState,
      loanParameters: {
        ...mockCalculatorState.loanParameters,
        interestRates: [0.02],
        amortizationRates: [0.04],
      },
      income: { ...mockCalculatorState.income },
      expenses: {},
    };
    const { container } = render(
      <Forecast calculatorState={differentRatesState} />
    );
    const chart = container.querySelector("[data-testid='line-chart']");
    expect(chart).toBeInTheDocument();

    const line = container.querySelector(".recharts-line");
    expect(line).toBeInTheDocument();

    // Verify calculations with different rates
    const dataPoints = line?.getAttribute("data-points");
    expect(dataPoints).toBeDefined();
    if (dataPoints) {
      const points = JSON.parse(dataPoints);
      expect(points[0].yearlyCost).toBe(540000); // 9M * (0.02 + 0.04)
      expect(points[0].monthlyCost).toBe(45000); // 540K / 12
    }
  });

  it("calculates correct monthly savings", () => {
    const { container } = render(
      <Forecast calculatorState={mockCalculatorState} />
    );
    const chart = container.querySelector("[data-testid='line-chart']");
    expect(chart).toBeInTheDocument();

    const line = container.querySelector(".recharts-line");
    expect(line).toBeInTheDocument();

    // Monthly income: 35,000 (after tax)
    // Monthly cost: 45,000
    // Monthly savings: -10,000
    const dataPoints = line?.getAttribute("data-points");
    expect(dataPoints).toBeDefined();
    if (dataPoints) {
      const points = JSON.parse(dataPoints);
      expect(points[0].monthlySavings).toBe(-10000);
    }
  });

  it("stops calculation when loan is paid off", () => {
    const smallLoanState: CalculatorState = {
      ...mockCalculatorState,
      loanParameters: {
        ...mockCalculatorState.loanParameters,
        amount: 100000,
        amortizationRates: [0.1], // 10% amortization
      },
      income: { ...mockCalculatorState.income },
      expenses: {},
    };
    const { container } = render(<Forecast calculatorState={smallLoanState} />);
    const chart = container.querySelector("[data-testid='line-chart']");
    expect(chart).toBeInTheDocument();

    const line = container.querySelector(".recharts-line");
    expect(line).toBeInTheDocument();

    // With 100,000 loan and 10% amortization:
    // Year 1: 100,000 - 10,000 = 90,000
    // Year 2: 90,000 - 10,000 = 80,000
    // ... and so on until paid off
    const dataPoints = line?.getAttribute("data-points");
    expect(dataPoints).toBeDefined();
    if (dataPoints) {
      const points = JSON.parse(dataPoints);
      const lastPoint = points[points.length - 1];
      expect(lastPoint.remainingLoan).toBe(0);
    }
  });

  it("handles maximum calculation years (50)", () => {
    const tinyAmortizationState: CalculatorState = {
      ...mockCalculatorState,
      loanParameters: {
        ...mockCalculatorState.loanParameters,
        amortizationRates: [0.001], // 0.1% amortization
      },
      income: { ...mockCalculatorState.income },
      expenses: {},
    };
    const { container } = render(
      <Forecast calculatorState={tinyAmortizationState} />
    );
    const chart = container.querySelector("[data-testid='line-chart']");
    expect(chart).toBeInTheDocument();

    const line = container.querySelector(".recharts-line");
    expect(line).toBeInTheDocument();

    // Should stop at 50 years even if loan isn't paid off
    const dataPoints = line?.getAttribute("data-points");
    expect(dataPoints).toBeDefined();
    if (dataPoints) {
      const points = JSON.parse(dataPoints);
      expect(points.length).toBe(50);
      expect(points[49].year).toBe(49); // 0-based index, so year 49 is the 50th year
    }
  });
});
