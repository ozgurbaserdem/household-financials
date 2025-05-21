import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { AnimatedScramble } from "@/components/bubba-ui/animated-scramble";
import type { CalculationResult } from "@/lib/types";

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
}

function ResultCard({ result, showTooltips, HEAD_CELLS }: ResultCardProps) {
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

  // Tooltip open state for click (only for first card)
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  useEffect(() => {
    // Trigger animation after component mounts
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
        {gridOrder.map((key, idx) => {
          const cell = HEAD_CELLS.find((c) => c.key === key);
          if (!cell) return null;
          return (
            <Box key={cell.key} className="flex flex-col">
              {showTooltips ? (
                <>
                  <Text
                    className="text-sm text-gray-500 dark:text-gray-400 cursor-help"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenIndex(openIndex === idx ? null : idx);
                    }}
                    onMouseLeave={() => setOpenIndex(null)}
                    onBlur={() => setOpenIndex(null)}
                  >
                    {t(cell.key)}
                  </Text>
                  {openIndex === idx && (
                    <div
                      className={`absolute z-10 w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-lg p-2 text-xs text-gray-700 dark:text-gray-200 ${idx === 0 ? "translate-x-[-70px]" : "translate-x-[-40px]"}`}
                      style={{ top: "2.5rem" }}
                    >
                      {t(cell.tooltipKey)}
                    </div>
                  )}
                </>
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
    </Box>
  );
}

export { ResultCard };
