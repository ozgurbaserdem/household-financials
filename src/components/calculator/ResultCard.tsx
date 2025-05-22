import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { AnimatedScramble } from "@/components/bubba-ui/animated-scramble";
import type { CalculationResult } from "@/lib/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { calculateFinancialHealthScoreForResult } from "@/lib/calculations";
import { FinancialHealthScore } from "./FinancialHealthScore";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";

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
  currentBuffer?: number;
}

function ResultCard({
  result,
  showTooltips,
  HEAD_CELLS,
  currentBuffer = 0,
}: ResultCardProps) {
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
  const isTouch = useIsTouchDevice();
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

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
              "text-green-600 dark:text-green-400":
                result.remainingSavings >= 0,
              "text-red-600 dark:text-red-400": result.remainingSavings < 0,
            }
          )}
          format={cell.format}
        />
      );
    }
    return cell.format(rawValue);
  };

  return (
    <Box className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
      <Box className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
        {gridOrder.map((key) => {
          const cell = HEAD_CELLS.find((c) => c.key === key);
          if (!cell) return null;
          return (
            <Box key={cell.key} className="flex flex-col relative">
              {showTooltips ? (
                <Box className="flex items-center gap-2 relative">
                  <Text
                    className="text-sm text-gray-500 dark:text-gray-400"
                    tabIndex={0}
                  >
                    {t(cell.key)}
                  </Text>
                  <Tooltip
                    delayDuration={100}
                    open={isTouch ? openTooltip === cell.key : undefined}
                    onOpenChange={
                      isTouch
                        ? (open) => setOpenTooltip(open ? cell.key : null)
                        : undefined
                    }
                  >
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        tabIndex={0}
                        aria-label={t(cell.tooltipKey)}
                        className="focus:outline-none p-2 -m-2 bg-transparent flex items-center justify-center"
                        onClick={
                          isTouch
                            ? (e) => {
                                e.stopPropagation();
                                setOpenTooltip(
                                  openTooltip === cell.key ? null : cell.key
                                );
                              }
                            : undefined
                        }
                      >
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={-8}
                      className="z-50 max-w-xs p-3 text-xs"
                    >
                      {t(cell.tooltipKey)}
                    </TooltipContent>
                  </Tooltip>
                </Box>
              ) : (
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {t(cell.key)}
                </Text>
              )}
              <Text
                className={cn(
                  "font-medium",
                  cell.key === "remaining_savings" && {
                    "text-green-600 dark:text-green-400 font-bold":
                      result.remainingSavings >= 0,
                    "text-red-600 dark:text-red-400 font-bold":
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
      {/* Divider */}
      <Box className="my-4 border-t border-gray-300 dark:border-gray-700" />
      {/* Financial Health Score section */}
      <FinancialHealthScore
        score={calculateFinancialHealthScoreForResult(result, currentBuffer)}
        showTooltips={showTooltips}
      />
    </Box>
  );
}

export { ResultCard };
