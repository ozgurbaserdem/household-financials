import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Box } from "@/components/ui/Box";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import type { calculateFinalValues } from "@/lib/compound-interest";

import { STYLES } from "../constants";

import { ResultCard } from "./ResultCard";

interface ResultsSectionProps {
  finalValues: ReturnType<typeof calculateFinalValues>;
  investmentHorizon: number;
}

export const ResultsSection = ({
  finalValues,
  investmentHorizon,
}: ResultsSectionProps) => {
  const t = useTranslations("compound_interest");

  const hasWithdrawals = finalValues.totalWithdrawn > 0;

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className={STYLES.ICON_CONTAINER}>
          <TrendingUp className={STYLES.ICON} />
        </div>
        <Box className="flex-1">
          <CardTitle>{t("results.title")}</CardTitle>
          <Text className="text-sm text-muted-foreground mt-1">
            {t("results.description", { years: investmentHorizon })}
          </Text>
        </Box>
      </CardHeader>
      <CardContent>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${hasWithdrawals ? "md:grid-cols-3 xl:grid-cols-6" : "lg:grid-cols-4"}`}
        >
          {/* Theoretical Total Value (without withdrawals) */}
          <ResultCard
            amount={finalValues.theoreticalTotalValue}
            delay={0.1}
            progressPercent={100}
            title={t("results.theoretical_total_value")}
          />

          {/* Current Total Value (after withdrawals) - Only show if there are withdrawals */}
          {hasWithdrawals && (
            <ResultCard
              amount={finalValues.totalValue}
              delay={0.2}
              progressPercent={
                (finalValues.totalValue / finalValues.theoreticalTotalValue) *
                100
              }
              title={t("results.total_value_after_withdrawals")}
            />
          )}

          <ResultCard
            amount={finalValues.startSum}
            color="BLUE"
            delay={0.3}
            progressPercent={
              (finalValues.startSum / finalValues.theoreticalTotalValue) * 100
            }
            title={t("results.start_sum")}
          />

          <ResultCard
            amount={finalValues.totalSavings}
            color="GREEN"
            delay={0.4}
            progressPercent={
              (finalValues.totalSavings / finalValues.theoreticalTotalValue) *
              100
            }
            title={t("results.total_savings")}
          />

          <ResultCard
            amount={finalValues.totalReturns}
            color="PURPLE"
            delay={0.5}
            progressPercent={
              (finalValues.totalReturns / finalValues.theoreticalTotalValue) *
              100
            }
            title={t("results.compound_returns")}
          />

          {/* Total Withdrawn (show only if there have been withdrawals) */}
          {hasWithdrawals && (
            <ResultCard
              amount={finalValues.totalWithdrawn}
              color="RED"
              delay={0.6}
              progressPercent={
                (finalValues.totalWithdrawn /
                  finalValues.theoreticalTotalValue) *
                100
              }
              title={t("results.total_withdrawn")}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
