import React from "react";
import { Check, CheckCircle } from "lucide-react";

interface BudgetkollenLogoProps {
  variant?: "b-check" | "full-text" | "b-circle" | "text-check" | "minimal";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const BudgetkollenLogo = ({
  variant = "b-check",
  size = "md",
  className = "",
}: BudgetkollenLogoProps) => {
  const sizeClasses = {
    sm: { text: "text-lg", container: "h-8", icon: 16, padding: "p-1" },
    md: { text: "text-2xl", container: "h-12", icon: 20, padding: "p-2" },
    lg: { text: "text-4xl", container: "h-16", icon: 28, padding: "p-3" },
    xl: { text: "text-6xl", container: "h-24", icon: 40, padding: "p-4" },
  };

  const currentSize = sizeClasses[size];

  // Variant 1: Large "B" with checkmark overlay
  if (variant === "b-check") {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <div
          className={`${currentSize.container} aspect-square bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg`}
        >
          <span className={`${currentSize.text} font-bold text-white`}>B</span>
        </div>
        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-md">
          <Check size={currentSize.icon * 0.6} className="text-white" />
        </div>
      </div>
    );
  }

  // Variant 2: Full text with integrated checkmark
  if (variant === "full-text") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`bg-green-500 rounded-lg ${currentSize.padding}`}>
          <Check size={currentSize.icon} className="text-white" />
        </div>
        <span
          className={`${currentSize.text} font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent`}
        >
          Budgetkollen
        </span>
      </div>
    );
  }

  // Variant 3: "B" inside a check circle
  if (variant === "b-circle") {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <div
          className={`${currentSize.container} aspect-square bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg border-4 border-green-300`}
        >
          <span className={`${currentSize.text} font-bold text-white`}>B</span>
        </div>
        <CheckCircle
          size={currentSize.icon * 1.8}
          className="absolute inset-0 text-green-400 opacity-30"
        />
      </div>
    );
  }

  // Variant 4: Text with checkmark replacing the "o"
  if (variant === "text-check") {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <div
          className={`${currentSize.text} font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent flex items-center`}
        >
          <span>Budgetk</span>
          <div
            className={`bg-gradient-to-r from-blue-400 to-purple-600 rounded-full p-1 mx-0.5`}
          >
            <Check size={currentSize.icon * 0.5} className="text-white" />
          </div>
          <span>llen</span>
        </div>
      </div>
    );
  }

  // Variant 5: Minimal design with subtle checkmark
  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className={`${currentSize.text} font-bold text-slate-700`}>
          Budget
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
            kollen
          </span>
        </span>
        <Check size={currentSize.icon * 0.7} className="text-green-500 ml-1" />
      </div>
    );
  }

  return null;
};

export { BudgetkollenLogo };
