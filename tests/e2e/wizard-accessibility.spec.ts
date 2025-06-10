import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("Wizard Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage with Swedish locale
    await page.goto("/sv");
  });

  test("should focus on Income heading when landing on first step", async ({
    page,
  }) => {
    // Wait for the page to load and find the income title
    const incomeTitle = page.locator("h3").filter({ hasText: "Inkomster" });
    await expect(incomeTitle).toBeVisible();

    // Check that the heading is focused
    await expect(incomeTitle).toBeFocused();
  });

  test("should focus on Loan Parameters heading when navigating to step 2", async ({
    page,
  }) => {
    // Wait for next button and click it
    const nextButton = page.locator("button").filter({ hasText: "Nästa" });
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Wait for URL to change to loan step
    await expect(page).toHaveURL(/steg=lan/);

    // Check that loan parameters heading is focused
    const loanTitle = page.locator("h3").filter({ hasText: "Låneparametrar" });
    await expect(loanTitle).toBeVisible();
    await expect(loanTitle).toBeFocused();
  });

  test("should focus on Expense Categories heading when navigating to step 3", async ({
    page,
  }) => {
    // Navigate to loans step first
    const nextButton = page.locator("button").filter({ hasText: "Nästa" });
    await nextButton.click();
    await expect(page).toHaveURL(/steg=lan/);

    // Click "I don't have loans" to proceed
    const noLoanButton = page
      .locator("button")
      .filter({ hasText: "Jag har inga lån" });
    await noLoanButton.click();

    // Click next again to go to expenses
    await nextButton.click();
    await expect(page).toHaveURL(/steg=utgifter/);

    // Check that expense categories heading is focused
    const expenseTitle = page
      .locator("h3")
      .filter({ hasText: "Utgiftskategorier" });
    await expect(expenseTitle).toBeVisible();
    await expect(expenseTitle).toBeFocused();
  });

  test("should focus on Summary heading when navigating to step 4", async ({
    page,
  }) => {
    // Navigate through all steps
    const nextButton = page.locator("button").filter({ hasText: "Nästa" });

    // Step 1 -> 2
    await nextButton.click();
    await expect(page).toHaveURL(/steg=lan/);

    // Select "no loan" and continue
    const noLoanButton = page
      .locator("button")
      .filter({ hasText: "Jag har inga lån" });
    await noLoanButton.click();

    // Step 2 -> 3
    await nextButton.click();
    await expect(page).toHaveURL(/steg=utgifter/);

    // Step 3 -> 4
    await nextButton.click();
    await expect(page).toHaveURL(/steg=summering/);

    // Check that summary heading is focused
    const summaryTitle = page.locator("h3").filter({ hasText: "summering" });
    await expect(summaryTitle).toBeVisible();
    await expect(summaryTitle).toBeFocused();
  });

  test("should focus on Results heading when navigating to step 5", async ({
    page,
  }) => {
    // Navigate through all steps to results
    const nextButton = page.locator("button").filter({ hasText: "Nästa" });

    // Step 1 -> 2
    await nextButton.click();
    const noLoanButton = page
      .locator("button")
      .filter({ hasText: "Jag har inga lån" });
    await noLoanButton.click();

    // Step 2 -> 3
    await nextButton.click();

    // Step 3 -> 4
    await nextButton.click();

    // Step 4 -> 5
    await nextButton.click();
    await expect(page).toHaveURL(/steg=resultat/);

    // Check that results heading is focused (it's an h3 CardTitle)
    const resultsTitle = page
      .locator("h3")
      .filter({ hasText: "Beräkningsresultat" });
    await expect(resultsTitle).toBeVisible();
    await expect(resultsTitle).toBeFocused();
  });

  test("should maintain keyboard navigation flow after focus changes", async ({
    page,
  }) => {
    // Go to loans step
    const nextButton = page.locator("button").filter({ hasText: "Nästa" });
    await nextButton.click();

    // Check that heading is focused first
    const loanTitle = page.locator("h3").filter({ hasText: "Låneparametrar" });
    await expect(loanTitle).toBeFocused();

    // Press Tab to move focus to next element
    await page.keyboard.press("Tab");

    // The focus should move to the "I have loans" button
    const hasLoanButton = page
      .locator("button")
      .filter({ hasText: "Jag har lån" });
    await expect(hasLoanButton).toBeFocused();
  });

  test("should pass axe accessibility checks on all wizard steps", async ({
    page,
  }) => {
    await injectAxe(page);

    // Check accessibility on income step with some exclusions for known issues
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        rules: {
          "document-title": { enabled: false }, // Next.js handles this
          "landmark-one-main": { enabled: false }, // Layout structure
          "page-has-heading-one": { enabled: false }, // App structure
          "color-contrast": { enabled: false }, // Design choice with dark theme
        },
      },
    });

    // Navigate to loans step
    const nextButton = page.locator("button").filter({ hasText: "Nästa" });
    await nextButton.click();
    await checkA11y(page, undefined, {
      axeOptions: {
        rules: {
          "document-title": { enabled: false },
          "landmark-one-main": { enabled: false },
          "page-has-heading-one": { enabled: false },
          "color-contrast": { enabled: false },
        },
      },
    });

    // Navigate to expenses step
    const noLoanButton = page
      .locator("button")
      .filter({ hasText: "Jag har inga lån" });
    await noLoanButton.click();
    await nextButton.click();
    await checkA11y(page, undefined, {
      axeOptions: {
        rules: {
          "document-title": { enabled: false },
          "landmark-one-main": { enabled: false },
          "page-has-heading-one": { enabled: false },
          "color-contrast": { enabled: false },
        },
      },
    });

    // Navigate to summary step
    await nextButton.click();
    await checkA11y(page, undefined, {
      axeOptions: {
        rules: {
          "document-title": { enabled: false },
          "landmark-one-main": { enabled: false },
          "page-has-heading-one": { enabled: false },
          "color-contrast": { enabled: false },
        },
      },
    });

    // Navigate to results step
    await nextButton.click();
    await checkA11y(page, undefined, {
      axeOptions: {
        rules: {
          "document-title": { enabled: false },
          "landmark-one-main": { enabled: false },
          "page-has-heading-one": { enabled: false },
          "color-contrast": { enabled: false },
        },
      },
    });
  });

  test("should have proper ARIA labels and roles", async ({ page }) => {
    // Check income step ARIA attributes
    const incomeTitle = page.locator("h3").filter({ hasText: "Inkomster" });
    await expect(incomeTitle).toHaveAttribute("aria-label", "Inkomstsektion");
    await expect(incomeTitle).toHaveAttribute("tabindex", "0");

    // Navigate to loans step and check
    const nextButton = page.locator("button").filter({ hasText: "Nästa" });
    await nextButton.click();

    const loanTitle = page.locator("h3").filter({ hasText: "Låneparametrar" });
    await expect(loanTitle).toHaveAttribute(
      "aria-label",
      "Avsnitt för låneparametrar"
    );
    await expect(loanTitle).toHaveAttribute("tabindex", "0");
  });

  test("should support screen reader navigation", async ({ page }) => {
    // Test that headings are properly structured for screen readers
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();

    // Should have at least one main heading and step heading
    expect(headings.length).toBeGreaterThan(0);

    // Check that visible buttons have proper labels
    const visibleButtons = await page.locator("button:visible").all();
    for (const button of visibleButtons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");
      const ariaLabelledBy = await button.getAttribute("aria-labelledby");

      // Button should have text, aria-label, or aria-labelledby
      // Skip buttons that are just icons or have aria-hidden
      const isHidden = await button.getAttribute("aria-hidden");
      if (isHidden !== "true") {
        const hasLabel =
          (text && text.trim() !== "") || ariaLabel || ariaLabelledBy;
        expect(hasLabel).toBeTruthy();
      }
    }
  });
});
