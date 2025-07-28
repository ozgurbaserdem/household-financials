"use client";

import { forwardRef, useId } from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";

export interface ToggleOption<T = string | number | boolean> {
  value: T;
  label: string;
}

interface ToggleButtonGroupProps<T = string | number | boolean> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  disabled?: boolean;
}

export const ToggleButtonGroup = forwardRef<
  HTMLDivElement,
  ToggleButtonGroupProps
>(
  (
    {
      options,
      value,
      onChange,
      name,
      ariaLabel,
      ariaDescribedBy,
      className,
      disabled = false,
    },
    ref
  ) => {
    const groupId = useId();
    const labelId = `${groupId}-label`;

    return (
      <div ref={ref} className={className}>
        {ariaLabel && (
          <div className="sr-only" id={labelId}>
            {ariaLabel}
          </div>
        )}
        <Box
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabel ? labelId : undefined}
          className="flex flex-col sm:flex-row items-stretch gap-3"
          role="radiogroup"
        >
          {options.map((option, index) => {
            const isActive = option.value === value;
            const buttonId = `${groupId}-option-${index}`;

            return (
              <Button
                key={String(option.value)}
                aria-checked={isActive}
                className="flex-1 py-2 px-3 text-md"
                disabled={disabled}
                id={buttonId}
                name={name}
                role="radio"
                size="budgetkollen-selection"
                type="button"
                variant={
                  isActive
                    ? "budgetkollen-selection-active"
                    : "budgetkollen-selection"
                }
                onClick={() => onChange(option.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const prevIndex =
                      index > 0 ? index - 1 : options.length - 1;
                    const prevButton = document.getElementById(
                      `${groupId}-option-${prevIndex}`
                    );
                    prevButton?.focus();
                    onChange(options[prevIndex].value);
                  } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const nextIndex =
                      index < options.length - 1 ? index + 1 : 0;
                    const nextButton = document.getElementById(
                      `${groupId}-option-${nextIndex}`
                    );
                    nextButton?.focus();
                    onChange(options[nextIndex].value);
                  } else if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    onChange(option.value);
                  }
                }}
              >
                {option.label}
              </Button>
            );
          })}
        </Box>
      </div>
    );
  }
);

ToggleButtonGroup.displayName = "ToggleButtonGroup";
