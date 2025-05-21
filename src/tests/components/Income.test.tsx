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
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup ResizeObserver mock
    window.ResizeObserver = ResizeObserverMock;
  });

  it("renders all form fields and radio buttons", () => {
    render(
      <Income
        onChange={mockOnChange}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
        }}
      />
    );
    expect(screen.getByLabelText(/number_of_adults$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/one_adult/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/two_adults/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/income1_aria/i)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(/income2_aria/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/secondaryIncome1_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/secondaryIncome2_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/child_benefits_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other_benefits_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other_incomes_aria/i)).toBeInTheDocument();
  });

  it("hides income2 and income4 fields when 1 adult is selected", () => {
    render(
      <Income
        onChange={mockOnChange}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
        }}
      />
    );

    // Initially, income2 and income4 should be hidden (default is 1 adult)
    const income2Field = screen
      .getAllByLabelText(/income2_aria/i)[0]
      .closest('[data-slot="form-item"]');
    const income4Field = screen
      .getByLabelText(/secondaryIncome2_aria/i)
      .closest('[data-slot="form-item"]');
    expect(income2Field).toHaveClass("hidden");
    expect(income4Field).toHaveClass("hidden");
  });

  it("shows income2 and income4 fields when 2 adults is selected", () => {
    render(
      <Income
        onChange={mockOnChange}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
        }}
      />
    );

    // Click the "2 adults" radio button
    fireEvent.click(screen.getByLabelText(/two_adults/i));

    // income2 and income4 should now be visible
    const income2Field = screen
      .getAllByLabelText(/income2_aria/i)[0]
      .closest('[data-slot="form-item"]');
    const income4Field = screen
      .getAllByLabelText(/secondaryIncome1_aria/i)[0]
      .closest('[data-slot="form-item"]');
    expect(income2Field).not.toHaveClass("hidden");
    expect(income4Field).not.toHaveClass("hidden");
  });

  it("clears income2 and income4 values when switching from 2 to 1 adult", async () => {
    render(
      <Income
        onChange={mockOnChange}
        values={{
          income1: 0,
          income2: 30000,
          secondaryIncome1: 0,
          secondaryIncome2: 25000,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
        }}
      />
    );

    // First select 2 adults
    fireEvent.click(screen.getByLabelText(/two_adults/i));

    // Fill in income2 and income4
    fireEvent.change(screen.getAllByLabelText(/income2_aria/i)[0], {
      target: { value: "30000" },
    });
    fireEvent.change(screen.getByLabelText(/secondaryIncome1_aria/i), {
      target: { value: "25000" },
    });

    // Switch back to 1 adult
    fireEvent.click(screen.getByLabelText(/one_adult/i));

    // Wait for the onChange callback
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          income2: 0,
          secondaryIncome2: 0,
        })
      );
    });

    // Check if the fields are cleared in the UI
    expect(screen.getAllByLabelText(/income2_aria/i)[0]).toHaveValue(0);
    expect(screen.getByLabelText(/secondaryIncome2_aria/i)).toHaveValue(0);
  });

  it("maintains income2 and income4 values when switching from 1 to 2 adults", () => {
    render(
      <Income
        onChange={mockOnChange}
        values={{
          income1: 0,
          income2: 30000,
          secondaryIncome1: 0,
          secondaryIncome2: 25000,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
        }}
      />
    );

    // Fill in income2 and income4
    fireEvent.change(screen.getAllByLabelText(/income2_aria/i)[0], {
      target: { value: "30000" },
    });
    fireEvent.change(screen.getByLabelText(/secondaryIncome2_aria/i), {
      target: { value: "25000" },
    });

    // Switch to 2 adults
    fireEvent.click(screen.getByLabelText(/two_adults/i));

    // Values should remain unchanged
    expect(screen.getAllByLabelText(/income2_aria/i)[0]).toHaveValue(30000);
    expect(screen.getByLabelText(/secondaryIncome2_aria/i)).toHaveValue(25000);
  });

  it("initializes with provided values", () => {
    const initialValues = {
      income1: 30000,
      income2: 25000,
      secondaryIncome1: 20000,
      secondaryIncome2: 15000,
      childBenefits: 1000,
      otherBenefits: 500,
      otherIncomes: 2000,
    };

    render(<Income onChange={mockOnChange} values={initialValues} />);

    expect(screen.getAllByLabelText(/income1_aria/i)[0]).toHaveValue(30000);
    expect(screen.getAllByLabelText(/income2_aria/i)[0]).toHaveValue(25000);
    expect(screen.getByLabelText(/secondaryIncome1_aria/i)).toHaveValue(20000);
    expect(screen.getByLabelText(/secondaryIncome2_aria/i)).toHaveValue(15000);
    expect(screen.getByLabelText(/child_benefits_aria/i)).toHaveValue(1000);
    expect(screen.getByLabelText(/other_benefits_aria/i)).toHaveValue(500);
    expect(screen.getByLabelText(/other_incomes_aria/i)).toHaveValue(2000);
  });

  it("handles field changes with valid data", async () => {
    render(
      <Income
        onChange={mockOnChange}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
        }}
      />
    );

    // Change and blur each field
    const income1Field = screen.getAllByLabelText(/income1_aria/i)[0];
    const income2Field = screen.getAllByLabelText(/income2_aria/i)[0];
    const secondaryIncome1Field = screen.getByLabelText(
      /secondaryIncome1_aria/i
    );
    const secondaryIncome2Field = screen.getByLabelText(
      /secondaryIncome2_aria/i
    );
    const childBenefitsField = screen.getByLabelText(/child_benefits_aria/i);
    const otherBenefitsField = screen.getByLabelText(/other_benefits_aria/i);
    const otherIncomesField = screen.getByLabelText(/other_incomes_aria/i);

    // Change and blur income1
    fireEvent.change(income1Field, { target: { value: "30000" } });
    fireEvent.blur(income1Field);

    // Change and blur income2
    fireEvent.change(income2Field, { target: { value: "25000" } });
    fireEvent.blur(income2Field);

    // Change and blur secondaryIncome1
    fireEvent.change(secondaryIncome1Field, { target: { value: "20000" } });
    fireEvent.blur(secondaryIncome1Field);

    // Change and blur income4
    fireEvent.change(secondaryIncome2Field, { target: { value: "15000" } });
    fireEvent.blur(secondaryIncome2Field);

    // Change and blur childBenefits
    fireEvent.change(childBenefitsField, { target: { value: "1000" } });
    fireEvent.blur(childBenefitsField);

    // Change and blur otherBenefits
    fireEvent.change(otherBenefitsField, { target: { value: "500" } });
    fireEvent.blur(otherBenefitsField);

    // Change and blur otherIncomes
    fireEvent.change(otherIncomesField, { target: { value: "2000" } });
    fireEvent.blur(otherIncomesField);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        income1: 30000,
        income2: 25000,
        secondaryIncome1: 20000,
        secondaryIncome2: 15000,
        childBenefits: 1000,
        otherBenefits: 500,
        otherIncomes: 2000,
      });
    });
  });

  it("toggles extra incomes section", () => {
    render(
      <Income
        onChange={mockOnChange}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
        }}
      />
    );
    const toggleButton = screen.getByText(/add_extra_incomes/i);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });
});
