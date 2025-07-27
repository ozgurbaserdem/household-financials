import type { LucideIcon } from "lucide-react";
import React from "react";

import { Box } from "./Box";
import { CardHeader, CardTitle } from "./Card";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  level?: "h2" | "h3";
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  headerId?: string;
  variant?: "standalone" | "card";
}

export const SectionHeader = ({
  icon: Icon,
  title,
  level = "h2",
  className = "",
  iconClassName = "",
  titleClassName = "",
  headerId,
  variant = "standalone",
}: SectionHeaderProps) => {
  const iconElement = (
    <div className={`p-2 rounded-lg icon-bg-golden ${iconClassName}`}>
      <Icon aria-hidden="true" className="w-6 h-6 text-golden" />
    </div>
  );

  if (variant === "card") {
    return (
      <CardHeader className={className}>
        {iconElement}
        <Box className="flex-1">
          <CardTitle id={headerId}>{title}</CardTitle>
        </Box>
      </CardHeader>
    );
  }

  const HeadingElement = level;
  const defaultTitleClass =
    level === "h2"
      ? "text-2xl font-bold text-foreground"
      : "text-xl font-bold text-foreground";

  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      {iconElement}
      <HeadingElement
        className={`${defaultTitleClass} ${titleClassName}`}
        id={headerId}
      >
        {title}
      </HeadingElement>
    </div>
  );
};
