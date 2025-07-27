import React from "react";

interface ChevronRightIconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

export const ChevronRightIcon = ({
  className = "w-4 h-4",
  "aria-hidden": ariaHidden = true,
}: ChevronRightIconProps) => {
  return (
    <svg
      aria-hidden={ariaHidden}
      className={`transition-transform group-hover:translate-x-1 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
};
