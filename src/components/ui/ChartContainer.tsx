import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

import { Box } from "./Box";
import { FinancialCard } from "./FinancialCard";
import { Text } from "./Text";

interface ChartContainerProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  height?: number;
  children: ReactElement;
  legend?: ReactElement;
  testId?: string;
  ariaLabel?: string;
  delay?: number;
  animate?: boolean;
}

const ChartContainer = ({
  title,
  description,
  icon,
  height = 400,
  children,
  legend,
  testId,
  ariaLabel,
}: ChartContainerProps) => {
  return (
    <FinancialCard
      ariaLabel={ariaLabel}
      description={description}
      icon={icon}
      title={title}
    >
      <div className={`h-[${height}px] w-full`} data-testid={testId}>
        <ResponsiveContainer height="100%" width="100%">
          {children}
        </ResponsiveContainer>
      </div>

      {legend && (
        <Box className="mt-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
          {legend}
        </Box>
      )}
    </FinancialCard>
  );
};

interface ChartLegendProps {
  items: Array<{
    color: string;
    label: string;
  }>;
  className?: string;
}

const ChartLegend = ({ items, className }: ChartLegendProps) => {
  return (
    <Box className={`flex flex-wrap justify-center gap-6 ${className || ""}`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: item.color }}
          />
          <Text className="text-sm text-foreground">{item.label}</Text>
        </div>
      ))}
    </Box>
  );
};

export { ChartContainer, ChartLegend };
