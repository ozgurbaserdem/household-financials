import type { LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { Box } from "@/components/ui/Box";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardIcon,
} from "@/components/ui/Card";

interface NavigableCardProps {
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  onClick: () => void;
  ariaLabel: string;
}

const handleCardKeyDown = (event: React.KeyboardEvent, action: () => void) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
};

export const NavigableCard = ({
  icon: IconComponent,
  title,
  description,
  onClick,
  ariaLabel,
}: NavigableCardProps) => {
  return (
    <Card
      aria-label={ariaLabel}
      className="h-full cursor-pointer border-gray-200/50 dark:border-gray-700/50 shadow-sm"
      role="button"
      tabIndex={0}
      variant="interactive"
      onClick={onClick}
      onKeyDown={(e) => handleCardKeyDown(e, onClick)}
    >
      <CardHeader>
        <CardIcon
          className="bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
          size="lg"
          variant="default"
        >
          <IconComponent className="w-8 h-8 text-golden" />
        </CardIcon>
        <Box className="flex-1">
          <CardTitle>{title}</CardTitle>
        </Box>
      </CardHeader>
      <CardDescription className="text-muted-foreground leading-relaxed">
        {description}
      </CardDescription>
    </Card>
  );
};
