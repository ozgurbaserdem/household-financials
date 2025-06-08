import { motion } from "framer-motion";
import { TrendingUp, Calculator } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import React from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { CardContent } from "@/components/ui/Card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Card } from "@/components/ui/ModernCard";
import { Text } from "@/components/ui/Text";
import { Forecast } from "@/features/calculator/Forecast";
import { ResultsTable } from "@/features/calculator/ResultsTable";
import { ExpenseBreakdown } from "@/features/charts/ExpenseBreakdown";
import { Link } from "@/i18n/navigation";
import { calculateLoanScenarios } from "@/lib/calculations";
import { formatCurrencyNoDecimals } from "@/lib/formatting";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
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
  const locale = useLocale();
  const isMobile = useIsTouchDevice();

  // Calculate loan scenario with current rates
  const loanScenarios = calculateLoanScenarios(calculatorState);
  const scenario = loanScenarios[0]; // Now we only have one scenario
  const monthlySavings = scenario ? scenario.remainingSavings : 0;

  return (
    <Box className="space-y-4 md:space-y-6">
      <ResultsTable calculatorState={calculatorState} />
      <ExpenseBreakdown expenses={expenses} />
      <Forecast calculatorState={calculatorState} />

      {/* Compound Interest CTA */}
      {monthlySavings > 0 && (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card
            glass
            gradient
            animate={!isMobile}
            className="overflow-hidden relative"
            hover={false}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
            <CardContent className="relative z-10">
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
                        savings: formatCurrencyNoDecimals(monthlySavings),
                      })}
                    </Text>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-sm">
                      <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
                        <CurrencyDisplay
                          amount={monthlySavings}
                          className="inline"
                          showDecimals={false}
                          variant="positive"
                        />{" "}
                        / {locale === "sv" ? "månad" : "month"}
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
                      className="group relative overflow-hidden"
                      size="lg"
                      variant="gradient"
                    >
                      <span className="relative z-10 flex items-center gap-2 px-2">
                        <Calculator className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        {t("compound_interest_cta.button")}
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
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};
