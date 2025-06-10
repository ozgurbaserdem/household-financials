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
    if (!Number.isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
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
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, 
      rgb(255 255 255) 0%, 
      rgb(107 114 128) ${percentage}%, 
      rgb(55 65 81) ${percentage}%, 
      rgb(55 65 81) 100%)`;
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
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex-shrink-0">
        {isEditing ? (
          <input
            autoFocus
            className={`px-2 py-1 rounded-lg bg-muted border border-border hover:border-border transition-all duration-200 hover:bg-muted ${width} text-center text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-border`}
            type="text"
            value={tempValue}
            onBlur={handleEditEnd}
            onChange={(e) => setTemporaryValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button
            className={`px-2 py-1 rounded-lg bg-muted border border-border hover:border-border transition-all duration-200 hover:bg-muted ${width} text-center cursor-text`}
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
