import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExpenseCategories } from "@/components/calculator/ExpenseCategories";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => {
    // Return the key for testing purposes
    return key;
  }),
}));

describe("ExpenseCategories", () => {
  const mockOnChange = vi.fn();

  // Create a function to get fresh test data
  const getTestData = () => ({
    home: {
      "rent-monthly-fee": 5000,
      "electricity-heating": 1000,
    },
    food: {
      groceries: 3000,
      "restaurants-cafes": 2000,
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all expense categories and subcategories", async () => {
    const testExpenses = getTestData();
    render(
      <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
    );

    // Check for category names
    expect(screen.getAllByText("home.name").length).toBeGreaterThan(0);
    expect(screen.getAllByText("food.name").length).toBeGreaterThan(0);

    // Find and click the category buttons to expand them
    const homeButton = screen.getAllByText("home.name")[0].closest("button");
    const foodButton = screen.getAllByText("food.name")[0].closest("button");

    fireEvent.click(homeButton!);
    fireEvent.click(foodButton!);

    // Check for subcategory inputs
    expect(
      screen.getByLabelText("home.rent-monthly-fee in home.name")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("home.electricity-heating in home.name")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("food.groceries in food.name")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("food.restaurants-cafes in food.name")
    ).toBeInTheDocument();
  });

  it("displays correct initial values", () => {
    const testExpenses = getTestData();
    render(
      <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
    );

    // Find and click the category buttons to expand them
    const homeButton = screen.getAllByText("home.name")[0].closest("button");
    const foodButton = screen.getAllByText("food.name")[0].closest("button");

    fireEvent.click(homeButton!);
    fireEvent.click(foodButton!);

    expect(
      screen.getByLabelText("home.rent-monthly-fee in home.name")
    ).toHaveValue(5000);
    expect(
      screen.getByLabelText("home.electricity-heating in home.name")
    ).toHaveValue(1000);
    expect(screen.getByLabelText("food.groceries in food.name")).toHaveValue(
      3000
    );
    expect(
      screen.getByLabelText("food.restaurants-cafes in food.name")
    ).toHaveValue(2000);
  });

  it("handles expense changes correctly", () => {
    const testExpenses = getTestData();
    render(
      <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
    );

    // Find and click the home category button to expand it
    const homeButton = screen.getAllByText("home.name")[0].closest("button");
    fireEvent.click(homeButton!);

    fireEvent.change(
      screen.getByLabelText("home.rent-monthly-fee in home.name"),
      {
        target: { value: "6000" },
      }
    );

    expect(mockOnChange).toHaveBeenCalledWith({
      ...testExpenses,
      home: {
        ...testExpenses.home,
        "rent-monthly-fee": 6000,
      },
    });
  });

  it("calculates category totals correctly", () => {
    const testExpenses = getTestData();
    render(
      <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
    );

    // Find the category total elements by looking for the text content
    const homeTotals = screen.getAllByText("6 000 kr");
    const foodTotals = screen.getAllByText("5 000 kr");

    expect(homeTotals.length).toBeGreaterThan(0);
    expect(foodTotals.length).toBeGreaterThan(0);
  });

  it("calculates grand total correctly", () => {
    const testExpenses = getTestData();
    render(
      <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
    );

    // Find the grand total by looking for the text content
    const grandTotals = screen.getAllByText("11 000 kr");
    expect(grandTotals.length).toBeGreaterThan(0);
  });

  it("handles empty expenses", () => {
    render(<ExpenseCategories expenses={{}} onChange={mockOnChange} />);

    // Find the grand total using data-testid
    const grandTotal = screen.getByTestId("grand-total");
    expect(grandTotal).toHaveTextContent("0 kr");
  });

  it("handles category expansion/collapse", async () => {
    const testExpenses = getTestData();
    render(
      <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
    );

    // Find the home category button
    const homeButton = screen.getAllByText("home.name")[0].closest("button");
    expect(homeButton).toBeInTheDocument();

    // Click to expand
    fireEvent.click(homeButton!);

    // Wait for the animation to complete and check if subcategories are visible
    const rentInput = await screen.findByLabelText(
      "home.rent-monthly-fee in home.name"
    );
    expect(rentInput).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(homeButton!);

    // Wait for the animation to complete and check if subcategories are hidden
    await waitFor(() => {
      expect(rentInput).not.toBeVisible();
    });
  });
});
