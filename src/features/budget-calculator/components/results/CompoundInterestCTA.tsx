import { TrendingUp, Calculator } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/ui/Button";
import { ChevronRightIcon } from "@/components/ui/ChevronRightIcon";
import { ResultCard } from "@/components/ui/ResultCard";
import { Text } from "@/components/ui/Text";
import { Link } from "@/i18n/navigation";
import { formatCurrencyNoDecimals } from "@/lib/formatting/";

import { CALCULATION_CONSTANTS } from "../../constants/constants";

interface CompoundInterestCTAProps {
  monthlySavings: number;
  currentBuffer: number;
  projectedWealth: number;
}

export const CompoundInterestCTA = React.memo(
  ({
    monthlySavings,
    currentBuffer,
    projectedWealth,
  }: CompoundInterestCTAProps) => {
    const tCompoundInterestCta = useTranslations(
      "results.compound_interest_cta"
    );

    // Early return if no savings
    if (monthlySavings <= 0) {
      return null;
    }

    const roundedMonthlySavings =
      Math.round(
        monthlySavings / CALCULATION_CONSTANTS.CURRENCY_ROUND_TO_NEAREST
      ) * CALCULATION_CONSTANTS.CURRENCY_ROUND_TO_NEAREST;
    const roundedCurrentBuffer =
      Math.round(
        currentBuffer / CALCULATION_CONSTANTS.CURRENCY_ROUND_TO_NEAREST
      ) * CALCULATION_CONSTANTS.CURRENCY_ROUND_TO_NEAREST;

    return (
      <ResultCard
        aria-describedby="compound-interest-cta-description"
        aria-labelledby="compound-interest-cta-title"
        padding="md"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg icon-bg-golden">
              <TrendingUp aria-hidden="true" className="w-6 h-6 text-golden" />
            </div>
            <h3
              className="text-xl font-bold text-foreground"
              data-testid="compound-interest-cta-title"
              id="compound-interest-cta-title"
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
                aria-label={`Projected wealth: ${formatCurrencyNoDecimals(projectedWealth)}`}
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
                  monthlySavings: roundedMonthlySavings,
                  ...(currentBuffer > 0 && {
                    startSum: roundedCurrentBuffer,
                  }),
                },
              }}
            >
              <Button
                aria-describedby="compound-interest-cta-description"
                className="group relative overflow-hidden"
                data-testid="compound-interest-cta-button"
                size="lg"
                variant="default"
              >
                <span className="relative z-10 flex items-center gap-1">
                  <Calculator
                    aria-hidden="true"
                    className="w-5 h-5 transition-transform group-hover:rotate-12"
                  />
                  {tCompoundInterestCta("button")}
                  <ChevronRightIcon />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </ResultCard>
    );
  }
);

CompoundInterestCTA.displayName = "CompoundInterestCTA";
