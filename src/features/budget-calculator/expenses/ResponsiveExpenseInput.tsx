"use client";

import { useCallback } from "react";

import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ResponsiveExpenseInputProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (value: string) => void;
  ariaLabel: string;
  showProgressBar?: boolean;
  progressPercentage?: number;
}

export const ResponsiveExpenseInput = ({
  id,
  icon,
  label,
  value,
  onChange,
  ariaLabel,
  showProgressBar = false,
  progressPercentage = 0,
}: ResponsiveExpenseInputProps) => {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    },
    []
  );

  const displayValue = value && value !== 0 ? value.toString() : "";

  return (
    <div className="p-4 transition-all duration-300 hover:bg-muted card-base">
      {/* Mobile layout */}
      <Box className="flex flex-col w-full gap-3 sm:hidden">
        <Box className="flex items-center justify-between w-full gap-2">
          <Box className="flex items-center gap-3 min-w-0 flex-1">
            <Box className="p-2 rounded-lg bg-muted transition-colors duration-300">
              {icon}
            </Box>
            <label
              className="font-medium text-foreground whitespace-normal break-words min-w-0 cursor-pointer"
              htmlFor={`${id}-input`}
            >
              {label}
            </label>
          </Box>
        </Box>
        <Input
          aria-label={ariaLabel}
          className="w-full modern-input text-right"
          id={`${id}-input`}
          min={0}
          placeholder="0"
          type="number"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {showProgressBar && progressPercentage > 0 && (
          <ProgressBar percentage={progressPercentage} width="full" />
        )}
      </Box>

      {/* Desktop layout */}
      <Box className="hidden sm:flex items-center justify-between w-full gap-4">
        <Box className="flex items-center gap-3 flex-1">
          <Box className="p-2 rounded-lg bg-muted transition-colors duration-300">
            {icon}
          </Box>
          <label
            className="font-medium text-foreground cursor-pointer flex-1"
            htmlFor={`${id}-input-desktop`}
          >
            {label}
          </label>
        </Box>
        <Box className="flex items-center gap-4">
          {showProgressBar && progressPercentage > 0 && (
            <ProgressBar percentage={progressPercentage} width="small" />
          )}
          <Input
            aria-label={ariaLabel}
            className="w-40 modern-input text-right"
            id={`${id}-input-desktop`}
            min={0}
            placeholder="0"
            type="number"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </Box>
      </Box>
    </div>
  );
};
