import React from "react";

interface BudgetkollenLogoProps {
  variant?: "minimal" | "full-text";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const BudgetkollenLogo = ({
  variant = "minimal",
  size = "md",
  className = "",
}: BudgetkollenLogoProps) => {
  const sizeClasses = {
    sm: { text: "text-sm", weight: "font-semibold" },
    md: { text: "text-lg", weight: "font-semibold" },
    lg: { text: "text-2xl", weight: "font-bold" },
    xl: { text: "text-4xl", weight: "font-bold" },
  };

  const currentSize = sizeClasses[size];

  // Clean, minimal design matching Quartr aesthetic
  if (variant === "minimal") {
    return (
      <div className={`flex items-center ${className}`}>
        <span
          className={`${currentSize.text} ${currentSize.weight} text-foreground font-serif`}
        >
          Budget<span className="italic">kollen</span>
        </span>
      </div>
    );
  }

  // Full text variant for larger displays
  if (variant === "full-text") {
    return (
      <div className={`flex items-center ${className}`}>
        <span
          className={`${currentSize.text} ${currentSize.weight} text-foreground font-serif`}
        >
          Budgetkollen
        </span>
      </div>
    );
  }

  return null;
};

export { BudgetkollenLogo };
