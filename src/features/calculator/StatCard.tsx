import React from "react";

import { Box } from "@/components/ui/Box";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Text } from "@/components/ui/Text";

import { ICON_BG_CLASSES, type ColorScheme } from "./constants";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value?: number;
  displayText?: string;
  variant: "success" | "warning" | "destructive" | "neutral";
  colorScheme: ColorScheme;
  ariaLabel: string;
  periodText: string;
}

export const StatCard = React.memo<StatCardProps>(
  ({
    icon,
    label,
    value,
    displayText,
    variant,
    colorScheme,
    ariaLabel,
    periodText,
  }) => {
    const iconBgClass = ICON_BG_CLASSES[colorScheme];

    return (
      <Box
        aria-label={ariaLabel}
        className="p-4 bg-card rounded-lg border border-gray-200/50 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring shadow-sm"
        role="group"
        tabIndex={0}
      >
        <Box className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg ${iconBgClass}`}>{icon}</div>
          <Text
            className="text-sm text-muted-foreground"
            id={`${label.toLowerCase().replace(/\s+/g, "-")}-label`}
          >
            {label}
          </Text>
        </Box>
        {value !== undefined ? (
          <>
            <CurrencyDisplay
              amount={value}
              aria-describedby={`${label.toLowerCase().replace(/\s+/g, "-")}-period`}
              className="text-lg font-bold"
              showDecimals={false}
              size="xl"
              variant={variant}
            />
            <Text
              className="text-base text-foreground font-medium mt-1"
              id={`${label.toLowerCase().replace(/\s+/g, "-")}-period`}
            >
              {periodText}
            </Text>
          </>
        ) : (
          <>
            <Text className="text-lg font-bold text-muted-foreground">
              {displayText}
            </Text>
            <Text className="text-base text-muted-foreground font-medium mt-1">
              &nbsp;
            </Text>
          </>
        )}
      </Box>
    );
  }
);

StatCard.displayName = "StatCard";
