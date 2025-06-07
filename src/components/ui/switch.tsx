"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/general";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { checked, onCheckedChange, disabled = false, size = "md", className },
    ref
  ) => {
    const sizes = {
      sm: {
        switch: "h-5 w-9",
        thumb: "h-3 w-3",
        translateX: 16, // 4 * 0.25rem = 1rem = 16px
      },
      md: {
        switch: "h-6 w-11",
        thumb: "h-4 w-4",
        translateX: 20, // 5 * 0.25rem = 1.25rem = 20px
      },
      lg: {
        switch: "h-7 w-12",
        thumb: "h-5 w-5",
        translateX: 20, // 5 * 0.25rem = 1.25rem = 20px
      },
    };

    const currentSize = sizes[size];

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900",
          currentSize.switch,
          checked
            ? "bg-gradient-to-r from-blue-500 to-purple-600"
            : "bg-gray-600",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <motion.div
          className={cn("bg-white rounded-full shadow-lg", currentSize.thumb)}
          animate={{
            x: checked ? currentSize.translateX : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          style={{
            marginLeft: "2px",
          }}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
