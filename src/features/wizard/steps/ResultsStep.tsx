import { TrendingUp, Calculator, PieChart } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/Button";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { StepHeader } from "@/components/ui/StepHeader";
import { Text } from "@/components/ui/Text";
import { Forecast } from "@/features/calculator/Forecast";
import { ResultsTable } from "@/features/calculator/ResultsTable";
import { ExpenseBreakdown } from "@/features/charts/ExpenseBreakdown";
import { Link } from "@/i18n/navigation";
import { calculateLoanScenarios } from "@/lib/calculations";
import { formatCurrencyNoDecimals } from "@/lib/formatting";
import { useAppSelector } from "@/store/hooks";

export const ResultsStep = () => {
  const loanParameters = useAppSelector((state) => state.loanParameters);
  const income = useAppSelector((state) => state.income);
  const expenses = useAppSelector((state) => state.expenses);
  const expenseViewMode = useAppSelector((state) => state.expenseViewMode);
  const totalExpenses = useAppSelector((state) => state.totalExpenses);

  const calculatorState = {
    loanParameters,
    income,
    expenses,
    expenseViewMode,
    totalExpenses,
  };
  const t = useTranslations("results");
  const tWizard = useTranslations("wizard");
  const tCompoundInterestCta = useTranslations("compound_interest_cta");

  // Calculate loan scenario with current rates
  const loanScenarios = calculateLoanScenarios(calculatorState);
  const scenario = loanScenarios[0]; // Now we only have one scenario
  const monthlySavings = scenario ? scenario.remainingSavings : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Main Results Header with Calculation Results */}
      <div className="card-base shadow-sm p-4 md:p-6">
        <StepHeader step="results">
          <div className="text-sm text-muted-foreground">
            {tWizard("step_descriptions.results.description")}
          </div>
        </StepHeader>
        <div className="mt-6">
          <ResultsTable calculatorState={calculatorState} />
        </div>
      </div>

      {/* Expense Breakdown Card */}
      <div className="p-6 card-base shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-red-500/10">
            <PieChart className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("expense_breakdown.title")}
          </h2>
        </div>
        <ExpenseBreakdown expenses={expenses} />
      </div>

      {/* Loan Forecast Card - Only show if user has loans */}
      {loanParameters.hasLoan && (
        <div className="p-6 card-base shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("loan_forecast.title")}
            </h2>
          </div>
          <Forecast calculatorState={calculatorState} />
        </div>
      )}

      {/* Compound Interest CTA */}
      {monthlySavings > 0 && (
        <div className="p-6 card-base shadow-sm">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3
                  className="text-2xl font-bold text-foreground"
                  data-testid="compound-interest-cta-title"
                >
                  {tCompoundInterestCta("title")}
                </h3>
              </div>
              <div className="space-y-2">
                <Text
                  className="text-muted-foreground leading-relaxed"
                  data-testid="compound-interest-cta-description"
                >
                  {tCompoundInterestCta("description", {
                    savings: formatCurrencyNoDecimals(monthlySavings),
                  })}
                </Text>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-50 to-emerald-100/70 dark:from-green-950/40 dark:to-emerald-900/30 text-green-800 dark:text-green-100 font-medium border border-green-200/60 dark:border-green-800/40 shadow-sm">
                    <CurrencyDisplay
                      amount={monthlySavings}
                      className="inline text-green-800 dark:text-green-100"
                      showDecimals={false}
                      variant="positive"
                    />{" "}
                    / {tCompoundInterestCta("per_month")}
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-violet-100/70 dark:from-purple-950/40 dark:to-violet-900/30 text-purple-800 dark:text-purple-100 font-medium border border-purple-200/60 dark:border-purple-800/40 shadow-sm">
                    {tCompoundInterestCta("potential_wealth")}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                href={{
                  pathname: "/ranta-pa-ranta",
                  query: { monthlySavings: Math.round(monthlySavings) },
                }}
              >
                <Button
                  className="group relative overflow-hidden"
                  data-testid="compound-interest-cta-button"
                  size="lg"
                  variant="default"
                >
                  <span className="relative z-10 flex items-center gap-2 px-2">
                    <Calculator className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    {tCompoundInterestCta("button")}
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
