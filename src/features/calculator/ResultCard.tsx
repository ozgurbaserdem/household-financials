import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { AnimatedScramble } from "@/components/ui/animated-scramble";
import type { CalculationResult } from "@/lib/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { calculateFinancialHealthScoreForResult } from "@/lib/calculations";
import { FinancialHealthScore } from "./FinancialHealthScore";
import { motion } from "framer-motion";

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

function ResultCard({
  result,
  showTooltips,
  HEAD_CELLS,
  isBest,
  isWorst,
}: ResultCardProps) {
  const t = useTranslations("results");
  const [showAnimation, setShowAnimation] = useState(false);
  const [showHealthScore, setShowHealthScore] = useState(false);
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
    if (typeof rawValue !== "number" || isNaN(rawValue))
      return cell.render(result);
    if (showAnimation) {
      return (
        <AnimatedScramble
          value={rawValue}
          className={cn(
            cell.key === "remaining_savings" && {
              "text-green-400": result.remainingSavings >= 0,
              "text-red-400": result.remainingSavings < 0,
            }
          )}
          format={cell.format}
        />
      );
    }
    return cell.format(rawValue);
  };

  return (
    <Box
      className={cn(
        "glass p-6 rounded-xl transition-all duration-300",
        "hover:bg-white/5 hover:border-white/20",
        isBest && "border-green-500/30 bg-green-500/5",
        isWorst && "border-red-500/30 bg-red-500/5"
      )}
    >
      {/* Header Badge */}
      {(isBest || isWorst) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mb-3 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
            isBest && "bg-green-500/20 text-green-400",
            isWorst && "bg-red-500/20 text-red-400"
          )}
        >
          {isBest ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isBest ? t("best_option") : t("worst_option")}
        </motion.div>
      )}

      <Box className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gridOrder.map((key) => {
          const cell = HEAD_CELLS.find((c) => c.key === key);
          if (!cell) return null;
          return (
            <Box key={cell.key} className="flex flex-col relative">
              {showTooltips ? (
                <Box className="flex items-center gap-2 relative">
                  <Text className="text-xs text-gray-300" tabIndex={0}>
                    {t(cell.key)}
                  </Text>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        tabIndex={0}
                        aria-label={t(cell.tooltipKey)}
                        className="focus:outline-none p-1 -m-1 bg-transparent flex items-center justify-center hover:text-blue-400 transition-colors"
                      >
                        <Info className="w-4 h-4 text-gray-300" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={-8}
                      className="z-50 max-w-xs p-3 text-xs glass"
                    >
                      {t(cell.tooltipKey)}
                    </TooltipContent>
                  </Tooltip>
                </Box>
              ) : (
                <Text className="text-xs text-gray-300">{t(cell.key)}</Text>
              )}
              <Text
                className={cn(
                  "font-medium text-white",
                  cell.key === "remaining_savings" && {
                    "text-green-400 font-bold text-lg":
                      result.remainingSavings >= 0,
                    "text-red-400 font-bold text-lg":
                      result.remainingSavings < 0,
                  }
                )}
              >
                {renderValue(cell, result)}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Toggle Financial Health Score */}
      <Box className="mt-4 pt-4 border-t border-gray-500/50">
        <button
          onClick={() => setShowHealthScore(!showHealthScore)}
          className="w-full text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
        >
          <span>
            {showHealthScore
              ? t("hide_financial_health_score_details")
              : t("show_financial_health_score_details")}
          </span>
          <motion.div
            animate={{ rotate: showHealthScore ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Info className="w-6 h-6 group-hover:text-blue-400" />
          </motion.div>
        </button>

        {showHealthScore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <FinancialHealthScore
              score={calculateFinancialHealthScoreForResult(result)}
              showTooltips={showTooltips}
            />
          </motion.div>
        )}
      </Box>
    </Box>
  );
}

export { ResultCard };
