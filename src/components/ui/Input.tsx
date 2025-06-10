"use client";

import * as React from "react";

import { cn } from "@/lib/utils/general";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Defensive: never pass NaN or undefined to value
    let value: string | number = "";
    if (typeof props.value === "number") {
      if (Number.isNaN(props.value)) {
        value = "";
      } else {
        value = props.value;
      }
    } else if (Array.isArray(props.value)) {
      value = props.value.join(",");
    } else if (typeof props.value === "string") {
      value = props.value;
    } else if (props.value == null) {
      value = "";
    }

    return (
      <input
        ref={ref}
        className={cn(
          "input-base h-10 w-full",
          // No spinner for number inputs
          type === "number" ? "no-spinner" : "",
          className
        )}
        data-slot="input"
        type={type}
        {...props}
        value={value}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
