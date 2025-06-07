import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Income } from "@/features/calculator/Income";
import React from "react";

describe("Income", () => {
  const mockOnChange = vi.fn();
  const mockOnNumberOfAdultsChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correct fields for 1 adult", () => {
    render(
      <Income
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
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
        }}
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
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
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
        }}
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
          onChange={mockOnChange}
          onNumberOfAdultsChange={setAdults}
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
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
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
        }}
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
          onChange={mockOnChange}
          onNumberOfAdultsChange={setAdults}
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
          }}
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
          onChange={mockOnChange}
          onNumberOfAdultsChange={setAdults}
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
    };

    render(
      <Income
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
        numberOfAdults={"2"}
        values={initialValues}
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
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
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
        }}
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
      });
    });
  });

  it("toggles extra incomes section", () => {
    render(
      <Income
        onChange={mockOnChange}
        onNumberOfAdultsChange={mockOnNumberOfAdultsChange}
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
        }}
      />
    );
    const toggleButton = screen.getByTestId("extra-incomes-toggle");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });
});
