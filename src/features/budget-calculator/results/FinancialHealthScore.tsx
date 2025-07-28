import { HeartPulse, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { AnimatedScramble } from "@/components/ui/AnimatedScramble";
import { Box } from "@/components/ui/Box";
import { Progress } from "@/components/ui/Progress";
import { Text } from "@/components/ui/Text";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/Tooltip";
import {
  getScoreColor,
  getProgressColor,
  getSafeDisplayValues,
} from "@/lib/financial-health";
import { formatPercent, formatDTIRatio } from "@/lib/formatting";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import type { FinancialHealthScore as FinancialHealthScoreType } from "@/lib/types";
import { cn } from "@/lib/utils/general";

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

  // Use extracted business logic functions
  const displayValues = getSafeDisplayValues(score);

  return (
    <Box className="space-y-6">
      {/* Section heading, smaller and subtle */}
      <Box className="flex items-center gap-2 mb-2">
        <HeartPulse className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <Text className="text-base font-semibold text-foreground">
          {t("title")}
        </Text>
      </Box>
      {/* Overall Score */}
      <Box className="space-y-2">
        <Box className="flex items-center gap-2">
          <Text className="text-s text-muted-foreground">
            {t("overall_score")}
          </Text>
          {showTooltips && (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  aria-label={`Info: ${t("overall_score")}`}
                  className="focus:outline-none relative bg-transparent flex items-center justify-center hover:text-accent transition-colors min-w-[44px] min-h-[44px] -m-[20px] p-[20px]"
                  tabIndex={0}
                  type="button"
                >
                  <Info className="w-4 h-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="z-50 max-w-xs p-3 text-xs"
                side="top"
                sideOffset={-8}
              >
                {t("tooltips.overall_score")}
              </TooltipContent>
            </Tooltip>
          )}
        </Box>
        <Box className="flex items-center gap-4">
          <AnimatedScramble
            className={cn(
              "text-3xl font-bold",
              getScoreColor(displayValues.overallScore)
            )}
            format={(v) => (Number.isFinite(v) ? String(v) : "–")}
            value={displayValues.overallScore}
          />
          <Progress
            className="flex-1 h-2"
            indicatorClassName={getProgressColor(displayValues.overallScore)}
            value={displayValues.overallScore}
          />
        </Box>
      </Box>

      {/* Metrics */}
      <Box className="space-y-4">
        <Text className="text-s text-muted-foreground">{t("metrics")}</Text>
        <Box className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          <MetricCard
            format={formatDTIRatio}
            showTooltip={showTooltips}
            title={t("debt_to_income")}
            tooltip={t("tooltips.debt_to_income")}
            value={displayValues.debtToIncomeRatio}
          />
          <MetricCard
            format={formatPercent}
            showTooltip={showTooltips}
            title={t("emergency_fund")}
            tooltip={t("tooltips.emergency_fund")}
            value={displayValues.emergencyFundCoverage}
          />
          <MetricCard
            format={formatPercent}
            showTooltip={showTooltips}
            title={t("housing_cost")}
            tooltip={t("tooltips.housing_cost")}
            value={displayValues.housingCostRatio}
          />
          <MetricCard
            format={formatPercent}
            showTooltip={showTooltips}
            title={t("discretionary_income")}
            tooltip={t("tooltips.discretionary_income")}
            value={displayValues.discretionaryIncomeRatio}
          />
        </Box>
      </Box>

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <Box className="space-y-2">
          <Text className="text-s text-muted-foreground ">
            {t("recommendations")}
          </Text>
          <Box className="space-y-3 mt-2">
            {score.recommendations.map((recommendation) => (
              <Box
                key={recommendation}
                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border border-blue-200/60 dark:border-blue-800/40 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Text className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
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
        <Text className="text-sm text-muted-foreground">{title}</Text>
        {showTooltip && (
          <Tooltip
            delayDuration={100}
            open={isTouch ? open : undefined}
            onOpenChange={isTouch ? setOpen : undefined}
          >
            <TooltipTrigger asChild>
              <button
                aria-label={`Info: ${title}`}
                className="focus:outline-none relative bg-transparent flex items-center justify-center hover:text-accent transition-colors min-w-[44px] min-h-[44px] -m-[20px] p-[20px]"
                tabIndex={0}
                type="button"
                onClick={
                  isTouch
                    ? (e) => {
                        e.stopPropagation();
                        setOpen((o) => !o);
                      }
                    : undefined
                }
              >
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="z-50 max-w-xs p-3 text-xs"
              side="top"
              sideOffset={-8}
            >
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </Box>
      <AnimatedScramble
        className="font-medium"
        format={(v) =>
          typeof v === "number" && Number.isFinite(v) ? format(v) : "–"
        }
        value={typeof value === "number" && Number.isFinite(value) ? value : 0}
      />
    </Box>
  );
};
