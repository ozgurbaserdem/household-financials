"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

interface NavigationButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export const NavigationButton = ({
  direction,
  onClick,
  disabled = false,
  ariaLabel,
}: NavigationButtonProps) => {
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  const defaultLabel = direction === "prev" ? "Previous" : "Next";

  return (
    <button
      aria-label={ariaLabel || defaultLabel}
      className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:bg-white/10"
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};
