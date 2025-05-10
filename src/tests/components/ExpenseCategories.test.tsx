import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

    // First expand the categories
    const homeCategory = screen.getByLabelText("home.name category");
    const foodCategory = screen.getByLabelText("food.name category");
    fireEvent.click(homeCategory.querySelector("button")!);
    fireEvent.click(foodCategory.querySelector("button")!);

    // Check for category names
    expect(screen.getByText("home.name")).toBeInTheDocument();
    expect(screen.getByText("food.name")).toBeInTheDocument();

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

    // First expand the categories
    const homeCategory = screen.getByLabelText("home.name category");
    const foodCategory = screen.getByLabelText("food.name category");
    fireEvent.click(homeCategory.querySelector("button")!);
    fireEvent.click(foodCategory.querySelector("button")!);

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

    // First expand the home category
    const homeCategory = screen.getByLabelText("home.name category");
    fireEvent.click(homeCategory.querySelector("button")!);

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

    // Find the specific category total elements by their parent elements
    const homeCategory = screen.getByLabelText("home.name category");
    const foodCategory = screen.getByLabelText("food.name category");

    const homeTotal = homeCategory.querySelector(".text-sm.text-gray-500");
    const foodTotal = foodCategory.querySelector(".text-sm.text-gray-500");

    expect(homeTotal).toHaveTextContent("6 000 kr");
    expect(foodTotal).toHaveTextContent("5 000 kr");
  });

  it("calculates grand total correctly", () => {
    // Get fresh test data for this test
    const testExpenses = getTestData();

    render(
      <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
    );

    // Find the grand total by its specific class
    const grandTotal = screen
      .getByText("total_expenses")
      .closest("div")
      ?.querySelector(".text-lg");

    // Verify the test data hasn't been modified
    expect(testExpenses.home["rent-monthly-fee"]).toBe(5000);
    expect(testExpenses.home["electricity-heating"]).toBe(1000);
    expect(testExpenses.food.groceries).toBe(3000);
    expect(testExpenses.food["restaurants-cafes"]).toBe(2000);

    // Verify the total
    expect(grandTotal).toHaveTextContent("11 000 kr");
  });

  it("handles empty expenses", () => {
    render(<ExpenseCategories expenses={{}} onChange={mockOnChange} />);

    // Find the grand total by its specific class
    const grandTotal = screen
      .getByText("total_expenses")
      .closest("div")
      ?.querySelector(".text-lg");
    expect(grandTotal).toHaveTextContent("0 kr");
  });

  it("handles category expansion/collapse", () => {
    const testExpenses = getTestData();
    render(
      <ExpenseCategories expenses={testExpenses} onChange={mockOnChange} />
    );

    // Find the category button by its aria-label
    const homeCategory = screen.getByLabelText("home.name category");
    const homeButton = homeCategory.querySelector("button");

    // Click to expand
    fireEvent.click(homeButton!);

    // Check if subcategories are visible
    const rentInput = screen.getByLabelText(
      "home.rent-monthly-fee in home.name"
    );
    expect(rentInput).toBeVisible();

    // Click to collapse
    fireEvent.click(homeButton!);
    expect(rentInput).not.toBeVisible();
  });
});
