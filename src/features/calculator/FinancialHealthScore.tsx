import { HeartPulse, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Progress } from "@/components/ui/progress";
import type { FinancialHealthScore as FinancialHealthScoreType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { useState } from "react";
import { AnimatedScramble } from "@/components/ui/animated-scramble";

/**
 * Props for the FinancialHealthScore component.
 */
interface FinancialHealthScoreProps {
  /** Financial health score data including metrics and recommendations */
  score: FinancialHealthScoreType;
  /** Whether to show informational tooltips for metrics */
  showTooltips?: boolean;
}

/**
 * Formats a decimal value as a percentage string.
 *
 * @param value - Decimal value (e.g., 0.25 for 25%)
 * @returns Formatted percentage string with 1 decimal place
 *
 * @example
 * ```typescript
 * formatPercent(0.254); // "25.4%"
 * ```
 */
const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

/**
 * Financial Health Score component displaying comprehensive financial wellness metrics.
 *
 * Shows an overall financial health score (0-100) with detailed breakdown of:
 * - Debt-to-income ratio
 * - Emergency fund coverage
 * - Housing cost ratio
 * - Discretionary income ratio
 *
 * Also displays personalized recommendations based on the metrics.
 * Includes interactive tooltips for metric explanations.
 *
 * @param props - Component props
 * @returns JSX element displaying financial health analysis
 *
 * @example
 * ```typescript
 * <FinancialHealthScore
 *   score={healthScore}
 *   showTooltips={true}
 * />
 * ```
 */
export const FinancialHealthScore = ({
  score,
  showTooltips = true,
}: FinancialHealthScoreProps) => {
  const t = useTranslations("financial_health");

  /**
   * Determines the color class for score display based on score value.
   *
   * @param score - Score value (0-100)
   * @returns Tailwind CSS color class string
   */
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  /**
   * Determines the progress bar color based on score value.
   *
   * @param score - Score value (0-100)
   * @returns Tailwind CSS background color class string
   */
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600 dark:bg-green-400";
    if (score >= 60) return "bg-yellow-600 dark:bg-yellow-400";
    return "bg-red-600 dark:bg-red-400";
  };

  /**
   * Safely handles potentially undefined or infinite numeric values for display.
   *
   * @param value - Numeric value that might be undefined or infinite
   * @returns The value if finite, undefined otherwise
   */
  const safeDisplay = (value: number | undefined) =>
    Number.isFinite(value) ? value : undefined;

  /**
   * Formats debt-to-income ratio as a multiplier (e.g., "2.5x").
   *
   * @param value - DTI ratio value
   * @returns Formatted ratio string with 1 decimal place and "x" suffix
   */
  const formatDTIRatio = (value: number) => `${value.toFixed(1)}x`;

  return (
    <Box className="space-y-6">
      {/* Section heading, smaller and subtle */}
      <Box className="flex items-center gap-2 mb-2">
        <HeartPulse className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <Text className="text-base font-semibold text-gray-700 dark:text-gray-200">
          {t("title")}
        </Text>
      </Box>
      {/* Overall Score */}
      <Box className="space-y-2">
        <Box className="flex items-center gap-2">
          <Text className="text-xs text-gray-600 dark:text-gray-300">
            {t("overall_score")}
          </Text>
          {showTooltips && (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  tabIndex={0}
                  aria-label={`Info: ${t("overall_score")}`}
                  className="focus:outline-none relative bg-transparent flex items-center justify-center hover:text-blue-500 transition-colors min-w-[44px] min-h-[44px] -m-[20px] p-[20px]"
                >
                  <Info className="w-4 h-4 text-gray-300" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={-8}
                className="z-50 max-w-xs p-3 text-xs"
              >
                {t("tooltips.overall_score")}
              </TooltipContent>
            </Tooltip>
          )}
        </Box>
        <Box className="flex items-center gap-4">
          <AnimatedScramble
            value={Number.isFinite(score.overallScore) ? score.overallScore : 0}
            className={cn(
              "text-3xl font-bold",
              getScoreColor(score.overallScore)
            )}
            format={(v) => (Number.isFinite(v) ? String(v) : "–")}
          />
          <Progress
            value={Number.isFinite(score.overallScore) ? score.overallScore : 0}
            className="flex-1 h-2"
            indicatorClassName={getProgressColor(score.overallScore)}
          />
        </Box>
      </Box>

      {/* Metrics */}
      <Box className="space-y-4">
        <Text className="text-xs text-gray-600 dark:text-gray-300">
          {t("metrics")}
        </Text>
        <Box className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title={t("debt_to_income")}
            value={safeDisplay(score.metrics.debtToIncomeRatio)}
            format={formatDTIRatio}
            tooltip={t("tooltips.debt_to_income")}
            showTooltip={showTooltips}
          />
          <MetricCard
            title={t("emergency_fund")}
            value={safeDisplay(score.metrics.emergencyFundCoverage)}
            format={formatPercent}
            tooltip={t("tooltips.emergency_fund")}
            showTooltip={showTooltips}
          />
          <MetricCard
            title={t("housing_cost")}
            value={safeDisplay(score.metrics.housingCostRatio)}
            format={formatPercent}
            tooltip={t("tooltips.housing_cost")}
            showTooltip={showTooltips}
          />
          <MetricCard
            title={t("discretionary_income")}
            value={safeDisplay(score.metrics.discretionaryIncomeRatio)}
            format={formatPercent}
            tooltip={t("tooltips.discretionary_income")}
            showTooltip={showTooltips}
          />
        </Box>
      </Box>

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <Box className="space-y-2">
          <Text className="text-xs text-gray-600 dark:text-gray-300">
            {t("recommendations")}
          </Text>
          <Box className="space-y-2">
            {score.recommendations.map((recommendation, index) => (
              <Box
                key={index}
                className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <Text className="text-sm text-blue-600 dark:text-blue-400">
                  {t(recommendation)}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

/**
 * Props for the MetricCard component.
 */
interface MetricCardProps {
  /** Display title for the metric */
  title: string;
  /** Numeric value of the metric (may be undefined for invalid/missing data) */
  value: number | undefined;
  /** Function to format the value for display */
  format: (value: number) => string;
  /** Tooltip text explaining the metric */
  tooltip: string;
  /** Whether to show the informational tooltip */
  showTooltip?: boolean;
}

/**
 * Individual metric card component for displaying a single financial health metric.
 *
 * Displays a metric with its formatted value and an optional tooltip for explanation.
 * Handles touch devices appropriately for tooltip interaction.
 *
 * @param props - Component props
 * @returns JSX element for metric display
 */
const MetricCard = ({
  title,
  value,
  format,
  tooltip,
  showTooltip = true,
}: MetricCardProps) => {
  const isTouch = useIsTouchDevice();
  const [open, setOpen] = useState(false);
  return (
    <Box className="p-0 bg-transparent rounded-none">
      <Box className="flex items-center gap-2 mb-1">
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          {title}
        </Text>
        {showTooltip && (
          <Tooltip
            delayDuration={100}
            open={isTouch ? open : undefined}
            onOpenChange={isTouch ? setOpen : undefined}
          >
            <TooltipTrigger asChild>
              <button
                type="button"
                tabIndex={0}
                aria-label={`Info: ${title}`}
                className="focus:outline-none relative bg-transparent flex items-center justify-center hover:text-blue-500 transition-colors min-w-[44px] min-h-[44px] -m-[20px] p-[20px]"
                onClick={
                  isTouch
                    ? (e) => {
                        e.stopPropagation();
                        setOpen((o) => !o);
                      }
                    : undefined
                }
              >
                <Info className="w-4 h-4 text-gray-300" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={-8}
              className="z-50 max-w-xs p-3 text-xs"
            >
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </Box>
      <AnimatedScramble
        value={typeof value === "number" && Number.isFinite(value) ? value : 0}
        className="font-medium"
        format={(v) =>
          typeof v === "number" && Number.isFinite(v) ? format(v) : "–"
        }
      />
    </Box>
  );
};
