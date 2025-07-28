import { TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ResultCard } from "@/components/ui/ResultCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CalculatorState, LoanParameters } from "@/lib/types";

import { Forecast } from "../Forecast";

interface LoanForecastCardProps {
  calculatorState: CalculatorState;
  loanParameters: LoanParameters;
}

export const LoanForecastCard = React.memo(
  ({ calculatorState, loanParameters }: LoanForecastCardProps) => {
    const t = useTranslations("results");

    // Early return if no loan
    if (!loanParameters.hasLoan) {
      return null;
    }

    return (
      <ResultCard aria-labelledby="loan-forecast-title" padding="md">
        <SectionHeader
          headerId="loan-forecast-title"
          icon={TrendingDown}
          title={t("loan_forecast.title")}
        />
        <Forecast calculatorState={calculatorState} />
      </ResultCard>
    );
  }
);

LoanForecastCard.displayName = "LoanForecastCard";
