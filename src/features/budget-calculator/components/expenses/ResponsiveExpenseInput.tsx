"use client";

import { useCallback, useState, useEffect } from "react";

import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatNumber } from "@/lib/formatting/";

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
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const isValidNumber =
    typeof value === "number" && !Number.isNaN(value) && value !== 0;

  // Update display value when value changes and not focused
  useEffect(() => {
    if (!isFocused) {
      if (isValidNumber) {
        setDisplayValue(formatNumber(value));
      } else {
        setDisplayValue("");
      }
    }
  }, [value, isFocused, isValidNumber]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDisplayValue(e.target.value);
    },
    []
  );

  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Set raw number value for editing
      const rawValue = isValidNumber ? value.toString() : "";
      setDisplayValue(rawValue);
      e.target.select();
    },
    [value, isValidNumber]
  );

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    // Parse the entered value
    const cleanedValue = displayValue.replace(/[^\d]/g, "");
    const numericValue = cleanedValue === "" ? "0" : cleanedValue;
    onChange(numericValue);
    // Update display with formatted value
    const parsedValue = Number(numericValue);
    if (parsedValue === 0) {
      setDisplayValue("");
    } else {
      setDisplayValue(formatNumber(parsedValue));
    }
  }, [displayValue, onChange]);

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
          type="text"
          value={displayValue}
          onBlur={handleInputBlur}
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
            type="text"
            value={displayValue}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </Box>
      </Box>
    </div>
  );
};
