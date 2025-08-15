import { motion } from "framer-motion";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { AnimatedScramble } from "@/components/ui/AnimatedScramble";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { calculateFinancialHealthScoreForResult } from "@/lib/calculations/";
import type { CalculationResult } from "@/lib/types";
import { cn } from "@/shared/utils/general";

import { FinancialHealthScore } from "./FinancialHealthScore";

interface HeadCell {
  key: string;
  tooltipKey: string;
  className?: string;
  render?: (result: CalculationResult) => React.ReactNode;
  getRawValue?: (result: CalculationResult) => number;
  format?: (value: number) => string;
  priority?: number;
}

interface ResultCardProps {
  result: CalculationResult;
  showTooltips: boolean;
  HEAD_CELLS: HeadCell[];
  isBest?: boolean;
  isWorst?: boolean;
}

const ResultCard = ({
  result,
  showTooltips,
  HEAD_CELLS,
  isBest,
  isWorst,
}: ResultCardProps) => {
  const t = useTranslations("results");
  const [showAnimation, setShowAnimation] = useState(false);
  const gridOrder = [
    "interest_rate",
    "amortization",
    "housing_cost",
    "total_expenses",
    "total_income",
    "remaining_savings",
  ];

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const renderValue = (cell: HeadCell, result: CalculationResult) => {
    if (!cell.render) return null;
    if (!cell.getRawValue || !cell.format) return cell.render(result);
    const rawValue = cell.getRawValue(result);
    if (typeof rawValue !== "number" || Number.isNaN(rawValue))
      return cell.render(result);
    if (showAnimation) {
      // No style prop, so just render
      return (
        <AnimatedScramble
          className=""
          format={cell.format}
          maxDuration={0.3}
          smoothMode={true}
          value={rawValue}
        />
      );
    }
    return cell.format(rawValue);
  };

  // Use function expression for linter compliance
  const getRemainingSavingsColor = (remaining: number) => {
    if (remaining >= 0) return { color: "rgb(34 197 94)" };
    return { color: "rgb(239 68 68)" };
  };

  return (
    <div
      className={cn(
        "transition-all duration-300",
        isBest && "border-l-4 border-success/50 pl-4",
        isWorst && "border-l-4 border-destructive/50 pl-4"
      )}
    >
      {/* Header Badge */}
      {(isBest || isWorst) && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mb-3 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
            isBest && "bg-success/20 text-success",
            isWorst && "bg-destructive/20 text-destructive"
          )}
          initial={{ opacity: 0, y: -10 }}
        >
          {isBest ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isBest ? t("best_option") : t("worst_option")}
        </motion.div>
      )}

      <Box className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {gridOrder.map((key) => {
          const cell = HEAD_CELLS.find((c) => c.key === key);
          if (!cell) return null;
          return (
            <Box key={cell.key} className="flex flex-col relative">
              {showTooltips ? (
                <Box className="flex items-center gap-2 relative">
                  <Text className="text-s text-muted-foreground" tabIndex={0}>
                    {t(cell.key)}
                  </Text>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button
                        aria-label={t(cell.tooltipKey)}
                        className="focus:outline-none relative bg-transparent flex items-center justify-center hover:text-accent transition-colors min-w-[44px] min-h-[44px] -m-[20px] p-[20px]"
                        tabIndex={0}
                        type="button"
                      >
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="z-50 max-w-xs p-3 text-xs glass"
                      side="top"
                      sideOffset={-8}
                    >
                      {t(cell.tooltipKey)}
                    </TooltipContent>
                  </Tooltip>
                </Box>
              ) : (
                <Text className="text-xs text-muted-foreground">
                  {t(cell.key)}
                </Text>
              )}
              <Text
                className={cn(
                  "font-medium text-foreground",
                  cell.key === "remaining_savings" && "font-bold text-lg"
                )}
                style={
                  cell.key === "remaining_savings"
                    ? getRemainingSavingsColor(result.remainingSavings)
                    : undefined
                }
              >
                {renderValue(cell, result)}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Financial Health Score */}
      <Box className="mt-4 pt-4 border-t border-border/30">
        <FinancialHealthScore
          score={calculateFinancialHealthScoreForResult(result)}
          showTooltips={showTooltips}
        />
      </Box>
    </div>
  );
};

export { ResultCard };
