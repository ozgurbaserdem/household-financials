import { TrendingDown, TrendingUp, Calculator, PieChart } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/Button";
import { StepHeader } from "@/components/ui/StepHeader";
import { Text } from "@/components/ui/Text";
import { Forecast } from "@/features/calculator/Forecast";
import { ResultsTable } from "@/features/calculator/ResultsTable";
import { ExpenseBreakdown } from "@/features/charts/ExpenseBreakdown";
import { Link } from "@/i18n/navigation";
import { calculateLoanScenarios } from "@/lib/calculations";
import { calculateWealthProjection } from "@/lib/compound-interest";
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
  const tCompoundInterestCta = useTranslations("results.compound_interest_cta");

  // Calculate loan scenario with current rates
  const loanScenarios = calculateLoanScenarios(calculatorState);
  const scenario = loanScenarios[0]; // Now we only have one scenario
  const monthlySavings = scenario ? scenario.remainingSavings : 0;

  // Calculate 20-year wealth projection
  const currentBuffer = income.currentBuffer || 0;
  const projectedWealth = calculateWealthProjection(
    monthlySavings,
    currentBuffer
  );

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
          <div className="p-2 rounded-lg icon-bg-golden">
            <PieChart className="w-6 h-6 text-golden" />
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
            <div className="p-2 rounded-lg icon-bg-golden">
              <TrendingDown className="w-6 h-6 text-golden" />
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
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg icon-bg-golden">
                <TrendingUp className="w-6 h-6 text-golden" />
              </div>
              <h3
                className="text-2xl font-bold text-foreground"
                data-testid="compound-interest-cta-title"
              >
                {tCompoundInterestCta("title")}
              </h3>
            </div>
            <div className="space-y-6">
              <div className="max-w-3xl mx-auto">
                <Text
                  className="text-muted-foreground leading-relaxed text-center text-lg"
                  data-testid="compound-interest-cta-description"
                >
                  {tCompoundInterestCta("description", {
                    savings: formatCurrencyNoDecimals(monthlySavings),
                    currentBuffer: formatCurrencyNoDecimals(currentBuffer),
                  })}
                </Text>
              </div>
              <div className="text-center">
                <div
                  className="wealth-display"
                  data-testid="projected-wealth-amount"
                >
                  {formatCurrencyNoDecimals(projectedWealth)}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link
                href={{
                  pathname: "/ranta-pa-ranta",
                  query: {
                    monthlySavings: Math.round(monthlySavings),
                    ...(currentBuffer > 0 && {
                      startSum: Math.round(currentBuffer),
                    }),
                  },
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
