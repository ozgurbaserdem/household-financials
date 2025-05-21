/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import type { CalculatorState } from "@/lib/types";
import { importFromCsv } from "@/lib/import-from-csv";

describe("CSV Import", () => {
  it("should import data correctly from CSV", async () => {
    const csvContent = `loanAmount,interestRates,amortizationRates,income1,income2,secondaryIncome1,secondaryIncome2,home.rent-monthly-fee,home.utilities,food.groceries,food.restaurants-cafes
1000000,3.5|4,2|3,30000,25000,20000,15000,5000,1000,3000,2000`;

    const file = new File([csvContent], "test.csv", { type: "text/csv" });
    const onSuccess = vi.fn();
    const onError = vi.fn();

    // Mock FileReader
    const mockFileReader = {
      readAsText: vi.fn(),
      onload: null as any,
      onerror: null as any,
      result: csvContent,
    };
    vi.spyOn(window, "FileReader").mockImplementation(
      () => mockFileReader as any
    );

    importFromCsv(file, onSuccess, onError);

    // Trigger the onload event
    mockFileReader.onload();

    // Wait for the next tick to ensure all promises are resolved
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    const importedState = onSuccess.mock
      .calls[0][0] as Partial<CalculatorState>;
    expect(importedState.loanParameters).toEqual({
      amount: 1000000,
      interestRates: [3.5, 4],
      amortizationRates: [2, 3],
    });
    expect(importedState.income1?.gross).toBe(30000);
    expect(importedState.income2?.gross).toBe(25000);
    expect(importedState.secondaryIncome1?.gross).toBe(20000);
    expect(importedState.secondaryIncome2?.gross).toBe(15000);
    expect(importedState.expenses).toHaveProperty("home");
    expect(importedState.expenses).toHaveProperty("food");
  });

  it("should handle invalid CSV format", async () => {
    const invalidCsv = "invalid,csv,format";
    const file = new File([invalidCsv], "test.csv", { type: "text/csv" });
    const onSuccess = vi.fn();
    const onError = vi.fn();

    // Mock FileReader
    const mockFileReader = {
      readAsText: vi.fn(),
      onload: null as any,
      onerror: null as any,
      result: invalidCsv,
    };
    vi.spyOn(window, "FileReader").mockImplementation(
      () => mockFileReader as any
    );

    importFromCsv(file, onSuccess, onError);

    // Trigger the onload event
    mockFileReader.onload();

    // Wait for the next tick to ensure all promises are resolved
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });

  it("should handle file read error", async () => {
    const file = new File([], "test.csv", { type: "text/csv" });
    const onSuccess = vi.fn();
    const onError = vi.fn();

    // Mock FileReader to simulate error
    const mockFileReader = {
      readAsText: vi.fn(),
      onload: null as any,
      onerror: null as any,
    };
    vi.spyOn(window, "FileReader").mockImplementation(
      () => mockFileReader as any
    );

    importFromCsv(file, onSuccess, onError);

    // Trigger the onerror event
    mockFileReader.onerror();

    // Wait for the next tick to ensure all promises are resolved
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(new Error("File read error"));
  });
});
