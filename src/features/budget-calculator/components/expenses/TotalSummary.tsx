"use client";

import { TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Box } from "@/components/ui/Box";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Text } from "@/components/ui/Text";

interface TotalSummaryProps {
  total: number;
}

export const TotalSummary = ({ total }: TotalSummaryProps) => {
  const t = useTranslations("expense_categories");

  return (
    <div className="mt-4 p-4 card-base">
      <Box className="flex items-center justify-between">
        <Box className="flex items-center gap-3">
          <Box className="p-2 rounded-lg bg-muted">
            <TrendingDown className="w-5 h-5 text-foreground" />
          </Box>
          <Text className="text-md font-medium text-foreground">
            {t("total_expenses")}
          </Text>
        </Box>
        <CurrencyDisplay
          amount={total}
          className="text-lg font-bold"
          data-testid="grand-total"
          showDecimals={false}
          size="xl"
          variant={total > 0 ? "destructive" : "neutral"}
        />
      </Box>
    </div>
  );
};
