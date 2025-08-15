import React from "react";

import { Box } from "@/components/ui/Box";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Text } from "@/components/ui/Text";

interface DataRowProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  value?: number;
  netValue?: number;
  displayValue?: string;
  showNet?: boolean;
  netLabel?: string;
  showProgressBar?: boolean;
  progressPercentage?: number;
  className?: string;
}

export const DataRow = React.memo<DataRowProps>(
  ({
    id: _id,
    icon,
    label,
    value,
    netValue,
    displayValue,
    showNet = false,
    netLabel,
    showProgressBar = false,
    progressPercentage = 0,
    className = "",
  }) => {
    return (
      <div
        aria-label={`${label}: ${value ? `${value} kr` : displayValue || ""}`}
        className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors ${className}`}
        role="listitem"
        tabIndex={0}
      >
        {!showProgressBar ? (
          <Box className="flex items-center gap-3">
            <Box className="p-2 rounded-md bg-muted/50">{icon}</Box>
            <Text className="text-sm text-muted-foreground">{label}</Text>
          </Box>
        ) : (
          <Text className="text-sm text-muted-foreground">{label}</Text>
        )}

        <Box className="flex items-center gap-3">
          {showProgressBar && (
            <Box className="w-16 h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <div
                aria-label={`${Math.round(progressPercentage)}% of total expenses`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={progressPercentage}
                className="h-full bg-primary"
                role="progressbar"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </Box>
          )}

          <Box
            className={
              showProgressBar
                ? "flex flex-col items-end"
                : "flex flex-col items-end"
            }
          >
            {(() => {
              if (value !== undefined) {
                return (
                  <CurrencyDisplay
                    amount={value}
                    className={`font-medium text-foreground ${showProgressBar ? "min-w-[80px] text-right" : ""}`}
                    showDecimals={false}
                    variant="neutral"
                  />
                );
              }
              if (displayValue) {
                return (
                  <Text className="text-sm text-foreground font-medium">
                    {displayValue}
                  </Text>
                );
              }
              return null;
            })()}

            {showNet && netValue !== undefined && netLabel && (
              <Text className="text-xs text-muted-foreground font-medium mt-0.5 text-right">
                {netLabel}:{" "}
                <CurrencyDisplay
                  amount={netValue}
                  className="inline"
                  showDecimals={false}
                  variant="neutral"
                />
              </Text>
            )}
          </Box>
        </Box>
      </div>
    );
  }
);

DataRow.displayName = "DataRow";
