import React from "react";

interface ResultRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
  isHighlighted?: boolean;
}

export const ResultRow: React.FC<ResultRowProps> = ({
  label,
  value,
  isTotal = false,
  isHighlighted = false,
}) => {
  const getValueClassName = () => {
    if (isTotal) return "font-bold text-xl text-primary";
    if (isHighlighted) return "font-semibold text-primary";
    return "font-semibold";
  };

  return (
    <div className={`flex justify-between ${isTotal ? "border-t pt-2" : ""}`}>
      <span className={isTotal ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={getValueClassName()}>{value}</span>
    </div>
  );
};
