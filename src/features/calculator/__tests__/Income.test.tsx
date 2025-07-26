import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { Income } from "@/features/calculator/Income";

describe("Income", () => {
  const mockOnChange = vi.fn();
  const mockOnNumberOfAdultsChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correct fields for 1 adult", () => {
    render(
      <Income
        numberOfAdults={"1"}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          secondaryIncomeTaxRate: 34,
        }}
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
      />
    );
    expect(screen.getByLabelText(/number_of_adults$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/one_adult/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/two_adult/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/income1_aria/i)[0]).toBeInTheDocument();
    // Expand extra incomes
    fireEvent.click(screen.getByText(/add_extra_incomes/i));
    expect(
      screen.getAllByLabelText(/secondaryIncome1_aria/i)[0]
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/child_benefits_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other_benefits_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other_incomes_aria/i)).toBeInTheDocument();
    // These should NOT be in the DOM:
    expect(screen.queryAllByLabelText(/income2_aria/i).length).toBe(0);
    expect(screen.queryAllByLabelText(/secondaryIncome2_aria/i).length).toBe(0);
  });

  it("renders all form fields for 2 adults", () => {
    render(
      <Income
        numberOfAdults={"2"}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          secondaryIncomeTaxRate: 34,
        }}
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
      />
    );
    expect(screen.getByLabelText(/number_of_adults$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/one_adult/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/two_adult/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/income1_aria/i)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(/income2_aria/i)[0]).toBeInTheDocument();
    // Expand extra incomes
    fireEvent.click(screen.getByText(/add_extra_incomes/i));
    expect(
      screen.getAllByLabelText(/secondaryIncome1_aria/i)[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByLabelText(/secondaryIncome2_aria/i)[0]
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/child_benefits_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other_benefits_aria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other_incomes_aria/i)).toBeInTheDocument();
  });

  it("hides income2 and income4 fields when 1 adult is selected", () => {
    const Wrapper = () => {
      const [adults, setAdults] = React.useState<"2" | "1">("1");
      return (
        <Income
          numberOfAdults={adults}
          values={{
            income1: 0,
            income2: 0,
            secondaryIncome1: 0,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={setAdults}
        />
      );
    };

    render(<Wrapper />);

    // Should not be in the DOM when 1 adult is selected
    expect(screen.queryAllByLabelText(/income2_aria/i).length).toBe(0);
    expect(screen.queryAllByLabelText(/secondaryIncome2_aria/i).length).toBe(0);
  });

  it("shows income2 and income4 fields when 2 adults is selected", () => {
    render(
      <Income
        numberOfAdults={"2"}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          secondaryIncomeTaxRate: 34,
        }}
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
      />
    );

    // Click the "2 adults" radio button
    fireEvent.click(screen.getByLabelText(/two_adults/i));

    // Should now be present in the DOM
    expect(screen.getAllByLabelText(/income2_aria/i)[0]).toBeInTheDocument();
    // Expand extra incomes
    fireEvent.click(screen.getByText(/add_extra_incomes/i));
    expect(
      screen.getAllByLabelText(/secondaryIncome2_aria/i)[0]
    ).toBeInTheDocument();
  });

  it("clears income2 and income4 values when switching from 2 to 1 adult", async () => {
    const Wrapper = () => {
      const [adults, setAdults] = React.useState<"2" | "1">("2");
      return (
        <Income
          numberOfAdults={adults}
          values={{
            income1: 0,
            income2: 30000,
            secondaryIncome1: 0,
            secondaryIncome2: 25000,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={setAdults}
        />
      );
    };

    render(<Wrapper />);

    // Fill in income2 and income4
    fireEvent.change(screen.getAllByLabelText(/income2_aria/i)[0], {
      target: { value: "30000" },
    });
    // Expand extra incomes
    fireEvent.click(screen.getByText(/add_extra_incomes/i));
    fireEvent.change(screen.getAllByLabelText(/secondaryIncome2_aria/i)[0], {
      target: { value: "25000" },
    });

    // Switch back to 1 adult
    fireEvent.click(screen.getByLabelText(/one_adult/i));

    // Wait for the onChange callback
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          income2: 0,
          secondaryIncome2: 0,
        })
      );
    });

    // Wait for the animation to complete and fields to be removed from DOM
    await waitFor(() => {
      expect(screen.queryAllByLabelText(/income2_aria/i).length).toBe(0);
      expect(screen.queryAllByLabelText(/secondaryIncome2_aria/i).length).toBe(
        0
      );
    });
  });

  it("clears income2 and income4 values when toggling to 1 adult and back to 2 adults", async () => {
    const Wrapper = () => {
      const [adults, setAdults] = React.useState<"2" | "1">("2");
      return (
        <Income
          numberOfAdults={adults}
          values={{
            income1: 0,
            income2: 0,
            secondaryIncome1: 0,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={setAdults}
        />
      );
    };

    render(<Wrapper />);

    // Fill in income2 and income4
    fireEvent.change(screen.getAllByLabelText(/income2_aria/i)[0], {
      target: { value: "30000" },
    });
    // Expand extra incomes
    fireEvent.click(screen.getByTestId("extra-incomes-toggle"));
    fireEvent.change(screen.getAllByLabelText(/secondaryIncome2_aria/i)[0], {
      target: { value: "25000" },
    });

    // Switch to 1 adult (fields disappear, values cleared)
    fireEvent.click(screen.getByLabelText(/one_adult/i));

    // Wait for the state to update
    await waitFor(() => {
      expect(screen.queryAllByLabelText(/income2_aria/i).length).toBe(0);
      expect(screen.queryAllByLabelText(/secondaryIncome2_aria/i).length).toBe(
        0
      );
    });

    // Switch back to 2 adults (fields reappear, values should be 0)
    fireEvent.click(screen.getByLabelText(/two_adults/i));

    // Wait for the state to update and check values
    await waitFor(() => {
      const income2Field = screen.getAllByLabelText(/income2_aria/i)[0];
      expect(income2Field).toHaveValue(null);

      // Expand extra incomes again to check secondaryIncome2
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));
      const secondaryIncome2Field = screen.getAllByLabelText(
        /secondaryIncome2_aria/i
      )[0];
      expect(secondaryIncome2Field).toHaveValue(null);
    });
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
      currentBuffer: 0,
      secondaryIncomeTaxRate: 34,
    };

    render(
      <Income
        numberOfAdults={"2"}
        values={initialValues}
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
      />
    );

    expect(screen.getAllByLabelText(/income1_aria/i)[0]).toHaveValue(30000);
    expect(screen.getAllByLabelText(/income2_aria/i)[0]).toHaveValue(25000);
    // Expand extra incomes
    fireEvent.click(screen.getByText(/add_extra_incomes/i));
    expect(screen.getByLabelText(/secondaryIncome1_aria/i)).toHaveValue(20000);
    expect(screen.getByLabelText(/secondaryIncome2_aria/i)).toHaveValue(15000);
    expect(screen.getByLabelText(/child_benefits_aria/i)).toHaveValue(1000);
    expect(screen.getByLabelText(/other_benefits_aria/i)).toHaveValue(500);
    expect(screen.getByLabelText(/other_incomes_aria/i)).toHaveValue(2000);
  });

  it("handles field changes with valid data", async () => {
    render(
      <Income
        numberOfAdults={"2"}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          secondaryIncomeTaxRate: 34,
        }}
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
      />
    );

    // Change and blur each field
    const income1Field = screen.getAllByLabelText(/income1_aria/i)[0];
    const income2Field = screen.getAllByLabelText(/income2_aria/i)[0];
    // Expand extra incomes
    fireEvent.click(screen.getByText(/add_extra_incomes/i));
    const secondaryIncome1Field = screen.getAllByLabelText(
      /secondaryIncome1_aria/i
    )[0];
    const secondaryIncome2Field = screen.getAllByLabelText(
      /secondaryIncome2_aria/i
    )[0];
    const childBenefitsField =
      screen.getAllByLabelText(/child_benefits_aria/i)[0];
    const otherBenefitsField =
      screen.getAllByLabelText(/other_benefits_aria/i)[0];
    const otherIncomesField =
      screen.getAllByLabelText(/other_incomes_aria/i)[0];

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
      expect(mockOnChange).toHaveBeenLastCalledWith({
        income1: 30000,
        income2: 25000,
        secondaryIncome1: 20000,
        secondaryIncome2: 15000,
        childBenefits: 1000,
        otherBenefits: 500,
        otherIncomes: 2000,
        currentBuffer: 0,
        secondaryIncomeTaxRate: 34,
      });
    });
  });

  it("toggles extra incomes section", () => {
    render(
      <Income
        numberOfAdults={"1"}
        values={{
          income1: 0,
          income2: 0,
          secondaryIncome1: 0,
          secondaryIncome2: 0,
          childBenefits: 0,
          otherBenefits: 0,
          otherIncomes: 0,
          currentBuffer: 0,
          secondaryIncomeTaxRate: 34,
        }}
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
      />
    );
    const toggleButton = screen.getByTestId("extra-incomes-toggle");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  describe("Secondary Income Tax Rate Slider", () => {
    it("should not show tax rate slider when no secondary income is entered", () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 30000,
            income2: 0,
            secondaryIncome1: 0,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Expand secondary income section
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));

      // Tax rate slider should not be visible
      expect(
        screen.queryByLabelText(/secondary_income_tax_rate_aria/i)
      ).not.toBeInTheDocument();
    });

    it("should show tax rate slider when secondary income 1 is entered", async () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 30000,
            income2: 0,
            secondaryIncome1: 0,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Expand secondary income section
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));

      // Enter secondary income 1
      const secondaryIncome1Field = screen.getByLabelText(
        /secondaryIncome1_aria/i
      );
      fireEvent.change(secondaryIncome1Field, { target: { value: "15000" } });

      // Tax rate slider should now be visible (expect 2 elements: slider + button)
      await waitFor(() => {
        expect(
          screen.getAllByLabelText(/secondary_income_tax_rate_aria/i)
        ).toHaveLength(2);
      });
    });

    it("should show tax rate slider when secondary income 2 is entered", async () => {
      render(
        <Income
          numberOfAdults={"2"}
          values={{
            income1: 30000,
            income2: 25000,
            secondaryIncome1: 0,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Expand secondary income section
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));

      // Enter secondary income 2
      const secondaryIncome2Field = screen.getByLabelText(
        /secondaryIncome2_aria/i
      );
      fireEvent.change(secondaryIncome2Field, { target: { value: "10000" } });

      // Tax rate slider should now be visible (expect 2 elements: slider + button)
      await waitFor(() => {
        expect(
          screen.getAllByLabelText(/secondary_income_tax_rate_aria/i)
        ).toHaveLength(2);
      });
    });

    it("should display default tax rate value in slider", async () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 30000,
            income2: 0,
            secondaryIncome1: 12000,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Expand secondary income section
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));

      // Check that slider shows correct default value (get the range input specifically)
      await waitFor(() => {
        const sliders = screen.getAllByLabelText(
          /secondary_income_tax_rate_aria/i
        );
        const slider = sliders.find(
          (input) => input.getAttribute("type") === "range"
        );
        expect(slider).toHaveValue("34");
      });

      // Check that text display shows 34%
      expect(screen.getByText("34%")).toBeInTheDocument();
    });

    it("should allow changing tax rate via slider", async () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 30000,
            income2: 0,
            secondaryIncome1: 15000,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Expand secondary income section
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));

      await waitFor(() => {
        const sliders = screen.getAllByLabelText(
          /secondary_income_tax_rate_aria/i
        );
        const slider = sliders.find(
          (input) => input.getAttribute("type") === "range"
        );

        // Change slider value to 28%
        fireEvent.change(slider!, { target: { value: "28" } });

        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            secondaryIncomeTaxRate: 28,
          })
        );
      });
    });

    it("should allow changing tax rate via text input", async () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 30000,
            income2: 0,
            secondaryIncome1: 8000,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Expand secondary income section
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));

      await waitFor(() => {
        // Click on the percentage display to enter edit mode
        const percentageDisplay = screen.getByText("34%");
        fireEvent.click(percentageDisplay);
      });

      await waitFor(() => {
        // Enter new value and blur to trigger save
        const textInput = screen.getByDisplayValue("34");
        fireEvent.change(textInput, { target: { value: "30" } });
        fireEvent.blur(textInput);

        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            secondaryIncomeTaxRate: 30,
          })
        );
      });
    });

    it("should enforce minimum and maximum tax rate bounds", async () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 30000,
            income2: 0,
            secondaryIncome1: 10000,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Expand secondary income section
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));

      await waitFor(() => {
        const sliders = screen.getAllByLabelText(
          /secondary_income_tax_rate_aria/i
        );
        const slider = sliders.find(
          (input) => input.getAttribute("type") === "range"
        );

        // Test minimum bound
        expect(slider).toHaveAttribute("min", "25");

        // Test maximum bound
        expect(slider).toHaveAttribute("max", "40");

        // Test step
        expect(slider).toHaveAttribute("step", "1");
      });
    });

    it("should hide slider when secondary income is cleared", async () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 30000,
            income2: 0,
            secondaryIncome1: 10000,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Expand secondary income section
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));

      // Slider should be visible initially (expect 2 elements: slider + button)
      await waitFor(() => {
        expect(
          screen.getAllByLabelText(/secondary_income_tax_rate_aria/i)
        ).toHaveLength(2);
      });

      // Clear secondary income
      const secondaryIncome1Field = screen.getByLabelText(
        /secondaryIncome1_aria/i
      );
      fireEvent.change(secondaryIncome1Field, { target: { value: "0" } });

      // Slider should be hidden
      await waitFor(() => {
        expect(
          screen.queryAllByLabelText(/secondary_income_tax_rate_aria/i)
        ).toHaveLength(0);
      });
    });

    it("should show appropriate labels and help text", async () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 30000,
            income2: 0,
            secondaryIncome1: 5000,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Expand secondary income section
      fireEvent.click(screen.getByTestId("extra-incomes-toggle"));

      await waitFor(() => {
        // Check for slider label and help text by looking for the specific elements
        const labels = screen.getAllByText(/secondary_income_tax_rate/i);
        expect(labels.length).toBeGreaterThanOrEqual(1);

        const helpTexts = screen.getAllByText(
          /secondary_income_tax_rate_help/i
        );
        expect(helpTexts.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("Total Income Display", () => {
    it("should calculate total income correctly excluding tax rate field", () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 25000,
            income2: 0,
            secondaryIncome1: 5000,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 10000, // Should be excluded
            secondaryIncomeTaxRate: 34, // Should be excluded
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Total should be 25000 + 5000 = 30000, not including tax rate or buffer
      expect(screen.getByText("30 000 kr")).toBeInTheDocument();
    });

    it("should not include secondary income tax rate in total regardless of value", () => {
      render(
        <Income
          numberOfAdults={"1"}
          values={{
            income1: 25000,
            income2: 0,
            secondaryIncome1: 5000,
            secondaryIncome2: 0,
            childBenefits: 0,
            otherBenefits: 0,
            otherIncomes: 0,
            currentBuffer: 0,
            secondaryIncomeTaxRate: 40, // Different tax rate
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Total should still be 30000, regardless of tax rate
      expect(screen.getByText("30 000 kr")).toBeInTheDocument();
    });

    it("should exclude currentBuffer from total income calculation", () => {
      render(
        <Income
          numberOfAdults={"2"}
          values={{
            income1: 20000,
            income2: 15000,
            secondaryIncome1: 0,
            secondaryIncome2: 0,
            childBenefits: 2000,
            otherBenefits: 1000,
            otherIncomes: 500,
            currentBuffer: 50000, // Should not be included in total
            secondaryIncomeTaxRate: 34,
          }}
          onChange={mockOnChange}
          onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        />
      );

      // Total should be 20000 + 15000 + 2000 + 1000 + 500 = 38500
      expect(screen.getByText("38 500 kr")).toBeInTheDocument();
    });
  });
});
