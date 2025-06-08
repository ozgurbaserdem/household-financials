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
  iconColor = "text-purple-400",
  height = 400,
  children,
  legend,
  testId,
  ariaLabel,
  delay = 0.3,
  animate = true,
}: ChartContainerProps) => {
  return (
    <FinancialCard
      animate={animate}
      ariaLabel={ariaLabel}
      delay={delay}
      description={description}
      icon={icon}
      iconColor={iconColor}
      title={title}
    >
      <div className={`h-[${height}px] w-full`} data-testid={testId}>
        <ResponsiveContainer height="100%" width="100%">
          {children}
        </ResponsiveContainer>
      </div>

      {legend && (
        <Box className="mt-4 pt-4 border-t border-gray-700">{legend}</Box>
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
          <Text className="text-sm text-gray-300">{item.label}</Text>
        </div>
      ))}
    </Box>
  );
};

export { ChartContainer, ChartLegend };
