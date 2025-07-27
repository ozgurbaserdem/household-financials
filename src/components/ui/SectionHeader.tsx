import type { LucideIcon } from "lucide-react";
import React from "react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  level?: "h2" | "h3";
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  headerId?: string;
}

export const SectionHeader = ({
  icon: Icon,
  title,
  level = "h2",
  className = "",
  iconClassName = "",
  titleClassName = "",
  headerId,
}: SectionHeaderProps) => {
  const HeadingElement = level;
  const defaultTitleClass =
    level === "h2"
      ? "text-2xl font-bold text-foreground"
      : "text-xl font-bold text-foreground";

  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <div className={`p-2 rounded-lg icon-bg-golden ${iconClassName}`}>
        <Icon aria-hidden="true" className="w-6 h-6 text-golden" />
      </div>
      <HeadingElement
        className={`${defaultTitleClass} ${titleClassName}`}
        id={headerId}
      >
        {title}
      </HeadingElement>
    </div>
  );
};
