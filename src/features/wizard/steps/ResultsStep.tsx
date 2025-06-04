import React from "react";
import { useAppSelector } from "@/store/hooks";
import { ResultsTable } from "@/features/calculator/ResultsTable";
import { ExpenseBreakdown } from "@/features/charts/ExpenseBreakdown";
import { Forecast } from "@/features/calculator/Forecast";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { TrendingUp, Calculator } from "lucide-react";
import { Text } from "@/components/ui/text";
import { useTranslations, useLocale } from "next-intl";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { formatCurrency, calculateLoanScenarios } from "@/lib/calculations";
import { motion } from "framer-motion";
export function ResultsStep() {
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
  const locale = useLocale();
  const isMobile = useIsTouchDevice();

  // Calculate loan scenarios and get the best scenario's remaining savings
  const loanScenarios = calculateLoanScenarios(calculatorState);

  // Get the best scenario (highest remaining savings)
  const bestScenario =
    loanScenarios.length > 0
      ? loanScenarios.reduce(
          (best, current) =>
            current.remainingSavings > best.remainingSavings ? current : best,
          loanScenarios[0]
        )
      : null;

  // Use the best scenario's remaining savings as monthly savings
  const monthlySavings = bestScenario ? bestScenario.remainingSavings : 0;

  return (
    <Box className="space-y-6">
      <ResultsTable calculatorState={calculatorState} />
      <ExpenseBreakdown expenses={expenses} />
      <Forecast calculatorState={calculatorState} />

      {/* Compound Interest CTA */}
      {monthlySavings > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card
            gradient
            glass
            className="overflow-hidden relative"
            animate={!isMobile}
            hover={false}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
            <CardContent className="relative z-10 p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1 text-center lg:text-left space-y-4">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {t("compound_interest_cta.title")}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <Text className="text-gray-300 leading-relaxed">
                      {t("compound_interest_cta.description", {
                        savings: monthlySavings.toLocaleString(
                          locale === "sv" ? "sv-SE" : "en-US"
                        ),
                      })}
                    </Text>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-sm">
                      <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
                        {formatCurrency(monthlySavings)} /{" "}
                        {locale === "sv" ? "månad" : "month"}
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                        {locale === "sv"
                          ? "Potentiell förmögenhet"
                          : "Potential wealth"}
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
                      size="lg"
                      variant="gradient"
                      className="group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2 px-2">
                        <Calculator className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        {t("compound_interest_cta.button")}
                        <svg
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}
