import {
  Card,
  CardHeader,
  CardTitle,
  CardIcon,
} from "@/components/ui/modern-card";
import { CardContent } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/general";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface FinancialCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  gradient?: boolean;
  glass?: boolean;
  animate?: boolean;
  hover?: boolean;
  delay?: number;
  className?: string;
  ariaLabel?: string;
}

const FinancialCard = ({
  title,
  description,
  icon: Icon,
  iconColor = "text-blue-400",
  children,
  gradient = true,
  glass = true,
  animate = true,
  hover = false,
  delay = 0,
  className,
  ariaLabel,
}: FinancialCardProps) => {
  return (
    <Card
      gradient={gradient}
      glass={glass}
      animate={animate}
      hover={hover}
      delay={delay}
      className={className}
    >
      <CardHeader>
        <CardIcon>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle tabIndex={0} aria-label={ariaLabel || title}>
            {title}
          </CardTitle>
          {description && (
            <Text className="text-sm text-gray-300 mt-1">{description}</Text>
          )}
        </Box>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export { FinancialCard };
