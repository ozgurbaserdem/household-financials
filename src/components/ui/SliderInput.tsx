"use client";

import React, { useState } from "react";

import { Text } from "./Text";

interface SliderInputProps {
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  width?: string;
  onChange: (value: number) => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  ariaLabel?: string;
  className?: string;
  decimals?: number;
  allowInputBeyondMax?: boolean; // New prop to allow input beyond slider max
}

export const SliderInput = ({
  value,
  min,
  max,
  step,
  suffix = "",
  prefix = "",
  width = "w-20",
  onChange,
  onEditStart,
  onEditEnd,
  ariaLabel,
  className = "",
  decimals = 2,
  allowInputBeyondMax = false,
}: SliderInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTemporaryValue] = useState("");

  const handleEditStart = () => {
    setIsEditing(true);
    setTemporaryValue(value.toString());
    onEditStart?.();
  };

  const handleEditEnd = () => {
    const numValue = parseFloat(tempValue.replace(/[^\d.-]/g, ""));
    if (!Number.isNaN(numValue) && numValue >= min) {
      // Allow input beyond max if allowInputBeyondMax is true
      if (allowInputBeyondMax || numValue <= max) {
        onChange(numValue);
      }
    }
    setIsEditing(false);
    setTemporaryValue("");
    onEditEnd?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditEnd();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTemporaryValue("");
      onEditEnd?.();
    }
  };

  const getSliderBackground = () => {
    // Cap the percentage calculation at 100% for slider visual
    const cappedValue = Math.min(value, max);
    const percentage = ((cappedValue - min) / (max - min)) * 100;

    // Check if dark mode is active
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      // Dark mode: Create a golden gradient for the filled portion
      return `linear-gradient(to right, 
        #fff176 0%, 
        #fff59d ${percentage * 0.25}%, 
        #ffeb3b ${percentage * 0.5}%, 
        #ffd700 ${percentage * 0.75}%, 
        #b8860b ${percentage}%, 
        rgb(40 40 40) ${percentage}%, 
        rgb(40 40 40) 100%)`;
    } else {
      // Light mode: Create a golden gradient for the filled portion
      return `linear-gradient(to right, 
        #d4af37 0%, 
        #f4e07b ${percentage * 0.25}%, 
        #d4af37 ${percentage * 0.5}%, 
        #b8941f ${percentage * 0.75}%, 
        #d4af37 ${percentage}%, 
        rgb(230 230 230) ${percentage}%, 
        rgb(230 230 230) 100%)`;
    }
  };

  return (
    <div className={`relative flex items-center gap-4 ${className}`}>
      <input
        aria-label={ariaLabel}
        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-custom"
        max={max}
        min={min}
        step={step}
        style={{
          background: getSliderBackground(),
        }}
        type="range"
        value={Math.min(value, max)} // Cap slider value to max
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex-shrink-0">
        {isEditing ? (
          <input
            autoFocus
            className={`px-2 py-1 rounded-lg bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 ${width} text-center text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/50`}
            type="text"
            value={tempValue}
            onBlur={handleEditEnd}
            onChange={(e) => setTemporaryValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button
            className={`px-2 py-1 rounded-lg bg-card border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 ${width} text-center cursor-text`}
            onClick={handleEditStart}
          >
            <Text className="text-sm font-semibold text-foreground">
              {prefix}
              {value.toFixed(decimals)}
              {suffix}
            </Text>
          </button>
        )}
      </div>
    </div>
  );
};
