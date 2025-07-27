import React from "react";

interface ResultCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export const ResultCard = ({
  children,
  className = "",
  padding = "md",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: ResultCardProps) => {
  const paddingClasses = {
    sm: "p-4",
    md: "p-4 md:p-6",
    lg: "p-6",
  };

  return (
    <section
      aria-describedby={ariaDescribedBy}
      aria-labelledby={ariaLabelledBy}
      className={`card-base shadow-sm ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </section>
  );
};
