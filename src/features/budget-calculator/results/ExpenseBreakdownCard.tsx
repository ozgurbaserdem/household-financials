import { PieChart } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ResultCard } from "@/components/ui/ResultCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExpenseBreakdown } from "@/features/charts/ExpenseBreakdown";
import type { ExpensesByCategory } from "@/lib/types";

interface ExpenseBreakdownCardProps {
  expenses: ExpensesByCategory;
}

export const ExpenseBreakdownCard = React.memo(
  ({ expenses }: ExpenseBreakdownCardProps) => {
    const t = useTranslations("results");

    return (
      <ResultCard aria-labelledby="expense-breakdown-title" padding="md">
        <SectionHeader
          headerId="expense-breakdown-title"
          icon={PieChart}
          title={t("expense_breakdown.title")}
        />
        <ExpenseBreakdown expenses={expenses} />
      </ResultCard>
    );
  }
);

ExpenseBreakdownCard.displayName = "ExpenseBreakdownCard";
