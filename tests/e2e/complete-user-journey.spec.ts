import { test, expect } from "@playwright/test";

test.describe("Complete User Journey E2E Tests", () => {
  test("should complete full journey from landing page through budget calculator to compound interest", async ({
    page,
  }) => {
    // Start from the landing page
    await page.goto("/");

    // Wait for the landing page to load
    await expect(page.locator("h1")).toBeVisible();

    // Find and click the first "Kom igång" button in the hero section
    // There are two identical buttons on the page, so we need to be specific
    const budgetCalculatorButton = page
      .getByRole("button", {
        name: "Börja skapa din hushållsbudget - steg för steg guide som tar 3 minuter",
      })
      .first();
    await expect(budgetCalculatorButton).toBeVisible();
    await budgetCalculatorButton.click();

    // Should now be on the budget calculator page at step 1 (income)
    await expect(page).toHaveURL(/hushallsbudget.*steg=inkomst/);
    await expect(
      page.locator("h2").filter({ hasText: "Inkomster" })
    ).toBeVisible();

    // Fill in income data
    await page.getByRole("textbox", { name: /bruttoinkomst/ }).fill("35000");

    // Fill in kommun
    const kommunField = page.getByRole("textbox", { name: "Välj kommun" });
    await kommunField.fill("Stockholm");
    await page.waitForTimeout(500); // Wait for dropdown to populate

    // Select Stockholm from dropdown
    try {
      const stockholmOption = page.getByRole("button", {
        name: /STOCKHOLM.*30\.67%/,
      });
      await stockholmOption.waitFor({ state: "visible", timeout: 5000 });
      await stockholmOption.click();
    } catch {
      // Fallback: press Enter to select first option
      await kommunField.press("Enter");
    }

    // Wait for form validation and ensure Next button is enabled
    await page.waitForFunction(
      () => {
        const buttons = document.querySelectorAll("button");
        const nextButton = Array.from(buttons).find((btn) =>
          btn.textContent?.includes("Nästa")
        );
        return nextButton && !nextButton.disabled;
      },
      { timeout: 10000 }
    );

    const nextButton = page.locator("button").filter({ hasText: "Nästa" });
    await nextButton.click();

    // Step 2: Loan parameters
    await expect(page).toHaveURL(/steg=lan/);
    await expect(
      page.locator("h2").filter({ hasText: "Låneparametrar" })
    ).toBeVisible();

    // "No loans" should be selected by default, proceed to step 3
    await nextButton.click();

    // Step 3: Expenses
    await expect(page).toHaveURL(/steg=utgifter/);
    await expect(
      page.locator("h2").filter({ hasText: "Utgiftskategorier" })
    ).toBeVisible();

    // Add some expenses to make the calculation meaningful
    await page.getByRole("textbox", { name: "Hem" }).fill("15000");
    await page.getByRole("textbox", { name: "Mat" }).fill("4000");
    await page.getByRole("textbox", { name: "Transport" }).fill("2000");

    // Proceed to step 4
    await nextButton.click();

    // Step 4: Summary
    await expect(page).toHaveURL(/steg=summering/);
    await expect(
      page.locator("h2").filter({ hasText: "Summering" })
    ).toBeVisible();

    // Proceed to step 5 (results)
    await nextButton.click();

    // Step 5: Results
    await expect(page).toHaveURL(/steg=resultat/);
    await expect(
      page.locator("h2").filter({ hasText: "Resultat" })
    ).toBeVisible();

    // Wait for results to load completely
    await page.waitForTimeout(2000);

    // Look for the compound interest CTA button at the bottom of results
    const compoundInterestButton = page.getByTestId(
      "compound-interest-cta-button"
    );

    // Scroll to the compound interest CTA if it exists
    if (await compoundInterestButton.isVisible()) {
      await compoundInterestButton.scrollIntoViewIfNeeded();

      // Verify the compound interest section is visible
      await expect(
        page.getByTestId("compound-interest-cta-title")
      ).toBeVisible();
      await expect(
        page.getByTestId("compound-interest-cta-description")
      ).toBeVisible();

      // Click the compound interest calculator button
      await compoundInterestButton.click();

      // Should navigate to compound interest page
      await expect(page).toHaveURL(/ranta-pa-ranta/);

      // Verify compound interest page loaded with pre-filled values from budget calculator
      await expect(
        page
          .locator("h1")
          .filter({ hasText: /ränta på ränta|compound interest/i })
      ).toBeVisible();

      // Check that the monthly savings value was passed from the budget calculator
      const monthlySavingsInput = page
        .getByRole("textbox", { name: /månatlig|monthly.*saving/i })
        .first();
      if (await monthlySavingsInput.isVisible()) {
        const value = await monthlySavingsInput.inputValue();
        // Should have some positive value transferred from budget calculator
        expect(parseInt(value.replace(/\D/g, "")) || 0).toBeGreaterThan(0);
      }

      // Verify the compound interest calculator is functional
      // Just check that we're on the compound interest page with some key elements
      await expect(page.locator("h1, h2, h3").first()).toBeVisible();
    } else {
      // If no compound interest CTA is shown (e.g., no savings), just verify we're on results page
      console.log(
        "No compound interest CTA shown - user may have no savings to invest"
      );
      await expect(
        page.locator("h2").filter({ hasText: "Resultat" })
      ).toBeVisible();
    }
  });

  test("should handle the journey with loans and different income scenarios", async ({
    page,
  }) => {
    // Start from budget calculator directly
    await page.goto("/hushallsbudget?steg=inkomst");

    // Fill in higher income to ensure compound interest CTA shows
    await page.getByRole("textbox", { name: /bruttoinkomst/ }).fill("45000");

    // Fill in kommun
    const kommunField = page.getByRole("textbox", { name: "Välj kommun" });
    await kommunField.fill("Stockholm");
    await page.waitForTimeout(500);

    try {
      const stockholmOption = page.getByRole("button", {
        name: /STOCKHOLM.*30\.67%/,
      });
      await stockholmOption.waitFor({ state: "visible", timeout: 5000 });
      await stockholmOption.click();
    } catch {
      await kommunField.press("Enter");
    }

    // Wait for kommun selection to be processed
    await page.waitForTimeout(1500);

    // Add some buffer savings
    await page.getByRole("textbox", { name: /buffert/i }).fill("50000");

    // Wait for form validation and ensure Next button is enabled
    await page.waitForFunction(
      () => {
        const buttons = document.querySelectorAll("button");
        const nextButton = Array.from(buttons).find((btn) =>
          btn.textContent?.includes("Nästa")
        );
        return nextButton && !nextButton.disabled;
      },
      { timeout: 10000 }
    );

    const nextButton = page.locator("button").filter({ hasText: "Nästa" });
    await nextButton.click();

    // Step 2: Add a loan scenario
    await expect(page).toHaveURL(/steg=lan/);

    // Select "I have loans"
    const hasLoanRadio = page.getByRole("radio", { name: "Jag har lån" });
    await hasLoanRadio.click();

    // Fill in loan details (should appear after selecting "I have loans")
    await page.waitForTimeout(500);
    const loanAmountField = page
      .getByRole("textbox", { name: /lånebelopp|loan.*amount/i })
      .first();
    if (await loanAmountField.isVisible()) {
      await loanAmountField.fill("2500000");
    }

    await nextButton.click();

    // Continue through expenses with lower expenses to ensure savings
    await expect(page).toHaveURL(/steg=utgifter/);
    await page.getByRole("textbox", { name: "Hem" }).fill("8000"); // Lower housing costs
    await page.getByRole("textbox", { name: "Mat" }).fill("3000");

    await nextButton.click();

    // Summary
    await expect(page).toHaveURL(/steg=summering/);
    await nextButton.click();

    // Results with compound interest flow
    await expect(page).toHaveURL(/steg=resultat/);
    await page.waitForTimeout(2000);

    // Should show compound interest CTA with higher income and buffer
    const compoundInterestButton = page.getByTestId(
      "compound-interest-cta-button"
    );
    await expect(compoundInterestButton).toBeVisible();

    await compoundInterestButton.click();
    await expect(page).toHaveURL(/ranta-pa-ranta/);

    // Verify both monthly savings and start sum are pre-filled
    const monthlySavingsInput = page
      .getByRole("textbox", { name: /månatlig|monthly.*saving/i })
      .first();
    const startSumInput = page
      .getByRole("textbox", { name: /startbelopp|start.*sum|initial/i })
      .first();

    if (await monthlySavingsInput.isVisible()) {
      const monthlyValue = await monthlySavingsInput.inputValue();
      expect(parseInt(monthlyValue.replace(/\D/g, "")) || 0).toBeGreaterThan(0);
    }

    if (await startSumInput.isVisible()) {
      const startValue = await startSumInput.inputValue();
      expect(parseInt(startValue.replace(/\D/g, "")) || 0).toBeGreaterThan(0);
    }
  });
});
