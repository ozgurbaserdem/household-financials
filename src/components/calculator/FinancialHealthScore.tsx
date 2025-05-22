import { HeartPulse, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Progress } from "@/components/ui/progress";
import type { FinancialHealthScore } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useIsTouchDevice } from "@/lib/hooks/use-is-touch-device";
import { useState } from "react";

interface FinancialHealthScoreProps {
  score: FinancialHealthScore;
  showTooltips?: boolean;
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

export function FinancialHealthScore({
  score,
  showTooltips = true,
}: FinancialHealthScoreProps) {
  const t = useTranslations("financial_health");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600 dark:bg-green-400";
    if (score >= 60) return "bg-yellow-600 dark:bg-yellow-400";
    return "bg-red-600 dark:bg-red-400";
  };

  const safeDisplay = (value: number | undefined) =>
    Number.isFinite(value) ? value : undefined;

  // Custom formatter for DTI as ratio
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
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {t("overall_score")}
        </Text>
        <Box className="flex items-center gap-4">
          <Text
            className={cn(
              "text-3xl font-bold",
              getScoreColor(score.overallScore)
            )}
          >
            {Number.isFinite(score.overallScore) ? score.overallScore : "–"}
          </Text>
          <Progress
            value={Number.isFinite(score.overallScore) ? score.overallScore : 0}
            className="flex-1 h-2"
            indicatorClassName={getProgressColor(score.overallScore)}
          />
        </Box>
      </Box>

      {/* Metrics */}
      <Box className="space-y-4">
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {t("metrics")}
        </Text>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            title={t("savings_rate")}
            value={safeDisplay(score.metrics.savingsRate)}
            format={formatPercent}
            tooltip={t("tooltips.savings_rate")}
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
          <Text className="text-xs text-gray-500 dark:text-gray-400">
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
}

interface MetricCardProps {
  title: string;
  value: number | undefined;
  format: (value: number) => string;
  tooltip: string;
  showTooltip?: boolean;
}

function MetricCard({
  title,
  value,
  format,
  tooltip,
  showTooltip = true,
}: MetricCardProps) {
  const isTouch = useIsTouchDevice();
  const [open, setOpen] = useState(false);
  return (
    <Box className="p-0 bg-transparent rounded-none">
      <Box className="flex items-center gap-2 mb-1">
        <Text className="text-sm text-gray-500 dark:text-gray-400">
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
                className="focus:outline-none p-2 -m-2 bg-transparent flex items-center justify-center"
                onClick={
                  isTouch
                    ? (e) => {
                        e.stopPropagation();
                        setOpen((o) => !o);
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
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </Box>
      <Text className="font-medium">
        {typeof value === "number" && Number.isFinite(value)
          ? format(value)
          : "–"}
      </Text>
    </Box>
  );
}
