import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Income } from "@/components/calculator/Income";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

describe("Income", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup ResizeObserver mock
    window.ResizeObserver = ResizeObserverMock;
  });

  it("renders all form fields and radio buttons", () => {
    render(<Income onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/number_of_adults$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/one_adult/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/two_adults/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/income1_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/income2_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/income3_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/income4_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/child_benefits_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other_benefits_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other_incomes_aria/i)).toBeInTheDocument();
  });

  it("hides income2 and income4 fields when 1 adult is selected", () => {
    render(<Income onSubmit={mockOnSubmit} />);

    // Initially, income2 and income4 should be hidden (default is 1 adult)
    const income2Field = screen
      .getByLabelText(/income2_aria/i)
      .closest('[data-slot="form-item"]');
    const income4Field = screen
      .getByLabelText(/income4_aria/i)
      .closest('[data-slot="form-item"]');
    expect(income2Field).toHaveClass("hidden");
    expect(income4Field).toHaveClass("hidden");
  });

  it("shows income2 and income4 fields when 2 adults is selected", () => {
    render(<Income onSubmit={mockOnSubmit} />);

    // Click the "2 adults" radio button
    fireEvent.click(screen.getByLabelText(/two_adults/i));

    // income2 and income4 should now be visible
    const income2Field = screen
      .getByLabelText(/income2_aria/i)
      .closest('[data-slot="form-item"]');
    const income4Field = screen
      .getByLabelText(/income4_aria/i)
      .closest('[data-slot="form-item"]');
    expect(income2Field).not.toHaveClass("hidden");
    expect(income4Field).not.toHaveClass("hidden");
  });

  it("clears income2 and income4 values when switching from 2 to 1 adult", async () => {
    render(<Income onSubmit={mockOnSubmit} />);

    // First select 2 adults
    fireEvent.click(screen.getByLabelText(/two_adults/i));

    // Fill in income2 and income4
    fireEvent.change(screen.getByLabelText(/income2_aria/i), {
      target: { value: "30000" },
    });
    fireEvent.change(screen.getByLabelText(/income4_aria/i), {
      target: { value: "25000" },
    });

    // Switch back to 1 adult
    fireEvent.click(screen.getByLabelText(/one_adult/i));

    // Wait for the form submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          income2: 0,
          income4: 0,
          grossIncome2: 0,
          grossIncome4: 0,
        })
      );
    });

    // Check if the fields are cleared
    expect(screen.getByLabelText(/income2_aria/i)).toHaveValue(0);
    expect(screen.getByLabelText(/income4_aria/i)).toHaveValue(0);
  });

  it("maintains income2 and income4 values when switching from 1 to 2 adults", () => {
    render(<Income onSubmit={mockOnSubmit} />);

    // Fill in income2 and income4
    fireEvent.change(screen.getByLabelText(/income2_aria/i), {
      target: { value: "30000" },
    });
    fireEvent.change(screen.getByLabelText(/income4_aria/i), {
      target: { value: "25000" },
    });

    // Switch to 2 adults
    fireEvent.click(screen.getByLabelText(/two_adults/i));

    // Values should remain unchanged
    expect(screen.getByLabelText(/income2_aria/i)).toHaveValue(30000);
    expect(screen.getByLabelText(/income4_aria/i)).toHaveValue(25000);
  });

  it("initializes with provided values", () => {
    const initialValues = {
      income1: 30000,
      income2: 25000,
      income3: 20000,
      income4: 15000,
      childBenefits: 1000,
      otherBenefits: 500,
      otherIncomes: 2000,
    };

    render(<Income onSubmit={mockOnSubmit} values={initialValues} />);

    expect(screen.getByLabelText(/income1_aria/i)).toHaveValue(30000);
    expect(screen.getByLabelText(/income2_aria/i)).toHaveValue(25000);
    expect(screen.getByLabelText(/income3_aria/i)).toHaveValue(20000);
    expect(screen.getByLabelText(/income4_aria/i)).toHaveValue(15000);
    expect(screen.getByLabelText(/child_benefits_aria/i)).toHaveValue(1000);
    expect(screen.getByLabelText(/other_benefits_aria/i)).toHaveValue(500);
    expect(screen.getByLabelText(/other_incomes_aria/i)).toHaveValue(2000);
  });

  it("handles form submission with valid data", async () => {
    render(<Income onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText(/income1_aria/i), {
      target: { value: "30000" },
    });
    fireEvent.change(screen.getByLabelText(/income2_aria/i), {
      target: { value: "25000" },
    });
    fireEvent.change(screen.getByLabelText(/income3_aria/i), {
      target: { value: "20000" },
    });
    fireEvent.change(screen.getByLabelText(/income4_aria/i), {
      target: { value: "15000" },
    });
    fireEvent.change(screen.getByLabelText(/child_benefits_aria/i), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByLabelText(/other_benefits_aria/i), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByLabelText(/other_incomes_aria/i), {
      target: { value: "2000" },
    });
    fireEvent.submit(screen.getByTestId("income-form"));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          income1: 30000,
          income2: 25000,
          income3: 20000,
          income4: 15000,
          childBenefits: 1000,
          otherBenefits: 500,
          otherIncomes: 2000,
          grossIncome1: 30000,
          grossIncome2: 25000,
          grossIncome3: 20000,
          grossIncome4: 15000,
        })
      );
    });
  });

  it("toggles extra incomes section", () => {
    render(<Income onSubmit={mockOnSubmit} />);
    const toggleButton = screen.getByText(/add_extra_incomes/i);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });
});
