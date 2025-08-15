import { useTranslations } from "next-intl";
import React from "react";

import { ResultCard } from "@/components/ui/ResultCard";
import { StepHeader } from "@/components/ui/StepHeader";
import type { CalculatorState } from "@/lib/types";

import { ResultsTable } from "../ResultsTable";

interface ResultsHeaderProps {
  calculatorState: CalculatorState;
}

export const ResultsHeader = React.memo(
  ({ calculatorState }: ResultsHeaderProps) => {
    const tWizard = useTranslations("wizard");

    return (
      <ResultCard
        aria-describedby="results-header-description"
        aria-labelledby="results-header-title"
        padding="md"
      >
        <StepHeader step="results">
          <div
            className="text-sm text-muted-foreground"
            id="results-header-description"
          >
            {tWizard("step_descriptions.results.description")}
          </div>
        </StepHeader>
        <div className="mt-6">
          <ResultsTable calculatorState={calculatorState} />
        </div>
      </ResultCard>
    );
  }
);

ResultsHeader.displayName = "ResultsHeader";
