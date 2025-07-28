import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Text } from "@/components/ui/Text";

import { STYLES } from "../constants";
import type { COLORS } from "../constants";

interface ResultCardProps {
  title: string;
  amount: number;
  color?: keyof typeof COLORS;
  progressPercent: number;
  delay?: number;
  "aria-label"?: string;
}

export const ResultCard = React.memo<ResultCardProps>(
  ({
    title,
    amount,
    color,
    progressPercent,
    delay = 0,
    "aria-label": ariaLabel,
  }) => {
    const t = useTranslations("compound_interest");

    const getColorClasses = (colorKey?: keyof typeof COLORS) => {
      switch (colorKey) {
        case "BLUE":
          return { text: "text-blue-500", bg: "bg-blue-500" };
        case "GREEN":
          return { text: "text-green-500", bg: "bg-green-500" };
        case "PURPLE":
          return { text: "text-purple-500", bg: "bg-purple-500" };
        case "RED":
          return { text: "text-red-500", bg: "bg-red-500" };
        default:
          return { text: "text-foreground", bg: "bg-blue-500" };
      }
    };

    const colorClasses = getColorClasses(color);
    const textColorClass = colorClasses.text;
    const progressColorClass = colorClasses.bg;

    return (
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        aria-label={ariaLabel || title}
        className={STYLES.RESULT_CARD}
        initial={{ opacity: 0, scale: 0.9 }}
        role="region"
        transition={{ delay }}
      >
        <div className="space-y-2 lg:flex-1 lg:flex lg:flex-col lg:justify-between">
          <div className="lg:h-10 lg:flex lg:items-start">
            <Text className={STYLES.LABEL_TEXT}>{title}</Text>
          </div>
          <div className="lg:flex lg:items-center lg:h-8 lg:leading-none">
            <CurrencyDisplay
              amount={amount}
              className={
                color
                  ? `${STYLES.CURRENCY_DISPLAY_COLORED} ${textColorClass}`
                  : STYLES.CURRENCY_DISPLAY
              }
              showDecimals={false}
              size="lg"
              variant="neutral"
            />
          </div>
        </div>
        <div
          aria-label={t("accessibility.progress_bar_aria", {
            percent: Math.round(progressPercent),
          })}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progressPercent}
          className={STYLES.PROGRESS_BAR}
          role="progressbar"
        >
          <div
            className={`${STYLES.PROGRESS_FILL} ${progressColorClass}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </motion.div>
    );
  }
);

ResultCard.displayName = "ResultCard";
