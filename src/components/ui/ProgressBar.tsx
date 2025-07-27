"use client";

interface ProgressBarProps {
  percentage: number;
  width?: "full" | "small";
  className?: string;
}

export const ProgressBar = ({
  percentage,
  width = "full",
  className = "",
}: ProgressBarProps) => {
  const widthClass = width === "full" ? "w-full" : "w-[60px]";

  return (
    <div
      className={`h-1.5 bg-muted rounded-full overflow-hidden ${widthClass} ${className}`}
    >
      <div
        className="h-full bg-gradient-golden rounded-full transition-all duration-500"
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
      />
    </div>
  );
};
