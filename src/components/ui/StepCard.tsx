import { useTranslations } from "next-intl";
import React from "react";

import { Text } from "./Text";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  description,
}) => {
  const t = useTranslations();

  return (
    <div className="relative p-6 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div
        aria-label={t("ui.step_card.step_number_aria_label", { stepNumber })}
        className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-800 flex items-center justify-center"
      >
        <span className="text-sm font-bold text-gradient-golden">
          {stepNumber}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      <Text className="text-muted-foreground leading-relaxed">
        {description}
      </Text>
    </div>
  );
};
